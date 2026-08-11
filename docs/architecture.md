# Ohio Flow Co — Project Architecture

**Architecture status:** Phase 2 is complete for the current build scope with external analytics activation deferred; Phase 3 core pages are integrated, with proof and owner-content gates still open for Phases 3.2 and 3.9

**Last reviewed:** August 11, 2026

**Project root:** `/Users/kinghill/Documents/ohio flow co`

## Purpose and maintenance rule

This file is the source of truth for the website's current technical architecture and durable project decisions. It describes what exists now, not merely what is planned.

At the completion of every phase or subphase:

1. Inspect the implemented code and determine whether the architecture changed.
2. Record new, removed, or reorganized components, routes, data flows, integrations, and dependencies.
3. Record every durable business, product, content, operating, design, or technical decision.
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
| Package manager | npm with `npm@11.11.0` declared and `package-lock.json` committed |
| Node requirement | Node.js 20.9 or newer |
| Rendering model | Server Components by default; Client Components only for browser interaction |
| Canonical business data | `src/lib/site.ts` |
| SEO metadata composition | `src/lib/seo.ts` |
| Crawl-surface registry | `src/lib/routes.ts` |
| Analytics contract | Typed first-party `dataLayer` events with an optional GTM transport |
| Upload normalization | Sharp decodes and re-encodes bounded project photos in request memory |
| Lead notification | Server-only Resend email handoff with static headers, plain-text content, normalized JPEG attachments, and deterministic idempotency |
| Global shell | Root layout with header, main content, footer, and mobile call bar |
| Current routes | `/`, `/services`, five service-intent routes, `/commercial`, `/service-areas`, `/service-areas/toledo`, `/about`, `/request-service`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and the framework-provided not-found route |
| Crawl surfaces | Typed Next.js metadata routes plus a static plain-text route |
| Build command | `npm run build`, using Next.js's Webpack build path |
| Deployment target | Vercel remains the provisional production target; the Resend secret is stored there for testing, and the Node/Sharp/Resend path is verified on a protected Vercel Preview. Final production hosting confirmation remains pending. |

## Current file architecture

