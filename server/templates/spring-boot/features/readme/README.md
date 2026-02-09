# DevStarter — Spring Boot Backend Template

A production-minded Spring Boot (Java 17) backend starter designed for **DevStarter** projects.

It ships with:
- Layered architecture (Controller → Service → Repository)
- JWT authentication (register / login)
- BCrypt password hashing
- A mandatory health endpoint for uptime checks
- Docker + Render deployment files

## Architecture (beginner-friendly)

This project follows a simple layered structure:
- **Controller**: HTTP layer (routes). It should only validate input and call services.
- **Service**: Business logic (authentication, rules).
- **Repository**: Database access (Spring Data JPA). No business logic here.
- **Model**: JPA entities (database tables).
- **Security/Config**: All authentication + Spring Security setup.

## Folder structure

Main code is under `src/main/java/com/devstarter/app/`:

- `controller/`
  - `AuthController.java` — `/api/auth/register`, `/api/auth/login`
  - `HealthController.java` — `/api/health` (public), `/api/health/secure` (JWT-protected)
- `service/`
  - `AuthService.java` — register/login business logic
  - `UserService.java` — user lookup & user creation
- `repository/`
  - `UserRepository.java` — JPA repository
- `model/`
  - `User.java` — JPA entity
- `security/`
  - `JwtTokenProvider.java` — token creation/validation
  - `JwtAuthenticationFilter.java` — reads `Authorization: Bearer <token>`
- `config/`
  - `SecurityConfig.java` — Spring Security rules + CORS
- `DevStarterApplication.java` — app entry point

## API endpoints

### Health (public)
- `GET /api/health`

Response:
```json
{
  "success": true,
  "message": "Server healthy",
  "data": {
    "status": "ok",
    "timestamp": "2026-02-09T12:34:56.789Z"
  }
}
```

### Auth (public)
- `POST /api/auth/register`
- `POST /api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

Response contains a JWT:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "<jwt>"
  }
}
```

### Protected example
- `GET /api/health/secure`

Call with:
- `Authorization: Bearer <jwt>`

## Environment setup

This template reads configuration from environment variables.

- See `.env.example` for the full list.
- Spring Boot automatically reads env vars (no extra library needed).

### JWT secret (important)
Provide `JWT_SECRET` in production.

If `JWT_SECRET` is **not** provided, the app generates a random secret at startup so a fresh clone can run immediately.
That means tokens will become invalid when the app restarts.

## Database configuration

By default (no `DATABASE_URL`), the app uses **in-memory H2** so you can start quickly.

For Postgres:
- Set `DATABASE_URL` to a **JDBC URL**, for example:
  - `jdbc:postgresql://localhost:5432/devstarter`
- Set `DB_USERNAME` and `DB_PASSWORD`

JPA setting:
- `spring.jpa.hibernate.ddl-auto` defaults to `update` (good for learning). For production, consider migrations.

## Run locally

### Prerequisites
- Java 17+
- Maven

### Build
```bash
mvn clean package
```

### Run
```bash
java -jar target/app.jar
```

## Deployment

### Docker
Build and run:
```bash
docker build -t devstarter-spring .
docker run -p 8080:8080 \
  -e JWT_SECRET="your-secret" \
  devstarter-spring
```

### Render
This template includes `render.yaml`.
- Render sets a `PORT` environment variable automatically.
- The template uses `server.port=${PORT:${SERVER_PORT:8080}}` so it works on Render and locally.

## DevStarter features (important)

In this DevStarter repo, `server/templates/spring-boot/features/` contains **feature blueprints**.
They are not meant to be run directly — DevStarter injects selected features into `base/` when generating a project.
