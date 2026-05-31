create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type public.facility_role as enum ('admin', 'staff', 'user');
create type public.facility_status as enum ('운영중', '점검중', '예약중지');
create type public.reservation_status as enum ('pending', 'approved', 'rejected', 'cancelled');
create type public.maintenance_priority as enum ('low', 'normal', 'urgent');
create type public.maintenance_status as enum ('submitted', 'received', 'in_progress', 'completed');
create type public.inspection_status as enum ('scheduled', 'completed');
create type public.inspection_cycle as enum ('weekly', 'monthly', 'quarterly', 'yearly');
create type public.asset_condition as enum ('good', 'watch', 'repair');
create type public.asset_status as enum ('active', 'maintenance', 'retired');
create type public.notification_kind as enum (
  'reservation_approved',
  'reservation_rejected',
  'maintenance_completed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  app_role public.facility_role not null default 'user',
  active boolean not null default true,
  specialty text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  capacity integer not null check (capacity > 0),
  location text not null,
  description text not null,
  status public.facility_status not null default '운영중',
  image_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facility_assets (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  name text not null,
  asset_tag text not null unique,
  category text not null,
  condition public.asset_condition not null default 'good',
  status public.asset_status not null default 'active',
  manager_name text not null,
  purchased_at date,
  last_checked_at date,
  value integer check (value is null or value >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facility_reservations (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  requester_organization text not null default '',
  purpose text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.reservation_status not null default 'pending',
  reject_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

alter table public.facility_reservations
  add constraint facility_reservations_no_overlap
  exclude using gist (
    facility_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (status in ('pending', 'approved'));

create table public.facility_maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  priority public.maintenance_priority not null default 'normal',
  status public.maintenance_status not null default 'submitted',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facility_inspection_schedules (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  title text not null,
  inspection_type text not null,
  cycle public.inspection_cycle not null,
  inspector_name text not null,
  due_date date not null,
  status public.inspection_status not null default 'scheduled',
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facility_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind public.notification_kind not null,
  title text not null,
  message text not null,
  source_id uuid not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index facilities_status_idx on public.facilities(status);
create index reservations_facility_time_idx on public.facility_reservations(facility_id, start_at, end_at);
create index maintenance_status_idx on public.facility_maintenance_requests(status);
create index inspections_due_date_idx on public.facility_inspection_schedules(due_date, status);
create index notifications_recipient_idx on public.facility_notifications(recipient_id, read, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger facilities_set_updated_at
before update on public.facilities
for each row execute function public.set_updated_at();

create trigger facility_assets_set_updated_at
before update on public.facility_assets
for each row execute function public.set_updated_at();

create trigger facility_reservations_set_updated_at
before update on public.facility_reservations
for each row execute function public.set_updated_at();

create trigger facility_maintenance_requests_set_updated_at
before update on public.facility_maintenance_requests
for each row execute function public.set_updated_at();

create trigger facility_inspection_schedules_set_updated_at
before update on public.facility_inspection_schedules
for each row execute function public.set_updated_at();

create or replace function public.current_facility_role()
returns public.facility_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select profiles.app_role
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.active = true
    ),
    'user'::public.facility_role
  );
$$;

create or replace function public.is_facility_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_facility_role() = 'admin'::public.facility_role;
$$;

alter table public.profiles enable row level security;
alter table public.facilities enable row level security;
alter table public.facility_assets enable row level security;
alter table public.facility_reservations enable row level security;
alter table public.facility_maintenance_requests enable row level security;
alter table public.facility_inspection_schedules enable row level security;
alter table public.facility_notifications enable row level security;

create policy profiles_select_authenticated on public.profiles
for select to authenticated
using (true);

create policy profiles_update_admin on public.profiles
for update to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy profiles_insert_admin on public.profiles
for insert to authenticated
with check (public.is_facility_admin());

create policy facilities_select_authenticated on public.facilities
for select to authenticated
using (true);

create policy facilities_write_admin on public.facilities
for all to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy facility_assets_select_authenticated on public.facility_assets
for select to authenticated
using (true);

create policy facility_assets_write_admin on public.facility_assets
for all to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy reservations_select_by_role on public.facility_reservations
for select to authenticated
using (
  public.current_facility_role() in ('admin', 'staff')
  or requester_id = auth.uid()
);

create policy reservations_insert_self on public.facility_reservations
for insert to authenticated
with check (
  requester_id = auth.uid()
  and status = 'pending'
  and start_at > now()
);

create policy reservations_update_admin on public.facility_reservations
for update to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy reservations_cancel_own_pending on public.facility_reservations
for update to authenticated
using (requester_id = auth.uid() and status = 'pending')
with check (requester_id = auth.uid() and status = 'cancelled');

create policy maintenance_select_by_role on public.facility_maintenance_requests
for select to authenticated
using (
  public.current_facility_role() in ('admin', 'staff')
  or requester_id = auth.uid()
);

create policy maintenance_insert_staff on public.facility_maintenance_requests
for insert to authenticated
with check (
  requester_id = auth.uid()
  and public.current_facility_role() in ('admin', 'staff')
  and status = 'submitted'
);

create policy maintenance_update_admin on public.facility_maintenance_requests
for update to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy inspections_select_authenticated on public.facility_inspection_schedules
for select to authenticated
using (true);

create policy inspections_write_admin on public.facility_inspection_schedules
for all to authenticated
using (public.is_facility_admin())
with check (public.is_facility_admin());

create policy notifications_select_recipient on public.facility_notifications
for select to authenticated
using (public.is_facility_admin() or recipient_id = auth.uid());

create policy notifications_insert_admin on public.facility_notifications
for insert to authenticated
with check (public.is_facility_admin());

create policy notifications_update_recipient on public.facility_notifications
for update to authenticated
using (public.is_facility_admin() or recipient_id = auth.uid())
with check (public.is_facility_admin() or recipient_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('facility-images', 'facility-images', true)
on conflict (id) do nothing;

create policy facility_images_read on storage.objects
for select to authenticated
using (bucket_id = 'facility-images');

create policy facility_images_upload on storage.objects
for insert to authenticated
with check (
  bucket_id = 'facility-images'
  and public.current_facility_role() in ('admin', 'staff')
);