```text
ohio flow co/
├── .env.example
├── docs/
│   ├── analytics.md
│   ├── architecture.md
│   ├── email-delivery.md
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
    │   ├── about/
    │   │   └── page.tsx
    │   ├── commercial/
    │   │   └── page.tsx
    │   ├── globals.css
    │   ├── llms.txt/
    │   │   └── route.ts
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── request-service/
    │   │   ├── actions.ts
    │   │   └── page.tsx
    │   ├── service-areas/
    │   │   ├── page.tsx
    │   │   └── toledo/
    │   │       └── page.tsx
    │   ├── services/
    │   │   ├── page.tsx
    │   │   └── [implemented-service-route]/
    │   │       └── page.tsx
    │   ├── robots.ts
    │   └── sitemap.ts
    ├── components/
    │   ├── about/
    │   │   └── AboutPageContent.tsx
    │   ├── analytics/
    │   │   ├── Analytics.tsx
    │   │   ├── AnalyticsEventBridge.tsx
    │   │   └── PageViewTracker.tsx
    │   ├── forms/
    │   │   └── RequestServiceForm.tsx
    │   ├── home/
    │   │   ├── HomeHero.tsx
    │   │   └── HomePageContent.tsx
    │   ├── layout/
    │   │   ├── MobileCallBar.tsx
    │   │   ├── SiteFooter.tsx
    │   │   └── SiteHeader.tsx
    │   ├── locations/
    │   │   └── LocationIntentPage.tsx
    │   ├── services/
    │   │   └── ServiceIntentPage.tsx
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
        ├── location-pages.ts
        ├── request-service-delivery.server.ts
        ├── request-service-email.ts
        ├── request-service-photos.ts
        ├── request-service-submission.ts
        ├── request-service.ts
        ├── routes.ts
        ├── seo.ts
        ├── service-pages.ts
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

`src/app/page.tsx` is the complete Phase 3.1 homepage. It owns homepage metadata and delegates the responsive content hierarchy to `HomePageContent` and the isolated motion treatment to `HomeHero`.

`src/app/request-service/page.tsx` is the first implemented conversion route. It owns page metadata, breadcrumb and page composition while delegating form interaction to `RequestServiceForm`. The route fails closed whenever provider delivery is unconfigured or unconfirmed, is `noindex,follow`, and remains outside `publishedRoutes` while contacts are test-only and public abuse protection is not activated.

### Core page content layer

- `src/lib/service-pages.ts` owns typed, route-specific content for the five service-intent pages and the commercial page. It keeps titles, descriptions, intent, scope, signs, process, FAQs, and closing prompts page-owned rather than generating thin pages from service names.
- `ServiceIntentPage.tsx` is the shared Server Component renderer for those definitions. Each route wrapper still owns its canonical metadata and explicit breadcrumb.
- Water-service repair/replacement, stormwater/drainage, and excavation/trenching are intentionally combined because the confirmed scope and current content depth do not justify separate thin routes.
- `src/app/services/page.tsx` is a substantive services hub that exposes every implemented service and the commercial path.
- `src/lib/location-pages.ts` owns distinct location content and `LocationIntentPage.tsx` renders it. The initial Toledo page uses locally specific sewer, water, and stormwater context; it is not a city-name substitution template.
- `src/app/service-areas/page.tsx` is the published location hub. Future city pages must supply distinct local substance before registration.
- `AboutPageContent.tsx` renders the integrated About page using confirmed positioning and service facts. The page remains in Phase 3.9 owner-content review until authentic company history, team facts, and final factual approval are supplied.
- All conversion actions on these pages use `CallLink`, `PhoneLink`, or `RequestServiceLink`; no Phase 3 page owns a raw `tel:` destination.

### Request Service form layer

- `RequestServiceForm.tsx` is a Client Component because it owns pending state, action-result focus, correction-state errors, audience-path interaction, bounded client photo preflight, form analytics, and the Phase 2.4 confirmation transition. Its attempt-keyed uncontrolled text fields receive normalized values from Server Action state. Browser file inputs are deliberately cleared after every attempt. Ordinary validation and delivery failures show focused/inline reselection notices; a suspected-spam response stays generic and intentionally does not disclose upload handling. A confirmed success replaces the form with an accessible same-page thank-you panel; a deliberate “Send another request” action restores the cleared form and moves focus to its first field.
- `src/app/request-service/actions.ts` is the Server Action boundary. It delegates every submission to server validation and orchestration; only a fully valid, non-spam payload reaches the server-only delivery interface.
- `src/lib/request-service.ts` is the shared pure contract for field names, allowlisted audience/relationship/service/source options, text normalization and validation, photo metadata limits, state shapes, conditional lead types, and length limits.
- `src/lib/request-service-photos.ts` owns asynchronous server photo validation and normalization. It treats one exact zero-byte `application/octet-stream` empty-file sentinel as no optional upload, including the `blob` filename produced when React/Next reconstructs that sentinel. Repeated, mixed, or near-match sentinels remain invalid. Actual uploads must be MIME/signature-matched JPEG, PNG, or WebP input; Sharp decodes them under a 20-megapixel and four-channel cap, auto-orients, resizes to at most 1920 pixels per side, flattens transparency, strips embedded EXIF/GPS, ICC, IPTC, and XMP data, and emits generated JPEG attachments.
- `src/lib/request-service-submission.ts` owns delivery orchestration as an injectable, independently testable function, including untrusted action-state normalization, combined text/photo errors, request-scoped attachment handoff, a deterministic opaque idempotency key derived from the normalized payload, and the confirmed-receipt success gate.
- `src/lib/request-service-email.ts` renders the internal notification and owns the testable Resend transport. It uses the static verified sender and sole testing recipient from canonical configuration, places customer data only in a plain-text body, converts normalized JPEGs directly to Base64 request attachments, sends an idempotency header, applies a 10-second timeout, and accepts success only when Resend returns a nonblank receipt ID.
- `src/lib/request-service-delivery.server.ts` is the server-only credential boundary. It reads `RESEND_API_KEY`, passes it to the Resend transport, and returns `not_configured` when the secret is absent. Provider errors, malformed responses, timeouts, and network failures return `failed` without logging or exposing lead data.
- The action returns a success state only after the delivery boundary returns a provider receipt. Validation alone cannot clear the form, display confirmation, or emit `ofc_generate_lead`.
- The form shares name, phone, service, city, ZIP, self-reported source, optional email, and optional project details across all audiences. Residential requests additionally require an allowlisted property relationship; commercial, contractor, and municipal requests require a normalized company or organization name.
- Four native radio choices establish the audience contract: `residential`, `commercial`, `contractor`, and `municipal`. The two conditional panels stay mounted for value preservation, CSS `:has()` reveals the relevant panel before hydration, and the labeled fallback leaves both panels understandable where `:has()` is unavailable.
- Residential relationship choices are owner, tenant/occupant, landlord/property manager, and other. The service picker contains the confirmed service list plus “Not sure yet.” Referral-source choices cover Google Search, Google Maps, Facebook/Instagram, personal referral, previous customer, truck/sign/jobsite, another website/directory, and other.
- Server validation treats the selected audience as untrusted, validates only its active conditional field, blanks the inactive form-state value, and creates a discriminated `RequestServiceLead` that omits the inactive property before delivery. No audience-to-service compatibility restriction is imposed.
- Optional photos remain outside text form values and action state. Up to three files totaling 3 MiB are allowed, while the Server Action request ceiling is 4 MiB to leave multipart headroom below the provisional Vercel Function limit. The form presents these limits as “MB” for familiar customer-facing copy.
- The delivery interface receives one `{ lead, attachments, idempotencyKey }` payload. Attachments contain only normalized JPEG bytes, a generated `.jpg` filename, and the narrowed `image/jpeg` invariant; original filenames and browser file metadata never cross the handoff boundary. The idempotency key is a versioned SHA-256 digest of the full normalized payload and contains no readable contact data.
- Photo bytes exist only during validation, email request construction, and the provider handoff. No filesystem, object store, database, cache, analytics event, or log retains them in the application. Resend and the recipient mailbox can retain the sent message and sanitized attachments under their respective policies; the final Privacy Policy and operating procedure must state the approved retention/deletion practice.
- `tests/request-service-validation.test.ts` exercises the analytics, form, image, email, delivery, navigation, and phone-link contracts through the TypeScript compiler and Node test runner. The suite contains 42 tests covering bounded click-to-call attributes and payloads, all audiences, browser and React/Next no-file sentinels, real image normalization, corrupt inputs, resource limits, EXIF/ICC/IPTC/XMP removal, action-state minimization, opaque idempotency, static email headers, plain-text rendering, exact Resend requests, fail-closed provider behavior, the test-contact production guard, receipt non-disclosure, a second request after confirmation, published primary-navigation destinations, and source-wide enforcement of the shared phone primitives.

### Text and option envelope

| Field | Required | Authoritative server contract |
|---|---|---|
| Full name | Yes | Trimmed/collapsed single line, 2–100 characters, no control characters |
| Phone | Yes | U.S. 10-digit number, optionally with leading `1`; punctuation is accepted but alphabetic input is not |
| Email | No | Valid address when supplied, maximum 254 characters; the domain portion is normalized to lowercase |
| Project audience | Yes | One of residential, commercial, contractor, or municipal |
| Residential relationship | Conditional | Required only for residential requests and limited to the four recorded relationship choices |
| Company or organization | Conditional | Required only for non-residential requests, normalized to 2–150 characters |
| Service | Yes | One confirmed service or “Not sure yet” |
| Project details | No | Normalized multiline text, maximum 1,000 characters |
| City | Yes | Normalized single line, 2–100 characters |
| ZIP code | Yes | Exactly five digits; the form intentionally does not collect a street address |
| Referral source | Yes | One recorded source choice; no free-text tracking value |

Every declared shared field must be present exactly once as a string; optional fields may be blank. Required fields and the selected audience's active conditional field then enforce nonblank, allowlist, length, format, and control-character rules. Unknown fields and inactive conditional data are ignored and excluded from delivery. The hidden `website` honeypot must be present and empty; suspected spam receives the same generic delivery failure as other unconfirmed submissions.

### Upload resource envelope

- **Browser selection:** Up to three files are accepted. Each file and the raw selection total are capped at 3 MiB. The browser preflight gives normal JavaScript-enabled users a field-level error before submission.
- **Framework request:** The complete Server Action body is capped at 4 MiB. A request above that outer limit may be rejected by the framework before application validation can return the form's friendly error, especially without JavaScript.
- **No-file normalization:** A browser may submit one empty native file-control sentinel when this optional field is untouched. React/Next's multipart decoder reconstructs that exact zero-byte `application/octet-stream` entry with the synthetic filename `blob`; the validator treats only the sole exact native or reconstructed sentinel as no selection. Named empty files, altered MIME types, repeated sentinels, and sentinel/file mixtures are rejected.
- **Input formats:** Only JPEG, PNG, and WebP files whose declared MIME type matches their container signature are considered. Every accepted file must also decode successfully.
- **Decode work:** Sharp runs on the Node.js runtime with its operation cache disabled. Files are processed serially, one page at a time, with a 20-megapixel input cap and no more than four decoded channels.
- **Normalized output:** Images are auto-oriented, resized without enlargement to at most 1920 by 1920 pixels, flattened onto white, and encoded as progressive JPEG at quality 80. Normalized attachments are capped at 3 MiB combined.
- **Handoff:** Runtime output and the shared delivery type are both narrowed to JPEG with generated `.jpg` names. Resend receives the request-scoped bytes as Base64 attachment content; the application does not create an intermediate file or durable copy.
- **Retention:** The application has no persistent photo store. Customer uploads are request evidence only and are not marketing or case-study assets; any reuse requires separate permission.

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
- Contact-data testing/production readiness status
- Main navigation
- Request Service destination
- Legal navigation

Logic, links, metadata, and machine-readable routes must import these values rather than duplicating them as literals. Narrative copy may repeat human-readable brand or city wording, but any change must be reviewed against `site.ts`; the Request Service page currently contains two such narrative literals.

The canonical phone, phone link, public email, and inherited lead recipient are currently test fixtures: `(419) 486-9657`, `tel:+14194869657`, and `needytrooper04@gmail.com`. `contactDataStatus` marks this configuration as not production-ready. Phase 5 launch review must replace all test contact values with owner-confirmed real contact information and change that status before public production deployment; historical values are not automatically approved for restoration.

### Global layout components

- `SiteHeader.tsx` is a Client Component because it owns mobile-menu state, pathname-aware navigation, Escape handling, and focus return.
- `SiteFooter.tsx` is a Server Component containing company information, navigation, cities, legal links, and conversion calls to action.
- Footer legal destinations are filtered against `publishedRoutes`, so the planned Privacy, Terms, and Accessibility links do not render or lead to not-found pages before Phase 4 publishes them.
- `MobileCallBar.tsx` is a Server Component that keeps Call Now and Request Service fixed at the bottom below the large-desktop breakpoint.

### Analytics layer

- `Analytics.tsx` is a Server Component mounted once in the root layout. It reads the build-time analytics configuration and conditionally emits one `next/script` GTM bootstrap.
- `PageViewTracker.tsx` is a Client Component that emits one `ofc_page_view` event for the initial pathname and each distinct App Router pathname change.
- `AnalyticsEventBridge.tsx` is a Client Component with one delegated click listener for typed Call and Request Service data attributes. It does not delay or replace link navigation.
- `src/lib/analytics.ts` owns the event-name allowlist, CTA-location allowlist, narrow event helpers, pathname normalization, lead-form events, and the canonical tracked-phone attribute helper.
- `PhoneLink` and `CallLink` are the only components that emit `tel:` links. Both use the typed phone-attribute helper. Footer phone text, header/menu/call-bar controls, Request Service page calls, failure fallback, and confirmation follow-up are therefore covered without duplicating event literals.
- `src/lib/analytics-config.ts` requires both `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a syntactically valid `NEXT_PUBLIC_GTM_ID`; otherwise the transport is disabled or the enabled build fails closed.
- GTM is the only planned transport. GA4 will be configured inside the confirmed production GTM container rather than loaded independently.
- Events contain bounded structural fields only. Application code excludes contact details, form contents, uploaded-file information, raw URLs, query strings, referrers, and arbitrary payloads.
- Analytics activation is intentionally deferred until the website is otherwise ready for pre-launch integration. Existing GA4, GTM, advertising, call-tracking, and CRM accounts must then be inventoried before anyone creates replacement production accounts or enables the placeholder environment values.
- Server-returned validation and submission failures emit bounded form-error events. A client-only photo preflight error is displayed accessibly but is not currently sent to the data layer.
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
| Accent deep | `#7f3212` | High-contrast validation and emphasis text |
| Accent light | `#f2a276` | Accent text on dark backgrounds |
| Accent soft | `#f8e8df` | Low-emphasis validation backgrounds |
| Canvas | `#f3f5f6` | Page background |
| Surface | `#ffffff` | Cards and navigation surfaces |
| Surface muted | `#e9eef0` | Secondary panels |
| Ink | `#14242c` | Primary body text |
| Ink muted | `#50616a` | Supporting text |
| Ink subtle | `#66777f` | Secondary labels and hints |
| Line | `#d9e0e3` | Standard borders and dividers |
| Line strong | `#bac7cc` | Form-control and stronger structural borders |

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
- Server-returned Request Service field errors appear both in linked summaries and beside their native controls. Client-only photo preflight errors appear inline as a live alert. The result container receives focus after a server response so success or failure is announced without moving focus during ordinary typing. A confirmed result replaces the form with a focused status region; choosing to send another request restores the empty form and focuses the name field.
- Audience choices use native radio controls, and service, relationship, source, and photo controls retain their native semantics. Conditional paths remain understandable before hydration and when CSS `:has()` is unavailable.
- Only the selected audience path contributes visible errors. Inactive conditional values are excluded from delivery rather than merely hidden.
- Client photo errors use a live alert. Clearing photos resets the actual file input, removes the blocking error, and returns focus to the picker.
- Browsers cannot restore file selections after a submission. Focused and inline notices explain when photos were cleared and must be selected again; a no-JavaScript submission remains possible.

