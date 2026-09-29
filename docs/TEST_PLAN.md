# Test Plan

Defines what "working" means for the portfolio application. Every item is a checklist entry; a task from `TASKS.md` is not complete until its related items pass. Criteria come from `PRD.md`, `DESIGN.md` and `ARCHITECTURE.md`.

## How to Use
- Run the relevant sections after each task, and the full plan before launch (TASK-082).
- Mark items with `[x]` when they pass. Log failures in `MEMORY.md` under Known Issues.
- **Types:** Unit (U), API (A), Component (C), End-to-end (E2E), Manual (M).

---

## 1. Admin Authentication

- [ ] Owner can log in with valid credentials (E2E)
- [ ] Invalid credentials show a clear error and do not reveal which field was wrong (E2E)
- [ ] Session cookie is httpOnly and secure (A)
- [ ] Owner can log out and the session is invalidated (E2E)
- [ ] Logged-out users are redirected from `/admin` to the login page (E2E)
- [ ] Expired or tampered tokens are rejected (A)
- [ ] Repeated failed logins are rate limited (A)
- [ ] Public visitors cannot call any write endpoint (A)

## 2. Home / Hero

- [ ] Name, role, tagline and profile image load from the API (C)
- [ ] Call-to-action buttons scroll to the correct sections (E2E)
- [ ] Loading skeleton shows while data loads (C)
- [ ] Error state with retry shows if the API fails (C)

## 3. About Me

- [ ] About content renders from the API (C)
- [ ] Image has alt text and correct aspect ratio (M)
- [ ] Empty content shows an empty state instead of a blank area (C)

## 4. Skills

- [ ] Skills display grouped by category (C)
- [ ] Level indicators render correctly (C)
- [ ] Empty category is hidden or shows an empty state (C)
- [ ] Skill added in admin appears on the site without a redeploy (E2E)

## 5. Resume

### 5.1 Education
- [ ] Entries show institution, degree, dates and description in the correct order (C)
### 5.2 Professional Training
- [ ] Entries render with provider, title and dates (C)
### 5.3 Certifications & Accreditations
- [ ] Cards show issuer, date and credential link or ID where provided (C)
- [ ] Credential links open in a new tab safely (`rel="noopener noreferrer"`) (M)
### 5.4 Industrial Projects
- [ ] Project cards render with title, summary and technologies (C)
- [ ] Detail view opens, is keyboard accessible and closes with Escape (E2E)
### 5.5 Industrial Training Projects
- [ ] Training entries show topic, audience, duration and outcomes (C)
### Resume general
- [ ] Sub-section navigation switches content without a page reload (E2E)
- [ ] Each sub-section has loading, empty and error states (C)

## 6. Technical Blogs

- [ ] Blog list shows published posts only; drafts are never public (A)
- [ ] Search returns matching posts and shows an empty state for no results (E2E)
- [ ] Category filter works and can be cleared (E2E)
- [ ] Pagination works and preserves filters (E2E)
- [ ] Post page renders markdown, headings, images and code blocks (C)
- [ ] Unknown slug shows the 404 page (E2E)
- [ ] Post has correct title, meta description and Open Graph tags (M)
- [ ] Published post appears immediately after admin publishes it (E2E)

## 7. Services

- [ ] Service cards render from the API (C)
- [ ] "Enquire" action opens the contact form with the service prefilled (E2E)
- [ ] Empty state shows when no services exist (C)

## 8. Contact Form

- [ ] Valid submission is saved, the owner is notified, and a success message shows (E2E)
- [ ] Required fields show inline errors on blur and on submit (C)
- [ ] Invalid email is rejected on the client and the server (A)
- [ ] Server rejects oversized or malformed input (A)
- [ ] Double submission is prevented while sending (C)
- [ ] Rate limit and spam protection block repeated submissions (A)
- [ ] Failed submission shows an error and keeps the entered text (E2E)
- [ ] Form is fully usable by keyboard and labeled for screen readers (M)

## 9. Live Web Chat

- [ ] Chat button opens the panel, and the panel closes with Escape (E2E)
- [ ] Visitor can send a message and the owner receives it in real time (E2E)
- [ ] Owner reply appears in the visitor's panel in real time (E2E)
- [ ] Messages persist and the visitor sees history after reopening (E2E)
- [ ] Connection states show correctly: connecting, connected, disconnected, reconnecting (C)
- [ ] Empty and over-length messages are rejected (A)
- [ ] Message flooding is rate limited (A)
- [ ] Owner-offline case lets the visitor leave a message and notifies the owner (E2E)
- [ ] Message content is escaped so HTML or scripts cannot execute (A)
- [ ] New messages are announced to screen readers (M)
- [ ] Panel is full screen and usable on mobile (M)

