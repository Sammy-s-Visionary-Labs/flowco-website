# Ohio Flow Co — Project Progress

**Progress status:** Current through Phase 1.4  
**Last updated:** August 6, 2026  
**Recommended next task:** Phase 1.5 — Crawl files

## Purpose and maintenance rule

This file tracks what each project phase is expected to deliver and what was actually completed.

At the completion of every phase or subphase:

1. Change its status and add a concise implementation summary.
2. Record validation performed and any remaining follow-up work.
3. Check `docs/architecture.md` for architectural or decision changes.
4. Update the current snapshot, recommended next task, and document date.

### Status labels

- **Complete:** Implemented and validated for the defined scope.
- **In progress:** Work has started but the completion condition is not met.
- **Awaiting input:** Progress depends on a business decision or asset from the owner.
- **Draft:** A working direction exists but must be verified before launch.
- **Not started:** No implementation work has begun.

## Current snapshot

| Phase | Status | Current summary |
|---|---|---|
| Phase 0 — Decisions and assets | In progress | Core brand, phone, positioning, service scope, domain, and route direction are decided. Lead delivery, analytics ownership, photos, case studies, and the final Wix URL crawl remain open. |
| Phase 1 — Foundation | In progress | Phases 1.1 through 1.4 are complete. Crawl and analytics foundations remain. |
| Phase 2 — Conversion system | Not started | Request forms, notifications, uploads, tracking, and lead handoff are not built. |
| Phase 3 — Core pages | Not started | Only a minimal homepage placeholder exists. |
| Phase 4 — Trust, legal, and polish | Not started | Legal pages, structured data, image pipeline, and final QA remain. |
| Phase 5 — Launch engineering | Not started | Redirects, deployment, and launch validation remain. |
| Phase 6 — Expansion | Not started | Location expansion, articles, additional case studies, and reporting remain. |

## Phase 0 — Decisions and assets

**Expected outcome:** Remove business, contact, service, asset, lead-routing, and URL blockers before they can create inconsistent implementation.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 0.1 Brand identity and domain | One canonical public name, legal name, and primary domain | Complete | Locked **Ohio Flow Co** as the display/legal brand and `toledosewerandwater.com` as the primary domain. Buying `ohioflowco.com` is recommended as a redirect but is not confirmed. |
| 0.2 Public phone | One number used everywhere | Complete | Locked `(567) 358-1055` and rejected the old 419 numbers. |
| 0.3 Offered services | Written yes/no service list | Complete | Locked the underground sewer, water, stormwater, drainage, excavation, trenching, commercial, and contractor/municipal scope. Unconfirmed services are explicitly excluded. |
| 0.4 Lead destination and tracking owners | Agreed form recipient, notification owner, and account ownership | Awaiting input | Need the form-delivery email, notification recipients, and confirmation of any existing GA4, GTM, Google Ads, Meta, call-tracking, or CRM accounts. |
| 0.5 Real photos and project facts | Enough approved assets for the home page and at least one or two case studies | Awaiting input | The plan is to use approved Instagram/Facebook project images. Sam still needs to provide permission and 2–3 project summaries with location, problem, work performed, result, and photos. |
| 0.6 Wix URL inventory and redirect plan | Complete old-to-new map | Draft | A clean destination structure and initial redirect map exist. A full crawl of the live Wix site is still required before Phase 5. |

### Phase 0 summary

The project now has a stable specialist identity and avoids unsupported service claims. The remaining Phase 0 items do not block the next foundation tasks, but they will block conversion wiring, final content, and launch.

## Phase 1 — Foundation

**Expected outcome:** A maintainable technical foundation, persistent conversion shell, reusable visual system, shared SEO behavior, crawl files, and analytics hooks.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 1.1 Stack and project scaffold | Application runs locally with agreed framework and canonical constants | Complete | Created the Next.js 16 App Router scaffold with React 19, TypeScript, Tailwind CSS 4, ESLint, npm scripts, and `src/lib/site.ts`. The repository was initially empty, so the missing Phase 1.1 foundation was reconstructed. |
| 1.2 Global layout | Header, footer, navigation, and mobile call bar keep Call and Request Service reachable | Complete | Built the sticky responsive header, pathname-aware navigation, accessible mobile menu, shared Call/Request Service components, full footer, fixed mobile call bar, skip link, safe-area clearance, and flex-column root shell. |
| 1.3 Design system | Colors, typography, spacing, surfaces, and components match the industrial/local brief | Complete | Added semantic visual tokens, responsive gutters and section spacing, system font stacks, focus treatment, industrial grid motifs, and reusable Container, Section, Eyebrow, SectionHeading, Surface, and refined CTA primitives. Applied the system to the shell and kept the homepage minimal. |
| 1.4 Shared SEO shell | Reusable title, description, canonical, Open Graph, and breadcrumb behavior | Complete | Added typed metadata and canonical helpers, explicit homepage metadata, complete Open Graph/Twitter defaults, a validated social card, and an accessible breadcrumb primitive. |
| 1.5 Crawl files | `robots.txt`, sitemap, and `llms.txt` stub | Not started | No crawl files exist yet. They must use the canonical domain and only expose intended routes. |
| 1.6 Analytics foundation | GA4/GTM integration points and event stubs | Not started | Account ownership and identifiers are not confirmed. The code should support later IDs without hardcoding or blocking the site. |

