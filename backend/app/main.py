from __future__ import annotations

import base64
import hashlib
import hmac
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field

from .emailer import notify_new_lead, send_enquiry_confirmation, send_payment_receipt
from .security import (
    ROLE_PERMISSIONS,
    client_ip,
    lead_limiter,
    order_limiter,
    require_role,
    role_grants,
    verify_supabase_token,
)
from .settings import get_settings
from .supabase import SupabaseError, supabase_request

app = FastAPI(title="GUIDESOFT API", version="1.0.0")


@app.exception_handler(SupabaseError)
async def supabase_error_handler(request: Request, exc: SupabaseError) -> JSONResponse:
    """Degrade gracefully when the database is unreachable or not configured.

    The frontend treats this as "database offline" and falls back to its static
    catalogue / UPI flow instead of showing a stack trace.
    """
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": "The database is not reachable right now. Please try again shortly.",
            "code": "database_unavailable",
        },
    )


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


class UpiIntentCreate(BaseModel):
    batch_id: str = Field(min_length=2, max_length=120)
    customer_name: str = Field(min_length=2, max_length=120)
    customer_email: EmailStr
    customer_phone: str = Field(min_length=8, max_length=30)
    note: str = Field(default="", max_length=500)


class BlogPostUpsert(BaseModel):
    slug: str = Field(min_length=2, max_length=160)
    title: str = Field(min_length=3, max_length=240)
    excerpt: str = Field(default="", max_length=1000)
    author: str = Field(default="GUIDESOFT Editorial", max_length=120)
    published_on: str | None = Field(default=None, max_length=20)
    read_time: str = Field(default="5 min read", max_length=40)
    category: str = Field(default="Industry Insights", max_length=80)
    image: str = Field(default="", max_length=500)
    content: list[str] = Field(default_factory=list, max_length=200)
    published: bool = True


class CourseUpsert(BaseModel):
    slug: str = Field(min_length=2, max_length=160)
    title: str = Field(min_length=3, max_length=240)
    category: str = Field(min_length=2, max_length=120)
    level: str = Field(default="Intermediate", max_length=40)
    duration: str = Field(default="12 weeks", max_length=60)
    format: str = Field(default="Live online", max_length=60)
    price: float = Field(default=0, ge=0)
    summary: str = Field(default="", max_length=2000)
    overview: str = Field(default="", max_length=8000)
    curriculum: list[Any] = Field(default_factory=list)
    tools: list[str] = Field(default_factory=list)
    published: bool = True


class BatchUpsert(BaseModel):
    id: str = Field(min_length=2, max_length=120)
    course_slug: str = Field(min_length=2, max_length=160)
    name: str = Field(min_length=3, max_length=200)
    start_date: str = Field(max_length=20)
    end_date: str = Field(max_length=20)
    days: str = Field(default="Mon, Wed, Fri", max_length=80)
    time: str = Field(default="7:30–9:00 PM", max_length=80)
    seats: int = Field(default=0, ge=0)
    available: int = Field(default=0, ge=0)
    mode: str = Field(default="Live online", max_length=60)
    instructor: str = Field(default="GUIDESOFT Faculty", max_length=120)
    status: str = Field(default="Open for enrolment", max_length=80)
    price: float = Field(default=0, ge=0)


# Role-scoped admin dependencies (also accept the legacy X-Admin-Key service key).
require_admin = require_role("admin", permission="manage_system")
require_lead_manager = require_role("admin", permission="manage_leads")
require_payment_manager = require_role("admin", permission="reconcile_payments")
require_catalog_manager = require_role("admin", "instructor", permission="manage_catalog")


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
# Blog (headless CMS collection)
# ---------------------------------------------------------------------------


@app.get("/api/blog")
async def list_blog_posts() -> Any:
    return await supabase_request(
        "GET", "blog_posts", query="published=eq.true&select=*&order=published_on.desc"
    )


