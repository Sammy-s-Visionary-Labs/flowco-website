# Ohio Flow Co — Project Progress

**Progress status:** Phase 2 is complete for the current build scope with analytics activation deferred; Phase 3.1 and 3.3–3.8 are complete, while Phase 3.2 proof and Phase 3.9 owner-content review remain in progress

**Last updated:** August 11, 2026

**Recommended next task:** Continue Phase 3.10 while approved project proof for Phase 3.2 and authentic owner/company facts for Phase 3.9 remain tracked inputs

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
- **Deferred:** Intentionally postponed until a later project gate; completed foundations remain preserved.
- **Awaiting input:** Progress depends on a business decision or asset from the owner.
- **Draft:** A working direction exists but must be verified before launch.
- **Not started:** The dedicated subphase has not begun; reusable foundations from earlier phases may already exist.

## Current snapshot

| Phase | Status | Current summary |
|---|---|---|
| Phase 0 — Decisions and assets | In progress | Core brand, positioning, service scope, domain, and route direction are decided. Phone, public email, and lead recipient are temporarily overridden with test values and must be reconfirmed for production. Analytics ownership, approved marketing photos, case studies, and the Wix URL crawl remain open. |
| Phase 1 — Foundation | Complete | Phases 1.1 through 1.6 are implemented and validated. Live analytics activation still depends on the Phase 0.4 owner/account decision. |
| Phase 2 — Conversion system | Complete | Phases 2.1–2.4 and 2.6 are complete, including provider-confirmed Vercel Preview submissions and mailbox/attachment delivery. Phase 2.5 application coverage is complete; the owner intentionally deferred external GTM/GA4 activation until the website is otherwise ready for pre-launch integration. |
| Phase 3 — Core pages | In progress | Phase 3.1 and 3.3–3.8 are complete. Phase 3.2 has complete service-page structure and copy but cannot meet its proof requirement until approved real assets exist. The integrated Phase 3.9 About page remains in owner-content review; Phases 3.10 and 3.11 have not begun. |
| Phase 4 — Trust, legal, and polish | Not started | Legal pages, structured data, image pipeline, and final QA remain. |
| Phase 5 — Launch engineering | Not started | Redirects, deployment, and launch validation remain. |
| Phase 6 — Expansion | Not started | Location expansion, articles, additional case studies, and reporting remain. |

## Confirmed owner directions

- Use the supplied Ohio Flow Co brand guide for the visual system. The descriptor is **Sewer, Water, Drainage & Excavation**, and the provided logo artwork may be extracted into website-ready SVG exports.
- Use `(419) 709-5808`, `tel:+14197095808`, and `Ohioflowcollc@gmail.com` as the owner-confirmed production phone, clickable destination, public email, and Request Service notification recipient everywhere on the site.
- Do not add an application-owned persistent photo store for customer uploads at this stage.
- Treat Vercel as the preferred but unconfirmed production host. If another host is chosen, revalidate Node/Sharp support, request and memory limits, abuse controls, and preview indexing behavior.
- Keep analytics configuration as disabled placeholders. Inventory any existing GA4, GTM, advertising, call-tracking, and CRM accounts before creating or enabling production integrations.
- Finish building the website before integrating Google Analytics. Preserve the application event contract and tracked call primitives, then activate and verify the external GTM/GA4 mapping during pre-launch work.
- Use Resend for lead notification. Send only from `requests@notifications.ohioflowco.com` on the verified `notifications.ohioflowco.com` domain and only to `Ohioflowcollc@gmail.com`; keep the API key server-only in Vercel.
- Publish only confirmed company facts and services. Real project photography and case-study facts require permission; unsupported service, emergency, financing, or procurement claims remain excluded.

## Current project safeguards and working plans

- Treat customer-uploaded photos as sanitized service-request evidence, not reusable marketing assets, unless separate permission is obtained.
- Resend processes and may retain lead text and sanitized attachments under its policy. Delivered email remains in the company mailbox until deletion; the account setting and mailbox retention/deletion practices must be understood and reflected in the Privacy Policy.
- Customer email remains optional. No customer autoresponder is authorized. Phase 2.4 uses a same-page confirmation only after provider-confirmed delivery, explains next steps without promising timing, and retains a phone path.
- Canonical contact data is marked production-ready. Production form delivery remains fail-closed under a separate readiness gate until rate limiting and production re-verification are complete; retention approval also remains a launch requirement.

## Phase 0 — Decisions and assets

**Expected outcome:** Remove business, contact, service, asset, lead-routing, and URL blockers before they can create inconsistent implementation.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 0.1 Brand identity and domain | One canonical public name, legal name, and primary domain | Complete | Locked **Ohio Flow Co** as the display/legal brand and `toledosewerandwater.com` as the primary domain. Buying `ohioflowco.com` is recommended as a redirect but is not confirmed. |
| 0.2 Public phone | One number used everywhere | Complete | The site consistently uses the owner-confirmed `(419) 709-5808` and `tel:+14197095808`. |
| 0.3 Offered services | Written yes/no service list | Complete | Locked the underground sewer, water, stormwater, drainage, excavation, trenching, commercial, and contractor/municipal scope. Unconfirmed services are explicitly excluded. |
| 0.4 Lead destination and tracking owners | Agreed form recipient, notification owner, and account ownership | Partial | Public email and form notifications use the owner-confirmed `Ohioflowcollc@gmail.com`. GA4, GTM, Google Ads, Meta, call-tracking, and CRM ownership remain unconfirmed and paused. |
| 0.5 Real photos and project facts | Enough approved assets for the home page and at least one or two case studies | Awaiting input | The plan is to use approved Instagram/Facebook project images. Sam still needs to provide permission and 2–3 project summaries with location, problem, work performed, result, and photos. |
| 0.6 Wix URL inventory and redirect plan | Complete old-to-new map | Draft | A clean destination route direction exists, but no source-URL inventory or old-to-new redirect-map artifact exists yet. Crawl the live Wix site before creating and implementing the Phase 5 map. |

