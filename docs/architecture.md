# Ohio Flow Co — Project Architecture

**Architecture status:** Phase 2.2 complete; Phase 2.1 delivery pending

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
| Published-route registry | `src/lib/routes.ts` |
| Analytics contract | Typed first-party `dataLayer` events with an optional GTM transport |
| Global shell | Root layout with header, main content, footer, and mobile call bar |
| Current routes | `/`, `/request-service`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and the framework-provided not-found route |
| Crawl surfaces | Typed Next.js metadata routes plus a static plain-text route |
| Build command | `npm run build`, using Next.js's Webpack build path |
| Deployment target | Vercel is preferred provisionally but is not selected or configured yet |

## Current file architecture

```text
ohio flow co/
├── .env.example
├── docs/
│   ├── analytics.md
│   ├── architecture.md
│   └── progress.md
├── public/
│   └── og.png
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── tsconfig.test.json
├── eslint.config.mjs
├── postcss.config.mjs
├── tests/
│   └── request-service-validation.test.ts
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── llms.txt/
    │   │   └── route.ts
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── request-service/
    │   │   ├── actions.ts
    │   │   └── page.tsx
    │   ├── robots.ts
    │   └── sitemap.ts
    ├── components/
    │   ├── analytics/
    │   │   ├── Analytics.tsx
    │   │   ├── AnalyticsEventBridge.tsx
    │   │   └── PageViewTracker.tsx
    │   ├── forms/
    │   │   └── RequestServiceForm.tsx
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
        ├── analytics-config.ts
        ├── analytics.ts
        ├── request-service-delivery.server.ts
        ├── request-service-submission.ts
        ├── request-service.ts
        ├── routes.ts
        ├── seo.ts
        └── site.ts
```

## Architectural responsibilities

### Application layer

`src/app/layout.tsx` owns the sitewide document structure and imports safe root metadata defaults from `src/lib/seo.ts`.

The rendered order is:

```text
Skip link
SiteHeader
Main (#main-content)
└── Current route content
SiteFooter
MobileCallBar
Analytics hooks (non-visual)
```

The body is a minimum-height flex column and the main element uses `flex-1`, keeping the footer at the bottom on short pages.

`src/app/page.tsx` remains a deliberately minimal placeholder. Full homepage content belongs to Phase 3.1.

`src/app/request-service/page.tsx` is the first implemented conversion route. It owns page metadata, breadcrumb and page composition while delegating form interaction to `RequestServiceForm`. The route fails closed while delivery is unconfigured, is `noindex,follow`, and remains outside `publishedRoutes` until external delivery is operational.

### Request Service form layer

- `RequestServiceForm.tsx` is a Client Component because it owns pending state, action-result focus, correction-state errors, audience-path interaction, and bounded form analytics. Its attempt-keyed uncontrolled fields receive normalized values from Server Action state, preserving failures and clearing only confirmed success.
- `src/app/request-service/actions.ts` is the Server Action boundary. It always revalidates submitted `FormData`, then calls the server-only delivery interface.
- `src/lib/request-service.ts` is the shared pure contract for field names, allowlisted audience/relationship/service/source options, normalization, validation, state shapes, conditional lead types, and length limits.
- `src/lib/request-service-submission.ts` owns delivery orchestration as an injectable pure function, including untrusted action-state normalization and the confirmed-receipt success gate.
- `src/lib/request-service-delivery.server.ts` is the only external handoff boundary. During Phase 2.1 it returns `not_configured` and deliberately retains no lead data.
- The action returns a success state only after the delivery boundary returns a provider receipt. Validation alone cannot clear the form, display confirmation, or emit `ofc_generate_lead`.
- The form shares name, phone, service, city, ZIP, self-reported source, optional email, and optional project details across all audiences. Residential requests additionally require an allowlisted property relationship; commercial, contractor, and municipal requests require a normalized company or organization name.
- Four native radio choices establish the audience contract: `residential`, `commercial`, `contractor`, and `municipal`. The two conditional panels stay mounted for value preservation, CSS `:has()` reveals the relevant panel before hydration, and the labeled fallback leaves both panels understandable where `:has()` is unavailable.
- Server validation treats the selected audience as untrusted, validates only its active conditional field, blanks the inactive form-state value, and creates a discriminated `RequestServiceLead` that omits the inactive property before delivery. No audience-to-service compatibility restriction is imposed.
- `tests/request-service-validation.test.ts` exercises the pure form and delivery contracts through the existing TypeScript compiler and Node test runner without adding a runtime or test dependency. Phase 2.2 expands the suite to 23 tests covering every audience, tampering, active/inactive conditional data, preservation, and minimized delivery payloads.

