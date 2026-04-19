-- Euro Heaven / Mercedes-Benz repair site — Supabase schema
-- Run this in the Supabase SQL editor or via CLI.

create extension if not exists "pgcrypto";

create type repair_status as enum (
  'booked',
  'received',
  'diagnosis',
  'quote-sent',
  'awaiting-approval',
  'parts-ordered',
  'repair-in-progress',
  'quality-check',
  'ready-for-pickup',
  'completed'
);

create type drop_off_type as enum ('drop-off', 'wait', 'courtesy-car');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_id uuid references auth.users(id) on delete set null,
  service_slug text not null,
  model text not null,
  year text not null,
  rego text not null,
  odometer text not null,
  description text not null,
  symptoms text[] not null default '{}',
  appointment_date date not null,
  time_slot text not null,
  drop_off drop_off_type not null,
  name text not null,
  phone text not null,
  email text not null,
  notes text,
  status repair_status not null default 'booked',
  eta_date date,
  calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_email_idx on public.bookings (lower(email));
create index bookings_rego_idx on public.bookings (upper(rego));
create index bookings_status_idx on public.bookings (status);
create index bookings_date_idx on public.bookings (appointment_date);

create table public.technician_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  author_id uuid references auth.users(id),
  text text not null,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  customer_name text not null,
  car text not null,
  stars int not null check (stars between 1 and 5),
  comment text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index reviews_published_idx on public.reviews (is_published, created_at desc);

-- Contact form submissions
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Update timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at before update on public.bookings
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.bookings enable row level security;
alter table public.technician_notes enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- Staff role: stored in auth.users.raw_user_meta_data->>'role' = 'staff'
create or replace function public.is_staff() returns boolean as $$
  select coalesce((auth.jwt() ->> 'user_role')::text = 'staff', false);
$$ language sql stable;

-- Bookings policies
create policy "customers can see own bookings" on public.bookings
  for select using (
    auth.uid() = customer_id
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "staff can see all bookings" on public.bookings
  for all using (public.is_staff());

create policy "anyone can insert a booking" on public.bookings
  for insert with check (true);

-- Reviews: public can read published, insert own
create policy "anyone can read published reviews" on public.reviews
  for select using (is_published = true);

create policy "customers can insert own review" on public.reviews
  for insert with check (true);

create policy "staff can manage reviews" on public.reviews
  for all using (public.is_staff());

-- Realtime for status tracking
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.technician_notes;