### Phase 0 summary

The project now has a stable specialist identity, owner-confirmed production contacts, and no unsupported service claims. Remaining Phase 0 inputs include analytics ownership, final proof content, redirect mapping, and launch validation.

## Phase 1 — Foundation

**Expected outcome:** A maintainable technical foundation, persistent conversion shell, reusable visual system, shared SEO behavior, crawl files, and analytics hooks.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 1.1 Stack and project scaffold | Application runs locally with agreed framework and canonical constants | Complete | Created the Next.js 16 App Router scaffold with React 19, TypeScript, Tailwind CSS 4, ESLint, npm scripts, and `src/lib/site.ts`. The repository was initially empty, so the missing Phase 1.1 foundation was reconstructed. |
| 1.2 Global layout | Header, footer, navigation, and mobile call bar keep Call and Request Service reachable | Complete | Built the sticky responsive header, pathname-aware navigation, accessible mobile menu, shared Call/Request Service components, full footer, fixed mobile call bar, skip link, safe-area clearance, and flex-column root shell. |
| 1.3 Design system | Colors, typography, spacing, surfaces, and components match the industrial/local brief | Complete | Added semantic visual tokens, responsive gutters and section spacing, system font stacks, focus treatment, industrial grid motifs, and reusable Container, Section, Eyebrow, SectionHeading, Surface, and refined CTA primitives. Applied the system to the shell and kept the homepage minimal. |
| 1.4 Shared SEO shell | Reusable title, description, canonical, Open Graph, and breadcrumb behavior | Complete | Added typed metadata and canonical helpers, explicit homepage metadata, complete Open Graph/Twitter defaults, a validated social card, and an accessible breadcrumb primitive. |
| 1.5 Crawl files | `robots.txt`, sitemap, and `llms.txt` stub | Complete | Added crawl endpoints, a canonical crawl-surface registry, and a static machine-readable business summary. The registry now contains the substantive Phase 3 homepage, service, commercial, service-area, and About routes. |
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
- Updated the header, footer, and initial placeholder page to consume the shared system; Phase 3.1 later replaced that placeholder with the full homepage.

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
- Added `src/lib/routes.ts` as the single crawl-surface inventory.
- Initially limited the sitemap to `/` as a temporary validation entry. Phase 3 later replaced the placeholder homepage and added only substantive core pages to the same canonical route registry.
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
| 2.1 Short Request Service form | Core contact, service, location, and source fields submit successfully | Complete | Built the `/request-service` route, short form, pure server validation, accessible error states, baseline honeypot, confirmed-receipt boundary, and Resend adapter. No-photo and photo submissions completed the provider and mailbox handoff in a protected Vercel Preview. |
| 2.2 Residential and commercial paths | Distinct entry paths with appropriate questions | Complete | Added one accessible four-choice audience selector. Residential requests collect the person's property relationship; commercial, contractor, and municipal requests collect the company or organization name. Shared fields, validation, and submission remain unified. |
| 2.3 Photo handling | Photos are selected, validated, normalized, and passed safely to the delivery boundary without application persistence | Complete | Added optional JPEG/PNG/WebP selection for up to three photos and 3 MiB combined. Files are decoded under strict limits, resized and re-encoded as EXIF/GPS/ICC/IPTC/XMP-stripped JPEG attachments, held only for the request, and passed to the fail-closed boundary. The generated `project-photo-1.jpg` was delivered and opened successfully in the live Phase 2.6 Preview test. |
| 2.4 Post-delivery thank-you experience | Submitter receives confirmation only after provider-confirmed delivery | Complete | Implemented a focused same-page confirmation that replaces the form, explains review and follow-up, prevents accidental duplicate submission, and supports an explicit second request. Both live Preview tests showed this state only after provider-confirmed handoff. |
| 2.5 Click-to-call tracking | Header, footer, menu, call-bar, and page interactions produce measurable events | Deferred | Completed typed application-side coverage for every rendered `tel:` link, including the Phase 3 pages and Request Service failure/confirmation states, with privacy-safe placement-only payloads. The owner intentionally deferred production GTM/GA4 mapping, consent activation, duplicate checks, and receipt validation until pre-launch. |
| 2.6 Provider email handoff and internal notification | Leads and attachments reach the configured internal mailbox with a durable provider receipt | Complete | Implemented Resend delivery from the verified notification subdomain to the sole testing recipient, static headers, plain-text content, sanitized attachments, deterministic idempotency, Vercel-secret handling, and durable-receipt validation. Protected Vercel Preview tests delivered both no-photo and photo emails; the generated JPEG attachment arrived and opened successfully. Production still requires replacing all test contacts. |

