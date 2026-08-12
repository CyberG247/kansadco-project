-- Live admin inbox and durable replies sent from the KANSADCO workspace.

create table if not exists public.enquiry_replies (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  admin_id uuid references auth.users(id) on delete set null default auth.uid(),
  subject text not null check (char_length(subject) between 2 and 240),
  message text not null check (char_length(message) between 2 and 5000),
  delivery_status text not null default 'Pending' check (delivery_status in ('Pending', 'Sent', 'Failed')),
  brevo_message_id text,
  delivery_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_replies_enquiry_created_idx
  on public.enquiry_replies (enquiry_id, created_at desc);

alter table public.enquiry_replies enable row level security;

drop policy if exists "Admins read enquiry replies" on public.enquiry_replies;
create policy "Admins read enquiry replies" on public.enquiry_replies
  for select to authenticated using ((select private.is_content_admin()));

drop policy if exists "Admins insert enquiry replies" on public.enquiry_replies;
create policy "Admins insert enquiry replies" on public.enquiry_replies
  for insert to authenticated with check ((select private.is_content_admin()));

grant select, insert on public.enquiry_replies to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'enquiries'
    ) then
    alter publication supabase_realtime add table public.enquiries;
  end if;
end;
$$;

