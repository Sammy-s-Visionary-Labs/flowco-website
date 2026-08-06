# Ohio Flow Co — Project Architecture

**Architecture status:** Current through Phase 1.4  
**Last reviewed:** August 6, 2026  
**Project root:** `/Users/kinghill/Documents/ohio flow co`

## Purpose and maintenance rule

This file is the source of truth for the website's current technical architecture and durable project decisions. It describes what exists now, not merely what is planned.

At the completion of every phase or subphase:

1. Inspect the implemented code and determine whether the architecture changed.
2. Record new, removed, or reorganized components, routes, data flows, integrations, and dependencies.
3. Record every new business or technical decision.
4. If a previous decision changes, keep the old decision in the decision log, mark it **Superseded**, and link it to the replacement decision.
5. If the work made no architectural change, add a change-log entry stating that explicitly.
6. Update `docs/progress.md` with the completion status and implementation summary.
7. Update the review date at the top of both files.

Do not silently change canonical business details in individual components. Update `src/lib/site.ts`, this document, and the relevant progress entry together.

## System overview

| Concern | Current implementation |
|---|---|
| Application framework | Next.js 16 App Router |
| UI runtime | React 19 |
| Language | TypeScript with strict checking |
| Styling | Tailwind CSS 4 through PostCSS, supported by semantic CSS tokens |
| Package manager | npm |
| Node requirement | Node.js 20.9 or newer |
| Rendering model | Server Components by default; Client Components only for browser interaction |
| Canonical business data | `src/lib/site.ts` |
| SEO metadata composition | `src/lib/seo.ts` |
| Global shell | Root layout with header, main content, footer, and mobile call bar |
| Current routes | `/` and the framework-provided not-found route |
| Build command | `npm run build`, using Next.js's Webpack build path |
| Deployment target | Not selected or configured yet |

## Current file architecture

```text
ohio flow co/
├── docs/
│   ├── architecture.md
│   └── progress.md
├── public/
│   └── og.png
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── MobileCallBar.tsx
    │   │   ├── SiteFooter.tsx
    │   │   └── SiteHeader.tsx
    │   └── ui/
    │       ├── Breadcrumbs.tsx
    │       ├── Container.tsx
    │       ├── CtaLink.tsx
    │       ├── Section.tsx
    │       ├── SectionHeading.tsx
    │       ├── Surface.tsx
    │       └── index.ts
    └── lib/
        ├── seo.ts
        └── site.ts
```

## Architectural responsibilities

### Application layer

`src/app/layout.tsx` owns the sitewide document structure and imports safe root metadata defaults from `src/lib/seo.ts`.

The rendered order is:

```text
Skip link
└── SiteHeader
    └── Main (#main-content)
        └── Current route content
    └── SiteFooter
    └── MobileCallBar
```

The body is a minimum-height flex column and the main element uses `flex-1`, keeping the footer at the bottom on short pages.

`src/app/page.tsx` remains a deliberately minimal placeholder. Full homepage content belongs to Phase 3.1.

### Canonical business-data layer

`src/lib/site.ts` is the only source for:

- Brand and legal name
- Tagline
- Primary domain
- Public phone number and `tel:` destination
- Public email
- Service-area label and primary cities
- Main navigation
- Request Service destination
- Legal navigation

Components must import these values rather than duplicating them as literals.

### Global layout components

- `SiteHeader.tsx` is the only Client Component in the current shell because it owns mobile-menu state, pathname-aware navigation, Escape handling, and focus return.
- `SiteFooter.tsx` is a Server Component containing company information, navigation, cities, legal links, and conversion calls to action.
- `MobileCallBar.tsx` is a Server Component that keeps Call Now and Request Service fixed at the bottom below the large-desktop breakpoint.

### Shared UI layer

- `Container` standardizes maximum widths and responsive gutters.
- `Section` standardizes section tone, vertical rhythm, and container placement.
- `Eyebrow` and `SectionHeading` provide consistent page and section hierarchy.
- `Surface` provides reusable bordered panels with surface, muted, brand, and accent-edge treatments.
- `CtaLink`, `CallLink`, and `RequestServiceLink` provide consistent conversion links without duplicating contact destinations.
- `Breadcrumbs` renders an explicit, accessible route trail without client-side pathname parsing. Ancestors are links and the final item is an unlinked `aria-current="page"` label.
- `src/components/ui/index.ts` is the public export surface for shared UI primitives.

## Design-system architecture

The design system is defined primarily in `src/app/globals.css` and consumed through Tailwind utilities and shared components.

### Semantic palette

