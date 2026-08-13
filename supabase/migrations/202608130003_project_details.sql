-- Add editable public case-study content to every project.

alter table public.projects
  add column if not exists slug text,
  add column if not exists client text not null default '',
  add column if not exists scope text not null default '',
  add column if not exists area text not null default '',
  add column if not exists duration text not null default '',
  add column if not exists overview text not null default '',
  add column if not exists challenge text not null default '',
  add column if not exists solution text not null default '',
  add column if not exists features text[] not null default '{}',
  add column if not exists gallery_images text[] not null default '{}';

update public.projects set slug = case name
  when 'Rahmaniyya Estate II' then 'rahmaniyya-estate-ii'
  when 'Federal Ministry Complex' then 'federal-ministry-complex'
  when 'KANSADCO Corporate Tower' then 'kansadco-corporate-tower'
  when 'River Kaduna Bridge' then 'river-kaduna-bridge'
  when 'Kano–Zaria Corridor' then 'kano-zaria-corridor'
  when 'Rahmaniyya Estate I' then 'rahmaniyya-estate-i'
  else coalesce(nullif(trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')), ''), 'project') || '-' || left(id::text, 8)
end
where slug is null or slug = '';

alter table public.projects alter column slug set not null;
alter table public.projects drop constraint if exists projects_slug_format;
alter table public.projects add constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
create unique index if not exists projects_slug_unique on public.projects (slug);

update public.projects set
  client = 'Private residential development',
  scope = 'Masterplanning · Architecture · Construction',
  area = '18 hectares',
  duration = '2024 — Ongoing',
  overview = 'Rahmaniyya Estate II is conceived as a calm, connected residential community where contemporary homes sit within a generous landscape framework. The plan balances privacy with neighbourhood life through shaded streets, shared green spaces and a clear hierarchy of movement.',
  challenge = 'The brief called for a high-quality residential environment that could accommodate different household types while preserving a coherent identity, efficient infrastructure and a strong sense of arrival.',
  solution = 'A landscape-led masterplan organizes homes into intimate clusters, separates service movement from primary pedestrian routes and uses a restrained material palette to unify the development as it grows.',
  features = array['Secure arrival and controlled access', 'Landscaped communal spaces', 'Flexible contemporary home types', 'Pedestrian-focused internal streets', 'Integrated utility and service planning'],
  gallery_images = array[image]
where name = 'Rahmaniyya Estate II';

update public.projects set
  client = 'Federal institution',
  scope = 'Architecture · Construction · Project management',
  area = '32,000 m²',
  duration = '2023 — Ongoing',
  overview = 'The Federal Ministry Complex brings several administrative functions into one legible civic campus. Its architecture is measured and durable, using shaded circulation, generous public thresholds and clearly organized work environments to support everyday institutional life.',
  challenge = 'The project needed to reconcile public accessibility, staff security and complex departmental relationships within a dignified building that remains practical to operate over time.',
  solution = 'The campus is arranged around a central orientation spine with distinct public and secure zones. Repetitive structural bays, protected façades and accessible courtyards simplify construction while improving daylight and navigation.',
  features = array['Clearly separated public and staff circulation', 'Shaded civic courtyards', 'Flexible departmental floor plates', 'Durable low-maintenance finishes', 'Integrated project delivery coordination'],
  gallery_images = array[image]
where name = 'Federal Ministry Complex';

update public.projects set
  client = 'Private corporate client',
  scope = 'Architecture · Interior coordination · Construction',
  area = '21,500 m²',
  duration = '2022 — 2025',
  overview = 'KANSADCO Corporate Tower is imagined as a confident commercial address with efficient floor plates, active ground-level uses and a composed skyline presence. The building pairs contemporary workplace flexibility with a warm, regionally responsive material character.',
  challenge = 'A constrained urban site required an efficient vertical programme without compromising arrival, daylight, service access or the quality of shared business amenities.',
  solution = 'A compact service core releases adaptable perimeter workspace while a layered façade manages glare and heat. Retail, lobby and meeting functions animate the lower levels and strengthen the tower''s relationship with the street.',
  features = array['Flexible Grade-A office floors', 'Ground-floor retail and hospitality', 'High-performance shaded façade', 'Executive meeting and amenity levels', 'Efficient vertical circulation core'],
  gallery_images = array[image]
where name = 'KANSADCO Corporate Tower';

update public.projects set
  client = 'Public infrastructure client',
  scope = 'Engineering · Construction · Delivery coordination',
  area = '500-metre crossing',
  duration = '2019 — 2022',
  overview = 'The River Kaduna Bridge creates a dependable connection across a critical waterway, improving movement between communities and supporting the wider transport network. Its straightforward structural expression reflects a focus on resilience, safety and long service life.',
  challenge = 'Seasonal water levels, demanding ground conditions and the need to maintain regional movement required a carefully phased engineering and construction strategy.',
  solution = 'Robust pier geometry, coordinated drainage and staged works reduced disruption while responding to the river environment. Clear carriageway separation and protected pedestrian edges improve everyday safety.',
  features = array['Dual carriageway crossing', 'Protected pedestrian movement', 'Resilient drainage strategy', 'Durable structural system', 'Phased construction planning'],
  gallery_images = array[image]
where name = 'River Kaduna Bridge';

update public.projects set
  client = 'Public infrastructure client',
  scope = 'Rehabilitation · Drainage · Construction',
  area = '45-kilometre corridor',
  duration = '2020 — 2023',
  overview = 'The Kano–Zaria Corridor rehabilitation focused on safer, more reliable movement along an economically important regional route. Improvements address pavement performance, drainage and the points where settlements meet the road.',
  challenge = 'Heavy daily use, seasonal runoff and continuous roadside activity demanded a construction approach that improved long-term performance while keeping people and goods moving.',
  solution = 'Targeted pavement reconstruction was coordinated with strengthened drainage, clearer junctions and a phased traffic plan designed around the corridor''s most active sections.',
  features = array['Rehabilitated carriageway', 'Strengthened drainage network', 'Safer junction transitions', 'Phased traffic management', 'Roadside settlement coordination'],
  gallery_images = array[image]
where name = 'Kano–Zaria Corridor';

update public.projects set
  client = 'Private residential development',
  scope = 'Architecture · Construction · Landscape coordination',
  area = '64 residences',
  duration = '2021 — 2024',
  overview = 'Rahmaniyya Estate I is a composed residential enclave shaped around privacy, security and an everyday relationship with landscape. Contemporary elevations and carefully scaled streets give each home an individual presence while maintaining a coherent community character.',
  challenge = 'The site needed to support a varied collection of homes and shared amenities without feeling repetitive, congested or disconnected from its landscaped setting.',
  solution = 'Homes are positioned to create comfortable setbacks, framed views and pockets of communal green. A consistent architectural language is varied through proportion, screening and material detail.',
  features = array['Contemporary residential architecture', 'Secure managed community', 'Private and shared landscape', 'Considered daylight and ventilation', 'Integrated parking and services'],
  gallery_images = array[image]
where name = 'Rahmaniyya Estate I';
