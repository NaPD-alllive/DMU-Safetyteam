create extension if not exists pgcrypto;

create table if not exists public.facility_app_state (
  id text primary key default 'main' check (id = 'main'),
  state jsonb not null default '{}'::jsonb,
  revision bigint not null default 1,
  updated_by text,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_facility_app_state()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.revision = old.revision + 1;
  return new;
end;
$$;

drop trigger if exists facility_app_state_touch on public.facility_app_state;
create trigger facility_app_state_touch
before update on public.facility_app_state
for each row execute function public.touch_facility_app_state();

insert into public.facility_app_state (id, state, updated_by)
values ('main', '{}'::jsonb, 'initial setup')
on conflict (id) do nothing;

alter table public.facility_app_state enable row level security;

drop policy if exists facility_app_state_read on public.facility_app_state;
drop policy if exists facility_app_state_insert on public.facility_app_state;
drop policy if exists facility_app_state_update on public.facility_app_state;

create policy facility_app_state_read on public.facility_app_state
for select to authenticated
using (id = 'main');

create policy facility_app_state_insert on public.facility_app_state
for insert to authenticated
with check (id = 'main');

create policy facility_app_state_update on public.facility_app_state
for update to authenticated
using (id = 'main')
with check (id = 'main');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'facility-attachments',
  'facility-attachments',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists facility_attachments_read on storage.objects;
drop policy if exists facility_attachments_upload on storage.objects;
drop policy if exists facility_attachments_update on storage.objects;
drop policy if exists facility_attachments_delete on storage.objects;

create policy facility_attachments_read on storage.objects
for select to authenticated
using (bucket_id = 'facility-attachments');

create policy facility_attachments_upload on storage.objects
for insert to authenticated
with check (bucket_id = 'facility-attachments');

create policy facility_attachments_update on storage.objects
for update to authenticated
using (bucket_id = 'facility-attachments')
with check (bucket_id = 'facility-attachments');

create policy facility_attachments_delete on storage.objects
for delete to authenticated
using (bucket_id = 'facility-attachments');