### Phase 2.1 completion summary

- Added a noindex `/request-service` page with canonical metadata, explicit breadcrumb, contact fallback, and Northwest Ohio service-area context.
- Added required name, phone, service, city, ZIP, and self-reported source fields, plus optional email and project details.
- The initial 2.1 increment intentionally excluded audience branching and photos; Phases 2.2 and 2.3 later extended the same form and Server Action without changing the 2.1 handoff boundary.
- Added one pure form-data parser and validator with trimming, allowlisted services and sources, phone/email/ZIP checks, length limits, duplicate/non-string rejection, and a honeypot.
- Added a Server Action and server-only delivery boundary. The boundary fails closed until an email provider confirms handoff; it does not log, temporarily store, or falsely acknowledge leads.
- Added accessible linked error summaries, field-level errors, pending-state protection, value preservation, and a phone fallback on submission failure.
- Wired `ofc_form_start` and bounded validation/submission error events. `ofc_generate_lead` remains gated behind confirmed external delivery and became reachable in the live Preview tests.
- Added a zero-dependency unit-test harness with validator and delivery-orchestration coverage.
- Kept the honeypot as baseline protection only. Rate limiting or a bot challenge remains required before public image-processing traffic; idempotency and safe email rendering are implemented.
- Kept `/request-service` `noindex` and out of the published-route registry because test contacts and the public abuse-control gate still make it prelaunch-only.
- Completed the external handoff gate on August 11, 2026: the protected Vercel Preview accepted representative no-photo and photo requests, returned provider-gated confirmation, and delivered both messages to the testing mailbox.

### Phase 2.2 completion summary

- Added four explicit project audiences: residential, commercial, contractor, and municipal/public agency.
- Kept one Request Service form and one Server Action instead of duplicating audience-specific forms.
- Added progressive disclosure that works before React hydration: residential requests reveal a property-relationship field, while the other three paths reveal a company or organization field.
- Kept both conditional controls mounted so entered values survive path changes and failed submissions; only the currently relevant path is validated and shown as erroneous.
- Added allowlisted server validation for audience and residential relationship, normalized organization-name validation, duplicate/non-string rejection for active fields, and safe rejection of tampered audience values.
- Converted the validated delivery contract to a discriminated lead shape that physically omits the inactive audience field before any provider adapter receives it.
- Added regression coverage for all four audiences, active and inactive conditional fields, malformed data, value preservation, and exact delivery payload minimization.
- Kept photo uploads, provider-backed email, and live analytics activation out of Phase 2.2 as planned.

### Phase 2.3 completion summary

- Added one optional native photo picker to the shared Request Service form with keyboard, touch, and no-JavaScript support.
- Limited normal selections to three JPEG, PNG, or WebP files and 3 MiB combined, with shared browser preflight and authoritative server checks. The form displays “MB” in customer-facing copy.
- Raised the Server Action body ceiling to 4 MiB, leaving headroom below the provisional Vercel Function limit while keeping request parsing bounded.
- Rejected mixed/non-file values, unsupported or mismatched formats, corrupt containers, excessive dimensions, excessive decoded channels, and oversized selections before delivery.
- Added request-scoped image normalization: accepted files are decoded with a 20-megapixel cap, auto-oriented, reduced to at most 1920 pixels per side, flattened, and re-encoded as JPEG.
- Removed EXIF, GPS, ICC, IPTC, XMP, original filenames, and browser file metadata from the delivery payload; attachment names are generated by the application.
- Kept bytes out of action state, analytics, logs, caches, databases, temporary files, and separate website storage. Phase 2.6 selected Resend, which processes and may retain final attachments under its policy; delivered email remains in the recipient mailbox until deletion.
- Added accessible field errors and focused notices explaining that browsers clear file selections after a failed attempt and photos must be chosen again.
- Extended the delivery contract to carry sanitized attachments alongside the minimized audience-specific lead while retaining the confirmed-receipt success gate.
- Fixed the untouched optional-photo path after runtime testing exposed React/Next's synthetic zero-byte `blob` file. The server now normalizes only one exact empty native or reconstructed sentinel to no attachment, while named, altered, repeated, or mixed zero-byte entries remain invalid.
- Originally kept actual external forwarding fail-closed for Phase 2.6. The implemented Resend adapter now receives the normalized output, and the live Preview test delivered an attachment named `project-photo-1.jpg` that opened successfully.

### Phase 2.4 completion summary

- Replaced the small generic success notice with a dedicated same-page confirmation experience; no separate thank-you route or crawl surface was added.
- Kept success unreachable unless the delivery adapter returns `confirmed` with a nonblank provider receipt. Validation, spam, unconfigured delivery, thrown failures, and blank receipts continue to show no confirmation.
- Replaced the form after success so an ordinary extra click cannot submit the same request twice. A clearly labeled second-request button restores the cleared form and moves focus to the name field.
- Added restrained next-step guidance: Ohio Flow Co reviews the request and any photos, then follows up using the submitted phone or optional email. The copy makes no response-time, scheduling, emergency-service, or email-receipt promise.
- Kept provider receipts, submitted values, filenames, and attachments out of confirmation state and rendered copy.
- Retained the test phone path for additions or immediate discussion and kept the existing `ofc_generate_lead` event behind the same confirmed-delivery state.
- Expanded the unit suite to 33 tests, including receipt non-disclosure and processing another request from a prior confirmed state.
- The protected Vercel Preview showed provider-gated same-page success for both no-photo and photo submissions, and both corresponding emails arrived in the testing mailbox.

