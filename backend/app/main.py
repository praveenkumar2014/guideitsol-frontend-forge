import base64
import hashlib
import hmac
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from .emailer import notify_new_lead, send_enquiry_confirmation, send_payment_receipt
from .security import client_ip, lead_limiter, order_limiter, require_admin_key, verify_supabase_token
from .settings import get_settings
from .supabase import SupabaseError, supabase_request

app = FastAPI(title="GUIDESOFT API", version="1.0.0")


def _cors_origins() -> list[str]:
    settings = get_settings()
    return list(dict.fromkeys([*settings.cors_origin_list, settings.frontend_url.rstrip("/")]))


# CORSMiddleware needs the origins at construction time; settings are read on
# import, which is fine because the API process reads env at startup.
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Admin-Key"],
)


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    course_slug: str | None = Field(default=None, max_length=160)
    batch_id: str | None = Field(default=None, max_length=120)
    source: str = Field(default="website", max_length=80)
    message: str = Field(min_length=10, max_length=4000)


class OrderCreate(BaseModel):
    batch_id: str = Field(min_length=2, max_length=120)
    customer_name: str = Field(min_length=2, max_length=120)
    customer_email: EmailStr
    customer_phone: str = Field(min_length=8, max_length=30)


class ProgressCreate(BaseModel):
    course_slug: str = Field(min_length=2, max_length=160)
    module_index: int = Field(ge=0, le=200)
    lesson_index: int = Field(ge=0, le=200)
    completed: bool = True


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "guidesoft-api"}


# ---------------------------------------------------------------------------
# Public catalogue
# ---------------------------------------------------------------------------


@app.get("/api/courses")
async def list_courses() -> Any:
    return await supabase_request(
        "GET", "courses", query="published=eq.true&select=*&order=title.asc"
    )


@app.get("/api/courses/{slug}")
async def get_course(slug: str) -> Any:
    result = await supabase_request("GET", "courses", query=f"slug=eq.{slug}&published=eq.true&select=*")
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return result[0]


@app.get("/api/batches")
async def list_batches() -> Any:
    return await supabase_request(
        "GET", "batches", query="select=*,courses(title)&order=start_date.asc"
    )


@app.get("/api/batches/{batch_id}")
async def get_batch(batch_id: str) -> Any:
    result = await supabase_request("GET", "batches", query=f"id=eq.{batch_id}&select=*,courses(title)")
    if not result:
        raise HTTPException(status_code=404, detail="Batch not found")
    return result[0]


# ---------------------------------------------------------------------------
# Leads / enquiries
# ---------------------------------------------------------------------------


@app.post("/api/leads", status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate, request: Request) -> dict[str, Any]:
    if not lead_limiter.allow(client_ip(request)):
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again later.")
    payload = lead.model_dump(mode="json")
    payload["status"] = "new"
    try:
        created = await supabase_request("POST", "leads", payload)
    except SupabaseError as exc:
        raise HTTPException(status_code=502, detail="Unable to store your enquiry. Please try again.") from exc
    notify_new_lead(payload)
    send_enquiry_confirmation(lead.email, lead.name)
    record = created[0] if isinstance(created, list) and created else payload
    return {"id": record.get("id"), "status": record.get("status", "new")}


# ---------------------------------------------------------------------------
# Certificate verification
# ---------------------------------------------------------------------------


@app.get("/api/certificates/{certificate_id}")
async def verify_certificate(certificate_id: str) -> Any:
    result = await supabase_request(
        "GET",
        "certificates",
        query=f"id=eq.{certificate_id}&status=eq.issued&select=id,learner_name,course_title,course_slug,issued_on,status",
    )
    if not result:
        raise HTTPException(status_code=404, detail="Certificate record not found")
    return result[0]


# ---------------------------------------------------------------------------
# Payments
# ---------------------------------------------------------------------------


