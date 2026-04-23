-- Clinician onboarding profile + patient contact fields for notification workflows

create table if not exists clinicians (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  clinic_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clinicians enable row level security;

drop policy if exists "Clinicians can insert own profile" on clinicians;
create policy "Clinicians can insert own profile"
  on clinicians
  for insert
  with check (auth.uid() = id);

drop policy if exists "Clinicians can view own profile" on clinicians;
create policy "Clinicians can view own profile"
  on clinicians
  for select
  using (auth.uid() = id);

drop policy if exists "Clinicians can update own profile" on clinicians;
create policy "Clinicians can update own profile"
  on clinicians
  for update
  using (auth.uid() = id);

drop policy if exists "Service role full access to clinicians" on clinicians;
create policy "Service role full access to clinicians"
  on clinicians
  for all
  using (auth.jwt()->>'role' = 'service_role')
  with check (auth.jwt()->>'role' = 'service_role');

create or replace function set_clinician_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_clinicians_updated_at on clinicians;
create trigger trigger_clinicians_updated_at
  before update on clinicians
  for each row
  execute function set_clinician_updated_at();

alter table sessions add column if not exists patient_phone text;
alter table sessions add column if not exists sms_sent_at timestamptz;
alter table sessions add column if not exists sms_delivery_error text;

create index if not exists idx_sessions_patient_phone on sessions(patient_phone);
