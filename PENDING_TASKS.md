# PENDING_TASKS.md — GUIDESOFT Production Status Board

Last updated: 2026-10-16. ✅ = shipped in this codebase, ⬜ = still to do.
Full docs: `README.md` (architecture, connectors, CLI/CI, cutover checklist).

---

## Phase 1 — AI Course & Batch Advisor ✅

- ✅ Step-by-step intake dialog (goal → experience → time & mode) — `src/components/ai-course-advisor-dialog.tsx`
- ✅ Instant catalogue scorer (offline-safe) — `src/lib/advisor.ts`
- ✅ Lovable AI Gateway server function (`createServerFn`, `openai/gpt-6-astra`,
      structured JSON, slug validation, 3-format retry, graceful `ok:false`) —
      `src/server/ai-advisor.functions.ts`
- ✅ AI-verified cards: match %, reasons, next cohort + seats + instructor,
      readiness timeline, career-trajectory roadmap
- ✅ One-click "Enrol in this cohort" (pre-filled checkout) + "Ask an advisor" lead capture
- ✅ Integration triggers: header "AI Advisor" button (desktop + mobile drawer),
      homepage hero, `/courses`, `/live-batches` CTA banner, global CTA band
- ⬜ Set `LOVABLE_API_KEY` in the production host (server-only) — without it the
      advisor runs on instant catalogue scoring (by design, not a bug)

## Phase 2 — Database, Auth & Role Permissions ✅

- ✅ PostgreSQL schema + Row Level Security — `backend/schema.sql`
- ✅ Tables: profiles/roles, courses, batches, enrolments, payment_orders, leads,
      blog, certificates, notifications
- ✅ Role matrix (learner / instructor / admin / partner) — `src/lib/auth.ts`,
      `backend/app/security.py`
- ✅ Auth modal (email/password, magic link, Google) — `src/components/auth-modal.tsx`
- ⬜ Create the Supabase project, apply `schema.sql`, run `python -m app.seed`,
      fill `SUPABASE_*` / `VITE_SUPABASE_*` env vars (see README "Connectors")

## Phase 3 — Payments & Seat Allotment ✅ (code) / ⬜ (live keys)

- ✅ Cashfree order creation + HMAC-verified webhook — `backend/app/main.py` (`/api/payments/webhook`)
- ✅ UPI QR / GPay deep link / reference flow with manual reconciliation — `src/components/upi-pay-panel.tsx`, `/admin` → Payments
- ✅ Idempotent `finalize_paid_order()`: seat decrement, enrolment upsert, receipt email
- ⬜ Confirm live UPI VPA ownership and replace placeholder Cashfree live keys in the host secret store
- ⬜ Run one real ₹1 test payment end-to-end and reconcile from `/admin`

## Phase 4 — CMS & Dynamic Catalogue ✅

- ✅ Admin console CRUD for courses, batches, blog — `/admin`
- ✅ Stale-while-revalidate hydration with static seed fallback — `src/lib/catalog.ts`
- ✅ Leads CRM with status pipeline + CSV export
- ⬜ (Optional) Move `/ai-studio` content generation to the Lovable AI Gateway so it
      needs no separate OpenAI key

## Phase 5 — LMS & Certification ✅

- ✅ Course player with module progress + guest Module-1 preview — `/course-player/$slug`
- ✅ Student dashboard (progress, batches, certificates) — `/student-dashboard`
- ✅ Certificate ledger with QR verification + print — `/verify/$certificateId`
- ⬜ Issue real certificates from paid enrolments once Phase 3 keys are live

## Phase 6 — Production Cutover & Domain ⬜

- ⬜ Deploy frontend (Nitro build) + FastAPI backend, set all env vars (README checklist)
- ⬜ DNS: A/CNAME `www.guideitsol.com` → deployment, SSL validation, 301 from `guideitsol.in`
- ⬜ Register the Cashfree webhook URL on the live dashboard
- ⬜ Final E2E pass: `bun run test:e2e` (login, advisor, checkout, admin edit, verify)
- ⬜ SEO spot-check: canonical tags, `robots.txt`, `sitemap.xml` on the live host

---

## Quick Reference (details live in README.md)

| Connector | Env vars | Status |
| --- | --- | --- |
| Supabase (DB + Auth) | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_ANON_KEY` | Code ready ⬜ project |
| Cashfree (payments) | `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET` | Code ready ⬜ live keys |
| UPI direct | `VITE_UPI_VPA`, `VITE_UPI_PAYEE_NAME`, `VITE_UPI_MERCHANT_CODE` | Code ready ⬜ confirm VPA |
| Email (Resend/SMTP) | `EMAIL_FROM`, `EMAIL_ADMIN_TO`, `RESEND_API_KEY` | Code ready ⬜ connect |
| Lovable AI Gateway | `LOVABLE_API_KEY` (server-only) | Code ready ⬜ set key |

CI (`.github/workflows/ci.yml`): typecheck + lint + build + backend pytest on every push/PR.

```bash
bun install && bun run typecheck && bun run lint && bun run build   # frontend gate
cd backend && PYTHONPATH=. pytest tests                            # backend gate
bun run dev                                                        # http://localhost:8080
```