@app.post("/api/payments/orders", status_code=status.HTTP_201_CREATED)
async def create_payment_order(order: OrderCreate, request: Request) -> dict[str, Any]:
    settings = get_settings()
    if not settings.cashfree_app_id or not settings.cashfree_secret_key:
        raise HTTPException(status_code=503, detail="Online payments are not configured yet")
    if not order_limiter.allow(client_ip(request)):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    batch_result = await supabase_request("GET", "batches", query=f"id=eq.{order.batch_id}&select=*,courses(title)")
    if not batch_result:
        raise HTTPException(status_code=404, detail="Batch not found")
    batch = batch_result[0]
    course_title = batch.get("courses", {}).get("title") or batch.get("course_slug", "course")
    amount = float(batch.get("price") or 0)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="This batch is not available for online payment")

    order_id = f"gs_{uuid.uuid4().hex}"
    payload = {
        "order_id": order_id,
        "order_amount": amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": order.customer_email.replace("@", "_").replace(".", "_"),
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone,
        },
        "order_meta": {
            "return_url": f"{settings.frontend_url.rstrip('/')}/payment-return?order_id={order_id}",
            "notify_url": f"{settings.public_api_base_url.rstrip('/')}/api/payments/webhook",
        },
        "order_note": f"GUIDESOFT course: {course_title} (batch {order.batch_id})",
    }
    headers = {
        "x-client-id": settings.cashfree_app_id,
        "x-client-secret": settings.cashfree_secret_key,
        "x-api-version": "2025-01-01",
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(f"{settings.cashfree_base_url}/pg/orders", headers=headers, json=payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Payment provider is unreachable. Please try again.") from exc
    if response.is_error:
        raise HTTPException(status_code=502, detail="Payment provider order creation failed")

    payment = response.json()
    payment_session_id = payment.get("payment_session_id", "")
    await supabase_request(
        "POST",
        "payment_orders",
        {
            "order_id": order_id,
            "course_slug": batch.get("course_slug"),
            "batch_id": order.batch_id,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone,
            "amount": amount,
            "payment_session_id": payment_session_id,
            "status": "pending",
        },
    )
    return {
        "order_id": order_id,
        "payment_session_id": payment_session_id,
        "amount": amount,
        "course_title": course_title,
        "cashfree_mode": settings.cashfree_mode,
    }


@app.get("/api/payments/orders/{order_id}")
async def get_payment_order(order_id: str) -> Any:
    result = await supabase_request(
        "GET", "payment_orders", query=f"order_id=eq.{order_id}&select=order_id,course_slug,batch_id,customer_name,customer_email,amount,status,payment_session_id,created_at,updated_at"
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    return result[0]


@app.post("/api/payments/webhook")
async def cashfree_webhook(
    request: Request,
    x_webhook_signature: str | None = Header(default=None),
    x_webhook_timestamp: str | None = Header(default=None),
) -> dict[str, str]:
    if not x_webhook_signature or not x_webhook_timestamp:
        raise HTTPException(status_code=400, detail="Missing payment webhook signature")
    raw_body = await request.body()
    settings = get_settings()
    if not settings.cashfree_webhook_secret:
        raise HTTPException(status_code=503, detail="Payment webhooks are not configured")
    signed_payload = f"{x_webhook_timestamp}{raw_body.decode('utf-8')}".encode("utf-8")
    digest = base64.b64encode(
        hmac.new(settings.cashfree_webhook_secret.encode(), signed_payload, hashlib.sha256).digest()
    ).decode()
    if not hmac.compare_digest(digest, x_webhook_signature):
        raise HTTPException(status_code=401, detail="Invalid payment webhook signature")

    event = await request.json()
    order_id = event.get("data", {}).get("order", {}).get("order_id")
    payment_status = (event.get("data", {}).get("payment", {}).get("payment_status") or "").lower()
    if not order_id or not payment_status:
        return {"status": "accepted"}

    existing = await supabase_request(
        "GET", "payment_orders", query=f"order_id=eq.{order_id}&select=*"
    )
    if existing and existing[0].get("status") == "success":
        # Idempotency: duplicate delivery of the same event.
        return {"status": "accepted"}

    updated = await supabase_request(
        "PATCH",
        f"payment_orders?order_id=eq.{order_id}",
        {"status": payment_status, "updated_at": datetime.now(timezone.utc).isoformat()},
    )

    if payment_status == "success":
        # The PATCH response is a PostgREST representation and may not carry the
        # customer columns, so build the enrolment from the stored order row.
        record = (existing or updated or [{}])[0]
        customer_email = record.get("customer_email") or ""
        customer_name = record.get("customer_name") or "there"
        batch_id = record.get("batch_id")
        course_slug = record.get("course_slug") or "course"
        await supabase_request(
            "POST",
            "enrolments",
            {
                "user_email": customer_email,
                "batch_id": batch_id,
                "course_slug": course_slug,
                "payment_order_id": order_id,
                "amount": record.get("amount"),
                "status": "active",
            },
        )
        await supabase_request(
            "POST",
            "notifications",
            {
                "user_email": customer_email,
                "title": "Enrolment confirmed",
                "body": f"Your enrolment for {course_slug} is active. Your batch coordinator will share the class link before the first session.",
            },
        )
        send_payment_receipt(customer_email, customer_name, order_id, course_slug, f"₹{record.get('amount', 0)}")
    return {"status": "accepted"}


# ---------------------------------------------------------------------------
# Learner workspace (Supabase JWT in Authorization header)
# ---------------------------------------------------------------------------


@app.get("/api/learner/me")
async def learner_profile(payload: dict[str, Any] = Depends(verify_supabase_token)) -> dict[str, Any]:
    user_id = payload.get("sub")
    email = payload.get("email") or ""
    meta = payload.get("user_metadata") or {}
    name = meta.get("name") or meta.get("full_name")
    if not name:
        name = email.split("@")[0] if email else "Learner"
    enrolments = await supabase_request(
        "GET",
        "enrolments",
        query=f"user_id=eq.{user_id}&select=*,courses(title),batches(name,start_date,status)",
    )
    notifications = await supabase_request(
        "GET",
        "notifications",
        query=f"user_id=eq.{user_id}&select=*&order=created_at.desc&limit=10",
    )
    return {
        "id": user_id,
        "email": email,
        "name": name,
        "enrolments": enrolments or [],
        "notifications": notifications or [],
    }


@app.get("/api/learner/progress")
async def get_progress(course_slug: str, payload: dict[str, Any] = Depends(verify_supabase_token)) -> Any:
    user_id = payload.get("sub")
    return await supabase_request(
        "GET",
        "course_progress",
        query=f"user_id=eq.{user_id}&course_slug=eq.{course_slug}&select=module_index,lesson_index,completed,completed_at",
    )


@app.post("/api/learner/progress")
async def set_progress(
    progress: ProgressCreate,
    payload: dict[str, Any] = Depends(verify_supabase_token),
) -> dict[str, Any]:
    user_id = payload.get("sub")
    lesson_key = f"{progress.module_index}:{progress.lesson_index}"
    await supabase_request(
        "POST",
        "course_progress?on_conflict=user_id,course_slug,lesson_key",
        {
            "user_id": user_id,
            "course_slug": progress.course_slug,
            "lesson_key": lesson_key,
            "module_index": progress.module_index,
            "lesson_index": progress.lesson_index,
            "completed": progress.completed,
            "completed_at": datetime.now(timezone.utc).isoformat() if progress.completed else None,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        query="select=module_index,lesson_index,completed",
    )
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Admin (X-Admin-Key header)
# ---------------------------------------------------------------------------


@app.get("/api/admin/leads")
async def admin_list_leads(
    _: None = Depends(require_admin_key),
    search: str | None = None,
    lead_status: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict[str, Any]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size
    filters = []
    if lead_status:
        filters.append(f"status=eq.{lead_status}")
    filters.append(f"order=created_at.desc")
    filters.append(f"range={offset}.{offset + page_size - 1}")
    query = "&".join(filters) + "&select=*"
    rows = await supabase_request("GET", "leads", query=query)
    total_result = await supabase_request("GET", "leads", query="select=count")
    total = total_result[0].get("count", 0) if total_result else 0
    items = rows or []
    if search:
        needle = search.lower()
        items = [
            row
            for row in items
            if needle in (row.get("name") or "").lower()
            or needle in (row.get("email") or "").lower()
            or needle in (row.get("course_slug") or "").lower()
        ]
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@app.get("/api/admin/stats")
async def admin_stats(_: None = Depends(require_admin_key)) -> dict[str, Any]:
    lead_rows = await supabase_request("GET", "leads", query="select=status")
    leads = lead_rows or []
    by_status: dict[str, int] = {}
    for row in leads:
        by_status[row.get("status", "unknown")] = by_status.get(row.get("status", "unknown"), 0) + 1
    course_rows = await supabase_request("GET", "leads", query="select=course_slug")
    course_counts: dict[str, int] = {}
    for row in course_rows or []:
        slug = row.get("course_slug") or "general"
        course_counts[slug] = course_counts.get(slug, 0) + 1
    top_courses = sorted(course_counts.items(), key=lambda item: item[1], reverse=True)[:5]
    order_rows = await supabase_request("GET", "payment_orders", query="select=status,amount")
    orders = order_rows or []
    paid = sum(float(row.get("amount") or 0) for row in orders if row.get("status") == "success")
    return {
        "total_leads": len(leads),
        "leads_by_status": by_status,
        "top_courses": [{"course_slug": slug, "count": count} for slug, count in top_courses],
        "total_orders": len(orders),
        "paid_revenue": paid,
    }


@app.patch("/api/admin/leads/{lead_id}")
async def admin_update_lead(
    lead_id: str,
    body: dict[str, Any],
    _: None = Depends(require_admin_key),
) -> Any:
    allowed = {"status", "assigned_counsellor", "follow_up_at", "notes"}
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=422, detail="No updatable fields provided")
    result = await supabase_request(
        "PATCH", f"leads?id=eq.{lead_id}", {**updates, "updated_at": datetime.now(timezone.utc).isoformat()}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return result[0]


@app.delete("/api/admin/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_lead(lead_id: str, _: None = Depends(require_admin_key)) -> None:
    await supabase_request("DELETE", f"leads?id=eq.{lead_id}")


@app.get("/api/admin/orders")
async def admin_list_orders(
    _: None = Depends(require_admin_key),
    search: str | None = None,
    order_status: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict[str, Any]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size
    filters = []
    if order_status:
        filters.append(f"status=eq.{order_status}")
    filters.append("order=created_at.desc")
    filters.append(f"range={offset}.{offset + page_size - 1}")
    rows = await supabase_request("GET", "payment_orders", query="&".join(filters) + "&select=*")
    items = rows or []
    if search:
        needle = search.lower()
        items = [
            row
            for row in items
            if needle in (row.get("order_id") or "").lower()
            or needle in (row.get("customer_name") or "").lower()
            or needle in (row.get("customer_email") or "").lower()
        ]
    total_result = await supabase_request(
        "GET", "payment_orders", query="select=count" + (f"&status=eq.{order_status}" if order_status else "")
    )
    total = total_result[0].get("count", 0) if total_result else len(items)
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@app.get("/api/admin/batches")
async def admin_list_batches(_: None = Depends(require_admin_key)) -> Any:
    return await supabase_request(
        "GET", "batches", query="select=*,courses(title)&order=start_date.asc"
    )


@app.patch("/api/admin/batches/{batch_id}")
async def admin_update_batch(
    batch_id: str,
    body: dict[str, Any],
    _: None = Depends(require_admin_key),
) -> Any:
    allowed = {"name", "start_date", "end_date", "days", "time", "seats", "available", "mode", "instructor", "status", "price"}
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=422, detail="No updatable fields provided")
    result = await supabase_request(
        "PATCH",
        f"batches?id=eq.{batch_id}",
        {**updates, "updated_at": datetime.now(timezone.utc).isoformat()},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Batch not found")
    return result[0]


@app.get("/api/admin/certificates")
async def admin_list_certificates(_: None = Depends(require_admin_key)) -> Any:
    return await supabase_request(
        "GET", "certificates", query="select=*&order=issued_on.desc&limit=200"
    )


class CertificateIssue(BaseModel):
    learner_name: str = Field(min_length=2, max_length=160)
    course_title: str = Field(min_length=2, max_length=200)
    course_slug: str | None = Field(default=None, max_length=160)
    issued_on: str = Field(min_length=10, max_length=10)


@app.post("/api/admin/certificates", status_code=status.HTTP_201_CREATED)
async def admin_issue_certificate(
    certificate: CertificateIssue,
    _: None = Depends(require_admin_key),
) -> Any:
    certificate_id = f"GS-{datetime.now(timezone.utc).strftime('%Y')}-{uuid.uuid4().hex[:4].upper()}"
    created = await supabase_request(
        "POST",
        "certificates",
        {
            "id": certificate_id,
            "learner_name": certificate.learner_name,
            "course_title": certificate.course_title,
            "course_slug": certificate.course_slug,
            "issued_on": certificate.issued_on,
            "status": "issued",
        },
    )
    record = created[0] if isinstance(created, list) and created else {}
    return {"id": certificate_id, **record}


@app.delete("/api/admin/certificates/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_certificate(
    certificate_id: str, _: None = Depends(require_admin_key)
) -> None:
    await supabase_request("DELETE", f"certificates?id=eq.{certificate_id}")


@app.get("/api/admin/enrolments")
async def admin_list_enrolments(_: None = Depends(require_admin_key)) -> Any:
    return await supabase_request(
        "GET", "enrolments", query="select=*,batches(name,status),courses(title)&order=enrolled_at.desc&limit=200"
    )