## Routing and SEO status

The homepage and registered Phase 3 core pages are substantive public content routes. `/request-service` remains a noindex Phase 2 conversion route while test contacts and the public abuse-control gate remain active. Primary navigation exposes only implemented public destinations; planned Residential, Projects, and Resources links are withheld until those routes contain substantive content.

`src/lib/seo.ts` now owns the shared SEO architecture:

- `rootMetadata` provides the canonical domain base, fallback title and title template, default description, application identity, and safe social defaults.
- `createPageMetadata` requires an explicit title, description, and site-relative pathname for every content/page route. Metadata resource routes and the framework-provided not-found route use their appropriate framework contracts instead.
- `absoluteSiteUrl` normalizes site-relative paths, removes query strings and fragments, collapses duplicate slashes, and removes trailing slashes except at the domain root.
- Each page metadata result contains a complete title, description, self-referencing canonical, Open Graph object, and Twitter card object.
- Complete nested objects are emitted intentionally because Next.js metadata merging is shallow.
- Route-specific canonical and Open Graph URLs do not live in the root layout, preventing homepage URLs from leaking into future nested routes.
- The default 1200×630 social card is `public/og.png`. Its brand, service-category, and service-area language are confirmed; it also contains the working tagline, which still requires owner confirmation or replacement before public release.

