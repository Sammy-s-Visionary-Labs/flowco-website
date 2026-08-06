# Ohio Flow Co — Project Progress

**Progress status:** Phase 2.2 complete; Phase 2.1 delivery pending

**Last updated:** August 6, 2026

**Recommended next task:** Phase 2.1 — Select and configure the email delivery provider and adapter

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
| Phase 0 — Decisions and assets | In progress | Core brand, phone, positioning, service scope, domain, route direction, and the sole lead recipient are decided. Analytics ownership, photos, case studies, and the final Wix URL crawl remain open. |
| Phase 1 — Foundation | Complete | Phases 1.1 through 1.6 are implemented and validated. Live analytics activation still depends on the Phase 0.4 owner/account decision. |
| Phase 2 — Conversion system | In progress | The short Request Service form now supports residential, commercial, contractor, and municipal paths through one validation and submission flow. Email delivery, photos, confirmation, and production tracking remain. |
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
| 0.4 Lead destination and tracking owners | Agreed form recipient, notification owner, and account ownership | Awaiting input | Form submissions and immediate notifications will go only to `Ohioflowcollc@gmail.com`, with email as the initial handoff. GA4, GTM, Google Ads, Meta, call-tracking, and CRM ownership remain unconfirmed and paused. |
| 0.5 Real photos and project facts | Enough approved assets for the home page and at least one or two case studies | Awaiting input | The plan is to use approved Instagram/Facebook project images. Sam still needs to provide permission and 2–3 project summaries with location, problem, work performed, result, and photos. |
| 0.6 Wix URL inventory and redirect plan | Complete old-to-new map | Draft | A clean destination structure and initial redirect map exist. A full crawl of the live Wix site is still required before Phase 5. |

### Phase 0 summary

The project now has a stable specialist identity, confirmed lead recipient, and no unsupported service claims. Remaining Phase 0 inputs do not block local form development, but they still block live analytics, final proof content, and launch validation.

## Phase 1 — Foundation

**Expected outcome:** A maintainable technical foundation, persistent conversion shell, reusable visual system, shared SEO behavior, crawl files, and analytics hooks.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 1.1 Stack and project scaffold | Application runs locally with agreed framework and canonical constants | Complete | Created the Next.js 16 App Router scaffold with React 19, TypeScript, Tailwind CSS 4, ESLint, npm scripts, and `src/lib/site.ts`. The repository was initially empty, so the missing Phase 1.1 foundation was reconstructed. |
| 1.2 Global layout | Header, footer, navigation, and mobile call bar keep Call and Request Service reachable | Complete | Built the sticky responsive header, pathname-aware navigation, accessible mobile menu, shared Call/Request Service components, full footer, fixed mobile call bar, skip link, safe-area clearance, and flex-column root shell. |
| 1.3 Design system | Colors, typography, spacing, surfaces, and components match the industrial/local brief | Complete | Added semantic visual tokens, responsive gutters and section spacing, system font stacks, focus treatment, industrial grid motifs, and reusable Container, Section, Eyebrow, SectionHeading, Surface, and refined CTA primitives. Applied the system to the shell and kept the homepage minimal. |
| 1.4 Shared SEO shell | Reusable title, description, canonical, Open Graph, and breadcrumb behavior | Complete | Added typed metadata and canonical helpers, explicit homepage metadata, complete Open Graph/Twitter defaults, a validated social card, and an accessible breadcrumb primitive. |
| 1.5 Crawl files | `robots.txt`, sitemap, and `llms.txt` stub | Complete | Added production crawl endpoints, a canonical published-route registry, and a static machine-readable business summary. Only the substantive homepage is exposed until later routes are built. |
| 1.6 Analytics foundation | GA4/GTM integration points and event stubs | Complete | Added a dormant-by-default GTM loader, application-owned pageviews, conversion click events, typed form-event stubs, validation, and an activation contract. Live GA4 delivery awaits the confirmed production container and privacy/consent decision. |

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

### Phase 1.5 completion summary

