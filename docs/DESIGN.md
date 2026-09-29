# Design System

## Style
Modern, minimal, professional, with a calm and trustworthy feel. Generous whitespace, clear hierarchy, restrained use of color. Motion is smooth and purposeful, never distracting.

## Colors

### Brand
| Token | Hex | Use |
|---|---|---|
| `primary` | `#215C5C` | Primary buttons, links, headings accents, active states |
| `secondary` | `#CCE8C9` | Highlights, badges, section tints, secondary buttons, hover fills |

### Supporting Palette (derived from the brand colors)
| Token | Hex | Use |
|---|---|---|
| `primary-hover` | `#1A4A4A` | Primary button hover and pressed |
| `primary-soft` | `#E6F3E4` | Subtle tinted backgrounds, hover on ghost items |
| `secondary-strong` | `#A9D3A5` | Borders on secondary elements, progress fills |
| `background` | `#F7FBF6` | Page background |
| `surface` | `#FFFFFF` | Cards, inputs, dialogs |
| `text` | `#0F2A2A` | Body text and headings |
| `muted` | `#4B6363` | Secondary text, captions, placeholders |
| `border` | `#D5E3D3` | Dividers, card and input borders |
| `success` | `#2E7D4F` | Success messages |
| `warning` | `#B7791F` | Warnings |
| `destructive` | `#B42318` | Errors, delete actions |
| `focus-ring` | `#215C5C` | Keyboard focus outline |

### Dark Mode (supported via `prefers-color-scheme` and a manual toggle)
| Token | Hex |
|---|---|
| `background` | `#0B1F1F` |
| `surface` | `#132E2E` |
| `text` | `#EAF5E8` |
| `muted` | `#9DB8B5` |
| `border` | `#244545` |
| `primary` | `#CCE8C9` (text on it: `#0B1F1F`) |

### Color Rules
- Define colors once as Tailwind theme tokens / CSS variables. Never use raw hex values in components.
- `#215C5C` on white or `#CCE8C9` has a contrast ratio above 5.5:1 and is safe for text. Do not put `#CCE8C9` text on white.
- Never rely on color alone to convey meaning; pair it with an icon or text.
- Use `primary` for at most one main call to action per view.

## Typography
- **Font:** Inter for all UI and content, loaded through `next/font`
- **Code font:** JetBrains Mono for code blocks in technical blogs
- **Fallback:** `system-ui, sans-serif`

| Style | Size (mobile / desktop) | Weight | Line height |
|---|---|---|---|
| Display (Hero title) | 40px / 64px | 700 | 1.1 |
| H1 | 32px / 44px | 700 | 1.2 |
| H2 | 26px / 34px | 600 | 1.25 |
| H3 | 20px / 24px | 600 | 1.3 |
| Body | 16px / 16px | 400 | 1.6 |
| Body large | 18px / 20px | 400 | 1.6 |
| Small / caption | 14px | 400 | 1.5 |

Blog article text uses 18px body with a maximum line length of about 70 characters.

## Spacing & Layout
- Spacing scale based on 4px (Tailwind default: 4, 8, 12, 16, 24, 32, 48, 64, 96)
- Content container: max width 1200px, horizontal padding 16px (mobile), 24px (tablet), 32px (desktop)
- Section vertical padding: 64px mobile, 96px desktop
- Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280
- Grid: 1 column on mobile, 2 on tablet, 3 on desktop for card lists

## Border Radius
| Element | Radius |
|---|---|
| Cards, dialogs, images | 12px |
| Buttons, inputs | 8px |
| Badges, chips, avatars | 9999px (pill / circle) |

Use these radii everywhere. No square cards, no mixed radii.

## Shadows
- `shadow-sm`: `0 1px 2px rgba(15, 42, 42, 0.06)` for cards at rest
- `shadow-md`: `0 6px 20px rgba(15, 42, 42, 0.10)` for hovered cards and dropdowns
- No heavy or colored shadows

## Buttons
Height 44px minimum touch target, padding 0 20px, radius 8px, font weight 500, transition 150ms.

