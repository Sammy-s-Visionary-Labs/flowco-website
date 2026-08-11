# Ohio Flow Co — Analytics Contract

## Current status

The Phase 1.6 analytics foundation and Phase 2.5 application-side click-to-call coverage are implemented, but external analytics delivery is disabled by default. Page and conversion events are written to the browser's `dataLayer`; no Google Tag Manager request is made unless both analytics environment values are deliberately configured.

GA4 must be configured inside one production GTM container. The application does not load a second direct GA4 script, preventing two integrations from reporting the same pageview.

Per the current owner direction, analytics remains paused. Inventory existing GA4, GTM, Google Ads, Meta, call-tracking, and CRM accounts before creating or connecting any replacement production account. The environment values below are disabled placeholders, not approval to activate tracking.

## Activation requirements

Do not enable the GTM loader until all of these are complete:

1. Sam confirms whether production GTM and GA4 accounts already exist and who owns them.
2. The production GTM container ID is available.
3. The privacy disclosure reflects the analytics configuration.
4. The project has made and implemented its consent decision for the jurisdictions it serves.
5. GTM Preview confirms the event mappings below without duplicates or personal information.

Set these build-time values in the production environment, then rebuild and deploy:

```dotenv
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GTM_ID=GTM-ABC1234
```

The site fails its production build when analytics is enabled with a missing or malformed GTM ID. Development and preview deployments should remain disabled unless they use a separate test container.

## Event contract

| Data-layer event | Allowed payload | Current source | Intended GTM/GA4 handling |
|---|---|---|---|
| `ofc_page_view` | `page_path` | Initial load and App Router pathname changes | Map to one GA4 `page_view` event |
| `ofc_phone_click` | `cta_location` | Every rendered phone link through the shared tracked phone primitives | Map to the approved call-click conversion event |
| `ofc_request_service_click` | `cta_location` | Shared Request Service links and footer navigation | Map to a CTA intent event |
| `ofc_form_start` | `form_id` | First meaningful interaction with the Request Service form | Map after analytics ownership is confirmed |
| `ofc_generate_lead` | `form_id` | Request Service success state, emitted only after confirmed external delivery; the success path is live-verified in Vercel Preview | Map to GA4 `generate_lead` after analytics are active |
| `ofc_form_error` | `form_id`, `error_type` | Request Service Server Action validation or submission failure | Use for aggregate form reliability reporting |

Allowed CTA locations are `header_desktop`, `header_mobile`, `mobile_menu`, `mobile_call_bar`, `footer_contact`, `footer_nav`, and `page_content`.

### Phase 2.5 phone-link coverage

- Desktop header call control: `header_desktop`
- Mobile navigation call control: `mobile_menu`
- Persistent mobile call bar: `mobile_call_bar`
- Footer phone text link and call control: `footer_contact`
- Request Service page call control, unconfirmed-submission fallback, and confirmed-submission follow-up link: `page_content`

`PhoneLink` and `CallLink` are the only application components that emit `tel:` links. Both receive their event attributes from the typed `getPhoneAnalyticsAttributes` helper, preventing a phone surface from using an arbitrary event name or placement. The delegated bridge pushes one synchronous `ofc_phone_click` event for normal click, touch, or keyboard link activation before the browser handles the phone link. The payload contains only `cta_location`; it never contains the displayed number, `tel:` value, route, or customer data.

The mobile header has no separate call link; its persistent phone action is the mobile call bar, while the header's compact CTA is Request Service. No synthetic phone-click event is emitted for a surface that does not initiate a call.

`page_path` contains the pathname only. Query strings, fragments, page titles, and referrers are intentionally excluded.

Client-only photo count, size, and type preflight errors are shown accessibly but are not currently sent to the data layer. Authoritative server-returned validation and submission failures emit `ofc_form_error`.

## Data rules

Analytics events must never contain:

- Names, email addresses, phone numbers, or street addresses
- Form field values or free-text messages
- Uploaded filenames, file metadata, or image contents
- Query strings, search terms, or raw referrers
- User, session, or advertising identifiers added by application code

Add future events through the typed helpers in `src/lib/analytics.ts`. Do not push arbitrary objects directly from page or form components.

## Duplicate-prevention rules

- Maintain one GTM container loader in `src/components/analytics/Analytics.tsx`.
- Configure GA4 inside GTM; do not add a parallel direct `gtag.js` integration.
- The application owns route pageviews through `ofc_page_view`.
- Disable automatic pageview sending for the GTM-managed Google tag.
- Do not add a second GTM History Change pageview trigger.
- Map each data-layer event to one GA4 tag and verify it once in GTM Preview and GA4 DebugView.

The environment flag is an operational activation gate, not a substitute for any per-visitor consent mechanism the project may later require.

Phase 2.5 remains operationally incomplete until the existing-account inventory and consent decision are resolved, GTM maps `ofc_phone_click` exactly once, and a production-like click is verified in GTM Preview and GA4 DebugView without duplicate or personal data.
