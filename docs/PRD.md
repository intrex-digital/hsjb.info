# Product Requirements Document

## Product
Personal Portfolio Web Application (Single Page Application)

## Problem
Professionals who work across development, technical training and consulting have no single place that presents their skills, experience, writing and services together. Static resumes and scattered profiles are hard to keep current, offer no way to interact with visitors, and do not show the full range of a person's work (industrial projects, training delivery, certifications).

## Target Users

**Visitors**
- Recruiters and hiring managers evaluating background and credentials
- Prospective clients looking for services
- Training organizations looking for a technical trainer
- Peers and readers of the technical blog

**Owner (site administrator)**
- The portfolio owner, who needs to update content without changing code

## Goal
Build a fast, fully responsive portfolio SPA that presents professional identity, experience, writing and services in one place, and lets visitors contact the owner directly through a form or live chat.

## Design Direction
- Brand colors: **#215C5C** (deep teal) and **#CCE8C9** (soft mint green)
- Dynamic, polished UI with smooth animations and transitions
- Consistent look across mobile, tablet and desktop

## Core Features

1. **Home / Hero**: first impression with name, role, tagline and calls to action
2. **About Me**: personal and professional introduction
3. **Skills**: categorized skills presented visually
4. **Resume**
   1. Education
   2. Professional Training
   3. Certifications & Accreditations
   4. Industrial Projects
   5. Industrial Training Projects (work as a technical trainer)
5. **Technical Blogs**: list of posts, individual post pages, categories or tags
6. **Services**: what the owner offers, with a way to enquire
7. **Contacts**: contact form with validation and confirmation
8. **Live Web Chat**: real-time chat between visitors and the owner
9. **Admin content management**: owner can add, edit and delete resume entries, skills, blog posts, services and media, and can view messages

## Cross-Cutting Requirements
- Fully responsive on all common screen sizes
- Single page navigation with smooth scrolling and active section highlighting
- Each section fully functional for its purpose, not just static content
- Dynamic content loaded from the backend, not hard-coded
- Accessible (keyboard navigation, readable contrast, semantic markup)
- Fast load times and good SEO for blog posts and public sections
- Contact form and chat protected against spam and abuse

## MVP

- Home/Hero, About Me, Skills sections
- Full Resume section with all five sub-sections
- Services section
- Contact form that delivers messages to the owner
- Technical blog with list and detail views
- Responsive layout and brand color theme
- Admin ability to manage content and media
- Basic live web chat (visitor sends, owner receives and replies)

## Out of Scope (for MVP)

- Payments or online booking
- Visitor accounts, login or comments
- Multi-language support
- Newsletter or email marketing
- AI chatbot
- Native mobile app
- Analytics dashboard beyond basic traffic stats

## Technical Direction
Chosen stack (from project planning):

| Layer | Choice |
|---|---|
| Frontend | Next.js (React), TypeScript, Tailwind CSS, Shadcn UI / Radix UI, Framer Motion or GSAP |
| Backend | Django with RESTful APIs |
| Database | Cloudflare D1 (SQLite) |
| Media storage | Cloudflare R2 |

**Open question:** Django does not run on Cloudflare Workers, and D1 is only reachable from Workers or via Cloudflare's REST API. The hosting arrangement for Django and its database connection must be decided before backend work starts.

## Success Criteria

**A visitor should be able to:**
1. Open the site on phone or desktop and navigate every section smoothly
2. Read the owner's about, skills and full resume
3. Browse and read technical blog posts
4. View the services offered
5. Submit the contact form and see a confirmation
6. Start a live chat and receive a reply

**The owner should be able to:**
1. Log in to an admin area
2. Add, edit and delete content in every section without touching code
3. Upload images and files to media storage
4. Receive and read contact form messages and chats

**Quality bar:**
- Site matches the #215C5C / #CCE8C9 color identity
- No horizontal scrolling or broken layouts on mobile
- Content changes appear on the live site without a redeploy
