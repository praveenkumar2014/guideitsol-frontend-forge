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
│   │   ├── ai-course-advisor-dialog.tsx # AI Course & Batch Advisor dialog + trigger
│   │   ├── course-advisor.tsx # Back-compat re-export of the advisor dialog
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
│   │   ├── advisor.ts         # Course & batch recommendation engine (instant layer)
│   │   └── auth.ts            # Roles, permissions matrix, token access
│   ├── server/
│   │   └── ai-advisor.functions.ts # Lovable AI Gateway server fn (createServerFn)
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
- **AI Course & Batch Advisor**: Two recommendation layers. (1) A deterministic scorer (`src/lib/advisor.ts`) runs instantly on the device and matches goal, experience, weekly commitment and preferred mode against the live catalogue. (2) A server function (`src/server/ai-advisor.functions.ts`, TanStack Start `createServerFn`) sends the same intake plus the full catalogue to the **Lovable AI Gateway** (`openai/gpt-6-astra`) and returns structured JSON — match scores, reasons, readiness timelines and a career trajectory. Results paint instantly, then upgrade in place when the AI answers; if the gateway is offline the instant matches simply stay. Entry points: header "AI Advisor" button, homepage hero, `/courses`, `/live-batches`, and every CTA band. Each card offers one-click cohort enrolment or a hand-off to a human advisor.
- **UPI / GPay Direct Checkout**: When the gateway is unavailable, `POST /api/payments/upi-intents` records the intent (with a unique reference) in `payment_orders` and mirrors it into the lead CRM. The learner sees a QR code, a GPay deep link and a copyable UPI ID. UPI cannot notify the site, so admissions verifies the bank credit and marks the order paid.
- **Automated Seat Allotment & LMS Unlock**: `finalize_paid_order()` runs for both Cashfree webhooks and manual UPI verification — it is idempotent and: marks the order paid with verifier attribution, decrements `batches.available`, upserts the `enrolments` record, writes a learner notification and emails the receipt. The course player then unlocks all modules (guests keep a Module 1 preview) and progress syncs to `/api/learner/progress`.
- **Universal Role Permissions**: `ROLE_PERMISSIONS` in `backend/app/security.py` and `src/lib/auth.ts` define `learner`, `instructor`, `admin` and `partner` grants. Admin APIs accept either a verified Supabase JWT (`Authorization: Bearer`) or the legacy `X-Admin-Key` service credential. `/admin` and `/ai-studio` are route-guarded on the client; every matching API route is guarded server-side.
- **Unified Admin Console** (`/admin`): Lead CRM with status pipeline and CSV export, **payment reconciliation** (verify UPI references → automatic seat allotment and enrolment), **live catalogue CRUD** for courses, batches and blog posts, and a **database & roles viewer** with live row counts.
- **Credential Verification Ledger**: Public lookups for certificate IDs (e.g. `GS-2026-0142`) with QR verification status and print/PDF export.
- **Production SEO & Domains**: Canonical host is `https://www.guideitsol.com` (configurable through `VITE_SITE_URL`); `https://www.guideitsol.in` is kept alive and should 301-redirect to it. Canonical/OG tags, `public/robots.txt` and `public/sitemap.xml` all point at the canonical host. Regenerate the sitemap after catalogue changes with `npm run sitemap`.

---

## AI Course & Batch Advisor — How It Works

**Intake** (4 quick steps in `src/components/ai-course-advisor-dialog.tsx`):
goal → experience level → weekly hours & delivery mode → matches.

**Two scoring layers, one UI:**

| Layer | Where | When | What it does |
| :--- | :--- | :--- | :--- |
| Instant scorer | `src/lib/advisor.ts` (browser) | Immediately, always | Scores every course & open cohort against the answers with plain-language reasons. Works offline against the seed catalogue. |
| AI Gateway | `src/server/ai-advisor.functions.ts` (server fn) | A few seconds later | Sends the answers + full catalogue to `https://ai.gateway.lovable.dev/v1/responses` (model `openai/gpt-6-astra`) and returns structured JSON: match %, reasons, next batch with seats, readiness timeline and a career-trajectory roadmap. |

