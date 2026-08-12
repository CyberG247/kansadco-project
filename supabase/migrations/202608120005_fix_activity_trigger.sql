-- The generic trigger must not address table-specific fields on a polymorphic
-- NEW/OLD record. Read the row as JSON so settings updates cannot fail while
-- compiling enquiry or content branches.

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
