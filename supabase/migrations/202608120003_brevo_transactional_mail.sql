-- Transactional mail state and abuse protection for the server-side enquiry endpoint.

alter table public.enquiries
  add column if not exists notification_status text not null default 'Pending'
    check (notification_status in ('Pending', 'Sent', 'Partial', 'Failed')),
  add column if not exists notification_message_id text,
  add column if not exists acknowledgement_message_id text,
  add column if not exists notification_error text,
  add column if not exists notified_at timestamptz;

create table if not exists public.enquiry_submission_attempts (
  id bigint generated always as identity primary key,
  fingerprint text not null check (char_length(fingerprint) = 64),
  created_at timestamptz not null default now()
);

create index if not exists enquiry_submission_attempts_lookup_idx
  on public.enquiry_submission_attempts (fingerprint, created_at desc);

alter table public.enquiry_submission_attempts enable row level security;
revoke all on public.enquiry_submission_attempts from public, anon, authenticated;

create or replace function public.claim_enquiry_submission(p_fingerprint text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  recent_attempts integer;
begin
  if p_fingerprint !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_fingerprint, 0));
  delete from public.enquiry_submission_attempts where created_at < now() - interval '24 hours';
  select count(*) into recent_attempts
  from public.enquiry_submission_attempts
  where fingerprint = p_fingerprint
    and created_at >= now() - interval '15 minutes';

  if recent_attempts >= 5 then
    return false;
  end if;

  insert into public.enquiry_submission_attempts (fingerprint) values (p_fingerprint);
  return true;
end;
$$;

revoke all on function public.claim_enquiry_submission(text) from public, anon, authenticated;
grant execute on function public.claim_enquiry_submission(text) to service_role;

-- Public submissions now pass through the validated Edge Function. The service role
-- writes the record; signed-in content administrators retain direct management access.
drop policy if exists "Visitors submit enquiries" on public.enquiries;
drop policy if exists "Signed-in users submit permitted enquiries" on public.enquiries;
create policy "Admins insert enquiries" on public.enquiries
  for insert to authenticated with check ((select private.is_content_admin()));
revoke insert on public.enquiries from anon;

comment on column public.enquiries.notification_status is 'Brevo delivery state for the internal notification and visitor acknowledgement.';