@app.get("/api/blog/{slug}")
async def get_blog_post(slug: str) -> Any:
    result = await supabase_request(
        "GET", "blog_posts", query=f"slug=eq.{slug}&published=eq.true&select=*"
    )
    if not result:
        raise HTTPException(status_code=404, detail="Blog post not found")
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


async def finalize_paid_order(order: dict[str, Any], *, verified_by: str | None = None) -> None:
    """Idempotent post-payment engine shared by gateway webhooks and manual UPI
    verification.

    On a successful transaction this:
      1. marks the payment order paid (with verifier attribution),
      2. decrements the batch seat counter (automated seat allotment),
      3. creates the learner enrolment (unique per email + batch),
      4. drops a learner notification and emails the receipt.
    """
    order_id = order.get("order_id") or ""
    now = datetime.now(timezone.utc).isoformat()
    await supabase_request(
        "PATCH",
        f"payment_orders?order_id=eq.{order_id}",
        {
            "status": "success",
            "verified_by": verified_by,
            "verified_at": now,
            "updated_at": now,
        },
    )

    batch_id = order.get("batch_id")
    if batch_id:
        try:
            rows = await supabase_request(
                "GET", "batches", query=f"id=eq.{batch_id}&select=id,available"
            )
            if rows and isinstance(rows, list) and isinstance(rows[0], dict):
                available = int(rows[0].get("available") or 0)
                if available > 0:
                    await supabase_request(
                        "PATCH",
                        f"batches?id=eq.{batch_id}",
                        {"available": available - 1, "updated_at": now},
                    )
        except SupabaseError:
            pass  # seat counter is best-effort; enrolment still proceeds

    try:
        await supabase_request(
            "POST",
            "enrolments",
            {
                "user_email": order.get("customer_email"),
                "batch_id": batch_id,
                "course_slug": order.get("course_slug"),
                "payment_order_id": order_id,
                "amount": order.get("amount"),
                "status": "active",
                "updated_at": now,
            },
        )
    except SupabaseError:
        pass  # already enrolled (unique user_email + batch_id)

    try:
        await supabase_request(
            "POST",
            "notifications",
            {
                "user_email": order.get("customer_email"),
                "title": "Enrolment confirmed",
                "body": f"Your payment for {order.get('course_slug', 'your course')} is verified. Course access is unlocked.",
                "read": False,
            },
        )
    except SupabaseError:
        pass

    send_payment_receipt(
        order.get("customer_email", ""),
        order.get("customer_name", "there"),
        order_id,
        order.get("course_slug", "your course"),
        f"₹{order.get('amount', 0)}",
    )


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

    existing_rec = existing[0] if existing and isinstance(existing, list) and existing else {}

    if payment_status == "success":
        record = {**existing_rec, "order_id": order_id}
        await finalize_paid_order(record, verified_by="cashfree-webhook")
    else:
        await supabase_request(
            "PATCH",
            f"payment_orders?order_id=eq.{order_id}",
            {"status": payment_status, "updated_at": datetime.now(timezone.utc).isoformat()},
        )
    return {"status": "accepted"}


# ---------------------------------------------------------------------------
# UPI / GPay direct intents (manual verification workflow)
# ---------------------------------------------------------------------------