`src/lib/routes.ts` is the canonical crawl-surface registry. It now contains the substantive homepage, services hub, five service-intent pages, commercial page, service-area hub, Toledo page, and About page. Planned destinations are not added while they return not found or lack substantive content. `/request-service` remains deliberately excluded by T-037 despite its implementation.

The crawl architecture is implemented as follows:

- `src/app/robots.ts` emits a typed `/robots.txt` response that permits crawling and advertises the canonical sitemap URL.
- `src/app/sitemap.ts` maps only `publishedRoutes` to canonical absolute URLs. It intentionally omits speculative `lastModified`, change-frequency, and priority values.
- `src/app/llms.txt/route.ts` emits a force-static plain-text resource containing the confirmed identity, positioning, service scope, service area, public contact details, and links from `publishedRoutes`.
- `llms.txt` is supplemental machine-readable context. It is not treated as an access-control, indexing, ranking, or training directive.
- Public preview deployments must receive platform-level crawl protection after a deployment provider is selected; production `robots.txt` is not used to conceal unfinished preview environments.

`Breadcrumbs` accepts explicit labels and links from each page rather than generating labels from URL slugs. The homepage does not render a redundant breadcrumb. Breadcrumb JSON-LD remains deferred to Phase 4.3.

Structured data belongs to Phase 4.3.

Current and planned route families include:

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

- Phone links currently use the test-only destination `tel:+14194869657`.
- Request Service links target `/request-service#request-form` so the shared CTA reaches the form directly.
- All current phone and Request Service links emit bounded, placement-aware data-layer events. Phase 2.5 centralized every `tel:` surface behind `PhoneLink` or `CallLink`; the Phase 3 regression guard rejects new raw phone destinations.
- `/request-service` renders one short form with residential, commercial, contractor, and municipal paths, one shared field contract, authoritative server validation for all submitted data, advisory browser preflight for photo count/size/type, and safe failure states.
- Form starts and Server Action validation/submission failures emit bounded events; client-only photo preflight errors remain local. Confirmed-lead events emit only after external delivery succeeds, a path proven by the August 11 Vercel Preview tests.
- The current test-only lead and immediate-notification recipient is `needytrooper04@gmail.com`; an owner-confirmed real recipient must replace it before production.
- The Resend adapter is implemented. It sends from `requests@notifications.ohioflowco.com` to the sole testing recipient, and its server-only API key is stored in Vercel. The local environment has no key, so local submissions still fail closed by design.
- The Phase 2.4 same-page confirmation experience is connected to the adapter and was verified end to end for no-photo and photo Preview submissions whose messages arrived in `needytrooper04@gmail.com`. It reveals no provider identifier or submitted values, states that another submission is unnecessary, explains review and follow-up without promising a response time, and supports a deliberate second request.
- A provider email workflow now exists; no CRM integration or customer autoresponder exists.
- Optional project photos are normalized into generated JPEG attachments and passed directly to Resend without separate website storage. The Preview test delivered `project-photo-1.jpg`, and the owner confirmed that it opened successfully.
- The honeypot is baseline protection only. Per-request image limits do not limit request frequency, so compatible rate limiting or a bot challenge is required before this image-processing route is exposed on any public deployment.
- No live GA4, GTM, advertising, or call-tracking transport is configured yet; the owner intentionally deferred that external integration until pre-launch.
- Pageview and conversion hooks remain local until the explicit analytics flag and a valid production GTM ID are supplied.
- Phase 2 provider-backed receipt, mailbox, and attachment verification is complete. The application-side analytics contract is also complete for the current build scope; external analytics mapping is a deferred pre-launch task rather than an active Phase 2 blocker.

### Outbound-delivery safeguards and remaining gates

Phase 2.6 owns the provider adapter, internal mailbox delivery, and durable receipt. The protected Vercel Preview handoff completed on August 11, 2026, satisfying Phase 2.1's remaining success condition and proving the Phase 2.4 confirmation experience.

- The static sender is `requests@notifications.ohioflowco.com` on the owner-verified `notifications.ohioflowco.com` domain. The sole testing recipient remains `needytrooper04@gmail.com`; submitted values cannot control sender, recipient, subject, or reply headers.
- Customer values are rendered only as inert plain-text body content. No HTML body or customer-controlled reply-to header is sent.
- The adapter sends a versioned deterministic idempotency key. Identical normalized lead-and-attachment payloads receive the same key, while changed text or bytes receive a new key; Resend retains idempotency keys for 24 hours.
- The bounded raw attachment envelope expands safely below Resend's documented 40 MB post-Base64 message limit. The Node/Sharp/attachment path passed the Vercel Preview end-to-end test; it must be revalidated in the final production environment.
- `RESEND_API_KEY` is read only on the server and is stored in Vercel, not in the repository or a public environment variable.
- Vercel production delivery is blocked while `contactDataStatus.productionReady` is `false`; the completed provider testing therefore used a protected Preview deployment.
- The provider receipt remains server-only and is used only to gate success. Errors, response bodies, customer data, and attachment bytes are not logged.
- Resend can store sent-message content and attachments. Exact provider/team settings and recipient-mailbox retention/deletion practice remain Privacy Policy and operating-procedure inputs.
- Customer email remains optional and no customer autoresponder is authorized. Before production, replace the testing recipient and all other test contacts with owner-confirmed production values.

