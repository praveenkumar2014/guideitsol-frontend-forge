from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.main import app
from app.security import verify_supabase_token
from app.settings import get_settings


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# ---------------------------------------------------------------------------
# Courses / batches
# ---------------------------------------------------------------------------


def test_list_courses(client, mock_supabase):
    mock_supabase.results["GET"] = [{"slug": "java", "title": "Java", "published": True}]
    response = client.get("/api/courses")
    assert response.status_code == 200
    assert response.json()[0]["slug"] == "java"


def test_get_course_not_found(client, mock_supabase):
    mock_supabase.results["GET"] = []
    response = client.get("/api/courses/nope")
    assert response.status_code == 404


def test_list_batches(client, mock_supabase):
    mock_supabase.results["GET"] = [{"id": "java-aug-26", "name": "Java Cohort"}]
    response = client.get("/api/batches")
    assert response.status_code == 200
    assert response.json()[0]["name"] == "Java Cohort"


# ---------------------------------------------------------------------------
# Leads
# ---------------------------------------------------------------------------


def test_create_lead_success(client, mock_supabase, monkeypatch):
    sent = {}
    monkeypatch.setattr("app.main.notify_new_lead", lambda lead: None)
    monkeypatch.setattr("app.main.send_enquiry_confirmation", lambda email, name: None)

    response = client.post(
        "/api/leads",
        json={
            "name": "Aarav Sharma",
            "email": "aarav@example.com",
            "phone": "9876543210",
            "course_slug": "java-full-stack-development",
            "message": "I want details about the Java course batch dates and fees.",
        },
    )
    assert response.status_code == 201
    assert response.json()["status"] == "new"
    sent = mock_supabase.calls[-1]
    assert sent["method"] == "POST"
    assert sent["path"] == "leads"
    assert sent["payload"]["status"] == "new"


def test_create_lead_validation(client):
    response = client.post("/api/leads", json={"name": "X", "email": "not-an-email", "message": "short"})
    assert response.status_code == 422


def test_create_lead_rate_limit(client, mock_supabase, monkeypatch):
    monkeypatch.setattr("app.main.notify_new_lead", lambda lead: None)
    monkeypatch.setattr("app.main.send_enquiry_confirmation", lambda email, name: None)
    payload = {
        "name": "Rate Test",
        "email": "rate@example.com",
        "message": "A message that is long enough to pass validation rules.",
    }
    statuses = []
    for _ in range(11):
        statuses.append(client.post("/api/leads", json=payload).status_code)
    assert statuses.count(429) == 1
    assert statuses[-1] == 429


def test_create_lead_backend_down(client, mock_supabase_error):
    response = client.post(
        "/api/leads",
        json={
            "name": "Down Test",
            "email": "down@example.com",
            "message": "A message that is long enough to pass validation rules.",
        },
    )
    assert response.status_code == 502


# ---------------------------------------------------------------------------
# Certificates
# ---------------------------------------------------------------------------


def test_verify_certificate_found(client, mock_supabase):
    mock_supabase.results["GET"] = [
        {"id": "GS-2026-0142", "learner_name": "Priya Sharma", "status": "issued"}
    ]
    response = client.get("/api/certificates/GS-2026-0142")
    assert response.status_code == 200
    assert response.json()["learner_name"] == "Priya Sharma"


def test_verify_certificate_not_found(client, mock_supabase):
    mock_supabase.results["GET"] = []
    response = client.get("/api/certificates/GS-0000-0000")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Payments
# ---------------------------------------------------------------------------


def test_create_payment_order_unconfigured(client, mock_supabase, settings_env):
    settings_env(CASHFREE_APP_ID="", CASHFREE_SECRET_KEY="")
    response = client.post(
        "/api/payments/orders",
        json={
            "batch_id": "java-aug-26",
            "customer_name": "Priya",
            "customer_email": "priya@example.com",
            "customer_phone": "9876543210",
        },
    )
    assert response.status_code == 503