### Phase 2.5 deferred summary

- Audited every active phone surface: desktop header, mobile menu, persistent mobile call bar, footer number and CTA, Request Service page CTA, unconfirmed-submission fallback, and confirmed-submission follow-up.
- Added a shared inline `PhoneLink` and retained the styled `CallLink`; these are now the only components that emit `tel:` destinations.
- Centralized phone event attributes in a typed helper so every call action uses `ofc_phone_click` and one allowlisted placement.
- Closed the two previously untracked Request Service inline phone links without changing their visible design or navigation behavior.
- Kept payloads limited to `cta_location`. Phone numbers, email addresses, routes, customer data, form values, and uploaded-file information are excluded.
- Added regression coverage for all allowed placements and the exact privacy-safe data-layer event. Phase 3 integration extended that guard so every source phone link must still use a shared tracked primitive.
- Kept GTM and GA4 disabled. The application-side deliverable is complete; external activation and single-mapping verification in GTM Preview and GA4 DebugView are intentionally deferred until pre-launch.

### Phase 2.6 completion summary

- Selected Resend for the testing handoff using the owner-verified `notifications.ohioflowco.com` sending domain and static sender `requests@notifications.ohioflowco.com`.
- Kept the sole testing recipient at `needytrooper04@gmail.com`. Submitted names, emails, phone numbers, and other values cannot control sender, recipient, subject, or reply headers; no customer autoresponder was added.
- Added a plain-text internal notification that converts validated option IDs to readable labels and includes the minimized lead fields only in the message body.
- Passed generated JPEG attachments directly to Resend as Base64 request content. The application still creates no filesystem, database, cache, object-store, or other durable photo copy.
- Narrowed the delivery attachment type to its runtime `image/jpeg` invariant.
- Added a versioned SHA-256 idempotency key derived from the normalized lead and attachment payload. Identical retries converge on one Resend operation during its 24-hour idempotency window; changed normalized text or attachment bytes produce a new key.
- Reads `RESEND_API_KEY` only at the server boundary. The owner has stored it in Vercel; it is absent from source, public environment variables, client state, logs, and local example values.
- Added a 10-second provider timeout and fail-closed handling for missing credentials, HTTP errors, malformed receipts, timeouts, and network failures. Only a nonblank Resend email ID unlocks the existing success state, and that receipt never reaches the browser.
- Blocked Vercel production delivery while canonical contact data remains marked test-only. Live testing was therefore completed on a protected Preview deployment.
- Expanded the suite to 40 tests and passed lint, whitespace validation, TypeScript checking, and a production build. Tests cover opaque/stable idempotency, exact static email routing, safe body/attachment construction, secret/idempotency headers, provider failures, receipt validation, and the test-contact production guard.
- Completed live verification on August 11, 2026. The Preview returned same-page success for a no-photo request and a photo request; the owner confirmed both emails arrived at the testing recipient and that `project-photo-1.jpg` arrived and opened. This closes Phase 2.1's delivery gate and Phase 2.4's external-verification gate.

## Phase documentation audit through Phase 3 core-page integration

This audit compares the repository, phase ledger, architecture change log, and decision register. It confirms completion only where the bounded deliverable exists and has validation evidence.

| Subphase | Audit result | Documentation coverage |
|---|---|---|
| 0.1 | Complete | Brand/domain decisions B-001–B-003 and the unresolved redirect-domain purchase are recorded. |
| 0.2 | Awaiting input | Historical phone decision B-004, active test override B-022, and the pre-production replacement gate are recorded; the real production contact remains unconfirmed. |
| 0.3 | Complete | Confirmed service scope, specialist positioning, and excluded claims are recorded in B-006–B-008 and canonical service data. |
| 1.1 | Complete | Stack, package/runtime requirements, strict TypeScript, build path, canonical data, and scaffold reconstruction are recorded. |
| 1.2 | Complete | Global shell, conversion surfaces, responsive breakpoint, mobile behavior, and accessibility foundations are recorded. |
| 1.3 | Complete | Semantic tokens, typography, spacing, components, contrast decision, and the later Phase 3.1 replacement of the original placeholder are recorded. |
| 1.4 | Complete | Metadata composition, canonical rules, social card, breadcrumbs, and deferred SEO work are recorded. |
| 1.5 | Complete | Crawl endpoints and the canonical substantive-route registry are recorded; the original temporary homepage exception is superseded by the completed Phase 3.1 page. |
| 1.6 | Complete | Dormant GTM transport, typed events, data minimization, duplicate prevention, account-inventory pause, and activation gates are recorded. |
| 2.1 | Complete | The short form, server-authoritative validation, fail-closed handoff, success gate, anti-spam baseline, and provider/mailbox-backed Preview verification are recorded. |
| 2.2 | Complete | Four audiences, conditional fields, progressive disclosure, active-field validation, and minimized discriminated payloads are recorded. |
| 2.3 | Complete | Exact upload envelope, Sharp/Node constraints, EXIF/GPS/ICC/IPTC/XMP removal, accessibility/reselection behavior, request-only retention, and provider deferral are recorded. |
| 2.4 | Complete | Same-page confirmation, focus behavior, next-step copy, duplicate-submission protection, second-request handling, receipt/data minimization, and the provider-backed no-photo/photo Preview proof are recorded. |
| 2.5 | Deferred | Complete application-side phone-link coverage, the typed placement-only payload, shared primitives, data minimization, and the owner-directed pre-launch deferral of external analytics activation are recorded. |
| 2.6 | Complete | Resend selection, verified sender, sole testing recipient, Vercel secret boundary, static headers, plain-text content, normalized attachments, idempotency, fail-closed behavior, provider receipt, privacy implications, and completed live verification are recorded. |
| 3.1 | Complete | Full homepage hierarchy, confirmed service scope, service-area context, conversion paths, responsive behavior, and restrained motion are recorded. |
| 3.2 | In progress | The sewer-repair intent page, process, FAQs, metadata, breadcrumbs, and CTAs are implemented; the defined proof requirement remains blocked by Phase 0.5 approved assets and facts. |
| 3.3–3.8 | Complete | The remaining core service pages, commercial path, service hub, service-area hub, and unique Toledo page are implemented and recorded with their content-combination and claim-safety decisions. |
| 3.9 | In progress | A substantive About page is integrated and tracked correctly, but authentic owner/company narrative and final factual approval are still required. |