## Decision register

The register separates non-engineering decisions (business, product, content, and operations) from engineering decisions (runtime, security, data flow, design system, and routing). A status of **Provisional**, **Awaiting confirmation**, or **Activation gate** is intentionally not presented as completed work.

### Business, product, content, and operating decisions

| ID | Decision | Status | Origin |
|---|---|---|---|
| B-001 | Display and legal brand name is **Ohio Flow Co**. | Locked | Phase 0.1 |
| B-002 | Primary domain remains `https://www.toledosewerandwater.com`. | Locked | Phase 0.1 |
| B-003 | Purchasing `ohioflowco.com` is recommended only as a redirect to the primary site; two separate sites must not be operated. | Recommended, not confirmed purchased | Phase 0.1 |
| B-004 | The previously recorded public phone number was `(567) 358-1055`. | Temporarily overridden by B-022; production value awaiting confirmation | Phase 0.2 |
| B-005 | The previously recorded public email was `Ohioflowcollc@gmail.com`. | Temporarily overridden by B-022; production value awaiting confirmation | Phase 1.1 brief |
| B-006 | Positioning is underground sewer, water line, drainage, excavation, and utility work—not general plumbing. | Locked | Phase 0.3 |
| B-007 | Confirmed services are sewer repair, sewer replacement, water-service repair, water-line replacement/installation, stormwater management, drainage solutions, site excavation, utility trenching, commercial sewer and water, and contractor/municipal support. | Locked | Phase 0.3 |
| B-008 | Do not claim camera inspections, trenchless service, hydro jetting, septic service, financing, careers, or 24/7 emergency service without later confirmation. | Locked until changed by Sam | Phase 0.3 |
| B-009 | Service area is Northwest Ohio, led by Toledo, Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova. | Locked | Phase 0 |
| B-010 | Ohio Flow Co is a service-area contractor. No storefront address is published. | Locked | Phase 0 |
| B-011 | Real project photography should be used with permission; generic plumbing imagery and glossy CGI pipes are excluded. | Locked approach | Phase 0.5 |
| B-012 | Request Service leads and immediate notifications were originally directed only to `Ohioflowcollc@gmail.com` for the initial email handoff. | Temporarily overridden by B-022; production recipient awaiting confirmation | Phase 2.1 owner decision |
| B-013 | Customer-submitted photos use no application-owned persistent store. Resend processes and may retain sanitized attachments under its policy; delivered email remains in the company mailbox until deletion under the eventual retention practice. | Locked storage approach; Resend/mailbox retention procedure pending | Phase 2.1 owner decision for Phase 2.3; Phase 2.6 provider selection |
| B-014 | Keep GA4/GTM activation paused and keep placeholder values disabled until existing account ownership and the privacy/consent approach are confirmed; do not create replacement production accounts without owner approval. | Locked current approach | Phase 2.1 owner decision |
| B-015 | Customer-submitted photos are service-request evidence only and are not approved for galleries, case studies, social media, or other marketing without separate permission. | Active privacy boundary | Phase 2.3 documentation audit |
| B-016 | Internal lead and immediate-notification delivery was authorized only to `Ohioflowcollc@gmail.com`, and customer email is optional. No customer autoresponder was authorized; on-site submitter confirmation was the working Phase 2.4 plan. | Recipient temporarily overridden by B-022; confirmation plan superseded by B-023 | Phase 2.1 owner direction; Phase 2.4 working plan |
| B-017 | Vercel is the preferred production host because the application uses Next.js, but it is not confirmed. A different host requires revalidation of request-size, Node/Sharp, memory, abuse-control, and preview-indexing assumptions. | Provisional | Phase 2.1 owner direction |
| B-018 | The current Request Service product asks for name, phone, project audience, service, city, ZIP, and referral source; email, project details, and photos remain optional. A phone path remains available when online delivery cannot be confirmed. | Active | Phases 2.1–2.3 |
| B-019 | The four project audiences share one service form. Residential users identify their relationship to the property; commercial, contractor, and municipal users identify their organization. No audience is prevented from selecting an otherwise confirmed service. | Active | Phase 2.2 |
| B-020 | Photo copy must state limits, warn against IDs/account documents or other sensitive material, avoid promising storage the application does not provide, and explain reselection after failure. | Active | Phase 2.3 |
| B-021 | `Keeping Northwest Ohio Flowing.` is the current working tagline in canonical data; separate owner approval has not been recorded. | Awaiting confirmation | Phase 1.1 brief audit |
| B-022 | During development testing only, render `(419) 486-9657` and `needytrooper04@gmail.com`, and route any future test lead handoff only to that email. These values are not approved for production and must be replaced with owner-confirmed real contact information before launch. | Active test override; production launch blocker | Owner direction, August 7, 2026 |
| B-023 | Confirm successful Request Service submissions on the same page only after provider-confirmed delivery. Do not send a customer autoresponder at this stage and do not promise a response time; explain the review/follow-up process and retain the phone path. | Active; live-verified in Vercel Preview | Phase 2.4; Phase 2.6 |
| B-024 | Use Resend for the testing lead handoff. The verified sending domain is `notifications.ohioflowco.com`, the static sender is `requests@notifications.ohioflowco.com`, and the sole testing recipient remains `needytrooper04@gmail.com`. The API key is stored in Vercel. This testing configuration does not approve the current contacts for production or finalize Vercel as the production host. | Active testing integration; live handoff verified | Owner direction, Phase 2.6 |
| B-025 | Finish the website before integrating Google Analytics. Preserve the application-owned pageview, conversion, form, and phone event contract, but defer external GTM/GA4 account selection, consent, activation, mapping, and receipt verification until pre-launch. | Active owner direction | Phase 2.5 deferral, August 11, 2026 |
| B-026 | Do not fabricate project proof or use customer-uploaded service-request photos as marketing proof. Phase 3.2 cannot be called complete against its defined proof requirement until approved real project facts and assets exist. | Active content gate | Phases 0.5 and 3.2 |
| B-027 | Keep water-service repair/replacement, stormwater/drainage, and excavation/trenching combined while confirmed scope and available content do not justify separate substantive pages. Split them only after distinct intent, facts, and proof support each route. | Active content architecture | Phases 3.4–3.6 |
| B-028 | The About page may use confirmed positioning and service-area facts now, but final Phase 3.9 completion requires authentic owner-approved company history, team, experience, and operating facts. | Awaiting owner content | Phase 3.9 integration |

