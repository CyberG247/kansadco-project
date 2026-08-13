-- Repair the managed team table if its migration history was marked as applied
-- without the table being present, and keep content refreshes schema-cache safe.

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  role text not null check (char_length(role) between 2 and 160),
  discipline text not null check (char_length(discipline) between 2 and 160),
  bio text not null default '' check (char_length(bio) <= 4000),
  image text not null default '',
  email text not null check (char_length(email) between 5 and 320),
  featured boolean not null default false,
  sort_order integer not null default 1 check (sort_order > 0),
  status text not null default 'Draft' check (status in ('Published', 'Draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_public_order_idx
  on public.team_members (status, sort_order, updated_at desc);

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at before update on public.team_members
  for each row execute procedure public.set_updated_at();

alter table public.activities drop constraint if exists activities_type_check;
alter table public.activities add constraint activities_type_check
  check (type in ('project', 'gallery', 'team', 'enquiry', 'settings'));

-- Use JSON records so the shared trigger never tries to compile a field that
-- does not exist on one of the tables using it.
create or replace function public.log_content_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  activity_message text;
  activity_type text;
  activity_action text;
  row_data jsonb;
  record_label text;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  record_label := coalesce(row_data ->> 'name', row_data ->> 'subject', 'workspace');

  activity_type := case tg_table_name
    when 'gallery_assets' then 'gallery'
    when 'team_members' then 'team'
    when 'site_settings' then 'settings'
    when 'enquiries' then 'enquiry'
    else 'project'
  end;

  activity_action := case tg_op
    when 'INSERT' then 'created'
    when 'UPDATE' then 'updated'
    else 'deleted'
  end;

  activity_message := case tg_table_name
    when 'projects' then 'Project ' || activity_action || ': ' || record_label
    when 'gallery_assets' then 'Gallery asset ' || activity_action || ': ' || record_label
    when 'team_members' then 'Team member ' || activity_action || ': ' || record_label
    when 'enquiries' then case when tg_op = 'INSERT' then 'New enquiry: ' else 'Enquiry ' || activity_action || ': ' end || record_label
    else 'Workspace settings updated'
  end;

  insert into public.activities (message, type, actor_id)
  values (activity_message, activity_type, auth.uid());

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.log_content_activity() from public, anon, authenticated;

drop trigger if exists team_members_log_activity on public.team_members;
create trigger team_members_log_activity after insert or update or delete on public.team_members
  for each row execute procedure public.log_content_activity();

alter table public.team_members enable row level security;

drop policy if exists "Public reads published team members" on public.team_members;
drop policy if exists "Signed-in users read team members" on public.team_members;
drop policy if exists "Admins manage team members" on public.team_members;
drop policy if exists "Signed-in users read permitted team members" on public.team_members;
drop policy if exists "Admins insert team members" on public.team_members;
drop policy if exists "Admins update team members" on public.team_members;
drop policy if exists "Admins delete team members" on public.team_members;

create policy "Public reads published team members" on public.team_members
  for select to anon using (status = 'Published');
create policy "Signed-in users read permitted team members" on public.team_members
  for select to authenticated
  using (status = 'Published' or (select private.is_content_admin()));
create policy "Admins insert team members" on public.team_members
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update team members" on public.team_members
  for update to authenticated
  using ((select private.is_content_admin()))
  with check ((select private.is_content_admin()));
create policy "Admins delete team members" on public.team_members
  for delete to authenticated using ((select private.is_content_admin()));

grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;

insert into public.team_members (name, role, discipline, bio, image, email, featured, sort_order, status)
select seed.name, seed.role, seed.discipline, seed.bio, seed.image, 'kansadco@gmail.com', seed.featured, seed.sort_order, 'Published'
from (values
  ('Arch. Yunusa Ibrahim Hassan, MNIA', 'Founder & Chief Executive Officer', 'Architecture · Leadership', 'He established KANSADCO in 2018 around a commitment to vision, responsibility, professionalism and excellence—transforming client aspirations into purposeful spaces and lasting relationships.', 'bundled:chairman', true, 1),
  ('Arc. Fatima Ibrahim', 'Chief Architect', 'Architecture · Design', '', '', false, 2),
  ('Engr. Chukwuma Okafor', 'Director of Construction', 'Delivery · Civil works', '', '', false, 3),
  ('Hajia Aisha Mohammed', 'Director of Real Estate', 'Investment · Property', '', '', false, 4),
  ('Engr. David Adeleke', 'Chief Engineer', 'Structures · Infrastructure', '', '', false, 5),
  ('Mrs. Grace Okonkwo', 'Finance Director', 'Finance · Governance', '', '', false, 6),
  ('Mallam Yusuf Garba', 'Head of Operations', 'Operations · Quality', '', '', false, 7),
  ('Engr. Amaka Nwosu', 'Project Manager', 'Projects · Coordination', '', '', false, 8)
) as seed(name, role, discipline, bio, image, featured, sort_order)
where not exists (select 1 from public.team_members);

notify pgrst, 'reload schema';
