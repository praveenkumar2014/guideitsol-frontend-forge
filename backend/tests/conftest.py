import os
from types import SimpleNamespace
from typing import Any

import pytest

os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "anon")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "service-role")
os.environ.setdefault("CASHFREE_APP_ID", "cf-app")
os.environ.setdefault("CASHFREE_SECRET_KEY", "cf-secret")
os.environ.setdefault("CASHFREE_WEBHOOK_SECRET", "cf-webhook-secret")
os.environ.setdefault("CASHFREE_ENV", "sandbox")
os.environ.setdefault("FRONTEND_URL", "https://frontend.test")
os.environ.setdefault("PUBLIC_API_BASE_URL", "https://api.test")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")
os.environ.setdefault("CORS_ORIGINS", "https://frontend.test")
os.environ.setdefault("EMAIL_SMTP_HOST", "")
os.environ.setdefault("EMAIL_SMTP_USER", "")
os.environ.setdefault("EMAIL_SMTP_PASSWORD", "")

import app.main as main  # noqa: E402
from app import settings as settings_module  # noqa: E402
from app.supabase import SupabaseError  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_settings():
    settings_module.get_settings.cache_clear()
    yield
    settings_module.get_settings.cache_clear()


@pytest.fixture(autouse=True)
def _reset_rate_limiters():
    """Rate limiters are module-level singletons keyed by client IP; the
    TestClient presents as a single IP, so state must not leak between tests."""
    from app.security import lead_limiter, order_limiter

    lead_limiter._hits.clear()
    order_limiter._hits.clear()
    yield
    lead_limiter._hits.clear()
    order_limiter._hits.clear()


@pytest.fixture()
def client():
    return TestClient(main.app)


@pytest.fixture()
def settings_env(monkeypatch):
    """Temporarily override pydantic-settings env values and refresh the cache."""

    def apply(**values):
        for key, value in values.items():
            monkeypatch.setenv(key, value)
        settings_module.get_settings.cache_clear()

    return apply


@pytest.fixture()
def mock_supabase(monkeypatch):
    """Replace supabase_request with a callable that records calls and returns canned rows."""

    calls: list[dict[str, Any]] = []
    result_by_method: dict[str, Any] = {"GET": [], "POST": [{"id": "generated-uuid"}], "PATCH": [{"id": "lead-id"}], "DELETE": None}

    async def handler(method: str, path: str, payload: Any | None = None, query: str | None = None) -> Any:
        calls.append({"method": method, "path": path, "payload": payload, "query": query})
        if method == "GET" and query and "select=count" in query:
            rows = result_by_method.get("GET") or []
            return [{"count": len(rows)}]
        return result_by_method.get(method)

    monkeypatch.setattr(main, "supabase_request", handler)
    return SimpleNamespace(calls=calls, results=result_by_method)


@pytest.fixture()
def mock_supabase_error(monkeypatch):
    async def handler(method: str, path: str, payload: Any | None = None, query: str | None = None) -> Any:
        raise SupabaseError(method, path, 500, "boom")

    monkeypatch.setattr(main, "supabase_request", handler)