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

## Current Task

TASK-014: Implement light and dark theme tokens with a theme toggle

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

Begin Phase 2 (Design Foundation): implement light and dark theme tokens with a theme toggle (TASK-014).
