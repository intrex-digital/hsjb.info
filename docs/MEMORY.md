# Project Memory

This file is the project's **current state**. Update it at the end of every task (see the workflow in `TASKS.md`). Permanent decisions belong in `DECISIONS.md`, not here.

**Last updated:** 2026-09-29

## Current Status

Planning is complete. All project documents are written. No application code exists yet.

## Completed

- PRD (`PRD.md`)
- Architecture (`ARCHITECTURE.md`)
- Design system (`DESIGN.md`)
- Task breakdown (`TASKS.md`)
- Technical decisions (`DECISIONS.md`)
- Project memory (`MEMORY.md`)
- Test plan (`TEST_PLAN.md`)
- TASK-001: Resolve Django + D1 database question (ADR-005)
- TASK-002: Collect owner content (`CONTENT.md`)
- TASK-003: Create monorepo structure and initialize Git
- TASK-004: Initialize Next.js (App Router, `src/` directory, TypeScript)
- TASK-005: Configure strict TypeScript, ESLint, Prettier and path aliases
- TASK-006: Configure Tailwind CSS with the brand color tokens
- TASK-007: Set up Shadcn UI / Radix UI
- TASK-008: Load Inter and JetBrains Mono with `next/font`
- TASK-009: Install and configure Framer Motion
- TASK-010: Initialize the Django project with `config/` and `apps/`
- TASK-011: Install DRF, CORS, and set up the `/api/v1/` prefix
- TASK-012: Configure environment variables and `.env.example` for both apps
- TASK-013: Add lint and test scripts and a basic CI workflow
- TASK-014: Implement light and dark theme tokens with a theme toggle
- TASK-015: Create the Button component (primary, secondary, outline, ghost, destructive)
- TASK-016: Create the Card component
- TASK-017: Create form components (Input, Textarea, Label, field error)
- TASK-018: Create Badge and SectionHeader components
- TASK-019: Create Skeleton, EmptyState and ErrorState components
- TASK-020: Create the Toast notification system
- TASK-021: Build the app shell (sticky Navbar, mobile menu, Footer, skip link)
- TASK-022: Create the scroll-reveal animation wrapper (respects reduced motion)
- TASK-023: Configure the database connection and initial migration (per ADR-005)
- TASK-024: Define the standard API error format and pagination
- TASK-025: Configure Cloudflare R2 storage
- TASK-026: Create the media presigned upload endpoint
- TASK-027: Create the typed frontend API client in `services/`
- TASK-028: Create the login endpoint (JWT in httpOnly cookie)
- TASK-029: Create logout and "current user" endpoints
- TASK-030: Add admin-only permission class for write endpoints
- TASK-031: Create the admin login page
- TASK-032: Protect `/admin` routes with a server-side check

## Current Task

TASK-033: Write authentication tests

## Known Issues

- Hosting targets for the Django backend and Redis are not chosen yet.
- Project name and domain are not decided.

## Open Questions

- Which host for the Django API and Redis (Render, Fly.io, Railway, VPS)?
- Should the frontend deploy to Cloudflare or Vercel?

## Environment

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS initialized. Shadcn UI / Radix UI, Framer Motion (not yet configured)
- Backend: Django REST API, using custom REST DB layer for Cloudflare D1 (initialized)
- Storage: Cloudflare R2 (not yet configured)
- Brand colors: `#215C5C`, `#CCE8C9`

## Next Step

Write authentication tests (TASK-033).
