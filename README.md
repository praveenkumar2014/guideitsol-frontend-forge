# GUIDESOFT — IT Solutions & Trainings Platform

A modern, production-ready Full-Stack IT Training, EdTech, and Digital Solutions Platform designed for learners, cohorts, corporate clients, and admissions administrators.

---

## Architecture & Technology Stack

### Frontend Application
- **Framework**: TanStack Start / React 19 / Vite 8 / Nitro SSR
- **Routing**: TanStack Router (File-based routing with full type safety)
- **Data Fetching**: TanStack React Query 5
- **Styling**: Modern Tailwind CSS 4 with custom dark/light theme tokens and glassmorphic elevated panels
- **Forms & Validation**: React Hook Form + Zod Schema Validation
- **Icons & UI Components**: Lucide React, Radix UI Primitives, Sonner Notifications

### Backend API Service
- **Framework**: FastAPI (Python 3.9+) with async ASGI runtime
- **Validation**: Pydantic v2 + Pydantic Settings + Email Validator
- **Database & Storage**: Supabase (PostgreSQL with Row Level Security & Extensions)
- **Payment Processing**: Cashfree Payments Gateway (UPI, GPay, PhonePe, Cards, NetBanking) with cryptographic HMAC-SHA256 webhook signature verification
- **Authentication**: Supabase JWT verification via RSA JWKS signature checks + Admin API Key header validation
- **Security & Reliability**: In-memory sliding-window IP rate limiters, CORS isolation, structured error handling

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── emailer.py         # Transactional email notification service
│   │   ├── main.py            # FastAPI application endpoints & routes
│   │   ├── security.py        # Token verification, rate limiting, and auth
│   │   ├── seed.py            # Idempotent database seeder
│   │   ├── settings.py        # Typed application configuration from env
│   │   └── supabase.py        # Async Supabase REST client wrapper
│   ├── seed_data/             # Courses, batches, blog & role seeds
│   ├── tests/                 # Complete Pytest test suite (28 tests)
│   ├── requirements.txt       # Python dependencies
│   └── schema.sql             # Complete PostgreSQL schema & RLS policies
├── src/
│   ├── components/            # Reusable UI & Layout Components
│   │   ├── checkout-dialog.tsx# Gateway checkout with UPI/GPay fallback
│   │   ├── upi-pay-panel.tsx  # Dynamic UPI QR + GPay deep link + reference
│   │   ├── course-advisor.tsx # AI Course & Batch Advisor dialog + trigger
│   │   ├── require-role.tsx   # RBAC route guard (role + permission matrix)
│   │   ├── enquiry-dialog.tsx # Interactive lead capture & advisor enquiry modal
│   │   └── training-ui.tsx    # Course cards, hero bands, and metadata grids
│   ├── data/
│   │   ├── site.ts            # Env-driven canonical domain, navigation, services
│   │   ├── training.ts        # Seed catalogue (instant fallback), roadmaps
│   │   └── blog.ts            # Seed blog posts (instant fallback)
│   ├── lib/
│   │   ├── api.ts             # Typed API client (catalogue, payments, admin CMS)
│   │   ├── catalog.ts         # Dynamic hydration hooks (stale-while-revalidate)
│   │   ├── lms.ts             # Enrolment/access state (cloud + local mirror)
│   │   ├── advisor.ts         # Course & batch recommendation engine
│   │   └── auth.ts            # Roles, permissions matrix, token access
│   └── routes/                # File-based TanStack routes
│       ├── index.tsx          # Homepage & value proposition
│       ├── courses.tsx        # Filterable & searchable course catalogue
│       ├── courses/$slug.tsx  # Week-by-week curriculum, syllabus & enrolment
│       ├── course-player/     # Interactive course player with video & notes
│       ├── live-batches.tsx   # Live cohorts with online enrolment & seats
│       ├── learning-paths.tsx # Career roadmaps and milestones
│       ├── internships.tsx    # Project internship briefs & applications
│       ├── student-dashboard.tsx # Learner workspace (progress, labs, certificates)
│       ├── verify/            # Public certificate verification ledger & printing
│       ├── payment-return.tsx # Payment confirmation & receipt screen
│       ├── admin.tsx          # Administrator CRM & Leads Management Console
│       └── contact.tsx        # Direct contact & enquiry submission form
└── .env.example               # Full environment configuration template
```

---

## Getting Started

### 1. Prerequisites
- **Bun** (or Node.js 20+)
- **Python 3.9+**

### 2. Frontend Setup
```bash
# Install dependencies
bun install

# Start development server (http://localhost:5173)
bun run dev

# Run production build
bun run build

# Run linting & formatting
bun run lint
bun run format
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend test suite (41 tests)
PYTHONPATH=. pytest tests

# Start FastAPI server (http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

---

## Database Setup & Seeding

