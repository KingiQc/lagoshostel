create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'owner', 'university', 'admin');
create type public.property_status as enum ('draft', 'under_review', 'verified', 'changes_requested');
create type public.application_status as enum ('submitted', 'under_review', 'approved', 'rejected', 'more_information');
create type public.booking_status as enum ('requested', 'confirmed', 'cancelled');
create type public.maintenance_status as enum ('submitted', 'in_progress', 'resolved');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role public.user_role not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table public.sessions (
  token_hash text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete restrict,
  name text not null,
  description text not null default '',
  city text not null,
  area text not null,
  university text not null,
  distance text not null default '',
  photos text[] not null default '{}',
  amenities text[] not null default '{}',
  status public.property_status not null default 'under_review',
  created_at timestamptz not null default now()
);

create table public.property_rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  beds integer not null check (beds > 0),
  price numeric(12, 2) not null check (price > 0),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete restrict,
  property_id uuid not null references public.properties(id) on delete restrict,
  room_name text not null,
  move_in_date date not null,
  details jsonb not null default '{}',
  documents text[] not null default '{}',
  status public.application_status not null default 'submitted',
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete restrict,
  property_id uuid not null references public.properties(id) on delete restrict,
  room_name text not null,
  move_in_date date not null,
  amount numeric(12, 2) not null check (amount > 0),
  status public.booking_status not null default 'requested',
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  student_id uuid not null references public.users(id) on delete restrict,
  provider_reference text unique,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'NGN',
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete restrict,
  recipient_id uuid not null references public.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete restrict,
  property_id uuid references public.properties(id) on delete restrict,
  subject text not null,
  description text not null,
  status public.maintenance_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index properties_status_idx on public.properties(status);
create index properties_owner_id_idx on public.properties(owner_id);
create index properties_university_idx on public.properties(university);
create index property_rooms_property_id_idx on public.property_rooms(property_id);
create index applications_student_id_idx on public.applications(student_id);
create index applications_property_id_idx on public.applications(property_id);
create index bookings_student_id_idx on public.bookings(student_id);
create index messages_participants_idx on public.messages(sender_id, recipient_id);
create index notifications_user_id_idx on public.notifications(user_id);
create index maintenance_student_id_idx on public.maintenance_requests(student_id);

alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.properties enable row level security;
alter table public.property_rooms enable row level security;
alter table public.applications enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.support_tickets enable row level security;
