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
  payment_method text not null default 'gateway',
  reference text,
  status text not null default 'pending',
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_email_idx on public.payment_orders (customer_email);
create index if not exists payment_orders_status_idx on public.payment_orders (status);
create index if not exists payment_orders_reference_idx on public.payment_orders (reference);

-- Upgrades for databases created before UPI reconciliation existed.
alter table public.payment_orders add column if not exists payment_method text not null default 'gateway';
alter table public.payment_orders add column if not exists reference text;
alter table public.payment_orders add column if not exists verified_by text;
alter table public.payment_orders add column if not exists verified_at timestamptz;

-- ---------------------------------------------------------------------------
-- Blog posts (headless CMS collection)
-- ---------------------------------------------------------------------------

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  author text not null default 'GUIDESOFT Editorial',
  published_on date not null default current_date,
  read_time text not null default '5 min read',
  category text not null default 'Industry Insights',
  image text not null default '',
  content jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (published);

-- ---------------------------------------------------------------------------
-- User roles (universal permission matrix)
-- ---------------------------------------------------------------------------

create table if not exists public.user_profiles (
  user_id text primary key,
  email text not null,
  name text,
  role text not null default 'learner' check (role in ('learner', 'instructor', 'admin', 'partner')),
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles (role);

alter table public.blog_posts enable row level security;
alter table public.user_profiles enable row level security;

create policy "published posts are public" on public.blog_posts for select using (published = true);
create policy "users read own profile" on public.user_profiles for select using (auth.uid()::text = user_id);

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