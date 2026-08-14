-- Remember deleted invoice ids so another device cannot upload them again.

create table if not exists public.invoice_app_deleted (
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null,
  deleted_at timestamptz not null default now(),
  primary key (user_id, invoice_id)
);

create index if not exists invoice_app_deleted_user_idx
  on public.invoice_app_deleted (user_id, deleted_at desc);

alter table public.invoice_app_deleted enable row level security;

drop policy if exists "Invoice admins read own deletions" on public.invoice_app_deleted;
create policy "Invoice admins read own deletions" on public.invoice_app_deleted
  for select to authenticated
  using ((select auth.uid()) = user_id and (select private.is_content_admin()));

drop policy if exists "Invoice admins insert own deletions" on public.invoice_app_deleted;
create policy "Invoice admins insert own deletions" on public.invoice_app_deleted
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.is_content_admin()));

drop policy if exists "Invoice admins update own deletions" on public.invoice_app_deleted;
create policy "Invoice admins update own deletions" on public.invoice_app_deleted
  for update to authenticated
  using ((select auth.uid()) = user_id and (select private.is_content_admin()))
  with check ((select auth.uid()) = user_id and (select private.is_content_admin()));

drop policy if exists "Invoice admins delete own deletions" on public.invoice_app_deleted;
create policy "Invoice admins delete own deletions" on public.invoice_app_deleted
  for delete to authenticated
  using ((select auth.uid()) = user_id and (select private.is_content_admin()));

grant select, insert, update, delete on public.invoice_app_deleted to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.invoice_app_deleted;
  end if;
end $$;
