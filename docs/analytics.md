# Ohio Flow Co — Analytics Contract

## Current status

The Phase 1.6 analytics foundation is implemented but external analytics delivery is disabled by default. Page and conversion events are written to the browser's `dataLayer`; no Google Tag Manager request is made unless both analytics environment values are deliberately configured.

GA4 must be configured inside one production GTM container. The application does not load a second direct GA4 script, preventing two integrations from reporting the same pageview.

## Activation requirements

Do not enable the GTM loader until all of these are complete:

1. Sam confirms ownership of the production GTM container and GA4 property.
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
| `ofc_phone_click` | `cta_location` | Shared phone links and the footer phone link | Map to the approved call-click conversion event |
| `ofc_request_service_click` | `cta_location` | Shared Request Service links and footer navigation | Map to a CTA intent event |
| `ofc_form_start` | `form_id` | First meaningful interaction with the Request Service form | Map after analytics ownership is confirmed |
| `ofc_generate_lead` | `form_id` | Request Service success state, reachable only after confirmed external delivery | Map to GA4 `generate_lead` after delivery and analytics are active |
| `ofc_form_error` | `form_id`, `error_type` | Request Service validation or submission failure | Use for aggregate form reliability reporting |

Allowed CTA locations are `header_desktop`, `header_mobile`, `mobile_menu`, `mobile_call_bar`, `footer_contact`, `footer_nav`, and `page_content`.

`page_path` contains the pathname only. Query strings, fragments, page titles, and referrers are intentionally excluded.

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
