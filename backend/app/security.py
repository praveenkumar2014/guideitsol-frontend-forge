from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from collections import defaultdict, deque
from typing import Any

import httpx
import jwt
from fastapi import Header, HTTPException, Request, status

from .settings import get_settings

_JWKS_CACHE: dict[str, Any] = {"fetched_at": 0.0, "keys": None}


def require_admin_key(x_admin_key: str | None = Header(default=None)) -> None:
    settings = get_settings()
    if not settings.admin_api_key or not x_admin_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin credentials required")
    if not hmac.compare_digest(settings.admin_api_key, x_admin_key):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin credentials required")


# ---------------------------------------------------------------------------
# Universal role / permission matrix
# ---------------------------------------------------------------------------

ROLE_PERMISSIONS: dict[str, list[str]] = {
    "learner": [
        "view_materials",
        "submit_assignments",
        "track_progress",
        "view_credentials",
    ],
    "instructor": [
        "view_materials",
        "submit_assignments",
        "track_progress",
        "view_credentials",
        "grade_assignments",
        "manage_cohorts",
        "review_curriculum",
        "manage_catalog",
    ],
    "admin": [
        "view_materials",
        "submit_assignments",
        "track_progress",
        "view_credentials",
        "grade_assignments",
        "manage_cohorts",
        "review_curriculum",
        "manage_catalog",
        "manage_leads",
        "issue_certificates",
        "view_analytics",
        "reconcile_payments",
        "manage_system",
    ],
    "partner": [
        "view_candidates",
        "view_credentials",
        "post_internships",
        "schedule_interviews",
    ],
}

ROLE_HIERARCHY: dict[str, int] = {"learner": 1, "partner": 1, "instructor": 2, "admin": 3}


def role_grants(role: str, permission: str) -> bool:
    return permission in ROLE_PERMISSIONS.get(role, [])


def resolve_token_role(payload: dict[str, Any]) -> str:
    """Extract the user's role from a verified Supabase JWT payload."""
    app_meta = payload.get("app_metadata") or {}
    role = app_meta.get("role") or payload.get("role") or "learner"
    if isinstance(role, list):
        role = role[0] if role else "learner"
    return str(role) if str(role) in ROLE_PERMISSIONS else "learner"


def require_role(*allowed_roles: str, permission: str | None = None) -> Any:
    """Build a FastAPI dependency enforcing a role and/or permission.

    Accepts either a verified Supabase JWT (Authorization header) or the
    legacy X-Admin-Key service credential, so automation keeps working while
    real user sessions gain token-based role verification.

    Implemented as a closure (not a class) so FastAPI can resolve the
    annotations in this module's namespace.
    """
    allowed = set(allowed_roles) or {"admin"}
    required_permission = permission

    async def _checker(
        request: Request,
        authorization: str | None = Header(default=None, alias="Authorization"),
        x_admin_key: str | None = Header(default=None),
    ) -> dict[str, Any]:
        settings = get_settings()
        if settings.admin_api_key and x_admin_key:
            if hmac.compare_digest(settings.admin_api_key, x_admin_key):
                return {
                    "sub": "service",
                    "role": "admin",
                    "email": "service@guideitsol.local",
                    "auth": "admin_key",
                }
        payload = await verify_supabase_token(authorization)
        role = resolve_token_role(payload)
        granted = required_permission is None or role_grants(role, required_permission)
        if role not in allowed or not granted:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return {**payload, "role": role, "auth": "jwt"}

    return _checker


class SlidingWindowLimiter:
    """Simple in-memory sliding-window rate limiter keyed by client IP."""

    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: defaultdict[str, deque[float]] = defaultdict(deque)

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        window = self._hits[key]
        while window and now - window[0] > self.window_seconds:
            window.popleft()
        if len(window) >= self.max_requests:
            return False
        window.append(now)
        return True

    def reset(self) -> None:
        self._hits.clear()


lead_limiter = SlidingWindowLimiter(max_requests=10, window_seconds=3600)
order_limiter = SlidingWindowLimiter(max_requests=20, window_seconds=3600)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def _get_jwks() -> list[dict[str, Any]]:
    now = time.time()
    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(status_code=503, detail="Authentication is not configured on this server")
    if _JWKS_CACHE["keys"] is not None and now - _JWKS_CACHE["fetched_at"] < 3600:
        return _JWKS_CACHE["keys"]  # type: ignore[return-value]
    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url)
    response.raise_for_status()
    keys = response.json().get("keys", [])
    _JWKS_CACHE["keys"] = keys
    _JWKS_CACHE["fetched_at"] = now
    return keys


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


async def verify_supabase_token(
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> dict[str, Any]:
    """Verify a Supabase-issued JWT from the Authorization header and return its payload.

    Raises 401 for missing, malformed, expired or untrusted tokens.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.removeprefix("Bearer ").removeprefix("bearer ").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(status_code=503, detail="Authentication is not configured on this server")

    try:
        unverified = jwt.decode(token, options={"verify_signature": False})
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from exc

    kid = unverified.get("kid")
    keys = await _get_jwks()
    matching = [key for key in keys if key.get("kid") == kid]
    if not matching:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(matching[0]))
    try:
        payload = jwt.decode(token, public_key, algorithms=["RS256"], options={"verify_aud": False})
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token") from exc
    return payload
