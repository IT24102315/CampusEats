# CampusEats

Campus food menu application built for Labs 02, 04, 08, and 11. React/Vite frontend at the repository root; ASP.NET Core 8 API in backend/CampusEats.Api; PostgreSQL via EF Core.

## Implemented

- Feature-based menu components, reusable fetching/debounce hooks, search, dish details, routing and 404.
- Controlled order form with per-field validation. This is a lab demonstration: it does not persist or submit orders.
- Registration with BCrypt password hashing, login with JWT, and memory-only frontend session. Refresh signs out.
- Public GET /api/menu and GET /api/menu/{id}; Admin-only POST, PUT and DELETE menu endpoints.
- PostgreSQL schema and InitialCreate migration, five seeded dishes, unique normalized user email and decimal prices.
- Docker deployment, platform PORT binding, configurable CORS, and GitHub Actions frontend checks/backend build.

## Local setup: PostgreSQL first

1. In pgAdmin create an empty database named campuseats.
2. Copy backend.example.json to backend.local (already created locally). The .local file is ignored by Git.
3. Fill ConnectionStrings__Default in backend.local with your local connection details:
   Host=localhost;Port=5432;Database=campuseats;Username=postgres;Password=YOUR_LOCAL_PASSWORD
   Do not put actual passwords in README or chat. Escape JSON characters if your password contains quotes or backslashes.
4. Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-api.ps1 -Migrate
powershell -ExecutionPolicy Bypass -File scripts/start-api.ps1
```

The first command applies the migration and seeds the menu. The second starts the API on http://localhost:8080. The script generates a random development JWT key in memory; restarting invalidates existing tokens. /swagger is available in Development. /health checks process health, not database connectivity.

5. Copy .env.example to .env and set VITE_API_URL=http://localhost:8080.
6. Run npm install, then npm run dev. Open http://localhost:5173.

Without VITE_API_URL, the frontend explicitly uses the demo menu in public/menu.json. With it set, failed API requests display an error instead of silently showing demo data. Demo mode does not support accounts.

## Verify locally

```powershell
npm.cmd run build
npm.cmd run lint
node --test
npm.cmd audit
dotnet build backend/CampusEats.Api -c Release
```

After the database is configured, register a Customer and sign in. Test public menu reads, invalid credentials (401), duplicate registration (409), unauthenticated writes (401), and Customer writes (403). Promote your own test user in pgAdmin:

```sql
UPDATE "Users" SET "Role" = 'Admin' WHERE "Email" = 'YOUR_NORMALIZED_EMAIL';
```

Log in again for an Admin token. In Postman use Authorization: Bearer TOKEN to create a dish (201), update it (204), and delete it (204). Restart the API to verify persistence. Swagger has no Authorize button configured; use Postman for protected endpoints.

## Deploy frontend: Vercel

Your frontend URL: https://campus-eats-one-red.vercel.app

Keep root directory at the repository root, framework Vite, install npm install, build npm run build, output dist. vercel.json supplies the SPA rewrite for direct route loads. Set VITE_API_URL to the actual deployed HTTPS API base URL and redeploy. Vite embeds this value at build time.

## Deploy API: Render

Connect IT24102315/CampusEats, main branch. Choose Docker, Root Directory backend/CampusEats.Api and Dockerfile Path ./Dockerfile. Set:

| Variable | Value |
| --- | --- |
| FrontendOrigin | https://campus-eats-one-red.vercel.app |
| ConnectionStrings__Default | Managed PostgreSQL connection string |
| Jwt__Key | Strong random production key of at least 32 bytes |
| Jwt__Issuer | CampusEats |
| Jwt__Audience | CampusEatsUsers |
| ASPNETCORE_ENVIRONMENT | Production |

Render provides PORT. The API listens on 0.0.0.0 at that port, defaulting to 8080. Do not expose credentials in the browser. Production Swagger is disabled; test /health and /api/menu.

## Managed database: Neon

Create a PostgreSQL database, obtain its host/database/user/password and configure ConnectionStrings__Default on Render. Use the provider-required SSL settings; prefer certificate verification where supported (SSL Mode=VerifyFull). Never commit the real connection string.

Apply the existing migration to the cloud database before testing. In a private local terminal with the cloud environment variables set:

```powershell
dotnet run --no-launch-profile --project backend/CampusEats.Api -- --migrate
```

Alternatively run dotnet tool restore, then dotnet ef database update --project backend/CampusEats.Api. The command requires the connection string and Jwt__Key environment variables because the application validates configuration at startup. Do not run cloud migrations using your local database config by accident.

https://campuseats-api.hasaranga.com is usable only after you configure the custom domain and DNS on the backend host and HTTPS is active. Until then use the actual Render URL.

## CI, deployment and monitoring

.github/workflows/ci.yml checks frontend lint, order validation tests, production build, and backend compilation. A green workflow is not automatically a merge gate: configure GitHub branch protection to require these checks. Vercel/Render deployment triggers should also be configured deliberately if you want deployment to wait for CI.

Collect real screenshots of successful deployments, masked environment settings, frontend menu, API JSON, and runtime/build logs. Verify frontend requests reach the database-backed menu. Local build and process-health checks alone do not prove deployed database connectivity.

## Current verification limits

Frontend production build/lint and order validation tests pass. Backend builds/publishes and the initial migration is generated. Process health, local CORS preflight, unauthenticated-write rejection and registration validation were checked. Database migration application, registration/login persistence, role behavior with real users, and live cloud connectivity need database credentials and host configuration. No dashboard screenshots have been fabricated.
