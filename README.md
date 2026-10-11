# CampusEats

React/Vite frontend for the CampusEats deployment lab.

The repository currently contains the frontend starter. The ASP.NET Core backend and database are not yet included or connected. src/api.js provides getMenu() for the future /api/menu endpoint using import.meta.env.VITE_API_URL. The starter UI does not yet call it.

## Task 01: local preparation

Run from the repository root:

```sh
npm install
```

Copy .env.example to .env and set VITE_API_URL to your API base URL, without /api/menu. Then run:

```sh
npm run dev
npm run build
npm run preview
```

The production build goes to dist/. Preview serves the production build locally. Vite reads frontend environment variables at build time; rebuild after changing VITE_API_URL.

## Required environment variables

| Tier | Variable | Value |
| --- | --- | --- |
| Frontend: Vercel or Netlify | VITE_API_URL | Public base URL of the deployed API |
| Backend: Render or Railway | ConnectionStrings__Default | PostgreSQL connection string with database credentials |
| Backend: Render or Railway | Jwt__Key | Strong randomly generated JWT signing secret |

Set real secrets in the backend hosting environment settings. VITE_ variables are public in the browser bundle; never put database credentials or JWT secrets in them. The managed database provider supplies the connection details used by the backend.

.gitignore excludes node_modules, dist, .env and its variants (except the blank .env.example), and .NET bin and obj directories.

## Deployment wiring

Browser ? React frontend ? ASP.NET Core API ? PostgreSQL.

Configure VITE_API_URL before the frontend build. Configure ConnectionStrings__Default and Jwt__Key on the backend host. Backend implementation, database setup, and deployment are later tasks.
