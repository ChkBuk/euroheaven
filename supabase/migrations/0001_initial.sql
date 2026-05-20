-- Euro Heaven — initial schema migration.
-- Run via Supabase CLI:  `supabase db push`
-- Or paste into the Supabase Dashboard → SQL Editor.

create extension if not exists "uuid-ossp";

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists public.bookings (
  reference        text primary key,
  user_id          uuid references auth.users(id) on delete set null,
  service_slug     text not null,
  model            text not null,
  year             text not null,
  rego             text not null,
  odometer         text not null,
  description      text not null,
  symptoms         jsonb not null default '[]'::jsonb,
  date             text not null,
  time_slot        text not null,
  drop_off         text not null,
  name             text not null,
  phone            text not null,
  email            text not null,
  notes            text,
  status           text not null default 'booked',
  eta_date         text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists bookings_email_idx     on public.bookings (email);
create index if not exists bookings_user_id_idx   on public.bookings (user_id);
create index if not exists bookings_status_idx    on public.bookings (status);
create index if not exists bookings_created_idx   on public.bookings (created_at desc);

-- Per-stage technician notes. visibility='public' is shown to the customer
-- on /track; 'internal' is admin-only.
create table if not exists public.booking_notes (
  id                uuid primary key default uuid_generate_v4(),
  booking_ref       text not null references public.bookings(reference) on delete cascade,
  status_at         text,
  body              text not null,
  visibility        text not null default 'public' check (visibility in ('public','internal')),
  created_at        timestamptz not null default now(),
  created_by_email  text
);
create index if not exists booking_notes_ref_idx on public.booking_notes (booking_ref, created_at desc);

-- Audit trail of every status change. Powers the customer-visible timeline.
create table if not exists public.booking_status_log (
  id                uuid primary key default uuid_generate_v4(),
  booking_ref       text not null references public.bookings(reference) on delete cascade,
  from_status       text,
  to_status         text not null,
  changed_at        timestamptz not null default now(),
  changed_by_email  text
);
create index if not exists booking_status_log_ref_idx on public.booking_status_log (booking_ref, changed_at desc);

-- Reviews — simple public list for the /reviews page + Google review scraper.
create table if not exists public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  booking_ref  text references public.bookings(reference) on delete set null,
  name         text not null,
  car          text,
  stars        int  not null check (stars between 1 and 5),
  comment      text not null,
  created_at   timestamptz not null default now()
);

-- Staff allowlist. Anyone whose auth.email() is in this table gets admin
-- access. Seed it manually with the workshop owner's email + technicians.
create table if not exists public.staff_emails (
  email     text primary key,
  added_at  timestamptz not null default now()
);

-- Helper: returns true if the current authenticated user is a staff member.
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists(
    select 1 from public.staff_emails
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;
grant execute on function public.is_staff() to anon, authenticated;

-- Auto-update bookings.updated_at on every UPDATE.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;
drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at
  before update on public.bookings
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Row-Level Security
-- ============================================================================

alter table public.bookings           enable row level security;
alter table public.booking_notes      enable row level security;
alter table public.booking_status_log enable row level security;
alter table public.reviews            enable row level security;
alter table public.staff_emails       enable row level security;

-- Bookings: customers see their own; staff see all.
drop policy if exists bookings_select_owner on public.bookings;
create policy bookings_select_owner on public.bookings
  for select using (
    auth.uid() = user_id
    or lower(email) = lower(auth.jwt() ->> 'email')
    or public.is_staff()
  );

drop policy if exists bookings_update_staff on public.bookings;
create policy bookings_update_staff on public.bookings
  for update using (public.is_staff());

-- Inserts come via the service-role key (booking form is anonymous), so no
-- public insert policy is needed. Service-role bypasses RLS.

-- booking_notes: customer reads only public notes for their own booking;
-- staff reads/writes all.
drop policy if exists notes_select_owner on public.booking_notes;
create policy notes_select_owner on public.booking_notes
  for select using (
    public.is_staff()
    or (
      visibility = 'public'
      and exists (
        select 1 from public.bookings b
        where b.reference = booking_notes.booking_ref
          and (b.user_id = auth.uid()
               or lower(b.email) = lower(auth.jwt() ->> 'email'))
      )
    )
  );

drop policy if exists notes_insert_staff on public.booking_notes;
create policy notes_insert_staff on public.booking_notes
  for insert with check (public.is_staff());

-- booking_status_log: customer sees their own; staff sees all.
drop policy if exists status_log_select on public.booking_status_log;
create policy status_log_select on public.booking_status_log
  for select using (
    public.is_staff()
    or exists (
      select 1 from public.bookings b
      where b.reference = booking_status_log.booking_ref
        and (b.user_id = auth.uid()
             or lower(b.email) = lower(auth.jwt() ->> 'email'))
    )
  );

-- Reviews: anyone can read; only authenticated staff can insert.
drop policy if exists reviews_select_public on public.reviews;
create policy reviews_select_public on public.reviews
  for select using (true);

drop policy if exists reviews_insert_staff on public.reviews;
create policy reviews_insert_staff on public.reviews
  for insert with check (public.is_staff());

-- staff_emails: only staff can read; managed manually via the dashboard.
drop policy if exists staff_select_self on public.staff_emails;
create policy staff_select_self on public.staff_emails
  for select using (public.is_staff());

-- ============================================================================
-- Seed data
-- ============================================================================

-- Add the workshop owner's email here before going live.
-- insert into public.staff_emails (email) values ('owner@euroheaven.com.au')
-- on conflict (email) do nothing;