def test_create_payment_order_batch_not_found(client, mock_supabase):
    mock_supabase.results["GET"] = []
    response = client.post(
        "/api/payments/orders",
        json={
            "batch_id": "missing",
            "customer_name": "Priya",
            "customer_email": "priya@example.com",
            "customer_phone": "9876543210",
        },
    )
    assert response.status_code == 404


def test_create_payment_order_success(client, mock_supabase, monkeypatch):
    mock_supabase.results["GET"] = [
        {"id": "java-aug-26", "course_slug": "java-full-stack-development", "price": "48000", "courses": {"title": "Java Full Stack"}}
    ]

    class FakeResponse:
        def __init__(self):
            self.is_error = False

        def json(self):
            return {"payment_session_id": "session_abc", "order_status": "ACTIVE"}

    class FakeClient:
        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            pass

        async def post(self, url, headers=None, json=None):
            return FakeResponse()

    monkeypatch.setattr("app.main.httpx.AsyncClient", lambda timeout=20: FakeClient())

    response = client.post(
        "/api/payments/orders",
        json={
            "batch_id": "java-aug-26",
            "customer_name": "Priya",
            "customer_email": "priya@example.com",
            "customer_phone": "9876543210",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["payment_session_id"] == "session_abc"
    assert body["amount"] == 48000.0
    created = mock_supabase.calls[-1]
    assert created["path"] == "payment_orders"
    assert created["payload"]["payment_session_id"] == "session_abc"
    assert created["payload"]["status"] == "pending"


def test_get_payment_order(client, mock_supabase):
    mock_supabase.results["GET"] = [{"order_id": "gs_1", "status": "pending"}]
    response = client.get("/api/payments/orders/gs_1")
    assert response.status_code == 200
    assert response.json()["status"] == "pending"


def _signed_webhook_payload(event: dict) -> tuple[str, str]:
    settings = get_settings()
    body = json.dumps(event).encode("utf-8")
    timestamp = str(int(datetime.now(timezone.utc).timestamp()))
    digest = base64.b64encode(
        hmac.new(settings.cashfree_webhook_secret.encode(), f"{timestamp}{body.decode('utf-8')}".encode(), hashlib.sha256).digest()
    ).decode()
    return body.decode("utf-8"), digest, timestamp


def test_webhook_missing_signature(client):
    response = client.post("/api/payments/webhook", json={"data": {}})
    assert response.status_code == 400


def test_webhook_invalid_signature(client):
    event = {"type": "PAYMENT_SUCCESS_WEBHOOK", "data": {"order": {"order_id": "gs_1"}}}
    body, _, timestamp = _signed_webhook_payload(event)
    response = client.post(
        "/api/payments/webhook",
        content=body,
        headers={"x-webhook-signature": "bogus", "x-webhook-timestamp": timestamp, "Content-Type": "application/json"},
    )
    assert response.status_code == 401


def test_webhook_success_updates_order_and_enrols(client, mock_supabase, monkeypatch):
    event = {
        "type": "PAYMENT_SUCCESS_WEBHOOK",
        "data": {
            "order": {"order_id": "gs_1"},
            "payment": {"payment_status": "SUCCESS"},
        },
    }
    body, digest, timestamp = _signed_webhook_payload(event)
    monkeypatch.setattr("app.main.send_payment_receipt", lambda *a, **k: None)

    mock_supabase.results["GET"] = [
        {"order_id": "gs_1", "customer_email": "priya@example.com", "customer_name": "Priya", "batch_id": "java-aug-26", "course_slug": "java-full-stack-development", "amount": 48000}
    ]
    mock_supabase.results["PATCH"] = [{"order_id": "gs_1", "status": "success"}]
    mock_supabase.results["POST"] = [{"id": "enrolment-id"}]

    response = client.post(
        "/api/payments/webhook",
        content=body,
        headers={"x-webhook-signature": digest, "x-webhook-timestamp": timestamp, "Content-Type": "application/json"},
    )
    assert response.status_code == 200
    paths = [call["path"] for call in mock_supabase.calls]
    assert "payment_orders?order_id=eq.gs_1" in paths
    assert "enrolments" in paths
    enrolment = next(call["payload"] for call in mock_supabase.calls if call["path"] == "enrolments")
    assert enrolment["user_email"] == "priya@example.com"
    assert enrolment["status"] == "active"


def test_webhook_success_is_idempotent(client, mock_supabase, monkeypatch):
    event = {
        "type": "PAYMENT_SUCCESS_WEBHOOK",
        "data": {"order": {"order_id": "gs_1"}, "payment": {"payment_status": "SUCCESS"}},
    }
    body, digest, timestamp = _signed_webhook_payload(event)
    mock_supabase.results["GET"] = [{"order_id": "gs_1", "status": "success"}]

    response = client.post(
        "/api/payments/webhook",
        content=body,
        headers={"x-webhook-signature": digest, "x-webhook-timestamp": timestamp, "Content-Type": "application/json"},
    )
    assert response.status_code == 200
    assert all(call["path"] != "enrolments" for call in mock_supabase.calls)


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------


def test_admin_requires_key(client):
    assert client.get("/api/admin/leads").status_code == 401
    assert client.get("/api/admin/leads", headers={"X-Admin-Key": "wrong"}).status_code == 401


def test_admin_list_leads(client, mock_supabase):
    mock_supabase.results["GET"] = [
        {"id": "1", "name": "Aarav", "status": "new"},
        {"id": "2", "name": "Priya", "status": "new"},
    ]
    response = client.get("/api/admin/leads", headers={"X-Admin-Key": get_settings().admin_api_key})
    assert response.status_code == 200
    assert response.json()["total"] == 2


def test_admin_stats(client, mock_supabase):
    mock_supabase.results["GET"] = [{"status": "new"}, {"status": "new"}, {"status": "contacted"}]
    response = client.get("/api/admin/stats", headers={"X-Admin-Key": get_settings().admin_api_key})
    assert response.status_code == 200
    assert response.json()["leads_by_status"]["new"] == 2


def test_admin_update_lead(client, mock_supabase):
    mock_supabase.results["PATCH"] = [{"id": "lead-1", "status": "contacted"}]
    response = client.patch(
        "/api/admin/leads/lead-1",
        json={"status": "contacted", "assigned_counsellor": "Nisha"},
        headers={"X-Admin-Key": get_settings().admin_api_key},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "contacted"


def test_admin_delete_lead(client, mock_supabase):
    response = client.delete("/api/admin/leads/lead-1", headers={"X-Admin-Key": get_settings().admin_api_key})
    assert response.status_code == 204
    assert mock_supabase.calls[-1]["method"] == "DELETE"


# ---------------------------------------------------------------------------
# Learner workspace
# ---------------------------------------------------------------------------


def test_learner_me_unauthenticated(client):
    response = client.get("/api/learner/me")
    assert response.status_code == 401


def test_learner_me_authenticated(client, mock_supabase):
    async def fake_verify():
        return {"sub": "user-123", "email": "learner@example.com", "user_metadata": {"name": "Priya"}}

    app.dependency_overrides[verify_supabase_token] = fake_verify
    mock_supabase.results["GET"] = []
    response = client.get("/api/learner/me", headers={"Authorization": "Bearer any"})
    assert response.status_code == 200
    assert response.json()["email"] == "learner@example.com"
    assert response.json()["name"] == "Priya"


def test_learner_progress_save(client, mock_supabase):
    async def fake_verify():
        return {"sub": "user-123"}

    app.dependency_overrides[verify_supabase_token] = fake_verify
    response = client.post(
        "/api/learner/progress",
        json={"course_slug": "java-full-stack-development", "module_index": 1, "lesson_index": 0, "completed": True},
        headers={"Authorization": "Bearer any"},
    )
    assert response.status_code == 200
    call = mock_supabase.calls[-1]
    assert call["method"] == "POST"
    assert call["path"] == "course_progress?on_conflict=user_id,course_slug,lesson_key"
    assert call["payload"]["user_id"] == "user-123"
    assert call["payload"]["lesson_key"] == "1:0"


def test_verify_token_rejects_garbage():
    import app.main as main
    from app.security import verify_supabase_token

    async def go():
        with pytest.raises(HTTPException) as exc:
            await verify_supabase_token("not-a-jwt")
        return exc.value.status_code

    import asyncio

    assert asyncio.run(go()) == 401


def test_settings_defaults():
    settings = get_settings()
    assert settings.cashfree_mode == "sandbox"
    assert "https://frontend.test" in settings.cors_origin_list

# ---------------------------------------------------------------------------
# Blog (headless CMS)
# ---------------------------------------------------------------------------


def test_list_blog_posts(client, mock_supabase):
    mock_supabase.results["GET"] = [{"slug": "post-1", "title": "Hello", "published": True}]
    response = client.get("/api/blog")
    assert response.status_code == 200
    assert response.json()[0]["slug"] == "post-1"


def test_get_blog_post_not_found(client, mock_supabase):
    mock_supabase.results["GET"] = []
    assert client.get("/api/blog/missing").status_code == 404


def test_admin_create_blog_post(client, mock_supabase):
    response = client.post(
        "/api/admin/blog",
        headers={"X-Admin-Key": "test-admin-key"},
        json={"slug": "new-post", "title": "New Post", "content": ["A", "B"]},
    )
    assert response.status_code == 201
    call = mock_supabase.calls[-1]
    assert call["path"] == "blog_posts?on_conflict=slug"
    assert call["payload"]["slug"] == "new-post"
    assert call["payload"]["published_on"]  # server fills a default date


# ---------------------------------------------------------------------------
# UPI intents & payment reconciliation
# ---------------------------------------------------------------------------


def _upi_payload() -> dict:
    return {
        "batch_id": "java-aug-26",
        "customer_name": "Kiran Kumar",
        "customer_email": "kiran@example.com",
        "customer_phone": "9876500112",
    }


def test_upi_intent_records_order_and_lead(client, mock_supabase):
    mock_supabase.results["GET"] = [
        {"id": "java-aug-26", "course_slug": "java-full-stack-development", "price": 48000, "courses": {"title": "Java Full Stack"}}
    ]
    response = client.post("/api/payments/upi-intents", json=_upi_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["reference"].startswith("GS")
    assert body["status"] == "awaiting_verification"
    assert body["amount"] == 48000

    paths = [call["path"] for call in mock_supabase.calls]
    assert "payment_orders" in paths
    assert "leads" in paths
    order = next(call["payload"] for call in mock_supabase.calls if call["path"] == "payment_orders")
    assert order["payment_method"] == "upi"
    assert order["status"] == "awaiting_verification"
    assert order["reference"] == body["reference"]
    lead = next(call["payload"] for call in mock_supabase.calls if call["path"] == "leads")
    assert lead["source"] == "upi-checkout"
    assert body["reference"] in lead["message"]


def test_upi_intent_batch_not_found(client, mock_supabase):
    mock_supabase.results["GET"] = []
    assert client.post("/api/payments/upi-intents", json=_upi_payload()).status_code == 404


def test_admin_verify_payment_allots_seat_and_enrols(client, mock_supabase, monkeypatch):
    monkeypatch.setattr("app.main.send_payment_receipt", lambda *a, **k: None)
    order = {
        "order_id": "gs_upi_1",
        "status": "awaiting_verification",
        "batch_id": "java-aug-26",
        "course_slug": "java-full-stack-development",
        "customer_email": "kiran@example.com",
        "customer_name": "Kiran Kumar",
        "amount": 48000,
    }
    batch = {"id": "java-aug-26", "available": 5}

    async def handler(method, path, payload=None, query=None):
        mock_supabase.calls.append({"method": method, "path": path, "payload": payload, "query": query})
        if method == "GET" and path == "batches":
            return [batch]
        if method == "GET":
            return [order]
        return [{"id": "x"}]

    monkeypatch.setattr("app.main.supabase_request", handler)

    response = client.post("/api/admin/payments/gs_upi_1/verify", headers={"X-Admin-Key": "test-admin-key"})
    assert response.status_code == 200

    paths = [call["path"] for call in mock_supabase.calls]
    assert "payment_orders?order_id=eq.gs_upi_1" in paths
    assert "batches?id=eq.java-aug-26" in paths
    assert "enrolments" in paths
    assert "notifications" in paths
    seat_update = next(call["payload"] for call in mock_supabase.calls if call["path"] == "batches?id=eq.java-aug-26")
    assert seat_update["available"] == 4
    enrolment = next(call["payload"] for call in mock_supabase.calls if call["path"] == "enrolments")
    assert enrolment["user_email"] == "kiran@example.com"
    assert enrolment["status"] == "active"


def test_admin_verify_payment_requires_credentials(client):
    assert client.post("/api/admin/payments/gs_1/verify").status_code == 401


def test_admin_verify_payment_idempotent(client, monkeypatch):
    mock_calls: list[str] = []

    async def handler(method, path, payload=None, query=None):
        mock_calls.append(path)
        return [{"order_id": "gs_upi_1", "status": "success"}]

    monkeypatch.setattr("app.main.supabase_request", handler)
    response = client.post("/api/admin/payments/gs_upi_1/verify", headers={"X-Admin-Key": "test-admin-key"})
    assert response.status_code == 200
    assert "enrolments" not in mock_calls


def test_admin_list_payments(client, mock_supabase):
    mock_supabase.results["GET"] = [{"order_id": "gs_1", "reference": "GSABC", "status": "awaiting_verification"}]
    response = client.get("/api/admin/payments", headers={"X-Admin-Key": "test-admin-key"})
    assert response.status_code == 200
    assert response.json()["items"][0]["reference"] == "GSABC"


def test_admin_schema_viewer(client, mock_supabase):
    mock_supabase.results["GET"] = [{"count": 7}]
    response = client.get("/api/admin/schema", headers={"X-Admin-Key": "test-admin-key"})
    assert response.status_code == 200
    tables = response.json()["tables"]
    assert any(table["name"] == "blog_posts" and table["rows"] == 7 for table in tables)
    assert "admin" in response.json()["role_permissions"]


# ---------------------------------------------------------------------------
# Role-based access control
# ---------------------------------------------------------------------------


def test_role_matrix_grants():
    from app.security import ROLE_PERMISSIONS, role_grants

    assert role_grants("admin", "reconcile_payments")
    assert role_grants("instructor", "manage_catalog")
    assert not role_grants("instructor", "manage_leads")
    assert not role_grants("learner", "manage_catalog")
    assert set(ROLE_PERMISSIONS) == {"learner", "instructor", "admin", "partner"}


def test_instructor_jwt_can_manage_catalog_but_not_leads(client, mock_supabase, monkeypatch):
    async def fake_verify(authorization=None):
        return {"sub": "u-1", "email": "faculty@guideitsol.in", "app_metadata": {"role": "instructor"}}

    monkeypatch.setattr("app.security.verify_supabase_token", fake_verify)
    mock_supabase.results["POST"] = [{"slug": "new-course"}]

    authorized = client.post(
        "/api/admin/courses",
        headers={"Authorization": "Bearer token"},
        json={"slug": "new-course", "title": "New Course", "category": "Data & AI"},
    )
    assert authorized.status_code == 201

    forbidden = client.get("/api/admin/leads", headers={"Authorization": "Bearer token"})
    assert forbidden.status_code == 403


def test_learner_jwt_cannot_manage_catalog(client, mock_supabase, monkeypatch):
    async def fake_verify(authorization=None):
        return {"sub": "u-2", "email": "learner@example.com", "app_metadata": {"role": "learner"}}

    monkeypatch.setattr("app.security.verify_supabase_token", fake_verify)
    response = client.post(
        "/api/admin/courses",
        headers={"Authorization": "Bearer token"},
        json={"slug": "hack", "title": "Hack Course", "category": "Data & AI"},
    )
    assert response.status_code == 403
