create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------------

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  level text not null,
  duration text not null,
  format text not null,
  price numeric(12,2) not null default 0,
  summary text not null,
  overview text not null,
  curriculum jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_published_idx on public.courses (published);
create index if not exists courses_category_idx on public.courses (category);

-- ---------------------------------------------------------------------------
-- Batches
-- ---------------------------------------------------------------------------

create table if not exists public.batches (
  id text primary key,
  course_slug text not null references public.courses (slug) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  days text not null,
  time text not null,
  seats integer not null default 0,
  available integer not null default 0,
  mode text not null,
  instructor text not null,
  status text not null default 'Open for enrolment',
  price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists batches_course_idx on public.batches (course_slug);
create index if not exists batches_start_idx on public.batches (start_date);

-- ---------------------------------------------------------------------------
-- Leads (enquiries)
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  course_slug text,
  batch_id text,
  source text not null default 'website',
  message text not null,
  status text not null default 'new',
  assigned_counsellor text,
  follow_up_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- Payment orders
-- ---------------------------------------------------------------------------

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  course_slug text not null,
  batch_id text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  amount numeric(12,2) not null,
  payment_session_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_email_idx on public.payment_orders (customer_email);
create index if not exists payment_orders_status_idx on public.payment_orders (status);

-- ---------------------------------------------------------------------------
-- Certificates
-- ---------------------------------------------------------------------------

create table if not exists public.certificates (
  id text primary key,
  learner_name text not null,
  course_title text not null,
  course_slug text,
  issued_on date not null,
  status text not null default 'issued',
  created_at timestamptz not null default now()
);

create index if not exists certificates_status_idx on public.certificates (status);

-- ---------------------------------------------------------------------------
-- Enrolments (created after a successful payment or admin approval)
-- ---------------------------------------------------------------------------

create table if not exists public.enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  user_email text not null,
  batch_id text not null references public.batches (id) on delete cascade,
  course_slug text not null,
  payment_order_id text,
  amount numeric(12,2) not null default 0,
  status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_email, batch_id)
);

create index if not exists enrolments_user_idx on public.enrolments (user_email);
create index if not exists enrolments_batch_idx on public.enrolments (batch_id);

-- ---------------------------------------------------------------------------
-- Course progress (learner workspace)
-- ---------------------------------------------------------------------------

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  course_slug text not null,
  lesson_key text not null,
  module_index integer not null default 0,
  lesson_index integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_key)
);

create index if not exists progress_user_course_idx on public.course_progress (user_id, course_slug);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  user_email text,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.leads enable row level security;
alter table public.payment_orders enable row level security;
alter table public.certificates enable row level security;
alter table public.enrolments enable row level security;
alter table public.course_progress enable row level security;
alter table public.notifications enable row level security;

-- Public catalogue reads
create policy "published courses are public" on public.courses for select using (published = true);
create policy "batches are public" on public.batches for select using (true);
create policy "issued certificates are public" on public.certificates for select using (status = 'issued');

-- Authenticated learners can read their own progress/enrolments/notifications.
create policy "learners read own progress" on public.course_progress for select using (auth.uid()::text = user_id);
create policy "learners write own progress" on public.course_progress for insert with check (auth.uid()::text = user_id);
create policy "learners update own progress" on public.course_progress for update using (auth.uid()::text = user_id);
create policy "learners read own enrolments" on public.enrolments for select using (auth.uid()::text = user_id);
create policy "learners read own notifications" on public.notifications for select using (auth.uid()::text = user_id);

-- Leads and payment_orders are server-only. The FastAPI service uses the
-- service role key. Never expose the service role key in the browser.