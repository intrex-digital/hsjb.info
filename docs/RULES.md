# Development Rules

These rules apply to every AI-assisted or manual change in this project. If a rule conflicts with a request, follow the rule and flag the conflict instead of silently breaking it.

## Project Documents

| File | Purpose |
|---|---|
| `PRD.md` | What we are building and why |
| `ARCHITECTURE.md` | How the system works, folder structure, architectural rules |
| `DESIGN.md` | Visual system and UX requirements |
| `DECISIONS.md` | Locked technical decisions (ADRs) |
| `TASKS.md` | Ordered task list |
| `MEMORY.md` | Current project state |
| `TEST_PLAN.md` | What "working" means |

## Working Process

- Work on **one task at a time**, in the order given in `TASKS.md`.
- Never build multiple tasks or the whole application in one prompt.
- Do not start a task if the previous one is not marked complete.
- Do only what the task describes. Do not add extra features.
- At the end of each task:
  1. Run tests, lint and type checks
  2. Mark the task complete in `TASKS.md`
  3. Update `MEMORY.md` (current status, current task, known issues, next step)
  4. Commit

## Before Coding

- Read the documents relevant to the task (always `TASKS.md`, `DECISIONS.md` and `MEMORY.md`).
- Inspect the existing implementation before adding anything.
- Reuse existing components, hooks, services and utilities where possible.
- For changes touching more than a few files, write a short plan first and confirm it.
- If requirements are unclear or conflict with the documents, ask instead of guessing.
- Never change a decision in `DECISIONS.md`. Propose a new ADR that supersedes it.
- Do not work on database code until ADR-005 is resolved.

## General

- Use TypeScript on the frontend (strict mode) and type hints on the backend.
- Do not use `any`. Use proper types or `unknown` with narrowing.
- Do not duplicate logic; extract shared code.
- Keep functions small and single purpose.
- Use clear, descriptive names. Avoid abbreviations.
- Do not modify unrelated files.
- Do not leave dead code, commented-out code, debug logs or unresolved TODOs.
- Do not add a dependency without a reason. Prefer what is already installed.
- No magic values; use named constants or configuration.

## Frontend

- Follow the folder structure in `ARCHITECTURE.md`: `app/`, `components/`, `features/`, `services/`, `hooks/`, `lib/`, `types/`, `utils/`.
- UI components must not contain API calls or business logic.
- All API communication goes through typed functions in `services/`.
- Each section lives in its own folder under `features/`.
- Reusable UI goes in `components/`; section-specific UI stays in its feature.
- Use Server Components by default. Add `"use client"` only when interactivity is needed.
- Content comes from the API. Never hard-code section content.
- Use Shadcn UI / Radix UI primitives instead of building custom dialogs, menus or tabs.
- Use `next/image` for images and `next/font` for fonts.

## UI and Design

- Follow `DESIGN.md` exactly.
- Use only the defined tokens for color, radius, shadow, spacing and type size. Never use raw hex values or arbitrary values in components.
- Brand colors are `#215C5C` (primary) and `#CCE8C9` (secondary).
- Reuse `Button`, `Card`, `Input`, `Badge` and `SectionHeader`; do not restyle them per page.
- Build mobile first and verify at 375px, 768px and 1440px.
- Every component with data or actions must include loading, empty and error states.
- Support light and dark mode in every new component.
- Animations use Framer Motion and must respect `prefers-reduced-motion`.
- Icons come from Lucide only.

## Accessibility

- Use semantic HTML and landmarks.
- Every interactive element must work with a keyboard and show a visible focus state.
- Inputs need visible labels; errors must be linked with `aria-describedby`.
- Images need meaningful alt text; icon-only buttons need accessible names.
- Touch targets are at least 44 x 44px.
- Meet WCAG 2.1 AA contrast.

## Backend

- Follow the structure in `ARCHITECTURE.md`: one Django app per domain under `apps/`.
- Views handle HTTP only: parse the request, call a service, return a response.
- Business logic goes in `services.py`; database access only through models and services.
- Validate all input with serializers, regardless of frontend validation.
- All endpoints live under `/api/v1/` and use the standard error and pagination format.
- Read endpoints are public; every write endpoint requires admin authentication.
- Keep migrations small, reversible where possible, and never edit an applied migration.
- Store media only in Cloudflare R2, never on the application server.

## Security

- Never expose or commit API keys, tokens, passwords or credentials.
- Read secrets from environment variables and keep `.env.example` up to date (without real values).
- Validate and sanitize all user input on the server.
- Verify authentication and authorization server-side on every protected request.
- Escape all user-generated content (contact messages, chat messages) to prevent XSS.
- Apply rate limiting to login, contact and chat endpoints.
- Restrict CORS to the frontend origin and keep CSRF protection where cookies are used.
- Store the auth token in an httpOnly, secure cookie, never in `localStorage`.
- Presigned upload URLs must be short lived and issued only to admins.
- Never log sensitive data.

## Error Handling

- Never show raw errors or stack traces to users.
- Show clear, plain-language messages with a retry option where possible.
- Handle network failures and empty responses explicitly.
- Log unexpected errors on the server with enough context to debug.

## Performance

- Optimize and lazy load images.
- Avoid unnecessary client-side JavaScript and heavy libraries.
- Avoid layout shift; reserve space for images and loading content.
- Cache read endpoints sensibly and revalidate when content changes.

## Testing

- Add tests for important functionality alongside the code.
- Backend: test services and API endpoints, including permission failures.
- Frontend: test components and critical user flows.
- Run the full test suite, lint and type checks after every implementation.
- Fix failing tests before continuing; never skip, delete or weaken tests to make them pass.
- Use `TEST_PLAN.md` as the checklist for what must work.

## Git

- Work on a feature branch; do not commit directly to `main`.
- Make small, focused commits, one per completed task.
- Start commit messages with the task ID, for example `TASK-016: add Card component`.
- Use descriptive messages that explain what changed and why.
- Never commit secrets, build output, `node_modules`, virtual environments or database files.

## Documentation

- Keep `MEMORY.md` accurate after every task.
- Record any new technical decision as an ADR in `DECISIONS.md`.
- Update `TASKS.md` if scope changes, and say why.
- Comment only where the reason is not obvious from the code.

## Things the AI Must Never Do

- Build features that are out of scope in `PRD.md`.
- Change the tech stack, folder structure or design tokens without an approved ADR.
- Skip tests, states or accessibility to finish faster.
- Rewrite working code that is unrelated to the current task.
- Claim something works without running it.
- Continue silently when blocked; stop and report the problem instead.