- The gateway key (`LOVABLE_API_KEY`) is read **server-side only** and never ships to the browser.
- Every course slug the model returns is validated against the catalogue that was sent — the model cannot invent courses.
- If the gateway is missing, slow or malformed, the UI keeps the instant matches and labels them "Instant catalogue matches" — the feature never breaks.
- Direct actions on every card: **Enrol in this cohort** (opens checkout pre-filled with that batch) or **Ask an advisor** (lead capture).

---

## Connectors: What to Connect vs. What to Skip

Connect **5 things** and the whole enrolment loop works. Everything else can wait.

| # | What | Provider | Connect it for | Configure (env / console) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Database + Auth | Supabase (PostgreSQL + RLS) | Accounts, courses, batches, enrolments, leads | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_ANON_KEY` — then run `backend/schema.sql` + `python -m app.seed` |
| 2 | Payments | Cashfree (Cards/NetBanking/UPI) | Live fee collection + webhooks | `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET` |
| 3 | UPI direct | Any UPI app (GPay/PhonePe) | QR + deep-link checkout without a gateway | `VITE_UPI_VPA`, `VITE_UPI_PAYEE_NAME`, `VITE_UPI_MERCHANT_CODE` |
| 4 | Transactional email | Resend (or SMTP) | Receipts, batch reminders, lead notifications | `EMAIL_FROM`, `EMAIL_ADMIN_TO`, `RESEND_API_KEY` (backend) |
| 5 | AI recommendations | Lovable AI Gateway | The AI advisor (zero config on Lovable Cloud) | `LOVABLE_API_KEY` (server-only; auto-injected on Lovable Cloud) |

**Skip for now** (add only after the enrolment loop is live): marketing CRMs, Zapier/Make
automations, external headless CMS (the built-in `/admin` console already is the CMS),
external analytics suites, separate hosting for the blog.

---

## CLI & CI/CD

Every command CI runs, you can run locally (bun or npm — both lockfiles are committed):

```bash
# Install dependencies
bun install              # or: npm install

# Strict typecheck (same as CI)
bun run typecheck        # or: npm run typecheck   (tsc --noEmit)

# Lint
bun run lint             # or: npm run lint

# Production build (TanStack Start + Vite + Nitro)
bun run build            # or: npm run build

# Dev server (port 8080)
bun run dev              # or: npm run dev

# Frontend e2e (Playwright) / Selenium
bun run test:e2e
bun run test:all

# Backend tests (41 pytest cases)
cd backend && PYTHONPATH=. pytest tests
```

**GitHub Actions** — `.github/workflows/ci.yml` runs on every push and pull request:
`frontend` job (bun install → typecheck → lint → build) and `backend` job (pip install → pytest).
Green CI is the merge gate.

**Desktop**: `npm run electron:build` (mac/win/linux variants) packages the same app as an
Electron desktop shell. The web UI is responsive from 393 px phones to 1440 px desktops
(sticky mobile bottom enrol bar, full-screen mobile checkout drawer, accordion syllabus).

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
3. **AI Advisor**: set `LOVABLE_API_KEY` (server-only) so the AI Gateway enhancement activates — without it the advisor still works on instant catalogue scoring.
4. **UPI**: confirm `VITE_UPI_VPA` / `VITE_UPI_PAYEE_NAME` match the admissions bank account before accepting payments.
5. **Domains**: point `www.guideitsol.com` at the deployment, add a 301 redirect from `guideitsol.in`/`www.guideitsol.in`, and keep both hosts in `CORS_ORIGINS`.
6. **API**: deploy the FastAPI service (e.g. `https://api.guideitsol.com`), set `PUBLIC_API_BASE_URL`/`VITE_PUBLIC_API_BASE_URL` and `FRONTEND_URL` accordingly, and register the Cashfree webhook URL (`/api/payments/webhook`).
7. **Verify**: push to GitHub and confirm the CI workflow is green, then a live UPI test payment reconciled from `/admin` → Payments.

---

## Production Build & Verification

- Backend Pytest Suite: **41 / 41 Tests Passing** (`cd backend && PYTHONPATH=. pytest tests`)
- Frontend ESLint: **0 Errors** (`npm run lint`)
- TypeScript: **0 Errors** (`npx tsc --noEmit`)
- Frontend Production Build: **Passing** (`npm run build`)
- Live smoke test: home, `/courses`, `/live-batches`, `/blog`, course detail, course player, `/admin`, `/payment-return`, `/sitemap.xml` all render (SSR verified against the dev server)