- Added typed Next.js metadata routes for `/robots.txt` and `/sitemap.xml`.
- Added `src/lib/routes.ts` as the single inventory of substantive published routes.
- Limited the sitemap to the homepage while planned navigation destinations still return not found.
- Omitted invented modification dates, change-frequency hints, and priority values.
- Added a force-static `/llms.txt` route sourced from canonical brand, contact, city, and confirmed-service constants.
- Added the Phase 0 confirmed service scope to `src/lib/site.ts` so machine-readable output does not duplicate or expand business claims.
- Verified 200 responses, canonical URLs, response content types, sitemap scope, and production generation.
- Recorded that public previews still need provider-level crawl protection after hosting is selected.

### Phase 1.6 completion summary

- Added one root analytics integration using built-in `next/script`, without adding a dependency.
- Selected GTM as the sole future transport, with GA4 to be configured inside the confirmed production container.
- Added a typed, namespaced data-layer contract for pageviews, phone clicks, Request Service clicks, form starts, confirmed leads, and form errors.
- Added pathname-only pageview tracking for the initial route and distinct App Router route changes.
- Instrumented every shell Call and Request Service surface with bounded placement values.
- Added future form helpers that cannot accept contact details, messages, filenames, or arbitrary payloads.
- Kept third-party analytics dormant unless `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a valid `NEXT_PUBLIC_GTM_ID` are supplied.
- Added `.env.example` and `docs/analytics.md` with activation, GTM mapping, privacy boundary, and duplicate-prevention instructions.
- Verified disabled output contains no GTM request, a valid test configuration emits exactly one loader, and invalid enabled configuration fails the build clearly.
- Live GA4 receipt was not claimed or tested because account ownership, the production ID, and the privacy/consent approach remain unconfirmed.

## Phase 2 — Conversion system

**Expected outcome:** Every service inquiry reaches the correct person, produces a confirmation, and can be attributed to its source.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 2.1 Short Request Service form | Core contact, service, location, and source fields submit successfully | In progress | Built the `/request-service` route, short form, pure server validation, accessible error states, baseline honeypot, and fail-closed delivery boundary. Completion still requires a configured email provider to confirm external handoff. |
| 2.2 Residential and commercial paths | Distinct entry paths with appropriate questions | Complete | Added one accessible four-choice audience selector. Residential requests collect the person's property relationship; commercial, contractor, and municipal requests collect the company or organization name. Shared fields, validation, and submission remain unified. |
| 2.3 Photo upload | Photos are accepted, validated, and stored or forwarded safely | Not started | Photos will be forwarded without long-term cloud storage for now; file limits and safe forwarding still need implementation. |
| 2.4 Thank-you page and notification | Submitter receives confirmation and the team is notified | Not started | The sole recipient is confirmed as `Ohioflowcollc@gmail.com`; provider delivery and the thank-you route remain. |
| 2.5 Click-to-call tracking | Header, footer, menu, and call-bar interactions produce measurable events | Not started | Phase 1.6 now emits the foundation events; production GTM conversion mapping and end-to-end validation remain. |
| 2.6 CRM or email handoff | Leads arrive in the system Sam actually monitors | Not started | Email to `Ohioflowcollc@gmail.com` is the initial handoff; provider configuration and end-to-end receipt validation remain. |

### Phase 2.1 in-progress summary

- Added a noindex `/request-service` page with canonical metadata, explicit breadcrumb, contact fallback, and Northwest Ohio service-area context.
- Added required name, phone, service, city, ZIP, and self-reported source fields, plus optional email and project details.
- Kept residential/commercial branching, company-specific questions, and photo uploads out of the Phase 2.1 form.
- Added one pure form-data parser and validator with trimming, allowlisted services and sources, phone/email/ZIP checks, length limits, duplicate/non-string rejection, and a honeypot.
- Added a Server Action and server-only delivery boundary. The boundary fails closed until an email provider confirms handoff; it does not log, temporarily store, or falsely acknowledge leads.
- Added accessible linked error summaries, field-level errors, pending-state protection, value preservation, and a phone fallback on submission failure.
- Wired `ofc_form_start` and bounded validation/submission error events. `ofc_generate_lead` remains gated behind confirmed external delivery.
- Added a zero-dependency unit-test harness with validator and delivery-orchestration coverage.
- Kept the honeypot as baseline protection only; provider-compatible abuse controls, idempotency, and safe email rendering are required before outbound delivery is enabled.
- Kept `/request-service` out of the published-route registry while delivery is incomplete.

### Phase 2.2 completion summary

- Added four explicit project audiences: residential, commercial, contractor, and municipal/public agency.
- Kept one Request Service form and one Server Action instead of duplicating audience-specific forms.
- Added progressive disclosure that works before React hydration: residential requests reveal a property-relationship field, while the other three paths reveal a company or organization field.
- Kept both conditional controls mounted so entered values survive path changes and failed submissions; only the currently relevant path is validated and shown as erroneous.
- Added allowlisted server validation for audience and residential relationship, normalized organization-name validation, duplicate/non-string rejection for active fields, and safe rejection of tampered audience values.
- Converted the validated delivery contract to a discriminated lead shape that physically omits the inactive audience field before any provider adapter receives it.
- Added regression coverage for all four audiences, active and inactive conditional fields, malformed data, value preservation, and exact delivery payload minimization.
- Kept photo uploads, provider-backed email, and live analytics activation out of Phase 2.2 as planned.

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

- Select and configure the outbound email provider, verified sender, and secret credentials needed to deliver requests to `Ohioflowcollc@gmail.com`.
- Select a Vercel-compatible rate limit or bot challenge before email activation; the delivery adapter must also define retry idempotency and escape all lead content outside static email headers.
- Confirm who owns the production GTM container and GA4 property, obtain the production GTM ID, and decide the privacy/consent approach before activation.
- Determine whether Google Ads, Meta, call tracking, or a CRM already exists.
- Confirm Vercel as the production host; it is the current preferred but not yet locked target.
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
| August 6, 2026 | Phase 1.5 production build, lint, whitespace validation, direct HTTP status/content-type checks, and crawl-output inspection | Passed |
| August 6, 2026 | Phase 1.6 lint, disabled production build, configured test build, invalid-config fail-closed check, rendered-loader count, CTA instrumentation inspection, and whitespace validation | Passed |
| August 6, 2026 | Phase 2.1 validator and delivery-state unit tests (15), production build, TypeScript checking, lint, rendered 200/noindex metadata check, and direct valid-submission fail-closed check | Passed; entered values were preserved, no false success appeared, and provider delivery intentionally remains unconfigured |
| August 6, 2026 | Phase 2.2 audience-path validation and delivery-state unit tests (23 total), production build, TypeScript checking, lint, whitespace validation, rendered 200/noindex form check, and direct non-residential fail-closed submission | Passed; all four paths render through one form, inactive data is omitted, the selected non-residential path and normalized organization value were preserved, and no false success appeared |

## Progress log

| Date | Event |
|---|---|
| August 6, 2026 | Phase 0 decisions and remaining blockers were documented from the earlier planning conversation. |
| August 6, 2026 | Phase 1.1 scaffold was reconstructed because the repository contained no recoverable starting files. |
| August 6, 2026 | Phase 1.2 global conversion shell was completed and validated. |
| August 6, 2026 | Phase 1.3 design system was completed and validated. |
| August 6, 2026 | Phase 1.4 shared SEO shell was completed and validated. |
| August 6, 2026 | Phase 1.5 crawl files and canonical published-route inventory were completed and validated. |
| August 6, 2026 | Phase 1.6 dormant analytics foundation, typed event contract, and conversion-shell instrumentation were completed and validated. |
| August 6, 2026 | Phase 2.1 began with the short Request Service form, validation and test contracts, form analytics, and a server delivery boundary that fails closed pending provider setup. |
| August 6, 2026 | Phase 2.2 completed the residential, commercial, contractor, and municipal Request Service paths with conditional questions, one shared server contract, minimized delivery payloads, and expanded regression coverage. |
| August 6, 2026 | Living architecture and progress records were created for mandatory maintenance after future phases and subphases. |
