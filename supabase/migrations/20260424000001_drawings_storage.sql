-- Drawings storage bucket for patient canvas captures (cube / clock / trail making).
-- Mirrors the stimuli/audio bucket patterns. Objects are stored under
-- `<session_id>/<task_name>.png` so clinicians can only read drawings that
-- belong to their own sessions.

insert into storage.buckets (id, name, public)
values ('drawings', 'drawings', false)
on conflict (id) do update
set public = excluded.public;

-- Service role (Edge Functions) can read and write every drawing.
drop policy if exists "Service role read access to Drawings" on storage.objects;
create policy "Service role read access to Drawings"
  on storage.objects for select
  using (bucket_id = 'drawings' and auth.role() = 'service_role');

drop policy if exists "Service role write access to Drawings" on storage.objects;
create policy "Service role write access to Drawings"
  on storage.objects for all
  using (bucket_id = 'drawings' and auth.role() = 'service_role')
  with check (bucket_id = 'drawings' and auth.role() = 'service_role');

-- Clinicians can read drawings for sessions they own. Object path is
-- `<session_id>/<task_name>.png`, so the first path segment identifies the session.
drop policy if exists "Clinicians can read own session drawings" on storage.objects;
create policy "Clinicians can read own session drawings"
  on storage.objects for select
  using (
    bucket_id = 'drawings'
    and exists (
      select 1 from sessions
      where sessions.id::text = (storage.foldername(name))[1]
        and sessions.clinician_id = auth.uid()
    )
  );
