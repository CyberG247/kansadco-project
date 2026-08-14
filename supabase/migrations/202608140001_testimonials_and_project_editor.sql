-- Manage homepage testimonials and align project validation with the simplified editor.

alter table public.projects drop constraint if exists projects_description_check;
alter table public.projects add constraint projects_description_check
  check (char_length(btrim(description)) between 2 and 4000);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null check (char_length(btrim(quote)) between 2 and 2000),
  name text not null check (char_length(btrim(name)) between 2 and 160),
  role text not null check (char_length(btrim(role)) between 2 and 240),
  sort_order integer not null default 1 check (sort_order > 0),
  status text not null default 'Draft' check (status in ('Published', 'Draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_public_order_idx
  on public.testimonials (status, sort_order, updated_at desc);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute procedure public.set_updated_at();

alter table public.testimonials enable row level security;

drop policy if exists "Public reads published testimonials" on public.testimonials;
drop policy if exists "Signed-in users read permitted testimonials" on public.testimonials;
drop policy if exists "Admins insert testimonials" on public.testimonials;
drop policy if exists "Admins update testimonials" on public.testimonials;
drop policy if exists "Admins delete testimonials" on public.testimonials;

create policy "Public reads published testimonials" on public.testimonials
  for select to anon using (status = 'Published');
create policy "Signed-in users read permitted testimonials" on public.testimonials
  for select to authenticated
  using (status = 'Published' or (select private.is_content_admin()));
create policy "Admins insert testimonials" on public.testimonials
  for insert to authenticated with check ((select private.is_content_admin()));
create policy "Admins update testimonials" on public.testimonials
  for update to authenticated
  using ((select private.is_content_admin()))
  with check ((select private.is_content_admin()));
create policy "Admins delete testimonials" on public.testimonials
  for delete to authenticated using ((select private.is_content_admin()));

grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;

insert into public.testimonials (quote, name, role, sort_order, status)
select seed.quote, seed.name, seed.role, seed.sort_order, 'Published'
from (values
  ('KANSADCO brought unusual discipline to a complex brief. Every decision felt considered, every milestone was visible, and the finished place exceeded the promise.', 'Abdullahi Bala Musa', 'Managing Director, InnovaTech Consultancy', 1),
  ('They understand that property is both a financial asset and a lived experience. That balance is why we continue to invest with them.', 'Ibrahim Suleiman', 'Property Investor, Kano', 2),
  ('The quality is evident in the details you touch every day. Our home feels calm, resolved, and built for the long term.', 'Dr. Amina Bello', 'Resident, Rahmaniyya Estate', 3)
) as seed(quote, name, role, sort_order)
where not exists (select 1 from public.testimonials);

alter table public.activities drop constraint if exists activities_type_check;
alter table public.activities add constraint activities_type_check
  check (type in ('project', 'gallery', 'team', 'testimonial', 'enquiry', 'settings'));

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
    when 'testimonials' then 'testimonial'
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
    when 'testimonials' then 'Testimonial ' || activity_action || ': ' || record_label
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

drop trigger if exists testimonials_log_activity on public.testimonials;
create trigger testimonials_log_activity after insert or update or delete on public.testimonials
  for each row execute procedure public.log_content_activity();

notify pgrst, 'reload schema';