### Canonical business-data layer

`src/lib/site.ts` is the only source for:

- Brand and legal name
- Tagline
- Primary domain
- Public phone number and `tel:` destination
- Public email
- Service-area label and primary cities
- Confirmed service list
- Sole lead and notification recipient
- Main navigation
- Request Service destination
- Legal navigation

Components and machine-readable routes must import these values rather than duplicating them as literals.

### Global layout components

- `SiteHeader.tsx` is a Client Component because it owns mobile-menu state, pathname-aware navigation, Escape handling, and focus return.
- `SiteFooter.tsx` is a Server Component containing company information, navigation, cities, legal links, and conversion calls to action.
- `MobileCallBar.tsx` is a Server Component that keeps Call Now and Request Service fixed at the bottom below the large-desktop breakpoint.

### Analytics layer

- `Analytics.tsx` is a Server Component mounted once in the root layout. It reads the build-time analytics configuration and conditionally emits one `next/script` GTM bootstrap.
- `PageViewTracker.tsx` is a Client Component that emits one `ofc_page_view` event for the initial pathname and each distinct App Router pathname change.
- `AnalyticsEventBridge.tsx` is a Client Component with one delegated click listener for typed Call and Request Service data attributes. It does not delay or replace link navigation.
- `src/lib/analytics.ts` owns the event-name allowlist, CTA-location allowlist, narrow event helpers, pathname normalization, and lead-form events.
- `src/lib/analytics-config.ts` requires both `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a syntactically valid `NEXT_PUBLIC_GTM_ID`; otherwise the transport is disabled or the enabled build fails closed.
- GTM is the only planned transport. GA4 will be configured inside the confirmed production GTM container rather than loaded independently.
- Events contain bounded structural fields only. Application code excludes contact details, form contents, uploaded-file information, raw URLs, query strings, referrers, and arbitrary payloads.
- `docs/analytics.md` is the activation, event-mapping, data-minimization, and duplicate-prevention contract.

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

The homepage remains a Phase 1 placeholder and `/request-service` is implemented as a noindex Phase 2 conversion route. Other navigation destinations intentionally exist before their pages and may return not found until Phase 3.

`src/lib/seo.ts` now owns the shared SEO architecture:

- `rootMetadata` provides the canonical domain base, fallback title and title template, default description, application identity, and safe social defaults.
- `createPageMetadata` requires an explicit title, description, and site-relative pathname for every route.
- `absoluteSiteUrl` normalizes site-relative paths, removes query strings and fragments, collapses duplicate slashes, and removes trailing slashes except at the domain root.
- Each page metadata result contains a complete title, description, self-referencing canonical, Open Graph object, and Twitter card object.
- Complete nested objects are emitted intentionally because Next.js metadata merging is shallow.
- Route-specific canonical and Open Graph URLs do not live in the root layout, preventing homepage URLs from leaking into future nested routes.
- The default 1200×630 social card is `public/og.png` and contains only confirmed brand, service-category, and service-area language.

`src/lib/routes.ts` is the canonical registry of substantive routes that are ready for discovery. It currently contains only the homepage. Navigation may point at planned Phase 3 destinations, but those placeholder destinations are not added to the crawl inventory while they return not found.

The crawl architecture is implemented as follows:

- `src/app/robots.ts` emits a typed `/robots.txt` response that permits crawling and advertises the canonical sitemap URL.
- `src/app/sitemap.ts` maps only `publishedRoutes` to canonical absolute URLs. It intentionally omits speculative `lastModified`, change-frequency, and priority values.
- `src/app/llms.txt/route.ts` emits a force-static plain-text resource containing the confirmed identity, positioning, service scope, service area, public contact details, and links from `publishedRoutes`.
- `llms.txt` is supplemental machine-readable context. It is not treated as an access-control, indexing, ranking, or training directive.
- Public preview deployments must receive platform-level crawl protection after a deployment provider is selected; production `robots.txt` is not used to conceal unfinished preview environments.

`Breadcrumbs` accepts explicit labels and links from each page rather than generating labels from URL slugs. The homepage does not render a redundant breadcrumb. Breadcrumb JSON-LD remains deferred to Phase 4.3.

Structured data belongs to Phase 4.3.

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

The current architecture provides conversion entry points and a fail-closed lead-processing boundary:

- Phone links use `tel:+15673581055`.
- Request Service links target `/request-service`.
- All current shell phone and Request Service links emit bounded, placement-aware data-layer events.
- `/request-service` renders one short form with residential, commercial, contractor, and municipal paths, shared client/server validation, and safe failure states.
- Form starts and validation/submission failures emit bounded events; confirmed-lead events remain unreachable until external delivery succeeds.
- The sole intended lead and immediate-notification recipient is `Ohioflowcollc@gmail.com`.
- The delivery adapter is not configured, so the form preserves entered values, reports that delivery was not confirmed, and presents the public phone fallback instead of dropping or falsely acknowledging the lead.
- No email-delivery workflow or CRM integration exists yet.
- Photo forwarding is planned without long-term cloud storage; no file input or upload handling exists yet.
- The honeypot is baseline protection only. Provider-compatible rate limiting or a bot challenge, idempotent delivery, and safe email-content/header construction are required before outbound email is enabled.
- No live GA4, GTM, advertising, or call-tracking transport is configured yet.
- Pageview and conversion hooks remain local until the explicit analytics flag and a valid production GTM ID are supplied.
- Remaining Phase 2 work will add safe photo forwarding, provider-backed email delivery, confirmation, and end-to-end tracking/handoff validation.

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
| B-012 | Request Service leads and immediate notifications go only to `Ohioflowcollc@gmail.com` for the initial email handoff. | Locked | Phase 2.1 owner decision |
| B-013 | Customer-submitted photos will be forwarded without long-term cloud storage for now. | Locked current approach | Phase 2.1 owner decision for Phase 2.3 |

### Technical and design decisions

| ID | Decision | Status | Origin |
|---|---|---|---|
| T-001 | Use Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. | Active | Phase 1.1 |
| T-002 | Keep dependencies minimal and do not add a UI library for the foundation. | Active | Phase 1.2 |
| T-003 | Use Server Components by default and isolate browser state in the header Client Component. | Superseded by T-016 | Phase 1.2 |
| T-004 | Keep canonical NAP and navigation data in `src/lib/site.ts`. | Active | Phase 1.1 |
| T-005 | Use `lg`/`64rem` as the shell transition between mobile/tablet conversion controls and the desktop header. | Active | Phase 1.2 |
| T-006 | Use the Webpack path for `next build` because the available environment blocks Turbopack's local worker port. | Active | Phase 1.2 validation |
| T-007 | Every route must use the typed page-metadata helper with an explicit canonical pathname; route-specific URLs must not be placed in root metadata. | Active | Phase 1.4 |
| T-008 | Breadcrumb labels and destinations are supplied explicitly by Server Components rather than inferred from the browser pathname. | Active | Phase 1.4 |
| T-009 | `publishedRoutes` is the single crawl-inventory source; a route enters the sitemap and `llms.txt` links only after it has substantive published content. | Active | Phase 1.5 |
| T-010 | Production robots rules permit crawling and advertise the canonical sitemap; preview crawl protection will be deployment-level rather than encoded in production rules. | Active | Phase 1.5 |
| T-011 | `llms.txt` is generated from canonical project constants as force-static supplemental context and is not treated as a crawler-control mechanism. | Active | Phase 1.5 |
| T-012 | Load GTM as the sole analytics transport and configure GA4 inside GTM; do not ship parallel GTM and direct GA4 loaders. | Active | Phase 1.6 |
| T-013 | Analytics transport is disabled by default and requires an explicit enable flag plus a valid production GTM ID. Enabled builds with invalid configuration fail closed. | Active | Phase 1.6 |
| T-014 | Application-owned analytics events use a typed allowlist and bounded parameters; personal information, form contents, query strings, referrers, and arbitrary payloads are excluded. | Active | Phase 1.6 |
| T-015 | Application code owns pathname pageviews. Future GTM configuration must disable automatic/history-change duplicates and map each data-layer event once. | Active | Phase 1.6 |
| T-016 | Use Server Components by default and isolate browser-only state and effects in the smallest practical leaf components, currently the header, analytics trackers, and Request Service form. | Active | Phase 1.6 |
| T-017 | Use one shared pure contract for Request Service field options, normalization, and server validation; the Client Component handles interaction while a Server Action owns submission. | Active | Phase 2.1 |
| T-018 | A service request is successful only after the server-only delivery adapter returns a confirmed provider receipt. Unconfigured or failed delivery must preserve values, show a phone fallback, and emit no lead-success event. | Active | Phase 2.1 |
| T-019 | Keep `/request-service` `noindex,follow` and outside `publishedRoutes` until external delivery is operational. | Active | Phase 2.1 |
| T-020 | Treat Vercel as the provisional production host, not a locked or configured deployment target. | Provisional | Phase 2.1 owner direction |
| T-021 | Before outbound email is enabled, add Vercel-compatible abuse protection and idempotency; keep recipient/sender headers static and render all submitted values only as escaped, untrusted email content. | Active activation gate | Phase 2.1 |
| T-022 | Use one shared Request Service form with four project audiences: residential, commercial, contractor, and municipal. Ask residential users for property relationship and all other audiences for company or organization name. | Active | Phase 2.2 |
| T-023 | Validate only the selected audience's conditional field, impose no audience-to-service compatibility gate, and pass delivery adapters a discriminated lead object that omits inactive audience data. | Active | Phase 2.2 |
| D-001 | Use deep navy, construction orange, light gray canvas, and white surfaces. | Active | Phase 1.3 |
| D-002 | Use the darker `#b64f1f` accent for accessible white CTA text. | Active | Phase 1.3 |
| D-003 | Use system fonts rather than remote font dependencies. | Active | Phase 1.3 |
| D-004 | Use restrained radii, clear rails, subtle grids, and limited motion for an industrial/local character. | Active | Phase 1.3 |
| D-005 | Use a typography-led 1200×630 default social card with no invented project photography, logo mark, equipment, or unsupported claims. | Active | Phase 1.4 |
| R-001 | Replace weak Wix URL names with descriptive service and service-area routes; preserve old traffic through 301 redirects at launch. | Active plan | Phase 0.6 |