| Role | Current value | Use |
|---|---:|---|
| Brand | `#1b2f3a` | Primary navy controls and identity |
| Brand deep | `#11232d` | Footer and high-emphasis dark surfaces |
| Brand soft | `#294552` | Secondary brand treatment |
| Accent | `#b64f1f` | Primary conversion actions and visual rails |
| Accent strong | `#963d17` | Hover states and accessible focus treatment |
| Accent light | `#f2a276` | Accent text on dark backgrounds |
| Canvas | `#f3f5f6` | Page background |
| Surface | `#ffffff` | Cards and navigation surfaces |
| Surface muted | `#e9eef0` | Secondary panels |
| Ink | `#14242c` | Primary body text |
| Ink muted | `#50616a` | Supporting text |
| Line | `#d9e0e3` | Standard borders and dividers |

The accent is intentionally darker than the original suggested `#c45c26`, allowing white CTA text to meet normal-text contrast requirements.

### Typography

- Body copy uses a system UI font stack. There are no remote font requests.
- Display headings use a condensed-first system stack with reliable fallbacks.
- Heading sizes use responsive `clamp()` scales.
- Eyebrows use uppercase text, increased tracking, and an orange rail.
- The hierarchy is designed to feel industrial and capable without resembling a technology startup.

### Spacing and surfaces

- Page and compact header gutters use separate responsive tokens to preserve 320-pixel layouts.
- Sections use compact, default, or spacious responsive vertical-spacing tokens.
- Controls and panels use restrained radii rather than pill-shaped or highly rounded styling.
- Shadows are subtle and functional: controls, panels, menus, headers, and the mobile call bar have separate tokens.
- A low-contrast CSS grid motif is available for industrial texture without using stock graphics or generated SVG artwork.

## Responsive architecture

- The site is mobile-first.
- `64rem` (`lg`) is the principal shell breakpoint.
- Below `lg`, the compact header, hamburger navigation, and fixed mobile call bar are active.
- At `lg` and above, the full navigation, visible phone control, and header Request Service CTA replace the mobile controls.
- Mobile call-bar clearance includes `env(safe-area-inset-bottom)`.
- The mobile menu has a viewport-bounded scroll area so navigation and CTAs remain reachable on short screens.

## Accessibility architecture

- Semantic `header`, `nav`, `main`, and `footer` landmarks are present.
- The skip link is the first focusable element and targets `#main-content`.
- Focus styling uses a two-part light-and-orange treatment that remains visible on white and navy surfaces.
- Mobile navigation exposes `aria-expanded`, `aria-controls`, and descriptive labels.
- Escape closes the mobile menu and returns focus to the menu button.
- Active navigation uses `aria-current="page"` and a visible structural marker.
- Interactive mobile targets are designed around a minimum height of 44–52 pixels.
- Reduced-motion preferences disable smooth scrolling and shorten transitions.
- The interface is light-theme only.

## Routing and SEO status

Only the homepage placeholder is implemented. Navigation destinations intentionally exist before their pages and may return not found until Phase 3.

`src/lib/seo.ts` now owns the shared SEO architecture:

- `rootMetadata` provides the canonical domain base, fallback title and title template, default description, application identity, and safe social defaults.
- `createPageMetadata` requires an explicit title, description, and site-relative pathname for every route.
- `absoluteSiteUrl` normalizes site-relative paths, removes query strings and fragments, collapses duplicate slashes, and removes trailing slashes except at the domain root.
- Each page metadata result contains a complete title, description, self-referencing canonical, Open Graph object, and Twitter card object.
- Complete nested objects are emitted intentionally because Next.js metadata merging is shallow.
- Route-specific canonical and Open Graph URLs do not live in the root layout, preventing homepage URLs from leaking into future nested routes.
- The default 1200×630 social card is `public/og.png` and contains only confirmed brand, service-category, and service-area language.

`Breadcrumbs` accepts explicit labels and links from each page rather than generating labels from URL slugs. The homepage does not render a redundant breadcrumb. Breadcrumb JSON-LD remains deferred to Phase 4.3.

Crawl files belong to Phase 1.5, while structured data belongs to Phase 4.3.

Planned route families include:

```text
/
/services
/services/[service-slug]
/residential
/commercial
/projects
/projects/[case-study-slug]
/service-areas
/service-areas/[city-slug]
/about
/resources
/request-service
/privacy
/terms
/accessibility
```

## Conversion and integration status

The current architecture provides conversion entry points but not lead processing:

- Phone links use `tel:+15673581055`.
- Request Service links target `/request-service`.
- No request form exists yet.
- No email-delivery workflow or CRM integration exists yet.
- No GA4, GTM, advertising, or call-tracking scripts are installed yet.
- Phase 2 will define form handling, confirmation, notifications, source attribution, uploads, and handoff behavior.

## Decision register

### Business decisions