Phase 0.2 and 0.4–0.6 remain partial or awaiting input. Phase 2 is complete for the current website-build scope; external analytics activation is explicitly deferred rather than treated as an active blocker. Phase 3 is in progress, with proof and authentic owner facts preventing overstatement of Phases 3.2 and 3.9. No Phase 4, 5, or 6 subphase is recorded as complete.

## Phase 3 — Core pages

**Expected outcome:** Publish the first complete set of pages needed to explain the company, rank for core local searches, establish trust, and generate qualified inquiries.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 3.1 Home | First screen answers what Ohio Flow Co does, where it works, and how to contact it | Complete | Replaced the Phase 1 placeholder with a full conversion homepage using confirmed services, Northwest Ohio coverage, shared tracked CTAs, service pathways, process guidance, and responsive visual treatment. |
| 3.2 Sewer Line Repair | Complete intent page with scope, process, proof, FAQs, and CTAs | In progress | Intent, scope, signs, process, FAQs, metadata, breadcrumbs, and CTAs are complete. Approved real project proof does not yet exist, so no proof was invented or substituted. |
| 3.3 Sewer Line Replacement | Complete replacement-intent page | Complete | Added a substantive replacement-intent page without claiming unconfirmed trenchless methods. |
| 3.4 Water Service Line | Repair and confirmed replacement/installation scope | Complete | Combined repair and replacement/installation in one substantive page because current confirmed scope and content depth do not justify a thin split. |
| 3.5 Stormwater and Drainage | Complete stormwater/drainage intent coverage | Complete | Combined stormwater and drainage in one substantive intent page while retaining both user needs and avoiding unsupported proof claims. |
| 3.6 Site Excavation and Utility Trenching | Complete excavation/trenching page or justified split | Complete | Combined excavation and trenching in one page centered on underground utility work; current content does not justify separate thin routes. |
| 3.7 Commercial Services | Contractor, commercial, and municipal-ready service page | Complete | Added distinct commercial, contractor, and municipal pathways without unsupported certification, emergency, capacity, or procurement claims. |
| 3.8 Toledo service-area page | Unique Toledo content, not a city-name substitution page | Complete | Added a service-area hub and a unique Toledo page with locally relevant water, sewer, and stormwater context rather than a reusable city-name template. |
| 3.9 About | Entity and trust page aligned with public business information | In progress | Integrated a substantive page built only from confirmed positioning and service facts, and corrected its phone CTA to use shared tracking. Authentic owner history, team facts, and final owner approval remain required. |
| 3.10 Contact and Request Service | Full inquiry workflow page | Not started | The Phase 2 Request Service route is a reusable foundation; the dedicated Phase 3 contact/content scope has not begun. |
| 3.11 Projects and case-study template | Gallery and reusable case-study structure with at least one real project if assets exist | Not started | Depends on Phase 0.5 assets and facts. |

### Phase 3.1 completion summary

- Replaced the development placeholder with a complete, responsive homepage that explains the company, confirmed underground utility services, Northwest Ohio coverage, working process, and conversion options.
- Used shared Call and Request Service primitives for every conversion surface and kept the phone payload privacy-safe.
- Added restrained hero motion with a reduced-motion fallback and no invented project photography or proof.

### Phase 3.2–3.8 implementation summary

- Added a published `/services` hub and substantive pages for sewer repair, sewer replacement, water service lines, stormwater and drainage, excavation and trenching, and commercial work.
- Used typed page-owned content in `service-pages.ts` with one shared rendering component so structure stays consistent while headings, intent, scope, process, FAQs, and metadata remain route-specific.
- Combined water repair/replacement, stormwater/drainage, and excavation/trenching where the confirmed scope and available content did not justify thin page splits.
- Added a service-area hub and a unique Toledo page using locally relevant public infrastructure context; future city routes still require distinct local substance.
- Kept public copy customer-facing and restricted to confirmed capabilities. Internal editorial notes, unsupported certifications, emergency claims, financing claims, procurement claims, and fabricated proof were excluded.
- Added canonical metadata, breadcrumbs, published-route registration, and tracked CTAs throughout. Main navigation now exposes only implemented substantive routes; Residential, Projects, and Resources will return when those destinations exist. Planned legal links stay in canonical navigation data but do not render until their Phase 4 pages are published.
- Phase 3.2 remains in progress solely because its expected deliverable includes real proof. Approved photos and project facts are still required before that claim can be closed.

