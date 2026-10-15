PENDING_TASKS.md — Complete Production Checklist
```
[ ] Priority 1: AI Course & Batch Advisor (In-App)
    ├── Prospective student questionnaire dialog (goals, experience, timeline, mode)
    ├── Server function with Lovable AI Gateway (openai/gpt-6-astra)
    ├── Catalog matcher mapping to live batches, start dates, and open seats
    └── One-click enrollment and direct batch reserve triggers

[ ] Priority 2: Database & Backend (Lovable Cloud)
    ├── Enable Lovable Cloud (PostgreSQL)
    ├── Tables: profiles, courses, batches, enrollments, leads, payments
    ├── Universal Role-Based Access Control (RLS: super_admin, instructor, student)
    └── Authentication modal (Email/Password, Magic Link, Google Auth)

[ ] Priority 3: Payment Verification & Seat Allotment
    ├── Verify UPI ID (confirm Q166755499@ybl) and live Cashfree App ID & Secret
    ├── Webhook endpoint (/api/public/cashfree-webhook) with HMAC signature checks
    ├── Idempotent seat reservation (decrement available seats on payment success)
    └── Automated payment receipt & invoice download

[ ] Priority 4: Dynamic Catalog & CMS
    ├── Hydrate frontend course/batch cards from DB with static fallback
    └── Unified Admin dashboard for course schedules, syllabus, and lead management

[ ] Priority 5: LMS & Student Portal
    ├── Student dashboard with enrolled courses, batch timetable, and syllabus
    └── Certificate generation with QR verification (/verify/:certificateId)

[ ] Priority 6: Production Launch & Domain Cutover
    ├── End-to-end checkout & enrollment verification
    ├── Map www.guideitsol.com (DNS A/CNAME & SSL)
    └── Production deployment & SEO meta verification
```
2. Apps, Connectors & SDKs Reference
```
| Connector           | SDK / Package                 | Client vs Server             | Configuration Required                                                                                                                    |
| ------------------- | ----------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Lovable AI Gateway  | Native fetch / @ai-sdk/openai | Server-only (createServerFn) | Built-in zero-config (uses https://ai.gateway.lovable.dev/v1/responses, model: openai/gpt-6-astra). No paid API keys exposed in frontend. |
| Database & Auth     | @supabase/supabase-js         | Browser + Server             | Lovable Cloud auto-provisions URL & publishable keys in project environment.                                                              |
| Cashfree Payments   | Cashfree Webhook SDK / REST   | Server (/api/public/*)       | CASHFREE_APP_ID, CASHFREE_SECRET_KEY, and webhook secret.                                                                                 |
| UPI QR Codes        | qrcode (already installed)    | Browser component            | VITE_UPI_VPA, VITE_UPI_PAYEE_NAME, VITE_UPI_MERCHANT_CODE.                                                                                |
| Transactional Email | Resend or Cloud Email         | Server-only                  | RESEND_API_KEY or Lovable Cloud transactional mailer.                                                                                     |
```
3. CLI Commands & Verification Guide
Run these commands in your sandbox or terminal:
```
# Check TypeScript types without running dev server
bunx tsgo --noEmit

# Test the production build bundle
bun run build

# Start local dev server (default port 8080)
bun run dev

# Inspect AI Gateway endpoints (run on server side only)
curl -fsS "https://ai.gateway.lovable.dev/v1/models" -H "Authorization: Bearer $LOVABLE_API_KEY"
```
4. Implementation Blueprint: In-App AI Course Advisor
1. User Interface (src/components/ai-course-advisor-dialog.tsx):
  * Step 1: Current Experience (Complete Beginner, College Grad, Non-IT Career Switch, Junior Developer).
  * Step 2: Target Goal (Full Stack Web Developer, Mobile App Specialist, Cloud/DevOps, Data/AI).
  * Step 3: Availability & Format (Weekdays Evening, Weekend Intensive; Live Online vs. Hyderabad Classroom).
2. AI Recommendation Engine (src/server/ai-advisor.functions.ts):
  * Calls Lovable AI Gateway with the full GUIDESOFT catalog (training.ts).
  * Returns structured JSON: Primary Course, Batch Recommendation, Match Score (e.g. 96%), and Career Milestone Roadmap.
3. Direct Action:
  * Student clicks "Book Batch" or "Enroll Now", pre-filling their checkout dialog with the recommended course and upcoming start date.