@app.post("/api/payments/upi-intents", status_code=status.HTTP_201_CREATED)
async def create_upi_intent(intent: UpiIntentCreate, request: Request) -> dict[str, Any]:
    """Record a direct UPI/GPay payment intent against a batch.

    UPI apps cannot notify the site automatically, so every intent is stored in
    SQL with a unique transaction reference and surfaced in the admin payment
    reconciliation tab. Admissions verifies the bank credit and marks the order
    paid, which triggers automatic seat allotment and enrolment.
    """
    if not order_limiter.allow(client_ip(request)):
        raise HTTPException(status_code=429, detail="Too many payment attempts. Please try again later.")

    batch_result = await supabase_request(
        "GET", "batches", query=f"id=eq.{intent.batch_id}&select=*,courses(title)"
    )
    if not batch_result:
        raise HTTPException(status_code=404, detail="Batch not found")
    batch = batch_result[0]
    course_title = batch.get("courses", {}).get("title") or batch.get("course_slug", "course")
    amount = float(batch.get("price") or 0)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="This batch is not available for online payment")

    reference = f"GS{uuid.uuid4().hex[:10].upper()}"
    order_id = f"gs_upi_{uuid.uuid4().hex}"
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "order_id": order_id,
        "course_slug": batch.get("course_slug"),
        "batch_id": intent.batch_id,
        "customer_name": intent.customer_name,
        "customer_email": intent.customer_email,
        "customer_phone": intent.customer_phone,
        "amount": amount,
        "payment_session_id": None,
        "payment_method": "upi",
        "reference": reference,
        "status": "awaiting_verification",
        "created_at": now,
        "updated_at": now,
    }
    try:
        await supabase_request("POST", "payment_orders", row)
    except SupabaseError as exc:
        raise HTTPException(status_code=502, detail="Unable to record the UPI payment request. Please try again.") from exc

    # Mirror the intent into the admin enquiry list (lead CRM) so admissions
    # can reconcile the reference against the bank statement.
    try:
        await supabase_request(
            "POST",
            "leads",
            {
                "name": intent.customer_name,
                "email": intent.customer_email,
                "phone": intent.customer_phone,
                "course_slug": batch.get("course_slug"),
                "batch_id": intent.batch_id,
                "source": "upi-checkout",
                "message": (
                    f"UPI payment initiated for {course_title} "
                    f"({batch.get('name', intent.batch_id)}), ref {reference}, amount ₹{amount:g}"
                    + (f". Note: {intent.note}" if intent.note else "")
                ),
                "status": "new",
            },
        )
    except SupabaseError:
        pass

    return {
        "order_id": order_id,
        "reference": reference,
        "amount": amount,
        "course_title": course_title,
        "status": "awaiting_verification",
    }


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
# Admin (role-verified JWT or X-Admin-Key service credential)
# ---------------------------------------------------------------------------