## Expected future architectural additions

These are planned boundaries, not implemented architecture:

- **Remaining Phase 2:** upload handling without long-term storage, provider-backed notification delivery, confirmation, and end-to-end handoff/tracking validation.
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
| August 6, 2026 | Phase 1.5 | Added typed robots and sitemap routes, a canonical published-route registry, a force-static `llms.txt` endpoint, and a confirmed-service data list. Only the substantive homepage is exposed in the crawl inventory. No business decisions changed. |
| August 6, 2026 | Phase 1.6 | Added a dormant-by-default GTM loader, typed pageview/conversion/form event contract, client route and delegated CTA tracking, configuration validation, and an operational analytics guide. Expanded the Client Component boundary from the header alone to minimal analytics leaf components (T-003 superseded by T-016). GA4 delivery remains inactive pending owner-approved account and privacy inputs. No business decisions changed. |
| August 6, 2026 | Phase 2.1 in progress | Added the noindex Request Service route, accessible short form, shared pure validator, Server Action, server-only fail-closed delivery boundary, form analytics wiring, and a zero-dependency unit-test harness. Locked the sole lead recipient and no-long-term-photo-storage direction; Vercel remains provisional. |
| August 6, 2026 | Phase 2.2 complete | Added four audience paths to the shared Request Service form, pre-hydration conditional disclosure, audience-aware error handling, conditional server validation, a minimized discriminated delivery contract, and expanded tests without adding a dependency or route. |
| August 6, 2026 | Project documentation | Added `docs/architecture.md` and `docs/progress.md` as required living records for every future phase and subphase. No runtime architecture changed. |
