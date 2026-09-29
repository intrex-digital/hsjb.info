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

## Current Task

TASK-003: Create the monorepo (`frontend/`, `backend/`) and initialize Git

## Known Issues

- Hosting targets for the Django backend and Redis are not chosen yet.
- Project name and domain are not decided.

## Open Questions

- Which host for the Django API and Redis (Render, Fly.io, Railway, VPS)?
- Should the frontend deploy to Cloudflare or Vercel?

## Environment

- Frontend: Next.js, TypeScript, Tailwind CSS, Shadcn UI / Radix UI, Framer Motion (not yet created)
- Backend: Django REST API, using custom REST DB layer for Cloudflare D1 (not yet created)
- Storage: Cloudflare R2 (not yet configured)
- Brand colors: `#215C5C`, `#CCE8C9`

## Next Step

Phase 1 (Project Setup): Start with TASK-003 to create the monorepo structure.