@app.get("/api/admin/leads")
async def admin_list_leads(
    _: dict[str, Any] = Depends(require_lead_manager),
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
    total = total_result[0].get("count") if (total_result and isinstance(total_result[0], dict) and "count" in total_result[0]) else len(rows or [])
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
async def admin_stats(_: dict[str, Any] = Depends(require_lead_manager)) -> dict[str, Any]:
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
    _: dict[str, Any] = Depends(require_lead_manager),
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


@app.delete("/api/admin/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def admin_delete_lead(lead_id: str, _: dict[str, Any] = Depends(require_lead_manager)) -> Response:
    await supabase_request("DELETE", f"leads?id=eq.{lead_id}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# Admin · payment reconciliation (UPI & gateway)
# ---------------------------------------------------------------------------


@app.get("/api/admin/payments")
async def admin_list_payments(
    _: dict[str, Any] = Depends(require_payment_manager),
    payment_status: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict[str, Any]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size
    filters = []
    if payment_status:
        filters.append(f"status=eq.{payment_status}")
    filters.append("order=created_at.desc")
    filters.append(f"range={offset}.{offset + page_size - 1}")
    query = "&".join(filters) + "&select=*"
    rows = await supabase_request("GET", "payment_orders", query=query)
    total_result = await supabase_request("GET", "payment_orders", query="select=count")
    total = (
        total_result[0].get("count")
        if (total_result and isinstance(total_result[0], dict) and "count" in total_result[0])
        else len(rows or [])
    )
    items = rows or []
    if search:
        needle = search.lower()
        items = [
            row
            for row in items
            if needle in (row.get("customer_name") or "").lower()
            or needle in (row.get("customer_email") or "").lower()
            or needle in (row.get("order_id") or "").lower()
            or needle in (row.get("reference") or "").lower()
        ]
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@app.post("/api/admin/payments/{order_id}/verify")
async def admin_verify_payment(
    order_id: str,
    actor: dict[str, Any] = Depends(require_payment_manager),
) -> Any:
    """Mark a payment as received (bank/UPI verified) and run the allotment engine."""
    result = await supabase_request("GET", "payment_orders", query=f"order_id=eq.{order_id}&select=*")
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    order = result[0]
    if order.get("status") == "success":
        return order
    verifier = actor.get("email") or actor.get("sub") or "admin"
    await finalize_paid_order(order, verified_by=str(verifier))
    updated = await supabase_request("GET", "payment_orders", query=f"order_id=eq.{order_id}&select=*")
    return updated[0] if updated else {**order, "status": "success"}


@app.post("/api/admin/payments/{order_id}/reject")
async def admin_reject_payment(
    order_id: str,
    actor: dict[str, Any] = Depends(require_payment_manager),
) -> Any:
    result = await supabase_request("GET", "payment_orders", query=f"order_id=eq.{order_id}&select=*")
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    if result[0].get("status") == "success":
        raise HTTPException(status_code=409, detail="A verified payment cannot be rejected")
    verifier = actor.get("email") or actor.get("sub") or "admin"
    now = datetime.now(timezone.utc).isoformat()
    updated = await supabase_request(
        "PATCH",
        f"payment_orders?order_id=eq.{order_id}",
        {
            "status": "failed",
            "verified_by": str(verifier),
            "verified_at": now,
            "updated_at": now,
        },
    )
    return updated[0] if updated and isinstance(updated, list) and updated else result[0]


# ---------------------------------------------------------------------------
# Admin · live catalogue CRUD (headless CMS)
# ---------------------------------------------------------------------------


@app.post("/api/admin/courses", status_code=status.HTTP_201_CREATED)
async def admin_upsert_course(
    course: CourseUpsert,
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    payload = {**course.model_dump(mode="json"), "updated_at": datetime.now(timezone.utc).isoformat()}
    created = await supabase_request("POST", "courses?on_conflict=slug", payload)
    return created[0] if isinstance(created, list) and created else payload


@app.patch("/api/admin/courses/{slug}")
async def admin_update_course(
    slug: str,
    body: dict[str, Any],
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    allowed = {
        "title", "category", "level", "duration", "format", "price",
        "summary", "overview", "curriculum", "tools", "published",
    }
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=422, detail="No updatable fields provided")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await supabase_request("PATCH", f"courses?slug=eq.{slug}", updates)
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return result[0]


@app.delete("/api/admin/courses/{slug}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def admin_delete_course(slug: str, _: dict[str, Any] = Depends(require_catalog_manager)) -> Response:
    await supabase_request("DELETE", f"courses?slug=eq.{slug}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/admin/batches", status_code=status.HTTP_201_CREATED)
async def admin_upsert_batch(
    batch: BatchUpsert,
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    payload = {**batch.model_dump(mode="json"), "updated_at": datetime.now(timezone.utc).isoformat()}
    created = await supabase_request("POST", "batches?on_conflict=id", payload)
    return created[0] if isinstance(created, list) and created else payload


@app.patch("/api/admin/batches/{batch_id}")
async def admin_update_batch(
    batch_id: str,
    body: dict[str, Any],
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    allowed = {
        "course_slug", "name", "start_date", "end_date", "days", "time",
        "seats", "available", "mode", "instructor", "status", "price",
    }
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=422, detail="No updatable fields provided")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await supabase_request("PATCH", f"batches?id=eq.{batch_id}", updates)
    if not result:
        raise HTTPException(status_code=404, detail="Batch not found")
    return result[0]


@app.delete("/api/admin/batches/{batch_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def admin_delete_batch(batch_id: str, _: dict[str, Any] = Depends(require_catalog_manager)) -> Response:
    await supabase_request("DELETE", f"batches?id=eq.{batch_id}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/admin/blog", status_code=status.HTTP_201_CREATED)
async def admin_upsert_blog_post(
    post: BlogPostUpsert,
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    payload = post.model_dump(mode="json")
    if not payload.get("published_on"):
        payload["published_on"] = datetime.now(timezone.utc).date().isoformat()
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    created = await supabase_request("POST", "blog_posts?on_conflict=slug", payload)
    return created[0] if isinstance(created, list) and created else payload


@app.patch("/api/admin/blog/{slug}")
async def admin_update_blog_post(
    slug: str,
    body: dict[str, Any],
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    allowed = {
        "title", "excerpt", "author", "published_on", "read_time",
        "category", "image", "content", "published",
    }
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        raise HTTPException(status_code=422, detail="No updatable fields provided")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await supabase_request("PATCH", f"blog_posts?slug=eq.{slug}", updates)
    if not result:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return result[0]


@app.delete("/api/admin/blog/{slug}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def admin_delete_blog_post(slug: str, _: dict[str, Any] = Depends(require_catalog_manager)) -> Response:
    await supabase_request("DELETE", f"blog_posts?slug=eq.{slug}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/api/admin/schema")
async def admin_schema_viewer(_: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    """Schema/query viewer: table list with live row counts and role grants."""
    tables = [
        "courses", "batches", "leads", "payment_orders", "certificates",
        "enrolments", "course_progress", "notifications", "blog_posts",
        "user_profiles",
    ]
    result = []
    for name in tables:
        count = 0
        try:
            rows = await supabase_request("GET", name, query="select=count")
            if rows and isinstance(rows, list) and isinstance(rows[0], dict):
                count = int(rows[0].get("count") or 0)
        except SupabaseError:
            count = -1  # table missing or unreachable
        result.append({"name": name, "rows": count})
    return {"tables": result, "role_permissions": ROLE_PERMISSIONS}


@app.get("/api/admin/roles")
async def admin_role_matrix(_: dict[str, Any] = Depends(require_admin)) -> dict[str, Any]:
    return {
        "roles": {
            role: {"permissions": perms, "grants": {perm: role_grants(role, perm) for perm in perms}}
            for role, perms in ROLE_PERMISSIONS.items()
        }
    }


# ---------------------------------------------------------------------------
# AI Content Generation
# ---------------------------------------------------------------------------

from .ai_content import ContentRequest, generate_content, generate_full_course
from .scraper import research_course_topics


class ContentGenerateRequest(BaseModel):
    content_type: str = Field(description="course_outline, lesson_plan, quiz, video_script, blog_post")
    topic: str = Field(min_length=3, max_length=200)
    level: str = Field(default="intermediate", max_length=50)
    duration_minutes: int = Field(default=60, ge=10, le=480)
    num_items: int = Field(default=10, ge=1, le=50)
    extra_context: str = Field(default="", max_length=2000)


@app.post("/api/ai/generate")
async def ai_generate_content(
    req: ContentGenerateRequest,
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    """Generate educational content using AI."""
    request = ContentRequest(
        content_type=req.content_type,
        topic=req.topic,
        level=req.level,
        duration_minutes=req.duration_minutes,
        num_items=req.num_items,
        extra_context=req.extra_context,
    )
    result = await generate_content(request)
    return {
        "content_type": result.content_type,
        "topic": result.topic,
        "content": result.content,
        "metadata": result.metadata,
    }


@app.post("/api/ai/generate-course")
async def ai_generate_full_course(
    topic: str = Query(..., min_length=3),
    level: str = Query(default="intermediate"),
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    """Generate a complete course package: outline + quizzes + video scripts."""
    result = await generate_full_course(topic, level)
    return result


@app.get("/api/ai/research")
async def ai_research_topic(
    topic: str = Query(..., min_length=3),
    num_results: int = Query(default=5, ge=1, le=20),
    _: dict[str, Any] = Depends(require_catalog_manager),
) -> Any:
    """Research course topics from the web."""
    results = await research_course_topics(topic, num_results)
    return {"topic": topic, "results": results}