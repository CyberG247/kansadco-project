# KANSADCO Web Platform

The public website and content workspace for KANSADCO Engineering Nigeria Limited.

## Stack

- React 18 and TypeScript
- Vite
- React Router
- Tailwind CSS and Radix UI
- Framer Motion
- Supabase Auth, Postgres, Storage and Edge Functions
- Brevo transactional mail

## Local development

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:8080`.

## Production

```sh
npm run build
npm run preview
```

The production output is generated in `dist/`. The application uses client-side routing, so the hosting platform must rewrite unknown document requests to `index.html`.

### Vercel

Import the GitHub repository into Vercel and select the Vite framework preset. The committed `vercel.json` defines the build output, SPA deep-link fallback, immutable asset caching and baseline security headers.

## Public routes

- `/`
- `/about`
- `/services`
- `/projects`
- `/team`
- `/gallery`
- `/contact`
- `/book-tour`

The `/admin` workspace is deliberately excluded from the sitemap and search indexing. Its content is synchronized through the configured Supabase project.

## Authentication and content database

The admin workspace uses Supabase Auth, Postgres Row Level Security and Storage. Public projects and gallery records are readable without a session, enquiry forms pass through a rate-limited Edge Function, and content writes require an approved `admin` or `editor` profile. Brevo sends internal enquiry notifications, visitor confirmations and Supabase Auth recovery mail.

Follow [supabase/README.md](supabase/README.md) to install the schema, create the first administrator, connect Brevo and configure Vercel.
