# Local Setup Guide

## Prerequisites

1. Node.js 22+ (latest LTS)
2. pnpm 9+
3. Docker + Docker Compose (optional)
4. MongoDB local or MongoDB Atlas URI

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment variables

Copy `.env.example` into `.env` and provide values:

```bash
cp .env.example .env
```

At minimum, set these securely:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## 3. Build shared package

```bash
pnpm --filter @ecom/shared build
```

## 4. Seed database (creates admin + sample products)

```bash
pnpm seed
```

Seeded admin credentials:

- Email: `admin@ecom.local`
- Password: `Admin@12345`

Change this password immediately in production.

## 5. Start development servers

```bash
pnpm dev
```

Apps:

- Backend: `http://localhost:5000`
- API docs: `http://localhost:5000/api/docs`
- Frontend: `http://localhost:3000`

## 6. Run tests

```bash
pnpm test
```

## Docker local setup

```bash
docker compose up --build
```

Run seed after backend is up:

```bash
pnpm seed
```