### Phase 3.9 integration summary

- Integrated the contributed About page without replacing the validated Phase 2.6 form, delivery, upload, and analytics foundations.
- Rewrote implementation-facing language as public company copy and routed its phone action through the shared tracked phone primitive.
- Kept the phase in progress because the owner has not yet supplied authentic company-history, team, experience, or operating facts needed for final trust content.

## Phase 4 — Trust, legal, and polish

**Expected outcome:** The site is credible, legally presentable, machine-readable, performant, and accessible enough for launch review.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 4.1 Privacy, Terms, and Accessibility | Clean legal pages with no draft titles | Not started | Legal text must cover contact data, free text, photo normalization, no application photo store, email-provider/company-mailbox retention, no marketing reuse without permission, and analytics only if later activated. |
| 4.2 FAQ coverage | Strong FAQs on service pages or a justified FAQ hub | Not started | Answers must be concise, accurate, and based on confirmed operations. |
| 4.3 Structured data | Organization/LocalBusiness, Service, FAQ, and Breadcrumb schema | Not started | Schema must match visible content and the service-area business model. |
| 4.4 Image pipeline | Optimized WebP/AVIF assets with useful filenames, dimensions, and alt text | Not started | Depends on approved real photography. |
| 4.5 Mobile and accessibility QA | Keyboard, labels, contrast, responsive behavior, and CTA clearance verified | Not started | Foundation accessibility and implementation-level checks exist; the dedicated cross-device, browser-interaction, and route-level QA subphase has not begun. |

## Phase 5 — Launch engineering

**Expected outcome:** Replace the Wix site without losing indexed URLs, leads, analytics, or the ability to recover the old site.

| Subphase | Expected deliverable | Status | Work completed or remaining |
|---|---|---|---|
| 5.1 Implement 301 redirects | Every discovered Wix URL resolves to the best new destination | Not started | No source Wix inventory or redirect-map artifact exists yet; crawl first, then create and verify the map. |
| 5.2 Form, phone, and analytics QA | Every conversion path works and records correctly | Not started | Earlier implementation-level checks exist, but production end-to-end QA requires completed delivery, analytics activation decisions, deployment, and removal of all test contact values. |
| 5.3 NAP consistency audit | Name, phone, and service area match the website and listings | Not started | This is a production gate: replace the test phone/email/recipient in `site.ts`, set `contactDataStatus.productionReady` only after owner confirmation, and verify the resulting values against company listings. |
| 5.4 Back up Wix site | Recoverable snapshot of the previous site | Not started | Complete immediately before migration. |
| 5.5 Deploy and submit sitemap | Production site is live and Search Console receives the sitemap | Not started | Hosting is unconfirmed, and production deployment is blocked while `contactDataStatus.productionReady` is false. |
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

- Select a deployment-compatible rate limit or bot challenge before `/request-service` is exposed publicly. Retry idempotency and static non-customer headers are implemented, but they do not replace request-frequency abuse protection.
- Decide and document lead/photo retention and deletion for the email provider and company mailbox before the Privacy Policy is finalized.
- During pre-launch work, inventory existing GTM, GA4, Google Ads, Meta, call-tracking, and CRM accounts; confirm ownership, obtain the production GTM ID if one exists, and decide privacy/consent before activation. This is intentionally deferred while the website is built; do not create replacement production accounts without approval.
- Confirm Vercel as the production host. If a different host is selected, revalidate request limits, Node/Sharp/native bundling, memory behavior, abuse controls, and preview crawl protection.
- Obtain permission to use real social-media project photos. This blocks the proof portion of Phase 3.2 and the project work in Phase 3.11.
- Obtain 2–3 project summaries and matching images from Sam, plus authentic company-history/team facts for final Phase 3.9 review.
- Confirm whether `Keeping Northwest Ohio Flowing.` is approved as the public tagline.
- Confirm whether `ohioflowco.com` was purchased for redirect use.
- Crawl the full Wix site, inventory every source URL, and create the first old-to-new redirect map before implementation.

## Current technical follow-ups

