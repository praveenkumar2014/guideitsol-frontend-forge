# GUIDESOFT API

FastAPI service for the production data and payment boundary.

## Local setup

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Copy the repository `.env.example` to `.env` and fill the server-only values. Apply `schema.sql` in Supabase SQL Editor before starting the API.

## Production integrations

- Supabase/Postgres stores courses, leads, and payment orders.
- Cashfree provides checkout, including UPI and Google Pay-compatible UPI flows.
- Payment webhooks are verified with `CASHFREE_WEBHOOK_SECRET` before order status changes.
- The Supabase service role key is used only by FastAPI and must never be exposed to the frontend.

The frontend must call this API through `PUBLIC_API_BASE_URL` after the FastAPI service is deployed. Deploy this service separately from Vercel (for example on Railway, Render, Fly.io, or a managed container platform).
