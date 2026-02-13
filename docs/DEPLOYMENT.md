# Deployment Guide (Render-Only, No Local Runtime)

This repository is configured so backend + frontend deploy from Render Blueprint on free-tier plans with no local Node/Docker required.

## What Is Already Automated In Repo

1. `render.yaml` provisions two Render web services:
   - `commercecraft-backend`
   - `commercecraft-frontend`
   - both use `plan: free`
2. Backend build/start commands are preconfigured for this monorepo.
3. Frontend build/start commands are preconfigured for this monorepo.
4. Frontend talks to backend through a public URL proxy (`/api` rewrite) using backend `RENDER_EXTERNAL_URL`, so you do not need to manually wire frontend API URL.
5. Backend `CORS_ORIGIN` is auto-linked from frontend `RENDER_EXTERNAL_URL`.
6. Backend seed runs on service start via start command chaining (`seed && start`) because `preDeployCommand` is not available on free tier.
7. Node runtime is pinned via `.node-version`.

## Manual Steps Only (Things That Cannot Be Done From This Workspace)

1. Push this repository to a Git provider Render can access (GitHub/GitLab).
2. Create a MongoDB Atlas cluster and copy its connection string.
3. In Render dashboard:
   - New -> Blueprint
   - Select this repository
   - Apply `render.yaml`
4. In the backend service environment variables, set:
   - `MONGODB_URI` (Atlas connection string)
5. (Optional, only if you enable these features) set backend env vars:
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
6. Click deploy.

## Result

After deploy completes:

- Frontend URL serves the application.
- Backend is reachable via frontend `/api` proxy and directly on its Render URL.
- Seed data is applied automatically during backend service start.
- API docs are available at `<backend-url>/api/docs`.

## Free Tier Notes

1. Free web services may spin down when idle, so first request after idle can be slow.
2. Keep using Atlas free/shared cluster if you want fully free infrastructure.