- Obtain the licensed Sonar Sans webfont files if exact guide typography is required in-browser; the current design requests Sonar Sans and uses a deliberate local/system fallback without remote font loading.
- Replace the two narrative brand/city literals in the Request Service page with canonical `site.ts` values, or keep them explicitly reviewed with canonical-data changes.
- The protected Vercel Preview verified the Sharp/native image path and provider attachment encoding. Revalidate the 4 MiB Server Action envelope, multipart behavior, rate limiting, and production delivery on the final production host.
- Follow `docs/email-delivery.md` for the completed Preview verification record and the remaining retention, abuse-control, and production-reverification gates.
- Confirm the working tagline before public release. If it changes, update canonical data and rendered copy and regenerate `public/og.png`, where the current tagline is baked into the image.
- Complete full browser, responsive, keyboard, assistive-technology, and production conversion QA in Phases 4.5 and 5.2; Phase 3 integration checks are route-level implementation checks rather than a final launch certification.

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
| August 7, 2026 | Phase 2.3 upload and delivery-boundary tests (31 total), real image decoding/re-encoding, corrupt-container and pixel-limit checks, embedded-metadata removal checks, production build, TypeScript checking, lint, whitespace validation, rendered upload-control check, and direct multipart fail-closed submission | Passed; valid photos were normalized into generated JPEG attachments, original filenames and EXIF/GPS/ICC/IPTC/XMP data were removed, text values were preserved, the reattachment notice appeared, and no false success or persistent website storage was introduced |
| August 7, 2026 | Phase 2.3 no-photo runtime regression reproduction, expanded unit suite (32 total), lint, whitespace validation, and isolated production build | Passed; the React/Next multipart decoder's zero-byte `blob` sentinel is treated as no optional upload, delivery receives an empty attachment list, malformed sentinel variants remain rejected, no photo-reselection state is returned for a no-photo request, and the optimized build completes without disturbing the active development server |
| August 7, 2026 | Phase 1.1 scaffold, configuration, package/runtime, and canonical-data audit, supported by every subsequent production build | Passed; no separate contemporaneous Phase 1.1 validation row existed, but the reconstructed scaffold remains the foundation used by all later passing builds |
| August 7, 2026 | Documentation and repository audit through Phase 2.3 | Passed after correcting Phase 2 ownership/status, the placeholder-home crawl exception, the nonexistent redirect-map claim, upload/runtime gates, and incomplete non-engineering decision coverage; the resulting checkpoint was later committed on the Phase 2 branch |
| August 7, 2026 | Canonical test-contact override, reference audit, 32 tests, lint, whitespace validation, isolated production build, and generated-output inspection | Passed; rendered pages and `llms.txt` use `(419) 486-9657`, `tel:+14194869657`, and `needytrooper04@gmail.com`, no old contact values remain in application source or generated routes, and the current contacts are explicitly marked as non-production fixtures |
| August 7, 2026 | Phase 2.4 confirmation-state tests (33 total), lint, whitespace validation, isolated production build, and generated-bundle inspection | Passed; coverage verifies the confirmed-receipt gate, receipt non-disclosure, cleared success state, and a second request after confirmation, while the optimized client/server bundles contain the new confirmation experience |
| August 7, 2026 | Phase 2.5 click-to-call contract tests (35 total), complete `tel:` source audit, lint, whitespace validation, isolated production build, and generated-output inspection | Passed; every allowlisted placement and the exact contact-free `ofc_phone_click` payload are covered, no direct phone destination remains outside the shared primitives, and all 13 prerendered phone-link instances contain the required event name and placement attributes |
| August 7, 2026 | Phase 2.6 Resend request/idempotency/provider tests (40 total), TypeScript checking, lint, whitespace validation, and production build | Passed locally; exact static sender/recipient routing, plain-text body construction, Base64 normalized attachment handling, opaque payload-bound idempotency, secret headers, fail-closed responses, production test-contact blocking, and nonblank receipt validation are covered. |
| August 11, 2026 | Protected Vercel Preview end-to-end tests of the no-photo and photo Request Service paths | Passed; provider-gated same-page success appeared for both submissions, the owner confirmed both messages arrived at `needytrooper04@gmail.com`, and the generated `project-photo-1.jpg` attachment arrived and opened successfully. This closes Phases 2.1, 2.4, and 2.6. |
| August 11, 2026 | Controlled Phase 3 integration: 42 regression tests, lint, TypeScript production build, static route generation, desktop route inspection, 390×844 responsive inspection, mobile navigation interaction, metadata/canonical checks, rendered broken-link audit, tracked-phone audit, and Request Service form-preservation check | Passed; all 12 content/conversion routes rendered with one H1, correct unique metadata and canonical URLs, no horizontal overflow, no links to planned not-found destinations, no untracked phone actions, no browser warnings, and the intact four-audience form with optional multi-photo input. The build generated all 17 framework routes without changing the Phase 2 delivery boundary. |
| August 11, 2026 | Deployed Vercel Preview verification for `codex/phase-3-core-pages-integration` across all 12 content/conversion routes, desktop and 390×844 mobile rendering, mobile-menu navigation, metadata/canonicals, tracked phone links, rendered link inventory, Request Service controls, browser console, and deployment crawl protection | Passed; every route loaded without a framework error, rendered one H1 with no horizontal overflow, retained the expected production canonical, and contained no unfinished navigation or untracked phone links. The mobile menu navigated and closed correctly, the four-audience form and optional multi-photo input remained intact, no browser warnings/errors appeared, and Vercel SSO returned `x-robots-tag: noindex`. No live lead was submitted because the unchanged Phase 2 email boundary already has provider-backed no-photo and photo verification. |
| August 11, 2026 | Brand-guided design revamp: logo extraction, full route restyle, responsive shell, shared branded UI, social card, lint, 42 tests, production build, 12-route desktop inspection, representative 390×844 mobile route inspection, mobile-menu navigation, FAQ interaction, form-control audit, broken-image/overflow checks, and browser console review | Passed; all brand assets rendered, each audited route retained one H1 and no horizontal overflow, the mobile menu routed and closed correctly, native FAQ disclosures opened, the full Request Service control contract remained intact, no visible images failed, and no browser warning/error was captured. No live lead was submitted. |
| August 11, 2026 | Owner-confirmed production contact replacement, repository reference audit, lint, 42 regression tests, TypeScript checking, and 17-route production build | Passed; rendered phone and email surfaces now resolve through `(419) 709-5808`, `tel:+14197095808`, and `Ohioflowcollc@gmail.com`, notification headers use the canonical recipient without the testing subject prefix, no superseded contact remains outside historical documentation, and a distinct production-delivery gate keeps the form fail-closed pending abuse protection and production re-verification. |

