# DevStarter Flask Backend (Template)

A clean, production-ready Flask backend starter used by **DevStarter**.

It includes:
- Application factory pattern (`create_app()`)
- Modular structure with Blueprints
- SQLite by default (configurable via `DATABASE_URL`)
- JWT authentication (register/login + protected route)
- Centralized error handling
- Deploy-ready setup for Docker and Render

## Folder Structure

This template lives under **DevStarter** at:

```
flask/base

app/
 ┣ __init__.py
 ┣ config.py
 ┣ extensions.py
 ┣ models/
 ┃ ┗ user.py
 ┣ routes/
 ┃ ┣ auth.py
 ┃ ┗ health.py
 ┣ services/
 ┃ ┣ auth_service.py
 ┃ ┗ user_service.py
 ┗ utils/
   ┗ response.py

run.py
requirements.txt
.env.example
Dockerfile
render.yaml
```

## Architecture (Beginner-Friendly)

- **Routes** (`app/routes/*`): HTTP layer only (request/response)
- **Services** (`app/services/*`): business logic (register/login, user creation)
- **Models** (`app/models/*`): database tables (SQLAlchemy)
- **Utils** (`app/utils/*`): shared helpers (JSON response + API errors)

The app is created by an **application factory** in `app/__init__.py`:
- `create_app()` loads env vars, config, extensions, registers blueprints, and sets up error handling.

## API Endpoints

### Health (mandatory)

`GET /api/health`

Response:

```json
{
  "success": true,
  "message": "Server healthy",
  "data": {
    "status": "ok",
    "timestamp": "<ISO string>"
  }
}
```

### Auth (JWT)

- `POST /api/auth/register` → creates a user + returns `access_token`
- `POST /api/auth/login` → returns `access_token`
- `GET /api/auth/me` → protected route example (`Authorization: Bearer <token>`)

## Environment Setup

1) Create your environment file:

- Copy `.env.example` to `.env`
- Fill in:
  - `SECRET_KEY`
  - `JWT_SECRET_KEY`
  - (Optional) `DATABASE_URL`

Tip: use secrets of at least 32 characters.

2) Install dependencies:

```bash
pip install -r requirements.txt
```

3) Run locally:

```bash
python run.py
```

The API will start on `http://localhost:5000`.

## Database (SQLite by Default)

- If `DATABASE_URL` is empty, the app uses a local SQLite file: `app.db`
- The template auto-creates tables on startup using `db.create_all()`

To use a different database, set `DATABASE_URL` to a valid SQLAlchemy URI.

## Auth Flow (How JWT Works)

1) Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

2) Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3) Access protected route:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Deployment

### Render

This template includes `render.yaml`.

- Build command: `pip install -r requirements.txt`
- Start command (required): `gunicorn run:app`
- Set environment variables in Render:
  - `SECRET_KEY`
  - `JWT_SECRET_KEY`
  - `DATABASE_URL` (optional)
  - `CORS_ORIGINS` (optional)

### Docker

Build and run:

```bash
docker build -t devstarter-flask .
docker run -p 5000:5000 --env-file .env devstarter-flask
```

## DevStarter Features Folder (Important)

In the DevStarter repository, the folder:

- `flask/features/`

contains **DevStarter internal feature blueprints**.

These feature folders are **NOT meant to be run directly**.
DevStarter injects selected features into `flask/base/` when generating a new project.
