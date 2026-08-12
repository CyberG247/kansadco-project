# KANSADCO Web Platform

The public website and content workspace for KANSADCO Engineering Nigeria Limited.

## Stack

- React 18 and TypeScript
- Vite
- React Router
- Tailwind CSS and Radix UI
- Framer Motion

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

## Public routes

- `/`
- `/about`
- `/services`
- `/projects`
- `/team`
- `/gallery`
- `/contact`
- `/book-tour`

The `/admin` workspace is deliberately excluded from the sitemap and search indexing. Content currently persists in browser storage; a shared production workspace requires an authenticated API and database.
