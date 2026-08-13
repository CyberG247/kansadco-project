# Supabase setup

The application uses Supabase Auth, Postgres, Row Level Security and Storage. The browser receives only the project URL and publishable key; authorization is enforced by database policies.

## 1. Install the schema

The preferred setup is the linked Supabase CLI:

```sh
supabase link --project-ref your-project-ref
supabase db push
```

Alternatively, run every SQL file in `supabase/migrations` in filename order through **SQL Editor → New query**. The migrations create:

- administrator profiles and role checks;
- projects, gallery assets, team members, enquiries, enquiry reply history, site settings and activity tables;
- editable project case studies with public slugs, detailed narratives, key features and image galleries;
- public-read/admin-write RLS policies;
- automatic activity logging and timestamps;
- a public `site-media` bucket with administrator-only writes.

The transactional-mail migration also creates delivery tracking and rate limiting for public enquiries. Public forms are submitted through a server-side Edge Function instead of writing directly from the browser.

## 2. Create the first administrator

In **Authentication → Users**, create the first email/password user. Then run:

```sql
update public.profiles
set role = 'admin', full_name = 'Administrator Name'
where email = 'administrator@example.com';
```

New accounts deliberately receive the `viewer` role and cannot enter the workspace until promoted to `admin` or `editor`.

For a private staff-only workspace, disable public email sign-ups in **Authentication → Providers → Email**. Accounts can still be created from the Supabase dashboard.

## 3. Configure Auth URLs

In **Authentication → URL Configuration**:

- set the Site URL to the production domain;
- add `https://your-domain.com/admin` as a redirect URL;
- add `http://localhost:8080/admin` for local password-recovery testing.

## 4. Configure environments

The local `.env` file is intentionally ignored by Git. In Vercel, add both variables under **Project Settings → Environment Variables** for Production, Preview and Development:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Redeploy after saving them. Vite is configured to expose the `NEXT_PUBLIC_` prefix to this browser application.

## 5. Configure Brevo transactional mail

Brevo is used in two separate places so credentials never enter the browser bundle.

### Website enquiries

Create a **Brevo API key** under **SMTP & API → API Keys**, then install the Edge Function secrets and deploy both functions:

```sh
supabase secrets set \
  BREVO_API_KEY='xkeysib-your-api-key' \
  BREVO_SENDER_EMAIL='info@kansadco.com' \
  BREVO_SENDER_NAME='Kansadco' \
  BREVO_NOTIFICATION_EMAIL='kansadco@gmail.com' \
  ENQUIRY_RATE_LIMIT_SALT='a-long-random-value'

supabase functions deploy submit-enquiry --no-verify-jwt --use-api
supabase functions deploy retry-enquiry-email --use-api
supabase functions deploy reply-enquiry --use-api
```

`BREVO_NOTIFICATION_EMAIL` is the internal inbox that receives new enquiries. If omitted, the function uses the Primary email in Admin → Settings. The public form receives a generic success response even when Brevo is temporarily unavailable because the enquiry is already safely stored. Administrators receive live inbox updates, can retry a failed receipt, and can send tracked Brevo replies directly from the enquiry drawer.

### Supabase Auth messages

In **Supabase → Authentication → SMTP Settings**, enable custom SMTP and enter:

```text
Sender name: Kansadco
Sender email: info@kansadco.com
Host: smtp-relay.brevo.com
Port: 587
Username: b35395001@smtp-brevo.com
Password: your Brevo SMTP key
```

The SMTP key is generated under **Brevo → SMTP & API → SMTP**. It is different from both the Brevo account password and the API key used by the Edge Functions. Configure the production Site URL and redirect allow-list before testing password recovery.

For reliable delivery, authenticate `kansadco.com` in Brevo and publish the DKIM/DMARC records Brevo provides.

## First authenticated load

On the first approved administrator session, the application migrates the bundled portfolio—or compatible data from the previous local browser store—into Postgres and marks the workspace initialized. Subsequent reads and writes are database-backed across devices.
