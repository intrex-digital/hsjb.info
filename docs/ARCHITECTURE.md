# Architecture

## Overview
A two-part application: a Next.js single page frontend and a Django REST backend, with Cloudflare R2 for media and a SQL database behind the backend. The frontend never talks to the database or storage directly for data; it goes through the Django API.

## Frontend
Next.js (App Router) + React + TypeScript

## Styling & UI
- Tailwind CSS with design tokens for the brand colors (#215C5C, #CCE8C9)
- Shadcn UI / Radix UI for accessible components
- Framer Motion for animations (GSAP only if a section needs timeline-style effects)

## Backend
Django + Django REST Framework (RESTful JSON APIs)
- Django Channels (ASGI, WebSockets) for live web chat

## Database
Cloudflare D1 (SQLite), as chosen. See **Open Decision** below: D1 is not directly compatible with Django's ORM, so the database layer must be confirmed before backend work starts.

## Media Storage
Cloudflare R2 (S3-compatible), accessed from Django via `django-storages` / `boto3`. Uploads use presigned URLs so files go straight from the browser to R2.

## Authentication
- Public visitors: no login
- Owner/admin: Django authentication, issuing a JWT stored in an httpOnly, secure cookie
- Admin authorization is always verified on the Django side, never trusted from the frontend

## Deployment
| Part | Target |
|---|---|
| Next.js frontend | Cloudflare Pages / Workers (or Vercel) |
| Django API + Channels | Container or VM host (Render, Fly.io, Railway, or a VPS) |
| Media | Cloudflare R2 |
| Chat channel layer | Redis (required by Channels in production) |

## Open Decision: Django and D1
Django cannot run on Cloudflare Workers, and D1 is reachable only from Workers or through Cloudflare's REST API. Django has no built-in D1 backend, so its ORM and migrations would not work against D1 as they do against a normal database.

Options:
1. **Keep D1**: Django hosted elsewhere, calling D1 through the REST API via a custom database layer. Slower, higher latency, and more custom code to maintain.
2. **Keep D1, drop Django**: use Cloudflare Workers with Hono/Next.js route handlers and D1 bindings. Everything runs on Cloudflare.
3. **Keep Django, change the database**: Postgres (or SQLite on the Django host). Simplest and best supported. R2 stays for media.

Recommendation: option 3 if Django is a firm requirement, option 2 if D1 is. This document assumes the database is isolated behind Django models and the service layer, so the choice does not change the frontend or API contract.

## High-Level Flow

```
Visitor / Owner
      ↓
Next.js UI (React components)
      ↓
Frontend API client (typed fetch wrappers)
      ↓
Django REST API  ←→  Django Channels (WebSocket chat)
      ↓
Service layer (business logic)
      ↓
Database (D1 / chosen SQL DB)          Cloudflare R2 (media)
```

### Key Flows
- **Content sections**: Next.js fetches section data (skills, resume entries, services, blog) from the API, server-rendered or cached for speed and SEO.
- **Contact form**: form → validated client-side → `POST /api/contact/` → validated again on the server → saved and emailed to the owner.
- **Live chat**: visitor opens WebSocket → Channels consumer stores messages and pushes them to the owner's admin view; owner replies over the same channel.
- **Media upload**: admin requests presigned URL from Django → uploads directly to R2 → saves the resulting URL on the record.
- **Admin edits**: authenticated requests to protected endpoints; changes appear on the site without a redeploy (cache revalidation on write).

## API Design
Versioned REST under `/api/v1/`:

| Resource | Endpoints |
|---|---|
| Profile / About | `GET /profile/`, `PUT /profile/` (admin) |
| Skills | `/skills/` |
| Education, Training, Certifications | `/education/`, `/trainings/`, `/certifications/` |
| Industrial Projects | `/projects/` |
| Industrial Training Projects | `/training-projects/` |
| Blog | `/posts/`, `/posts/{slug}/`, `/categories/` |
| Services | `/services/` |
| Contact | `POST /contact/`, `GET /contact/` (admin) |
| Chat | `/chat/rooms/`, WebSocket `/ws/chat/{room}/` |
| Media | `POST /media/presign/` (admin) |
| Auth | `POST /auth/login/`, `POST /auth/logout/`, `GET /auth/me/` |

Read endpoints are public; write endpoints require admin auth.

## Folder Structure

Monorepo with two apps:

```
portfolio/
├── frontend/                     # Next.js app
│   └── src/
│       ├── app/                  # routes, layouts, page composition
│       │   ├── (public)/         # single page sections, blog/[slug]
│       │   └── admin/            # admin dashboard routes
│       ├── components/           # reusable UI (ui/, layout/, shared/)
│       ├── features/             # one folder per section
│       │   ├── hero/
│       │   ├── about/
│       │   ├── skills/
│       │   ├── resume/
│       │   ├── blog/
│       │   ├── services/
│       │   ├── contact/
│       │   └── chat/
│       ├── services/             # API client calls (no UI)
│       ├── hooks/                # shared React hooks
│       ├── lib/                  # config, fetch wrapper, constants
│       ├── types/                # shared TypeScript types
│       └── utils/                # pure helper functions
│
├── backend/                      # Django project
│   ├── config/                   # settings, urls, asgi/wsgi
│   └── apps/
│       ├── profiles/             # about, hero
│       ├── skills/
│       ├── resume/               # education, training, certifications, projects
│       ├── blog/
│       ├── services/
│       ├── contact/
│       ├── chat/                 # consumers, routing, models
│       ├── media/                # R2 presigning
│       └── accounts/             # admin auth
│           # each app: models.py, serializers.py, views.py,
│           # services.py, urls.py, tests/
│
├── PRD.md
└── ARCHITECTURE.md
```

## Architectural Rules

**Frontend**
- UI components must not contain API calls or business logic; they receive data via props or hooks.
- All API communication goes through `services/`, using typed request and response objects.
- Each section lives in its own `features/` folder and owns its components, hooks and types.
- Reusable UI belongs in `components/`; section-specific UI stays in its feature.
- Server Components by default; use `"use client"` only for interactivity (animation, chat, forms).
- No hard-coded content; all section data comes from the API.
- Brand colors are defined once as Tailwind theme tokens, never as inline hex values.

**Backend**
- Views only handle HTTP (parse, call a service, return a response); business logic goes in `services.py`.
- Database access happens only through models and services, never in views or serializers.
- Every input is validated with serializers on the server, regardless of frontend validation.
- Admin authorization is enforced server-side on every write endpoint.
- Secrets (R2 keys, DB credentials, JWT secret) live in environment variables, never in the repo.
- Contact and chat endpoints are rate limited and spam protected.

**General**
- Frontend and backend share only the API contract; neither reaches into the other's internals.
- Media is never stored on the application server; it goes to R2.
- Type everything: TypeScript on the frontend, type hints on the backend.
- Every endpoint and critical feature has tests before merging.
