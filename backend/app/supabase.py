from __future__ import annotations

from typing import Any

import httpx

from .settings import get_settings


class SupabaseError(RuntimeError):
    """Raised when the Supabase REST API returns an error status."""

    def __init__(self, method: str, path: str, status_code: int, body: str) -> None:
        super().__init__(f"{method} {path} failed with status {status_code}: {body[:500]}")
        self.method = method
        self.path = path
        self.status_code = status_code
        self.body = body


async def supabase_request(
    method: str,
    path: str,
    payload: Any | None = None,
    query: str | None = None,
) -> Any:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise SupabaseError(method, path, 503, "Supabase is not configured")
    url = f"{settings.supabase_url.rstrip('/')}/rest/v1/{path}"
    if query:
        separator = "&" if "?" in path else "?"
        url = f"{url}{separator}{query}"
    headers = {
        "apikey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.request(method, url, headers=headers, json=payload)
    if response.is_error:
        raise SupabaseError(method, path, response.status_code, response.text)
    return response.json() if response.content else None