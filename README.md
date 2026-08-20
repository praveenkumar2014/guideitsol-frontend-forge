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
│   ├── seed_data/             # Courses, batches & certificate seeds
│   ├── tests/                 # Complete Pytest test suite (28 tests)
│   ├── requirements.txt       # Python dependencies
│   └── schema.sql             # Complete PostgreSQL schema & RLS policies
├── src/
│   ├── components/            # Reusable UI & Layout Components
│   │   ├── checkout-dialog.tsx# Interactive Cashfree batch checkout & payment modal
│   │   ├── enquiry-dialog.tsx # Interactive lead capture & advisor enquiry modal
│   │   ├── site-header.tsx    # Responsive header with navigation
│   │   ├── site-footer.tsx    # Site footer with directory links
│   │   └── training-ui.tsx    # Course cards, hero bands, and metadata grids
│   ├── data/
│   │   ├── site.ts            # Site configuration, navigation, services
│   │   └── training.ts        # Course catalogue, modules, batches, roadmaps
│   ├── lib/
│   │   └── api.ts             # Typed API client connecting frontend to backend
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

# Run backend test suite (28 tests)
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

- **Course Exploration & Discovery**: Search, filter by category/level, explore week-by-week syllabus modules, download curriculum PDFs.
- **Lead Capture & Academic Counselling**: Real-time submission from all pages and modal dialogs to `/api/leads`.
- **Online Enrolment & Cashfree Payments**: Initiate payment orders via `/api/payments/orders`, complete checkout via UPI/Cards, and receive instant confirmation receipts.
- **Learner LMS & Course Player**: Interactive lesson player with video preview, lab starter code downloads, notes autosave, lesson progress tracking (`/api/learner/progress`), and completion percentage.
- **Credential Verification Ledger**: Public lookups for certificate IDs (e.g. `GS-2026-0142`) with QR verification status and print/PDF export.
- **Admin CRM & Console**: Protected with Admin API key; view real-time statistics, search enquiries, change lead statuses (New -> Contacted -> Enrolled), add counsellor notes, and export to CSV.

---

## Production Build & Verification

- Backend Pytest Suite: **28 / 28 Tests Passing** (`pytest tests`)
- Frontend ESLint: **0 Errors** (`bun run lint`)
- Frontend Production Build: **Passing** (`bun run build`)