### Technical and design decisions

| ID | Decision | Status | Origin |
|---|---|---|---|
| T-001 | Use Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. | Active | Phase 1.1 |
| T-002 | Keep dependencies minimal and do not add a UI library for the foundation. | Active | Phase 1.2 |
| T-003 | Use Server Components by default and isolate browser state in the header Client Component. | Superseded by T-016 | Phase 1.2 |
| T-004 | Keep canonical NAP and navigation data in `src/lib/site.ts`. | Active | Phase 1.1 |
| T-005 | Use `lg`/`64rem` as the shell transition between mobile/tablet conversion controls and the desktop header. | Active | Phase 1.2 |
| T-006 | Use the Webpack path for `next build` because the available environment blocks Turbopack's local worker port. | Active | Phase 1.2 validation |
| T-007 | Every content/page route must use the typed page-metadata helper with an explicit canonical pathname; route-specific URLs must not be placed in root metadata. Metadata resource routes use their framework-specific contracts. | Active | Phase 1.4 |
| T-008 | Breadcrumb labels and destinations are supplied explicitly by Server Components rather than inferred from the browser pathname. | Active | Phase 1.4 |
| T-009 | `publishedRoutes` is the single crawl-inventory source; a route enters the sitemap and `llms.txt` links only after it has substantive published content. | Superseded by T-028 | Phase 1.5 |
| T-010 | Production robots rules permit crawling and advertise the canonical sitemap; preview crawl protection will be deployment-level rather than encoded in production rules. | Active | Phase 1.5 |
| T-011 | `llms.txt` is generated from canonical project constants as force-static supplemental context and is not treated as a crawler-control mechanism. | Active | Phase 1.5 |
| T-012 | Load GTM as the sole analytics transport and configure GA4 inside GTM; do not ship parallel GTM and direct GA4 loaders. | Active | Phase 1.6 |
| T-013 | Analytics transport is disabled by default and requires an explicit enable flag plus a valid production GTM ID. Enabled builds with invalid configuration fail closed. | Active | Phase 1.6 |
| T-014 | Application-owned analytics events use a typed allowlist and bounded parameters; personal information, form contents, query strings, referrers, and arbitrary payloads are excluded. | Active | Phase 1.6 |
| T-015 | Application code owns pathname pageviews. Future GTM configuration must disable automatic/history-change duplicates and map each data-layer event once. | Active | Phase 1.6 |
| T-016 | Use Server Components by default and isolate browser-only state and effects in the smallest practical leaf components, currently the header, analytics trackers, and Request Service form. | Active | Phase 1.6 |
| T-017 | Use one shared pure contract for Request Service field options, normalization, and server validation; the Client Component handles interaction while a Server Action owns submission. | Active | Phase 2.1 |
| T-018 | A service request is successful only after the server-only delivery adapter returns a confirmed provider receipt. Unconfigured or failed delivery must preserve values, show a phone fallback, and emit no lead-success event. | Active | Phase 2.1 |
| T-019 | Keep `/request-service` `noindex,follow` and outside `publishedRoutes` until external delivery is operational. | Superseded by the broader T-037 prelaunch gate after delivery became operational | Phase 2.1 |
| T-020 | Treat Vercel as the provisional production host, not a locked or configured deployment target. | Provisional; mirrored by B-017 | Phase 2.1 owner direction |
| T-021 | Before outbound email is enabled, add Vercel-compatible abuse protection and idempotency; keep recipient/sender headers static and render all submitted values only as escaped, untrusted email content. | Superseded by T-026 and T-027 | Phase 2.1 |
| T-022 | Use one shared Request Service form with four project audiences: residential, commercial, contractor, and municipal. Ask residential users for property relationship and all other audiences for company or organization name. | Active | Phase 2.2 |
| T-023 | Validate only the selected audience's conditional field, impose no audience-to-service compatibility gate, and pass delivery adapters a discriminated lead object that omits inactive audience data. | Active | Phase 2.2 |
| T-024 | Accept at most three JPEG/PNG/WebP project photos totaling 3 MiB through a 4 MiB Server Action request; keep bytes request-scoped and add no filesystem, database, cache, object-store, log, or analytics retention. | Active | Phase 2.3 |
| T-025 | Decode accepted images under strict resource limits, auto-orient and resize them, strip embedded EXIF/GPS, ICC, IPTC, and XMP data by re-encoding to JPEG, generate attachment filenames, and pass only normalized attachments to the delivery adapter. | Active | Phase 2.3 |
| T-026 | Before `/request-service` is exposed publicly, add rate limiting or a compatible bot challenge that protects multipart parsing and Sharp work; per-request file limits alone are insufficient. | Public-deployment activation gate | Phase 2.3 audit |
| T-027 | Before outbound email activation, use static server-owned headers, inert body content, retry-safe idempotency, server-only credentials, a durable provider receipt, and a provider verified for the encoded attachment envelope and retention policy. | Application and attachment-envelope requirements verified; retention procedure pending | Phase 2.3 audit; Phase 2.6 implementation and live verification |
| T-028 | Keep `publishedRoutes` as the crawl-surface source, with `/` as a temporary prelaunch validation exception. Replace the placeholder homepage before public launch or sitemap submission; all later routes require substantive content. | Superseded by T-041 after Phase 3.1 | Phase 1.5 documentation audit |
| T-029 | Sharp is the sole image-normalization dependency. Keep photo processing on the Node.js runtime, disable Sharp's cache, process files serially, and verify its native bundle and multipart behavior on the selected host. | Active; Vercel Preview path verified, final production environment revalidation pending | Phase 2.3 audit; Phase 2.6 live verification |
| T-030 | Any future submission-confirmation route must be `noindex` and excluded from `publishedRoutes`; it may present success only after a durable provider receipt. | Future-route constraint; current Phase 2.4 flow stays inline | Phase 2 documentation audit |
| T-031 | Normalize only a sole exact empty optional-file sentinel—including React/Next's synthetic `blob` filename—to no attachment. Do not discard repeated, mixed, named, or MIME-altered zero-byte entries. | Active | Phase 2.3 no-photo regression |
| T-032 | Keep the temporary phone, `tel:` link, public email, and inherited lead recipient centralized in `site.ts`; expose `contactDataStatus.productionReady = false` until Phase 5 replaces them with owner-confirmed production data. | Active production gate | Test-contact override |
| T-033 | Replace the form with a focused same-page status panel only when submission state is `success`; success remains gated by a nonblank provider receipt. Keep provider receipts and submitted values out of client state, prevent accidental duplicate submission, and restore a cleared form only through an explicit second-request action. | Active; end-to-end verified in Vercel Preview | Phase 2.4; Phase 2.6 live verification |
| T-034 | Emit every `tel:` link through a shared tracked phone primitive using one typed attribute helper. Push only `ofc_phone_click` and an allowlisted `cta_location`; exclude the displayed number, `tel:` value, page data, and customer data. Keep GTM/GA4 transport disabled until account ownership, consent, mapping, and duplicate checks are complete. | Active application contract; external activation deferred to pre-launch | Phase 2.5; B-025 |
| T-035 | Send internal Request Service notifications through Resend using native server-side `fetch`, the Vercel-held `RESEND_API_KEY`, one verified static sender, one canonical recipient, a static subject, a plain-text body, Base64 normalized JPEG attachments, a 10-second timeout, and a nonblank Resend email ID as the only success receipt. Add no provider SDK, customer reply-to header, application persistence, or sensitive logging. | Active; live handoff verified in Vercel Preview | Phase 2.6 |
| T-036 | Derive the Resend idempotency header from a versioned SHA-256 digest of the complete normalized lead and sanitized attachment payload. This makes retries of the same payload converge without returning the key or provider receipt in client state; any changed normalized content produces a new key. | Active | Phase 2.6 |
| T-037 | Return `not_configured` on Vercel production while canonical contact data is marked test-only. Permit current provider testing only in a non-production environment and keep `/request-service` outside published crawl surfaces until real production contacts and public abuse controls are in place. | Active production and publication guard; Preview handoff complete | Phase 2.6 |
| T-038 | Keep service and location page content in typed route-owned definitions rendered by shared Server Components. Page wrappers retain explicit metadata and breadcrumbs; shared structure must not collapse distinct intent into city-name or service-name substitutions. | Active | Phases 3.2–3.8 |
| T-039 | Rendered navigation may contain only implemented substantive destinations. Publish `/services` as the hub for implemented service routes; reintroduce Residential, Projects, or Resources only when their destination pages exist; and filter planned legal navigation until Phase 4 publishes those routes. | Active | Phase 3 integration audit |
| T-040 | Preserve tracked phone coverage across new pages with two static regressions: every primary navigation destination must be registered as published, and source files outside the CTA primitive may not emit `site.phoneHref` or literal `tel:` links directly. | Active | Phase 3 integration audit |
| T-041 | Keep `publishedRoutes` as the substantive crawl-surface source. Register the completed homepage and core Phase 3 pages; withhold `/request-service` under T-037 and withhold planned routes until their public content exists. | Active | Phase 3.1–3.9 integration |
| D-001 | Use deep navy, construction orange, light gray canvas, and white surfaces. | Active | Phase 1.3 |
| D-002 | Use the darker `#b64f1f` accent for accessible white CTA text. | Active | Phase 1.3 |
| D-003 | Use system fonts rather than remote font dependencies. | Active | Phase 1.3 |
| D-004 | Use restrained radii, clear rails, subtle grids, and limited motion for an industrial/local character. | Active | Phase 1.3 |
| D-005 | Use a typography-led 1200×630 default social card with no invented project photography, logo mark, equipment, or unsupported claims. | Active | Phase 1.4 |
| D-006 | Use restrained homepage hero motion only as progressive enhancement and honor reduced-motion preferences; do not require animation for content comprehension or conversion. | Active | Phase 3.1 |
| R-001 | Replace weak Wix URL names with descriptive service and service-area routes; preserve old traffic through 301 redirects at launch. | Active plan | Phase 0.6 |

