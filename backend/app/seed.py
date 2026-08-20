"""Idempotent seed script for the GUIDESOFT Supabase database.

Reads seed data from backend/seed_data/*.json (generated from the frontend
catalogue via `node scripts/export-seed.ts`) and upserts courses, batches and
certificates using the Supabase service role key.

Usage (from the backend directory):
    python -m app.seed

Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set in the
environment or in a .env file.
"""
import asyncio
import json
from pathlib import Path

from .supabase import supabase_request

SEED_DIR = Path(__file__).resolve().parent.parent / "seed_data"


async def upsert_courses() -> None:
    data = json.loads((SEED_DIR / "courses.json").read_text(encoding="utf-8"))
    for course in data:
        await supabase_request(
            "POST",
            "courses?on_conflict=slug",
            {**course, "updated_at": "now()"},
            query="select=slug",
        )
    print(f"Upserted {len(data)} courses")


async def upsert_batches() -> None:
    data = json.loads((SEED_DIR / "batches.json").read_text(encoding="utf-8"))
    for batch in data:
        await supabase_request(
            "POST",
            "batches?on_conflict=id",
            {**batch, "updated_at": "now()"},
            query="select=id",
        )
    print(f"Upserted {len(data)} batches")


async def upsert_certificates() -> None:
    data = json.loads((SEED_DIR / "certificates.json").read_text(encoding="utf-8"))
    for record in data:
        await supabase_request(
            "POST",
            "certificates?on_conflict=id",
            record,
            query="select=id",
        )
    print(f"Upserted {len(data)} certificates")


async def main() -> None:
    await upsert_courses()
    await upsert_batches()
    await upsert_certificates()


if __name__ == "__main__":
    asyncio.run(main())