### Phase 1.1 completion summary

- Established Next.js 16, React 19, TypeScript, Tailwind CSS 4, PostCSS, and ESLint.
- Added strict TypeScript and the `@/*` import alias.
- Added npm development, build, start, and lint scripts.
- Centralized business and navigation constants in `src/lib/site.ts`.
- Current build uses the Webpack path because Turbopack cannot bind its local worker port in the available environment.

### Phase 1.2 completion summary

- Added semantic global landmarks and a keyboard-accessible skip link.
- Added a two-tier desktop header with full navigation, phone, and Request Service CTA.
- Added a compact mobile header with Request Service visible before opening the menu.
- Added a full mobile navigation with Escape handling and focus return.
- Added a persistent Call Now and Request Service bar below the desktop breakpoint.
- Added footer contact information, service-area cities, navigation, legal links, CTAs, and the no-storefront statement.
- Added shared CTA variants for accent, brand, outline, and inverse-outline use.

### Phase 1.3 completion summary

- Formalized semantic colors, typography, responsive gutters, section spacing, radii, and shadows.
- Darkened the construction-orange accent to retain white-text contrast.
- Added shared Container, Section, Eyebrow, SectionHeading, and Surface components.
- Refined CTA sizing, weight, states, and shared exports.
- Added visible focus treatment that works on light and dark surfaces.
- Added restrained CSS grid textures for an industrial visual language.
- Updated the header, footer, and placeholder page to consume the shared system.
- Did not build full homepage content; that remains Phase 3.1.

### Phase 1.4 completion summary

- Added `src/lib/seo.ts` as the single metadata-composition layer.
- Added reusable fallback metadata and a root title template.
- Added a typed page helper that requires a title, description, and canonical pathname.
- Added canonical normalization that prevents query strings, fragments, duplicate slashes, and non-root trailing slashes.
- Removed the route-specific homepage canonical and Open Graph URL from root metadata.
- Added explicit homepage metadata with accurate service and Northwest Ohio language.
- Added complete Open Graph and Twitter large-card metadata with no unverified social handle.
- Added and validated a 1200×630 typography-led social card at `public/og.png`.
- Added an accessible Server Component breadcrumb with explicit labels, linked ancestors, hidden separators, and an unlinked current page.
- Kept robots, sitemap, `llms.txt`, JSON-LD, analytics, forms, and full route content out of scope.

## Phase 2 — Conversion system

**Expected outcome:** Every service inquiry reaches the correct person, produces a confirmation, and can be attributed to its source.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 2.1 Short Request Service form | Core contact, service, location, and source fields submit successfully | Not started | Requires the Phase 0.4 delivery decision. |
| 2.2 Residential and commercial paths | Distinct entry paths with appropriate questions | Not started | Define shared fields and audience-specific fields without duplicating the whole form. |
| 2.3 Photo upload | Photos are accepted, validated, and stored or forwarded safely | Not started | Storage and delivery architecture must be selected. |
| 2.4 Thank-you page and notification | Submitter receives confirmation and the team is notified | Not started | Requires confirmed recipient and notification owner. |
| 2.5 Click-to-call tracking | Header, footer, menu, and call-bar interactions produce measurable events | Not started | Coordinate with Phase 1.6 event helpers. |
| 2.6 CRM or email handoff | Leads arrive in the system Sam actually monitors | Not started | Email can be the initial handoff if no CRM exists. |

## Phase 3 — Core pages

**Expected outcome:** Publish the first complete set of pages needed to explain the company, rank for core local searches, establish trust, and generate qualified inquiries.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 3.1 Home | First screen answers what Ohio Flow Co does, where it works, and how to contact it | Not started | Current page is only a Phase 1 placeholder. |
| 3.2 Sewer Line Repair | Complete intent page with scope, process, proof, FAQs, and CTAs | Not started | Use only confirmed capabilities. |
| 3.3 Sewer Line Replacement | Complete replacement-intent page | Not started | Do not claim trenchless methods without confirmation. |
| 3.4 Water Service Line | Repair and confirmed replacement/installation scope | Not started | Clarify page split only if search intent and content depth justify it. |
| 3.5 Stormwater and Drainage | Complete stormwater/drainage intent coverage | Not started | May be one or two pages based on available proof and distinct intent. |
| 3.6 Site Excavation and Utility Trenching | Complete excavation/trenching page or justified split | Not started | Emphasize underground utility specialization. |
| 3.7 Commercial Services | Contractor, commercial, and municipal-ready service page | Not started | Must avoid unsupported certifications or procurement claims. |
| 3.8 Toledo service-area page | Unique Toledo content, not a city-name substitution page | Not started | First local landing page. |
| 3.9 About | Entity and trust page aligned with public business information | Not started | Requires authentic company facts from Sam. |
| 3.10 Contact and Request Service | Full inquiry workflow page | Not started | Builds on Phase 2 conversion components. |
| 3.11 Projects and case-study template | Gallery and reusable case-study structure with at least one real project if assets exist | Not started | Depends on Phase 0.5 assets and facts. |

