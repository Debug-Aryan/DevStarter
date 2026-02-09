# DevStarter — Node.js + Express API (Backend Only)

This project is a **production-ready API-only** starter built with **Node.js + Express**, **MongoDB (Mongoose)**, and **JWT authentication**.

There is **no frontend** in this template. It’s meant to be used as a backend for web/mobile apps.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Auth (HttpOnly cookie preferred, Bearer token supported)
- Helmet + CORS

## Folder Structure

```txt
src/
  config/
    db.js
    logger.js
  controllers/
    authController.js
    healthController.js
  services/
    authService.js
    userService.js
  models/
    User.js
  middlewares/
    authMiddleware.js
    errorHandler.js
    notFound.js
  routes/
    authRoutes.js
    healthRoutes.js
    index.js
  utils/
    response.js
    generateToken.js
  app.js
server.js
.env.example
```

## Unified API Response Format

Every endpoint returns:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

## Local Setup

1) Install dependencies

```bash
npm install
```

2) Create your `.env`

```bash
cp .env.example .env
```

3) Update `.env` values (MongoDB + JWT settings)

4) Run the API

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Auth Flow (JWT)

- `POST /api/auth/register` creates a user and issues a JWT
- `POST /api/auth/login` issues a JWT
- JWT is stored in an **HttpOnly cookie** named `token` (recommended)
- You can also send `Authorization: Bearer <token>` if you prefer header auth

### Protected Route Example

- `GET /api/auth/me` requires authentication.

## API Routes

- `GET /api/health` — health check
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/auth/me` — protected route (returns the current user)

## Environment Variables

See `.env.example` for full documentation.

## Deployment

### Render / Railway

- Build command: `npm install`
- Start command: `npm start`
- Set environment variables from `.env.example` in the platform dashboard

### Docker

This repo is designed to work well with container deployment. In DevStarter, the optional **docker** feature blueprint can inject a Dockerfile and compose setup into this base template.

## DevStarter Features Folder

If you see `server/templates/node-express/features/`, those are **internal DevStarter blueprints**.
They are not meant to be run directly — DevStarter injects selected features into `base/` when generating a project.
