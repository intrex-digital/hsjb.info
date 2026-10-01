# Tasks

Reference documents: `PRD.md` (what/why), `ARCHITECTURE.md` (how it works), `DESIGN.md` (how it looks), `DECISIONS.md` (locked technical choices).

## Workflow

Work on **one task at a time**, in order:

```
TASK-001
   ↓
Implement
   ↓
Test
   ↓
Review
   ↓
Mark complete
   ↓
TASK-002
```

### Rules
- Never ask AI to build more than one task per prompt.
- Before each task, the AI must read `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md` and `DECISIONS.md`.
- Do not change a decision in `DECISIONS.md` without adding a new ADR.
- Do not start a task until the previous one is marked complete.
- Commit after every completed task, with the task ID in the message (for example `TASK-016: add Card component`).

### Definition of Done
A task is complete only when:
- [ ] It does what the task says and nothing extra
- [ ] It follows the architecture rules and design tokens
- [ ] Loading, empty and error states exist where relevant
- [ ] It works on mobile and desktop
- [ ] Tests pass and lint/type checks are clean
- [ ] It has been reviewed and committed

---

## Phase 0: Decisions

- [x] TASK-001: Resolve the Django + D1 database question and record it as ADR-005
- [x] TASK-002: Collect owner content (bio, skills, resume data, services, sample posts, photo, logo)

## Phase 1: Project Setup

- [x] TASK-003: Create the monorepo (`frontend/`, `backend/`) and initialize Git
- [x] TASK-004: Initialize Next.js (App Router, `src/` directory, TypeScript)
- [x] TASK-005: Configure strict TypeScript, ESLint, Prettier and path aliases
- [x] TASK-006: Configure Tailwind CSS with the brand color tokens
- [x] TASK-007: Set up Shadcn UI / Radix UI
- [x] TASK-008: Load Inter and JetBrains Mono with `next/font`
- [x] TASK-009: Install and configure Framer Motion
- [x] TASK-010: Initialize the Django project with `config/` and `apps/`
- [x] TASK-011: Install Django REST Framework and CORS, and set up the `/api/v1/` prefix
- [x] TASK-012: Configure environment variables and `.env.example` for both apps
- [x] TASK-013: Add lint and test scripts and a basic CI workflow

## Phase 2: Design Foundation

- [x] TASK-014: Implement light and dark theme tokens with a theme toggle
- [x] TASK-015: Create the Button component (primary, secondary, outline, ghost, destructive)
- [x] TASK-016: Create the Card component
- [x] TASK-017: Create form components (Input, Textarea, Label, field error)
- [x] TASK-018: Create Badge and SectionHeader components
- [x] TASK-019: Create Skeleton, EmptyState and ErrorState components
- [x] TASK-020: Create the Toast notification system
- [x] TASK-021: Build the app shell (sticky Navbar, mobile menu, Footer, skip link)
- [x] TASK-022: Create the scroll-reveal animation wrapper (respects reduced motion)

## Phase 3: Backend Foundation

- [x] TASK-023: Configure the database connection and initial migration (per ADR-005)
- [x] TASK-024: Define the standard API error format and pagination
- [x] TASK-025: Configure Cloudflare R2 storage
- [x] TASK-026: Create the media presigned upload endpoint
- [x] TASK-027: Create the typed frontend API client in `services/`

## Phase 4: Admin Authentication

- [x] TASK-028: Create the login endpoint (JWT in httpOnly cookie)
- [x] TASK-029: Create logout and "current user" endpoints
- [x] TASK-030: Add admin-only permission class for write endpoints
- [x] TASK-031: Create the admin login page
- [x] TASK-032: Protect `/admin` routes with a server-side check
- [x] TASK-033: Write authentication tests

## Phase 5: Public Sections

### Home, About and Skills
- [x] TASK-034: Create Profile model and API (hero and about data)
- [x] TASK-035: Build the Home/Hero section
- [x] TASK-036: Build the About Me section
- [x] TASK-037: Create Skills model and API
- [x] TASK-038: Build the Skills section

### Resume
- [x] TASK-039: Create Resume models and APIs (education, training, certifications, industrial projects, training projects)
- [x] TASK-040: Build the Resume section shell with sub-section navigation
- [x] TASK-041: Build Education
- [x] TASK-042: Build Professional Training
- [x] TASK-043: Build Certifications & Accreditations
- [x] TASK-044: Build Industrial Projects (with detail view)
- [x] TASK-045: Build Industrial Training Projects (work as a technical trainer)

### Services
- [x] TASK-046: Create Services model and API
- [x] TASK-047: Build the Services section with an "Enquire" action

### Technical Blogs
- [x] TASK-048: Create Blog models and APIs (posts, categories, tags)
- [x] TASK-049: Build the blog list (search, category filter, pagination)
- [x] TASK-050: Build the blog post page (SEO metadata, markdown and code rendering)

### Contact
- [x] TASK-051: Create Contact model and API (validation, rate limit, email notification)
- [x] TASK-052: Build the Contact section and form with all states

### Assembly
- [x] TASK-053: Compose the single page layout with scroll-spy navigation
- [ ] TASK-054: Write tests for public APIs and section components

## Phase 6: Live Web Chat

- [ ] TASK-055: Set up Django Channels with a Redis channel layer
- [ ] TASK-056: Create Chat models (room, message)
- [ ] TASK-057: Create the visitor WebSocket consumer (validation, rate limiting)
- [ ] TASK-058: Build the chat widget (floating button, panel, connection states)
- [ ] TASK-059: Build the owner chat inbox with replies
- [ ] TASK-060: Handle the owner-offline case (leave a message, email notification)
- [ ] TASK-061: Write chat tests

## Phase 7: Admin Dashboard

- [ ] TASK-062: Build the admin layout and navigation
- [ ] TASK-063: Build the profile, hero and about editor
- [ ] TASK-064: Build Skills management (create, edit, delete)
- [ ] TASK-065: Build Resume management for all five resume types
- [ ] TASK-066: Build Services management
- [ ] TASK-067: Build Blog management (editor, cover image upload, publish/draft)
- [ ] TASK-068: Build the reusable media upload component
- [ ] TASK-069: Build the contact messages inbox
- [ ] TASK-070: Add cache revalidation so edits appear without a redeploy

## Phase 8: Polish

- [ ] TASK-071: Responsive audit on mobile, tablet and desktop
- [ ] TASK-072: Accessibility audit (keyboard, contrast, screen reader)
- [ ] TASK-073: SEO (metadata, Open Graph, sitemap, robots)
- [ ] TASK-074: Performance pass (images, bundle size, Lighthouse)
- [ ] TASK-075: Animation review
- [ ] TASK-076: Dark mode audit
- [ ] TASK-077: Create 404 and error pages

## Phase 9: Launch

- [ ] TASK-078: Deploy the frontend to production
- [ ] TASK-079: Deploy the backend, database and Redis to production
- [ ] TASK-080: Configure domain, HTTPS, and production CORS/CSRF settings
- [ ] TASK-081: Set up monitoring, error tracking and backups
- [ ] TASK-082: Run end-to-end tests against the PRD success criteria
- [ ] TASK-083: Final review and launch checklist