## Expected future architectural additions

These are planned boundaries, not implemented architecture:

- **Deferred analytics:** owner-approved GTM/GA4 account selection, production click/form mapping, consent implementation, duplicate prevention, and receipt validation during pre-launch. The current application event contract remains active and tested.
- **Remaining Phase 3:** approved real proof for Phase 3.2, authentic owner-approved About facts for Phase 3.9, Phase 3.10 contact/content work on the existing Request Service foundation, and Phase 3.11 projects/case studies.
- **Phase 4:** legal content, structured data, image pipeline, and complete accessibility QA.
- **Phase 5:** redirects, deployment configuration, launch validation, and search-engine submission.

## Architecture change log

| Date | Phase or milestone | Architectural impact |
|---|---|---|
| August 6, 2026 | Phase 0.1 | Locked the Ohio Flow Co display/legal name, `toledosewerandwater.com` primary domain, and single-site redirect direction for any future `ohioflowco.com` purchase. No application code existed yet. |
| August 6, 2026 | Phase 0.2 | Locked `(567) 358-1055` as the sole public phone and rejected the legacy 419-number direction. No application code existed yet. |
| August 6, 2026 | Phase 0.3 | Locked the underground utility positioning, confirmed service scope, Northwest Ohio service area, and unsupported-claim exclusions. No application code existed yet. |
| August 6, 2026 | Phase 0.4–0.6 planning | Recorded the Ohio Flow Co-only lead recipient, paused analytics/account questions, real-project-proof requirements, destination route direction, and the still-missing Wix source inventory and redirect map. These subphases remain partial, awaiting input, or draft. |
| August 6, 2026 | Phase 1.1 | Reconstructed the missing project scaffold with Next.js 16, React 19, TypeScript, Tailwind CSS 4, ESLint, npm, and canonical `site.ts` data. |
| August 6, 2026 | Phase 1.2 | Added the global root shell, shared CTA layer, responsive Client Component header, Server Component footer, persistent mobile call bar, active-route handling, and accessibility foundations. |
| August 6, 2026 | Phase 1.3 | Expanded CSS into a semantic token system; added Container, Section, SectionHeading, Eyebrow, and Surface primitives; refined CTA styling and applied the system to the shell. Framework and data-flow decisions did not change. |
| August 6, 2026 | Phase 1.4 | Added a typed SEO composition layer, canonical URL normalization, explicit page metadata, complete Open Graph/Twitter defaults, a validated social card, and a reusable Server Component breadcrumb. No business decisions changed. |
| August 6, 2026 | Project documentation | Added `docs/architecture.md` and `docs/progress.md` with repository work completed through Phase 1.4, establishing living records for future phases and subphases. No runtime architecture changed. |
| August 6, 2026 | Phase 1.5 | Added typed robots and sitemap routes, a canonical crawl-surface registry, a force-static `llms.txt` endpoint, and a confirmed-service data list. Added `/` as a temporary prelaunch route-generation fixture; Phase 3.1 must replace its placeholder content before public launch or sitemap submission. No business decisions changed. |
| August 6, 2026 | Phase 1.6 | Added a dormant-by-default GTM loader, typed pageview/conversion/form event contract, client route and delegated CTA tracking, configuration validation, and an operational analytics guide. Expanded the Client Component boundary from the header alone to minimal analytics leaf components (T-003 superseded by T-016). GA4 delivery remains inactive pending owner-approved account and privacy inputs. No business decisions changed. |
| August 6, 2026 | Phase 2.1 in progress | Added the noindex Request Service route, accessible short form, shared pure validator, Server Action, server-only fail-closed delivery boundary, form analytics wiring, and a zero-dependency unit-test harness. Completion still requires provider-confirmed external handoff; that work will also supply prerequisites for Phases 2.4 and 2.6. Locked the sole lead recipient and no-application-photo-storage direction; Vercel remains provisional. |
| August 6, 2026 | Phase 2.2 complete | Added four audience paths to the shared Request Service form, pre-hydration conditional disclosure, audience-aware error handling, conditional server validation, a minimized discriminated delivery contract, and expanded tests without adding a dependency or route. |
| August 7, 2026 | Phase 2.3 complete | Added optional bounded photo selection, shared client/server photo preflight, Sharp-backed decode and resource limits, EXIF/GPS/ICC/IPTC/XMP-stripping JPEG normalization, generated request-scoped attachments, reselection accessibility, a 4 MiB Server Action ceiling, and multipart validation without persistent website storage. |
| August 7, 2026 | Documentation audit through Phase 2.3 | Reconciled phase ownership and status, corrected crawl and redirect claims, expanded form accessibility and upload-runtime constraints, and recorded product, privacy, analytics, hosting, abuse-prevention, and provider-activation decisions. No runtime code changed. |
| August 7, 2026 | Phase 2.3 no-photo regression | Reproduced the React/Next multipart boundary that renames an untouched optional file sentinel to `blob`, normalized the sole exact sentinel to no attachment, kept malformed zero-byte inputs fail-closed, and expanded regression coverage. No business decision changed. |
| August 7, 2026 | Test contact override | Replaced the canonical rendered phone, `tel:` link, public email, and inherited lead recipient with owner-supplied test fixtures. Added an explicit non-production status and Phase 5 replacement gate; no deployment or provider activation occurred. |
| August 7, 2026 | Phase 2.4 in progress | Replaced the generic success notice with an accessible same-page confirmation experience, next-step guidance, duplicate-submission protection, and an explicit second-request path. The client receives no provider receipt or submitted values; live activation and end-to-end confirmation still depend on Phase 2.6. |
| August 7, 2026 | Phase 2.5 in progress | Centralized all `tel:` surfaces behind tracked phone primitives, covered the Request Service failure and confirmation links, and added bounded-event regression tests. External GTM/GA4 mapping remains disabled pending the existing-account and consent decisions. |
| August 7, 2026 | Phase 2.6 in progress | Added the Resend provider adapter, verified static sender configuration, testing-recipient routing, plain-text notification rendering, Base64 sanitized JPEG attachments, deterministic idempotency, server-only Vercel credential boundary, timeout/failure handling, and durable-receipt validation without adding an SDK or application storage. Live deployed receipt and mailbox verification remain pending. |
| August 11, 2026 | Phases 2.1, 2.4, and 2.6 complete | Verified the protected Vercel Preview end to end with representative no-photo and photo requests. Provider-gated same-page confirmation appeared for both, both internal messages reached the sole testing recipient, and `project-photo-1.jpg` arrived and opened successfully. This changed no runtime architecture; it closed the external delivery gates while retaining the test-contact production block, public abuse-control gate, retention-policy input, and paused Phase 2.5 analytics activation. |
| August 11, 2026 | Phase 3.1–3.9 controlled integration | Integrated the contributed core pages into the validated Phase 2.6 branch instead of replacing it. Added substantive home, services, service-intent, commercial, service-area, Toledo, and About routes; typed shared service/location content renderers; published-route registration; customer-facing copy; and tracked CTA enforcement. Removed rendered navigation links to unimplemented destinations and added `/services` as their implemented hub. Preserved the Phase 2 form, Sharp normalization, Resend delivery, confirmation, test-contact production guard, and dormant analytics contract. Phases 3.2 and 3.9 remain open for real proof and authentic owner-approved facts. The integrated system passed 42 tests, lint, a 17-route production build, desktop rendering checks, and 390×844 mobile interaction/overflow checks. |
