-- MVP case identity cleanup.
-- The active product flow uses case IDs only; legacy patient contact fields stay
-- nullable for compatibility with earlier local data and future import needs.

alter table patients
  alter column phone drop not null;

comment on table patients is 'MVP case records. full_name stores the clinician-entered case ID for compatibility with earlier patient-profile UI.';
comment on column patients.full_name is 'MVP case ID / pseudonymous case label; do not store patient names for active MVP use.';
comment on column patients.phone is 'Legacy optional contact field; not collected in the active MVP flow.';
comment on column patients.date_of_birth is 'Legacy optional field; not collected in the active MVP flow.';
comment on column patients.id_number is 'Legacy optional field; not collected in the active MVP flow.';