## 10. Admin Dashboard

- [ ] Owner can create, edit and delete each content type: profile, skills, all five resume types, services, blog posts (E2E)
- [ ] Delete actions ask for confirmation (E2E)
- [ ] Form validation errors are shown clearly (C)
- [ ] Image upload goes to R2 and the resulting URL is saved (E2E)
- [ ] Upload rejects wrong file types and oversized files (A)
- [ ] Contact messages and chats can be viewed and marked as read (E2E)
- [ ] Changes appear on the public site without a redeploy (E2E)

## 11. Navigation & Layout

- [ ] Navbar links scroll smoothly to each section (E2E)
- [ ] Active section is highlighted while scrolling (E2E)
- [ ] Mobile menu opens, traps focus, and closes on link click and Escape (E2E)
- [ ] Skip-to-content link works (M)
- [ ] Dark mode toggle switches theme and remembers the choice (E2E)
- [ ] 404 and error pages display correctly (E2E)

## 12. Responsive

Test every section at these widths:

- [ ] 375px (mobile)
- [ ] 768px (tablet)
- [ ] 1440px (desktop)

Check at each width:
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Touch targets are at least 44 x 44px
- [ ] Images scale without distortion
- [ ] Grids collapse as designed (1 / 2 / 3 columns)
- [ ] No overlapping or clipped elements

## 13. Design Consistency

- [ ] All colors come from the tokens; no raw hex values in components (M, lint/search)
- [ ] Cards use 12px radius; buttons and inputs use 8px (M)
- [ ] Only the defined button variants are used (M)
- [ ] Typography uses Inter and the defined scale (M)
- [ ] Every component has hover, focus, disabled, loading, empty and error states where relevant (M)
- [ ] All pages look correct in both light and dark mode (M)
- [ ] Animations respect `prefers-reduced-motion` (M)

## 14. Accessibility

- [ ] Automated scan (axe or Lighthouse) shows no serious or critical issues
- [ ] Text contrast meets WCAG 2.1 AA in light and dark mode
- [ ] Every interactive element is reachable and operable by keyboard
- [ ] Focus is always visible
- [ ] Headings are in a logical order and landmarks are used
- [ ] Images have alt text and icon-only buttons have accessible names
- [ ] Form errors are associated with inputs
- [ ] Tested with a screen reader on at least one platform

## 15. Performance

- [ ] Lighthouse mobile performance score of 90 or higher on the home page
- [ ] Largest Contentful Paint under 2.5 seconds
- [ ] Cumulative Layout Shift under 0.1
- [ ] Images are optimized and lazy loaded
- [ ] No API request is blocking the first render of the hero

## 16. SEO

- [ ] Each page has a title and meta description
- [ ] Open Graph and social preview images work
- [ ] `sitemap.xml` and `robots.txt` are present and correct
- [ ] Blog posts are server rendered and indexable
- [ ] Only one H1 per page

## 17. Security

- [ ] All write endpoints require admin authentication (A)
- [ ] All input is validated on the server (A)
- [ ] CORS allows only the frontend origin (A)
- [ ] CSRF protection is enabled where cookies are used (A)
- [ ] No secrets in the repository or client bundle (M)
- [ ] User content is escaped to prevent XSS (A)
- [ ] Presigned upload URLs are short lived and restricted to admins (A)
- [ ] Rate limiting is active on contact, chat and login (A)

## 18. Backend & API

- [ ] Every endpoint returns the standard error format (A)
- [ ] Read endpoints return correct data and pagination (A)
- [ ] Unit tests cover the service layer for each app (U)
- [ ] Migrations apply cleanly to an empty database (A)
- [ ] Backup and restore of the database is verified (M)

## 19. Browser & Device Support

- [ ] Latest Chrome
- [ ] Latest Safari (macOS and iOS)
- [ ] Latest Firefox
- [ ] Latest Edge
- [ ] Android Chrome

## 20. Launch Acceptance (from PRD Success Criteria)

**Visitor:**
- [ ] Opens the site on phone and desktop and navigates every section smoothly
- [ ] Reads about, skills and the full resume
- [ ] Browses and reads technical blog posts
- [ ] Views the services offered
- [ ] Submits the contact form and sees a confirmation
- [ ] Starts a live chat and receives a reply

**Owner:**
- [ ] Logs in to the admin area
- [ ] Adds, edits and deletes content in every section without touching code
- [ ] Uploads images and files to media storage
- [ ] Receives and reads contact messages and chats

**Quality:**
- [ ] Site matches the `#215C5C` / `#CCE8C9` color identity
- [ ] No broken layouts on mobile
- [ ] Content changes appear on the live site without a redeploy