## Phase 4 — Trust, legal, and polish

**Expected outcome:** The site is credible, legally presentable, machine-readable, performant, and accessible enough for launch review.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 4.1 Privacy, Terms, and Accessibility | Clean legal pages with no draft titles | Not started | Legal text must reflect the actual forms and tracking used. |
| 4.2 FAQ coverage | Strong FAQs on service pages or a justified FAQ hub | Not started | Answers must be concise, accurate, and based on confirmed operations. |
| 4.3 Structured data | Organization/LocalBusiness, Service, FAQ, and Breadcrumb schema | Not started | Schema must match visible content and the service-area business model. |
| 4.4 Image pipeline | Optimized WebP/AVIF assets with useful filenames, dimensions, and alt text | Not started | Depends on approved real photography. |
| 4.5 Mobile and accessibility QA | Keyboard, labels, contrast, responsive behavior, and CTA clearance verified | Not started | Foundation accessibility is present; complete route-level QA remains. |

## Phase 5 — Launch engineering

**Expected outcome:** Replace the Wix site without losing indexed URLs, leads, analytics, or the ability to recover the old site.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 5.1 Implement 301 redirects | Every discovered Wix URL resolves to the best new destination | Not started | Initial draft mappings exist; full crawl is required. |
| 5.2 Form, phone, and analytics QA | Every conversion path works and records correctly | Not started | Requires Phases 1.6 and 2. |
| 5.3 NAP consistency audit | Name, phone, and service area match the website and listings | Not started | Use canonical values from `site.ts`. |
| 5.4 Back up Wix site | Recoverable snapshot of the previous site | Not started | Complete immediately before migration. |
| 5.5 Deploy and submit sitemap | Production site is live and Search Console receives the sitemap | Not started | Hosting platform has not been selected. |
| 5.6 Broken-link, schema, and indexing check | Clean launch report | Not started | Run against the production domain after deployment. |

## Phase 6 — Expansion

**Expected outcome:** Expand organic reach and proof after the specialist core and conversion system are stable.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 6.1 Additional location pages | Unique pages for Holland, Maumee, Perrysburg, and other confirmed service areas | Not started | Each page needs local substance and must not be a city-name swap. |
| 6.2 Additional service pages | Further service splits only where confirmed scope and intent justify them | Not started | Do not create thin pages. |
| 6.3 Resources and articles | Useful articles from the planned topic list | Not started | Prioritize real customer questions and local underground utility concerns. |
| 6.4 More case studies | Ongoing project proof from real jobs | Not started | Establish a repeatable fact/photo collection process. |
| 6.5 Advertising and reporting | Optional pixels, call tracking, and monthly dashboard | Not started | Implement only after ownership, consent, and reporting needs are confirmed. |
| 6.6 Careers or financing | Pages only if these offerings become confirmed | Not started | Both remain excluded from current scope. |

## Current open inputs

- Confirm the email address or system that should receive Request Service submissions.
- Confirm who should receive immediate lead notifications.
- Determine whether GA4, GTM, Google Ads, Meta, call tracking, or a CRM already exists.
- Obtain permission to use real social-media project photos.
- Obtain 2–3 project summaries and matching images from Sam.
- Confirm whether `ohioflowco.com` was purchased for redirect use.
- Crawl the full Wix site before redirect implementation.

## Validation record

| Date | Scope | Result |
|---|---|---|
| August 6, 2026 | Phase 1.2 production build and lint | Passed |
| August 6, 2026 | Phase 1.3 production build, TypeScript checking, lint, and whitespace validation | Passed |
| August 6, 2026 | Phase 1.4 production build, rendered metadata inspection, social-image dimensions, lint, and whitespace validation | Passed |

## Progress log

| Date | Event |
|---|---|
| August 6, 2026 | Phase 0 decisions and remaining blockers were documented from the earlier planning conversation. |
| August 6, 2026 | Phase 1.1 scaffold was reconstructed because the repository contained no recoverable starting files. |
| August 6, 2026 | Phase 1.2 global conversion shell was completed and validated. |
| August 6, 2026 | Phase 1.3 design system was completed and validated. |
| August 6, 2026 | Phase 1.4 shared SEO shell was completed and validated. |
| August 6, 2026 | Living architecture and progress records were created for mandatory maintenance after future phases and subphases. |
