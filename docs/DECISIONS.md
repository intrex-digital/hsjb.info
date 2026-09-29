# Architecture Decisions

This file records important technical decisions so they are not changed randomly later. To change a decision, add a new ADR that supersedes the old one; do not edit or silently ignore existing ones.

Status values: **Accepted**, **Pending**, **Superseded**

---

## ADR-001: Use Next.js with TypeScript for the frontend

**Status:** Accepted

**Decision:**
Use Next.js (App Router) with React and TypeScript.

**Reason:**
Server rendering and static generation give good SEO for blog posts and public sections. TypeScript catches errors early and keeps the API contract typed.

---

## ADR-002: Use Tailwind CSS with Shadcn UI / Radix UI

**Status:** Accepted

**Decision:**
Style with Tailwind CSS and build components on Shadcn UI and Radix UI primitives.

**Reason:**
Design tokens live in one place, and Radix provides accessible behavior for menus, dialogs and tabs. Components are owned in the codebase and can match the design system exactly.

---

## ADR-003: Use Framer Motion for animations

**Status:** Accepted

**Decision:**
Use Framer Motion. Use GSAP only if a section needs timeline-based effects Framer Motion cannot do well.

**Reason:**
Framer Motion integrates naturally with React and supports reduced-motion preferences.

---

## ADR-004: Use Django with a RESTful API as the backend

**Status:** Accepted

**Decision:**
Use Django with Django REST Framework, exposing versioned JSON endpoints under `/api/v1/`.

**Reason:**
Django provides authentication, validation, an ORM and a mature ecosystem. A separate REST API keeps the frontend and backend independent.

**Consequence:**
Django cannot run on Cloudflare Workers, so it needs its own host (see ADR-005 and ADR-010).

---

## ADR-005: Database choice for the Django backend

**Status:** Accepted

**Decision:**
Keep both Cloudflare D1 and Django. Django will be hosted elsewhere and will communicate with D1 through the Cloudflare REST API using a custom database layer, rather than its built-in ORM for direct D1 interactions.

**Reason:**
This preserves the chosen stack (Django for backend, D1 for data) while bridging the incompatibility between Django's ORM and Cloudflare Workers. It accepts the trade-off of a more complex, custom database layer and potentially higher latency in exchange for keeping both technologies.

---

## ADR-006: Use Cloudflare R2 for media storage

**Status:** Accepted

**Decision:**
Store all uploaded media in Cloudflare R2, accessed from Django through the S3-compatible API with presigned URLs.

**Reason:**
R2 is inexpensive, S3-compatible and has no egress fees. Media stays off the application server.

---

## ADR-007: Use Django Channels with Redis for live chat

**Status:** Accepted

**Decision:**
Implement live web chat with WebSockets through Django Channels and a Redis channel layer.

**Reason:**
Keeps chat inside the existing backend without a third-party service.

**Consequence:**
The backend host must support ASGI and WebSockets, and Redis is required in production.

---

## ADR-008: Admin authentication with JWT in httpOnly cookies

**Status:** Accepted

**Decision:**
Only the owner logs in. Authentication uses a JWT stored in an httpOnly, secure cookie. Visitors do not have accounts. Authorization is always checked on the Django side.

**Reason:**
httpOnly cookies are not readable by JavaScript, which reduces token theft through XSS.

---

## ADR-009: Monorepo with feature-based frontend structure

**Status:** Accepted

**Decision:**
Keep `frontend/` and `backend/` in one repository. The frontend groups code by section under `src/features/`, with shared UI in `components/`, API calls in `services/`, and pure helpers in `utils/`.

**Reason:**
One repository keeps docs, tasks and both apps in sync, and feature folders keep each section self-contained.

---

## ADR-010: Split deployment

**Status:** Accepted (targets may change once ADR-005 is resolved)

**Decision:**
Deploy the Next.js frontend on Cloudflare (or Vercel) and the Django API on a container or VM host with Redis.

**Reason:**
Django and WebSockets need a conventional server environment that Workers do not provide.

---

## ADR-011: Design tokens and brand colors are fixed

**Status:** Accepted

**Decision:**
Brand colors are `#215C5C` (primary) and `#CCE8C9` (secondary). All colors, radii, shadows and type sizes come from the tokens in `DESIGN.md`. No raw hex values or one-off styles in components.

**Reason:**
Prevents inconsistent styling across pages.

---

## ADR-012: Content is dynamic and managed by the owner

**Status:** Accepted

**Decision:**
All section content (profile, skills, resume, services, blog) is stored in the backend and edited through an admin dashboard. Nothing is hard-coded in the frontend.

**Reason:**
The owner must be able to update the portfolio without changing code or redeploying.

---

## ADR-013: Single page experience with real routes for blog posts

**Status:** Accepted

**Decision:**
The main site is a single scrolling page with smooth-scroll navigation. Blog posts have their own routes (`/blog/[slug]`) so they can be shared and indexed.

**Reason:**
Satisfies the SPA requirement while keeping blog content discoverable by search engines.
