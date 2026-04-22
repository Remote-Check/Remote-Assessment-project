-- Stimuli Storage Setup
insert into storage.buckets (id, name, public) 
values ('stimuli', 'stimuli', true)
on conflict (id) do nothing;

-- RLS for Storage (Public Read, Admin Write)
create policy "Public Access to Stimuli"
  on storage.objects for select
  using ( bucket_id = 'stimuli' );

create policy "Admin Write Access to Stimuli"
  on storage.objects for all
  using ( bucket_id = 'stimuli' )
  with check ( auth.role() = 'service_role' );
