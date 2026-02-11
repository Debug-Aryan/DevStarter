# DevStarter — Full-Stack TypeScript (React + Express + MongoDB)

A production-ready, beginner-friendly full-stack starter with:

- **Client**: React + Vite + TypeScript + Tailwind CSS
- **Server**: Node.js + Express + TypeScript
- **DB**: MongoDB (Mongoose)
- **Auth**: JWT (register, login, protected route example)

## Architecture (how it’s structured)

This template is organized to scale without being over-engineered:

- **Controllers** (`server/src/controllers`) handle HTTP only (request/response)
- **Services** (`server/src/services`) contain business logic
- **Models** (`server/src/models`) contain Mongoose schemas
- **Routes** (`server/src/routes`) only wire endpoints to controllers
- **Middlewares** (`server/src/middlewares`) handle auth/errors/not-found
- **Client features** (`client/src/features`) group UI + logic by domain
- **Client API** (`client/src/services/api.ts`) is the only place that performs network calls

## Folder structure

```
full-stack-ts/base/
  client/
    src/
      app/
        App.tsx
        router.tsx
      features/
        auth/
          components/
          pages/
          hooks/
          services/
      components/
        common/
      services/
        api.ts
      types/
        auth.ts
      styles/
        index.css
      main.tsx
    package.json
    tsconfig.json
    vite.config.ts
    tailwind.config.ts
    postcss.config.js
    .env.example
  server/
    src/
      config/
        db.ts
      controllers/
        authController.ts
        healthController.ts
      services/
        authService.ts
        userService.ts
      models/
        User.ts
      middlewares/
        authMiddleware.ts
        errorHandler.ts
        notFound.ts
      routes/
        authRoutes.ts
        healthRoutes.ts
        index.ts
      utils/
        generateToken.ts
        response.ts
      index.ts
    package.json
    tsconfig.json
    .env.example
  docker-compose.yml
  .env.example
```

## API response shape (shared contract)

Both client and server use the same response envelope:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
```

## Auth flow (JWT)

1. **Register**: `POST /api/auth/register` → creates user, returns JWT
2. **Login**: `POST /api/auth/login` → verifies password, returns JWT
3. **Protected route**: `GET /api/auth/me` requires `Authorization: Bearer <token>`
4. Client stores token in `localStorage` and sends it via the centralized API layer

## Health endpoint

`GET /api/health`

Returns:

```json
{
  "success": true,
  "message": "Server healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-02-11T12:34:56.000Z"
  }
}
```

## TypeScript configuration (strict)

- Client and server run with **strict mode enabled**
- `noImplicitAny` is enabled on both sides
- Express request is extended safely (no `any`) for `req.user`

## Environment setup

### Server (`server/.env`)

Copy `server/.env.example` → `server/.env` and set:

- `NODE_ENV`: `development` or `production`
- `PORT`: server port (default `5000`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret
- `JWT_EXPIRES_IN`: e.g. `15m`, `1h`, `7d`
- `CLIENT_URL`: allowed origin for CORS

### Client (`client/.env`)

Copy `client/.env.example` → `client/.env`.

- `VITE_API_URL` (optional): set to your server base URL **including** `/api`
  - If omitted, the client uses `/api` (works in dev via Vite proxy)

## Run locally (development)

### 1) Start the server

```bash
cd server
npm install
npm run dev
```

### 2) Start the client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`.
Server runs on `http://localhost:5000`.

## Docker (local stack)

From `full-stack-ts/base/`:

1. Copy `.env.example` → `.env` and set `JWT_SECRET`.
2. Run:

```bash
docker compose up --build
```

- Client: `http://localhost:3000`
- Server: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Deployment guide

### Render

**Server (Web Service)**

- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV=production`, `PORT` (Render sets PORT automatically)

**Client (Static Site)**

- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- (Optional) Set `VITE_API_URL` at build time to `https://<your-server>/api`

### Docker

- Server image: [server/Dockerfile](server/Dockerfile)
- Client image: [client/Dockerfile](client/Dockerfile)

## DevStarter “features” folder (important)

The folder `full-stack-ts/features/` contains **DevStarter internal blueprints**.

- These folders are **not meant to be run directly**.
- DevStarter injects selected features into `full-stack-ts/base/` when generating a project.