| ID | Decision | Status | Origin |
|---|---|---|---|
| B-001 | Display and legal brand name is **Ohio Flow Co**. | Locked | Phase 0.1 |
| B-002 | Primary domain remains `https://www.toledosewerandwater.com`. | Locked | Phase 0.1 |
| B-003 | Purchasing `ohioflowco.com` is recommended only as a redirect to the primary site; two separate sites must not be operated. | Recommended, not confirmed purchased | Phase 0.1 |
| B-004 | The only public phone number is `(567) 358-1055`. | Locked | Phase 0.2 |
| B-005 | Public email is `Ohioflowcollc@gmail.com`. | Locked | Phase 1.1 brief |
| B-006 | Positioning is underground sewer, water line, drainage, excavation, and utility work—not general plumbing. | Locked | Phase 0.3 |
| B-007 | Confirmed services are sewer repair, sewer replacement, water-service repair, water-line replacement/installation, stormwater management, drainage solutions, site excavation, utility trenching, commercial sewer and water, and contractor/municipal support. | Locked | Phase 0.3 |
| B-008 | Do not claim camera inspections, trenchless service, hydro jetting, septic service, financing, careers, or 24/7 emergency service without later confirmation. | Locked until changed by Sam | Phase 0.3 |
| B-009 | Service area is Northwest Ohio, led by Toledo, Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova. | Locked | Phase 0 |
| B-010 | Ohio Flow Co is a service-area contractor. No storefront address is published. | Locked | Phase 0 |
| B-011 | Real project photography should be used with permission; generic plumbing imagery and glossy CGI pipes are excluded. | Locked approach | Phase 0.5 |

### Technical and design decisions

| ID | Decision | Status | Origin |
|---|---|---|---|
| T-001 | Use Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. | Active | Phase 1.1 |
| T-002 | Keep dependencies minimal and do not add a UI library for the foundation. | Active | Phase 1.2 |
| T-003 | Use Server Components by default and isolate browser state in the header Client Component. | Active | Phase 1.2 |
| T-004 | Keep canonical NAP and navigation data in `src/lib/site.ts`. | Active | Phase 1.1 |
| T-005 | Use `lg`/`64rem` as the shell transition between mobile/tablet conversion controls and the desktop header. | Active | Phase 1.2 |
| T-006 | Use the Webpack path for `next build` because the available environment blocks Turbopack's local worker port. | Active | Phase 1.2 validation |
| T-007 | Every route must use the typed page-metadata helper with an explicit canonical pathname; route-specific URLs must not be placed in root metadata. | Active | Phase 1.4 |
| T-008 | Breadcrumb labels and destinations are supplied explicitly by Server Components rather than inferred from the browser pathname. | Active | Phase 1.4 |
| D-001 | Use deep navy, construction orange, light gray canvas, and white surfaces. | Active | Phase 1.3 |
| D-002 | Use the darker `#b64f1f` accent for accessible white CTA text. | Active | Phase 1.3 |
| D-003 | Use system fonts rather than remote font dependencies. | Active | Phase 1.3 |
| D-004 | Use restrained radii, clear rails, subtle grids, and limited motion for an industrial/local character. | Active | Phase 1.3 |
| D-005 | Use a typography-led 1200×630 default social card with no invented project photography, logo mark, equipment, or unsupported claims. | Active | Phase 1.4 |
| R-001 | Replace weak Wix URL names with descriptive service and service-area routes; preserve old traffic through 301 redirects at launch. | Active plan | Phase 0.6 |

## Expected future architectural additions

These are planned boundaries, not implemented architecture:

- **Phase 1.5:** `robots.ts`, `sitemap.ts`, and an `llms.txt` stub.
- **Phase 1.6:** analytics component boundaries and event helper stubs.
- **Phase 2:** request-form schema, server-side processing, upload handling, notification delivery, source attribution, and thank-you route.
- **Phase 3:** full route tree for service, commercial, project, location, about, and contact content.
- **Phase 4:** legal content, structured data, image pipeline, and complete accessibility QA.
- **Phase 5:** redirects, deployment configuration, launch validation, and search-engine submission.

## Architecture change log

| Date | Phase or milestone | Architectural impact |
|---|---|---|
| August 6, 2026 | Phase 0 | Locked canonical business identity, positioning, service scope, public contact details, route direction, and content exclusions. No application code existed yet. |
| August 6, 2026 | Phase 1.1 | Reconstructed the missing project scaffold with Next.js 16, React 19, TypeScript, Tailwind CSS 4, ESLint, npm, and canonical `site.ts` data. |
| August 6, 2026 | Phase 1.2 | Added the global root shell, shared CTA layer, responsive Client Component header, Server Component footer, persistent mobile call bar, active-route handling, and accessibility foundations. |
| August 6, 2026 | Phase 1.3 | Expanded CSS into a semantic token system; added Container, Section, SectionHeading, Eyebrow, and Surface primitives; refined CTA styling and applied the system to the shell. Framework and data-flow decisions did not change. |
| August 6, 2026 | Phase 1.4 | Added a typed SEO composition layer, canonical URL normalization, explicit page metadata, complete Open Graph/Twitter defaults, a validated social card, and a reusable Server Component breadcrumb. No business decisions changed. |
| August 6, 2026 | Project documentation | Added `docs/architecture.md` and `docs/progress.md` as required living records for every future phase and subphase. No runtime architecture changed. |
