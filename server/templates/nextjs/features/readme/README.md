# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

This is a production-ready **Next.js App Router** starter with **Tailwind CSS** and **NextAuth (Auth.js)** credentials auth.

## Tech stack

- Next.js (App Router)
- Tailwind CSS
- NextAuth (Credentials provider, JWT sessions)
- Postgres (via `pg`) for storing users

## Folder structure

```
app/
  api/
    auth/
      [...nextauth]/route.js
      register/route.js
    health/route.js
  (auth)/
    signin/page.jsx
    register/page.jsx
  (dashboard)/
    dashboard/page.jsx
  layout.jsx
  page.jsx
  providers.jsx

components/
  common/
    Loader.jsx
    ErrorMessage.jsx
  layout/
    Navbar.jsx

lib/
  auth.js
  api.js

features/
  README.md
  auth/
    components/
    services/
    hooks/
```

### App Router (quick explanation)

- `app/layout.jsx` is the root layout for every route.
- Route groups like `app/(auth)` and `app/(dashboard)` help organize code **without changing the URL**.
  - `app/(auth)/signin/page.jsx` → `/signin`
  - `app/(dashboard)/dashboard/page.jsx` → `/dashboard`

## Authentication (NextAuth)

### How it works

- The NextAuth handler lives at `app/api/auth/[...nextauth]/route.js`.
- We use the **Credentials** provider (email + password).
- Sessions use the **JWT** strategy (recommended for serverless deployments).
- Cookies are HttpOnly by default (managed by NextAuth).

### Protected routes

The dashboard uses a server-side session check:

- If you are not signed in, `/dashboard` redirects to `/signin`.

## Environment setup

1) Copy the example env:

```bash
cp .env.example .env.local
```

2) Fill in:

- `NEXTAUTH_URL` (local: `http://localhost:3000`)
- `NEXTAUTH_SECRET` (generate one with `openssl rand -base64 32`)
- `DATABASE_URL` (Postgres connection string)

## Database setup (users table)

This starter expects a `users` table.

Run this SQL in your Postgres database:

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Health check API

`GET /api/health` returns:

```json
{
  "success": true,
  "message": "Server healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-02-08T00:00:00.000Z"
  }
}
```

## Vercel deployment notes

- Set `NEXTAUTH_URL` to your deployed URL (e.g. `https://your-app.vercel.app`).
- Set `NEXTAUTH_SECRET` to a strong secret.
- Set `DATABASE_URL` to your hosted Postgres connection string.
- The starter uses JWT sessions which work well on Vercel.

## DevStarter features (internal)

The `features/` folder contains **DevStarter blueprint modules**:

- They are not executed directly.
- DevStarter uses them to inject feature code when generating projects.

## Included features

__FEATURES_LIST__
