# Task 03 — Backend deployment (documented option)

## Status

Backend deployment is not completed. This repository contains a React/Vite starter and an API request helper, but no ASP.NET Core project, menu controller, PostgreSQL integration, or JWT implementation. These files are deployment templates, not a working backend. No live API response or deployment dashboard screenshot has been verified.

## Prepare the API

1. Obtain the actual CampusEats ASP.NET Core 8 API and add it under `backend/CampusEats.Api/` in this repository (or use a separate backend repository).
2. Copy the Dockerfile and .dockerignore from this folder into the API project root, alongside CampusEats.Api.csproj. Adjust the project filename and entrypoint if the actual assembly has a different name. Do not use this documentation folder or the React root as the Docker build context.
3. Merge Program.cs.example into the real Program.cs, retaining existing database registrations, authentication, controllers, and endpoints. The example allows the exact frontend origin via CORS and binds to 0.0.0.0 using PORT, falling back to 8080.
4. Read the database connection string through `builder.Configuration.GetConnectionString("Default")` and the JWT key through `builder.Configuration["Jwt:Key"]`. Register the database provider and JWT validation with those values; merely reading configuration does not implement them.
5. Build the API with `dotnet publish -c Release`. Optionally build and run its Docker image to verify the public /api/menu endpoint before pushing. Never commit actual credentials.

## Deploy on Render

1. Commit and push the prepared API to GitHub.
2. In Render choose New → Web Service and connect the GitHub repository and main branch.
3. Choose Docker runtime. For the suggested monorepo layout, set Root Directory to `backend/CampusEats.Api` and Dockerfile Path to `./Dockerfile`, with the API folder as the build context. Choose a service plan deliberately; do not enable an unwanted paid plan.
4. Add these environment variables in the service Environment settings:

| Variable | Value |
| --- | --- |
| FrontendOrigin | Actual deployed frontend origin, e.g. https://campuseats-web.vercel.app, with no path or trailing slash |
| ConnectionStrings__Default | Real PostgreSQL connection string from Task 04 |
| Jwt__Key | Strong randomly generated private signing key |
| ASPNETCORE_ENVIRONMENT | Production |

Render supplies PORT. The Program.cs example honors it. The Dockerfile alone defaults to port 8080. Keep secrets on Render, never in VITE_ variables.

5. Create the service and wait for a successful build and deploy. Check logs for the listening address and any missing configuration.
6. Open `https://<actual-service>.onrender.com/api/menu` and confirm a successful JSON response from the real menu controller. Use /swagger only if Swagger is explicitly enabled in production.
7. Set the frontend host's VITE_API_URL to the actual backend HTTPS base URL and redeploy the frontend. Test requests from the actual frontend origin to confirm CORS works.

## Custom domain

`https://campuseats-api.hasaranga.com` can be the frontend's VITE_API_URL only after that hostname is configured on the backend host, the instructed DNS records are installed, and HTTPS is active. A chosen URL by itself does not create or deploy an API.

## Evidence to collect after deployment

- Render service dashboard showing the service URL.
- Successful build/deployment status.
- Browser response from /api/menu with the URL visible.
- Frontend request succeeding without CORS errors.

These screenshots are pending; templates are the deliverable for the documented option.

## Official references

- [Render Docker deployment](https://render.com/docs/docker)
- [Render web services and port binding](https://render.com/docs/web-services)
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-8.0)