## Progress log

| Date | Event |
|---|---|
| August 6, 2026 | Phase 0 decisions and remaining blockers were documented from the earlier planning conversation. |
| August 6, 2026 | Phase 1.1 scaffold was reconstructed because the repository contained no recoverable starting files. |
| August 6, 2026 | Phase 1.2 global conversion shell was completed and validated. |
| August 6, 2026 | Phase 1.3 design system was completed and validated. |
| August 6, 2026 | Phase 1.4 shared SEO shell was completed and validated. |
| August 6, 2026 | Living architecture and progress records were created with repository work completed through Phase 1.4. |
| August 6, 2026 | Phase 1.5 crawl files and canonical published-route inventory were completed and validated. |
| August 6, 2026 | Phase 1.6 dormant analytics foundation, typed event contract, and conversion-shell instrumentation were completed and validated. |
| August 6, 2026 | Phase 2.1 began with the short Request Service form, validation and test contracts, form analytics, and a server delivery boundary that fails closed pending provider setup. |
| August 6, 2026 | Phase 2.2 completed the residential, commercial, contractor, and municipal Request Service paths with conditional questions, one shared server contract, minimized delivery payloads, and expanded regression coverage. |
| August 7, 2026 | Phase 2.3 completed bounded project-photo selection, strict image normalization and EXIF/GPS/ICC/IPTC/XMP removal, request-scoped attachment delivery, accessible reselection handling, and multipart regression/runtime validation without adding persistent storage. |
| August 7, 2026 | The documentation audit reconciled completed scopes, partial work, crawl/redirect claims, and the engineering and non-engineering decision record through Phase 2.3. |
| August 7, 2026 | Fixed and documented the Phase 2.3 untouched-photo regression caused by React/Next multipart sentinel reconstruction; the 32-test suite covers the no-photo delivery path and strict malformed-sentinel rejection. |
| August 7, 2026 | Applied owner-supplied test phone and email across canonical contact surfaces and recorded their mandatory replacement as a production-launch blocker. |
| August 7, 2026 | Began Phase 2.4 by implementing the provider-gated same-page thank-you experience, next-step guidance, duplicate-submission protection, and an accessible second-request path; external activation remains dependent on Phase 2.6. |
| August 7, 2026 | Began Phase 2.5 by completing application-side click-to-call coverage and privacy-safe event tests while preserving the owner-directed pause on GTM/GA4 activation. |
| August 7, 2026 | Began Phase 2.6 by implementing the Resend internal-notification adapter for the verified notification subdomain, Vercel-held secret, sole testing recipient, sanitized JPEG attachments, deterministic idempotency, and durable-receipt success gate; live Vercel/mailbox verification remains pending. |
| August 11, 2026 | Completed Phase 2.6 through protected Vercel Preview tests with and without a photo; provider-gated confirmation, both mailbox deliveries, and the generated attachment were verified. The same evidence completed the external gates for Phases 2.1 and 2.4. At that checkpoint, external Phase 2.5 analytics activation remained paused. |
| August 11, 2026 | Recorded the owner decision to finish the website before Google Analytics integration, completing Phase 2 for the current build scope and deferring only the external GTM/GA4 activation and verification work to pre-launch. |
| August 11, 2026 | Completed the controlled integration of the contributed Phase 3 core pages into the validated Phase 2.6 branch. Phase 3.1 and 3.3–3.8 are complete; Phase 3.2 remains open only for approved proof, and the contributed Phase 3.9 About page remains open for authentic owner facts and approval. Added a services hub, removed rendered links to unimplemented destinations, corrected customer-facing copy and phone tracking, preserved the full Request Service workflow, and passed the 42-test, lint, production-build, and browser validation set. |
| August 11, 2026 | Verified the pushed integration on its protected Vercel Preview. All integrated routes, metadata, tracked calls, mobile layouts/navigation, and the preserved Request Service form passed; Vercel SSO and `x-robots-tag: noindex` protect the Preview. No runtime code changed during this deployed-validation checkpoint. |
| August 11, 2026 | Completed the brand-guided design revamp. Extracted outlined standard/reverse SVG logo exports from the supplied PDF, added reusable logo/hero/FAQ/conversion components, rebuilt the header, footer, mobile call bar, homepage, service, location, About, and Request Service presentation in the official palette, and regenerated `public/og.png`. Existing form delivery and analytics boundaries were preserved and the full local validation set passed. |
| August 11, 2026 | Replaced all active test contacts with the owner-confirmed production phone, clickable destination, public email, and Request Service recipient. Marked canonical contacts production-ready, retained historical Preview-delivery records, and passed the full local validation set. |