| Variant | Style |
|---|---|
| **Primary** | Background `primary`, white text; hover `primary-hover` |
| **Secondary** | Background `secondary`, text `primary`; hover `secondary-strong` |
| **Outline** | Transparent, 1px `primary` border, `primary` text; hover `primary-soft` |
| **Ghost** | No border or fill, `primary` text; hover `primary-soft` |
| **Destructive** | Background `destructive`, white text; used only in admin delete actions |

States for every button: hover, focus-visible (2px `focus-ring` outline, 2px offset), active, disabled (50% opacity, no pointer), loading (spinner replaces label, width stays fixed).

## Cards
- Background `surface`, 1px `border`, radius 12px, padding 24px, `shadow-sm`
- Hover (only if clickable): `shadow-md`, lift 2px, transition 200ms
- Structure: optional image on top (16:9), title (H3), muted description, footer with tags or actions
- All card types (skills, projects, blog posts, services, certifications) share this same base style

## Forms
- Labels always visible above inputs; placeholders are hints only
- Input height 44px, radius 8px, 1px `border`; focus shows 2px `focus-ring`
- Error state: `destructive` border, message below the field with an icon
- Required fields are marked, and validation runs on blur and on submit
- Success confirmation after submit, with the form cleared
- Full keyboard support, correct `autocomplete` and `inputmode` attributes

## Section Patterns
- **Section header:** small uppercase label in `primary`, H2 title, one line of muted intro text
- **Alternating backgrounds:** `background` and `primary-soft` between sections for rhythm
- **Hero:** large display title, role and tagline, two buttons (primary + outline), profile image or illustration with a `secondary` shape behind it
- **Skills:** grouped cards or tags with progress or level indicators
- **Resume:** vertical timeline for education, training and projects; certifications as cards with issuer and date
- **Blog:** card grid with cover image, category badge, read time, date
- **Services:** icon, title, short description, and an "Enquire" action
- **Contact:** form on one side, contact details on the other (stacked on mobile)
- **Live chat:** floating button bottom-right that opens a chat panel (full screen on mobile)

## Navigation
- Sticky top bar with blurred `surface` background and a bottom border on scroll
- Active section highlighted while scrolling; smooth-scroll on click
- Mobile: hamburger opening a full-height slide-in menu
- Dark mode toggle in the header

## Iconography & Imagery
- Lucide icons only, 20px inline / 24px standalone, 1.75 stroke width
- Images use `next/image`, are lazy loaded with blur placeholders, and always have alt text
- Consistent 12px radius on all images

## Motion (Framer Motion)
- Section content fades and slides up 16px on entering the viewport, once only
- Staggered card reveals (60ms between items)
- Durations: 150ms for micro-interactions, 300-500ms for reveals; easing `easeOut`
- Respect `prefers-reduced-motion`: disable movement and use simple fades

## UX Requirements
- **Mobile first and fully responsive**, no horizontal scrolling at any width
- **Loading states:** skeleton placeholders matching the final layout, no blank sections
- **Empty states:** friendly message with an icon and, where useful, an action (for example "No posts yet")
- **Error states:** clear message in plain language with a retry action; never show raw errors
- **Accessible forms:** labels, error association with `aria-describedby`, visible focus
- **Feedback:** toast confirmation for successful actions such as sending a message
- **Performance:** fast first paint, optimized images, no layout shift

## Accessibility
- WCAG 2.1 AA contrast at minimum
- Semantic HTML landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Full keyboard navigation, logical tab order, skip-to-content link
- Radix UI primitives for menus, dialogs and tabs to get correct ARIA behavior
- Touch targets at least 44 x 44px
- Chat panel is announced to screen readers (`aria-live` for new messages)

## Consistency Rules (for AI and developers)
- Use only the tokens above; do not invent new colors, radii, shadows or font sizes
- Reuse the shared components (`Button`, `Card`, `Input`, `Badge`, `SectionHeader`) instead of restyling per page
- Every new component must define its hover, focus, disabled, loading, empty and error states
- Every page must look correct in light and dark mode and at mobile, tablet and desktop widths
