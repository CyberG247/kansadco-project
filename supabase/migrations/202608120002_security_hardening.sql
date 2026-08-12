-- Harden helper functions and consolidate RLS policies after advisor review.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'editor')
  );
$$;

revoke all on function private.is_content_admin() from public, anon, authenticated;
grant execute on function private.is_content_admin() to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.log_content_activity() from public, anon, authenticated;

drop policy if exists "Users read their own profile" on public.profiles;
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Users read permitted profiles" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or (select private.is_content_admin()));
create policy "Admins insert profiles" on public.profiles
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update profiles" on public.profiles
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));
create policy "Admins delete profiles" on public.profiles
  for delete to authenticated using ((select private.is_content_admin()));

drop policy if exists "Signed-in users read visible projects" on public.projects;
drop policy if exists "Admins manage projects" on public.projects;
create policy "Signed-in users read permitted projects" on public.projects
  for select to authenticated
  using (status in ('Published', 'In progress') or (select private.is_content_admin()));
create policy "Admins insert projects" on public.projects
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update projects" on public.projects
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));
create policy "Admins delete projects" on public.projects
  for delete to authenticated using ((select private.is_content_admin()));

drop policy if exists "Signed-in users read published gallery" on public.gallery_assets;
drop policy if exists "Admins manage gallery" on public.gallery_assets;
create policy "Signed-in users read permitted gallery" on public.gallery_assets
  for select to authenticated
  using (status = 'Published' or (select private.is_content_admin()));
create policy "Admins insert gallery" on public.gallery_assets
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update gallery" on public.gallery_assets
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));
create policy "Admins delete gallery" on public.gallery_assets
  for delete to authenticated using ((select private.is_content_admin()));

drop policy if exists "Visitors submit enquiries" on public.enquiries;
drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Visitors submit enquiries" on public.enquiries
  for insert to anon
  with check (status = 'New' and source in ('Contact', 'Private tour'));
create policy "Signed-in users submit permitted enquiries" on public.enquiries
  for insert to authenticated
  with check ((select private.is_content_admin()) or (status = 'New' and source in ('Contact', 'Private tour')));
create policy "Admins read enquiries" on public.enquiries
  for select to authenticated using ((select private.is_content_admin()));
create policy "Admins update enquiries" on public.enquiries
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));
create policy "Admins delete enquiries" on public.enquiries
  for delete to authenticated using ((select private.is_content_admin()));

drop policy if exists "Public reads site settings" on public.site_settings;
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings
  for select to anon using (true);
create policy "Signed-in users read site settings" on public.site_settings
  for select to authenticated using (true);
create policy "Admins insert site settings" on public.site_settings
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update site settings" on public.site_settings
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));
create policy "Admins delete site settings" on public.site_settings
  for delete to authenticated using ((select private.is_content_admin()));

drop policy if exists "Admins read activity" on public.activities;
drop policy if exists "Admins update activity" on public.activities;
create policy "Admins read activity" on public.activities
  for select to authenticated using ((select private.is_content_admin()));
create policy "Admins update activity" on public.activities
  for update to authenticated using ((select private.is_content_admin())) with check ((select private.is_content_admin()));

drop policy if exists "Admins manage site media" on storage.objects;
create policy "Admins manage site media" on storage.objects
  for all to authenticated
  using (bucket_id = 'site-media' and (select private.is_content_admin()))
  with check (bucket_id = 'site-media' and (select private.is_content_admin()));

drop function if exists public.is_content_admin();
