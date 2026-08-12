-- KANSADCO content platform: authentication, content tables, RLS and media storage.
-- Run this migration in the Supabase SQL Editor before using the admin workspace.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_content_admin()
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

revoke all on function public.is_content_admin() from public;
grant execute on function public.is_content_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, full_name)
select id, coalesce(email, ''), coalesce(raw_user_meta_data ->> 'full_name', split_part(coalesce(email, ''), '@', 1))
from auth.users
on conflict (id) do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  type text not null check (char_length(type) between 2 and 80),
  location text not null check (char_length(location) between 2 and 160),
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'Draft' check (status in ('Published', 'In progress', 'Draft')),
  year text not null check (char_length(year) between 2 and 24),
  description text not null check (char_length(description) between 10 and 4000),
  image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_assets (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  name text not null check (char_length(name) between 2 and 160),
  type text not null check (char_length(type) between 2 and 80),
  location text not null check (char_length(location) between 2 and 160),
  year text not null check (char_length(year) between 2 and 24),
  status text not null default 'Draft' check (status in ('Published', 'Draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  email text not null check (char_length(email) between 5 and 320),
  phone text not null default '' check (char_length(phone) <= 40),
  subject text not null check (char_length(subject) between 2 and 240),
  message text not null check (char_length(message) between 2 and 5000),
  status text not null default 'New' check (status in ('New', 'Review', 'Replied', 'Archived')),
  source text not null default 'Contact' check (source in ('Contact', 'Private tour', 'Admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  display_name text not null,
  primary_email text not null,
  telephone text not null,
  abuja_address text not null,
  kano_address text not null,
  default_author text not null,
  review_workflow text not null,
  image_quality text not null,
  content_initialized boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  type text not null check (type in ('project', 'gallery', 'enquiry', 'settings')),
  read boolean not null default false,
  actor_id uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

insert into public.site_settings (
  id, display_name, primary_email, telephone, abuja_address, kano_address,
  default_author, review_workflow, image_quality
) values (
  1,
  'KANSADCO Engineering Nig. Ltd.',
  'kansadco@gmail.com',
  '+234 803 738 0434',
  'Rahmaniyya Estate 1, Ajose Adeogun Street, Utako, Abuja',
  'No. 30 Lamido Road, Nassarawa GRA, Kano',
  'KANSADCO Editorial',
  'Approval required',
  'Web optimized'
) on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute procedure public.set_updated_at();
drop trigger if exists gallery_assets_set_updated_at on public.gallery_assets;
create trigger gallery_assets_set_updated_at before update on public.gallery_assets
  for each row execute procedure public.set_updated_at();
drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at before update on public.enquiries
  for each row execute procedure public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute procedure public.set_updated_at();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.log_content_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  activity_message text;
  activity_type text;
begin
  activity_type := case tg_table_name
    when 'gallery_assets' then 'gallery'
    when 'site_settings' then 'settings'
    when 'enquiries' then 'enquiry'
    else 'project'
  end;

  activity_message := case
    when tg_table_name = 'projects' and tg_op = 'INSERT' then 'Project created: ' || new.name
    when tg_table_name = 'projects' and tg_op = 'UPDATE' then 'Project updated: ' || new.name
    when tg_table_name = 'projects' and tg_op = 'DELETE' then 'Project deleted: ' || old.name
    when tg_table_name = 'gallery_assets' and tg_op = 'INSERT' then 'Gallery asset added: ' || new.name
    when tg_table_name = 'gallery_assets' and tg_op = 'UPDATE' then 'Gallery asset updated: ' || new.name
    when tg_table_name = 'gallery_assets' and tg_op = 'DELETE' then 'Gallery asset deleted: ' || old.name
    when tg_table_name = 'enquiries' and tg_op = 'INSERT' then 'New enquiry: ' || new.subject
    when tg_table_name = 'enquiries' and tg_op = 'UPDATE' then 'Enquiry updated: ' || new.subject
    when tg_table_name = 'enquiries' and tg_op = 'DELETE' then 'Enquiry deleted: ' || old.subject
    else 'Workspace settings updated'
  end;

  insert into public.activities (message, type, actor_id)
  values (activity_message, activity_type, auth.uid());
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists projects_log_activity on public.projects;
create trigger projects_log_activity after insert or update or delete on public.projects
  for each row execute procedure public.log_content_activity();
drop trigger if exists gallery_assets_log_activity on public.gallery_assets;
create trigger gallery_assets_log_activity after insert or update or delete on public.gallery_assets
  for each row execute procedure public.log_content_activity();
drop trigger if exists enquiries_log_activity on public.enquiries;
create trigger enquiries_log_activity after insert or update or delete on public.enquiries
  for each row execute procedure public.log_content_activity();
drop trigger if exists site_settings_log_activity on public.site_settings;
create trigger site_settings_log_activity after update on public.site_settings
  for each row when (old.* is distinct from new.*) execute procedure public.log_content_activity();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.gallery_assets enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.activities enable row level security;

drop policy if exists "Users read their own profile" on public.profiles;
create policy "Users read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles
  for all to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

drop policy if exists "Public reads visible projects" on public.projects;
create policy "Public reads visible projects" on public.projects
  for select to anon using (status in ('Published', 'In progress'));
drop policy if exists "Signed-in users read visible projects" on public.projects;
create policy "Signed-in users read visible projects" on public.projects
  for select to authenticated using (status in ('Published', 'In progress') or (select public.is_content_admin()));
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
  for all to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

drop policy if exists "Public reads published gallery" on public.gallery_assets;
create policy "Public reads published gallery" on public.gallery_assets
  for select to anon using (status = 'Published');
drop policy if exists "Signed-in users read published gallery" on public.gallery_assets;
create policy "Signed-in users read published gallery" on public.gallery_assets
  for select to authenticated using (status = 'Published' or (select public.is_content_admin()));
drop policy if exists "Admins manage gallery" on public.gallery_assets;
create policy "Admins manage gallery" on public.gallery_assets
  for all to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

drop policy if exists "Visitors submit enquiries" on public.enquiries;
create policy "Visitors submit enquiries" on public.enquiries
  for insert to anon, authenticated with check (status = 'New' and source in ('Contact', 'Private tour'));
drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries
  for all to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings
  for select to anon, authenticated using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings
  for all to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

drop policy if exists "Admins read activity" on public.activities;
create policy "Admins read activity" on public.activities
  for select to authenticated using ((select public.is_content_admin()));
drop policy if exists "Admins update activity" on public.activities;
create policy "Admins update activity" on public.activities
  for update to authenticated using ((select public.is_content_admin())) with check ((select public.is_content_admin()));

grant select on public.projects, public.gallery_assets, public.site_settings to anon;
grant insert on public.enquiries to anon;
grant select, insert, update, delete on public.projects, public.gallery_assets, public.enquiries, public.site_settings, public.activities, public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins manage site media" on storage.objects;
create policy "Admins manage site media" on storage.objects
  for all to authenticated
  using (bucket_id = 'site-media' and (select public.is_content_admin()))
  with check (bucket_id = 'site-media' and (select public.is_content_admin()));

-- After creating an Auth user in Authentication > Users, promote that account:
-- update public.profiles set role = 'admin', full_name = 'Your Name' where email = 'you@example.com';