1. Apply `backend/schema.sql` in your Supabase SQL Editor.
2. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`.
3. Run the database seeder:
```bash
cd backend
source .venv/bin/activate
python -m app.seed
```

---

## Key Platform Workflows

- **Dynamic Catalogue Hydration**: Course, batch and blog cards hydrate from the database/CMS through `src/lib/catalog.ts` (stale-while-revalidate: instant seed render, background refresh every 60s and on window focus). Every surface — home, `/courses`, `/live-batches`, `/browse/*`, `/blog`, search, enquiry dropdowns — reflects admin edits without a redeploy. If the backend is unreachable the static seed catalogue renders instead, so the site never breaks.
- **AI Course & Batch Advisor**: `src/lib/advisor.ts` scores the live catalogue against the learner's goal, experience, weekly commitment and preferred mode, and explains each match. The dialog also surfaces the next cohort with open seats and can enrol the learner directly or hand them to a human advisor. Entry points: homepage hero section, `/courses`, and every CTA band.
- **UPI / GPay Direct Checkout**: When the gateway is unavailable, `POST /api/payments/upi-intents` records the intent (with a unique reference) in `payment_orders` and mirrors it into the lead CRM. The learner sees a QR code, a GPay deep link and a copyable UPI ID. UPI cannot notify the site, so admissions verifies the bank credit and marks the order paid.
- **Automated Seat Allotment & LMS Unlock**: `finalize_paid_order()` runs for both Cashfree webhooks and manual UPI verification — it is idempotent and: marks the order paid with verifier attribution, decrements `batches.available`, upserts the `enrolments` record, writes a learner notification and emails the receipt. The course player then unlocks all modules (guests keep a Module 1 preview) and progress syncs to `/api/learner/progress`.
- **Universal Role Permissions**: `ROLE_PERMISSIONS` in `backend/app/security.py` and `src/lib/auth.ts` define `learner`, `instructor`, `admin` and `partner` grants. Admin APIs accept either a verified Supabase JWT (`Authorization: Bearer`) or the legacy `X-Admin-Key` service credential. `/admin` and `/ai-studio` are route-guarded on the client; every matching API route is guarded server-side.
- **Unified Admin Console** (`/admin`): Lead CRM with status pipeline and CSV export, **payment reconciliation** (verify UPI references → automatic seat allotment and enrolment), **live catalogue CRUD** for courses, batches and blog posts, and a **database & roles viewer** with live row counts.
- **Credential Verification Ledger**: Public lookups for certificate IDs (e.g. `GS-2026-0142`) with QR verification status and print/PDF export.
- **Production SEO & Domains**: Canonical host is `https://www.guideitsol.com` (configurable through `VITE_SITE_URL`); `https://www.guideitsol.in` is kept alive and should 301-redirect to it. Canonical/OG tags, `public/robots.txt` and `public/sitemap.xml` all point at the canonical host. Regenerate the sitemap after catalogue changes with `npm run sitemap`.

---

## API Surface

| Area | Endpoints |
| :--- | :--- |
| Catalogue | `GET /api/courses`, `GET /api/courses/{slug}`, `GET /api/batches`, `GET /api/batches/{id}`, `GET /api/blog`, `GET /api/blog/{slug}` |
| Leads | `POST /api/leads` |
| Payments | `POST /api/payments/orders`, `GET /api/payments/orders/{id}`, `POST /api/payments/upi-intents`, `POST /api/payments/webhook` (HMAC verified) |
| Learner LMS | `GET /api/learner/me`, `GET/POST /api/learner/progress` (Supabase JWT) |
| Admin CRM | `GET /api/admin/leads`, `GET /api/admin/stats`, `PATCH/DELETE /api/admin/leads/{id}` |
| Admin payments | `GET /api/admin/payments`, `POST /api/admin/payments/{id}/verify`, `POST /api/admin/payments/{id}/reject` |
| Admin CMS | `POST/PATCH/DELETE /api/admin/courses`, `/batches`, `/blog` |
| Admin platform | `GET /api/admin/schema`, `GET /api/admin/roles` |
| AI Studio | `POST /api/ai/generate`, `POST /api/ai/generate-course`, `GET /api/ai/research` (instructor/admin) |

When the database is unreachable every endpoint answers `503 {"code": "database_unavailable"}` so the frontend can fall back cleanly instead of failing hard.

---

## Production Cutover Checklist

1. **Database**: apply `backend/schema.sql` in Supabase, set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, then run `python -m app.seed` to publish the catalogue, blog posts and role profiles.
2. **Real keys**: replace the placeholder Cashfree keys (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET`) and set `ADMIN_API_KEY` in the host's secret store — never commit live keys.
3. **UPI**: confirm `VITE_UPI_VPA` / `VITE_UPI_PAYEE_NAME` match the admissions bank account before accepting payments.
4. **Domains**: point `www.guideitsol.com` at the deployment, add a 301 redirect from `guideitsol.in`/`www.guideitsol.in`, and keep both hosts in `CORS_ORIGINS`.
5. **API**: deploy the FastAPI service (e.g. `https://api.guideitsol.com`), set `PUBLIC_API_BASE_URL`/`VITE_PUBLIC_API_BASE_URL` and `FRONTEND_URL` accordingly, and register the Cashfree webhook URL (`/api/payments/webhook`).
6. **Verify**: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `cd backend && PYTHONPATH=. pytest tests`, then a live UPI test payment reconciled from `/admin` → Payments.

---

## Production Build & Verification

- Backend Pytest Suite: **41 / 41 Tests Passing** (`cd backend && PYTHONPATH=. pytest tests`)
- Frontend ESLint: **0 Errors** (`npm run lint`)
- TypeScript: **0 Errors** (`npx tsc --noEmit`)
- Frontend Production Build: **Passing** (`npm run build`)
- Live smoke test: home, `/courses`, `/live-batches`, `/blog`, course detail, course player, `/admin`, `/payment-return`, `/sitemap.xml` all render (SSR verified against the dev server)
