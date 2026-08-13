-- Align public company and leadership details with the approved 2026 company profile.

update public.site_settings
set
  display_name = 'Kansadco Services Nigerian Limited',
  kano_address = 'No. 28 Lamido Road, Nasarawa GRA, Kano, Nigeria'
where id = 1;

update public.team_members
set
  name = 'Arch. Yunusa Ibrahim Hassan, MNIA',
  role = 'Founder & Chief Executive Officer',
  discipline = 'Architecture · Leadership',
  bio = 'He established KANSADCO in 2018 around a commitment to vision, responsibility, professionalism and excellence—transforming client aspirations into purposeful spaces and lasting relationships.'
where featured is true
  and sort_order = 1
  and name in ('Arc. Yunusa Hassan Ibrahim', 'Arch. Yunusa Ibrahim Hassan, MNIA');
