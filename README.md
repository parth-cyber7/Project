# CommerceCraft Monorepo

Production-ready full-stack eCommerce platform built with Turborepo and Domain Driven Design (DDD).

## Stack

- Backend: Node.js, TypeScript, Express, MongoDB (Mongoose), JWT, Bcrypt, Zod, Swagger, Winston
- Frontend: Next.js (App Router), Tailwind CSS, Zustand, Axios, Recharts
- DevOps: Docker, docker-compose, Render + MongoDB Atlas deployment, GitHub Actions CI

## Monorepo Structure

```text
.
├── apps
│   ├── backend
│   │   ├── src
│   │   │   ├── domain
│   │   │   │   ├── customer
│   │   │   │   ├── product
│   │   │   │   ├── order
│   │   │   │   └── admin
│   │   │   ├── application
│   │   │   │   └── use-cases
│   │   │   ├── infrastructure
│   │   │   │   ├── database
│   │   │   │   ├── repositories
│   │   │   │   ├── services
│   │   │   │   └── logging
│   │   │   ├── interfaces
│   │   │   │   └── http
│   │   │   │       ├── controllers
│   │   │   │       ├── middlewares
│   │   │   │       ├── routes
│   │   │   │       ├── validators
│   │   │   │       └── docs
│   │   │   └── shared
│   │   ├── tests
│   │   │   ├── unit
│   │   │   └── integration
│   │   └── scripts
│   └── frontend
│       ├── app
│       │   ├── admin
│       │   ├── products
│       │   ├── cart
│       │   ├── checkout
│       │   ├── orders
│       │   ├── login
│       │   └── register
│       ├── components
│       ├── stores
│       ├── lib
│       └── types
├── packages
│   └── shared
├── docs
│   ├── SETUP.md
│   └── DEPLOYMENT.md
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Key Features

- Customer registration/login, admin/customer login, JWT access/refresh tokens
- Role-based authorization for backend APIs and frontend routes
- Product CRUD with category, stock, search/filter, pagination, image upload
- Persistent cart, checkout, order placement, order status lifecycle
- Admin dashboard with revenue/orders/customers KPIs and charts
- Customer management with block/unblock + customer order history
- Stripe payment intent endpoint (sandbox), order confirmation email, Swagger docs, Winston logging

## Quick Start

See:

- `docs/SETUP.md` for local development
- `docs/DEPLOYMENT.md` for Render + Atlas no-local deployment (free-tier ready)
- `render.yaml` for one-click Render Blueprint deployment (no local setup required)
