# DevStarter Django (Base Template)

This is the **Django backend base template** used by DevStarter.
It is designed to be:

- Production-ready (Render / Docker)
- Beginner-friendly (simple structure, clear defaults)
- Auth-capable (Django built-in auth)
- Tailwind-styled (no unstyled pages)

## Architecture (Plain Django, no DRF)

- **Django templates (HTML)** for pages
- **Django built-in auth** for login/register/logout
- **Whitenoise** for static files in production
- **`DATABASE_URL` support** for Postgres on deployment

## Folder structure

```
base/
  core/                 # Project config (settings/urls/asgi/wsgi)
  main/                 # Main app (views, urls, templates, static)
    templates/
      base.html
      main/
        home.html
        dashboard.html
      registration/
        login.html
        register.html
    static/
      css/
        style.css
  manage.py
  requirements.txt
  .env.example
  Procfile
  render.yaml
  Dockerfile
  docker-compose.yml
```

## Run locally

1) Create a virtualenv and install deps:

```bash
pip install -r requirements.txt
```

2) (Optional) Create a `.env` file:

- Copy `.env.example` to `.env`
- Keep `DEBUG=True` for local development

3) Run migrations (required for auth):

```bash
python manage.py migrate
```

4) Start the dev server:

```bash
python manage.py runserver
```

Open: `http://127.0.0.1:8000/`

## Auth flow (built-in Django auth)

Routes:

- `GET /accounts/login/` → login
- `GET /accounts/register/` → register
- `POST /accounts/logout/` → logout
- `GET /dashboard/` → protected page (requires login)

Implementation:

- Login/Logout: Django’s built-in auth views
- Register: `UserCreationForm` (password hashing handled by Django)
- Protected pages: `LoginRequiredMixin`

## Tailwind CSS integration

Tailwind must be available at:

- `main/static/css/style.css`

For a **fresh clone that runs instantly**, this template uses a **precompiled Tailwind CSS import** in that file.
All pages are styled using Tailwind utility classes and the shared layout in `base.html`.

## Environment variables

See `.env.example`:

- `DEBUG` – debug mode
- `SECRET_KEY` – Django secret key (required in production)
- `ALLOWED_HOSTS` – comma-separated hostnames
- `DATABASE_URL` – optional; if set, used for Postgres/etc

## Deployment

### Render

- Use `render.yaml` or create a new Render Web Service.
- Ensure env vars are set:
  - `DEBUG=False`
  - `SECRET_KEY` (Render can generate this)
  - `ALLOWED_HOSTS=.onrender.com` (or your custom domain)
  - `DATABASE_URL` (if you attach a Postgres database)

### Docker

Build + run:

```bash
docker compose up --build
```

For production Docker images, prefer:

- `python manage.py migrate`
- `python manage.py collectstatic --noinput`
- Run via `gunicorn`

## DevStarter features (important)

The folders under `server/templates/django/features/` are **DevStarter internal blueprints**.
They are **not meant to be run directly**.
DevStarter injects selected feature folders into `base/` when generating a new project.
