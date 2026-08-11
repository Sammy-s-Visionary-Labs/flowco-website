# Ohio Flow Co — Google Analytics Contract

## Current status

The website is ready to send consented events directly to one Google Analytics 4 web stream. It does not require an API token or Google Tag Manager. The only application value needed is the stream's public Measurement ID, which starts with `G-`.

If the Measurement ID is empty, no Google script, consent prompt, analytics cookie, or analytics event is emitted. If the value is malformed, the production build fails with a clear configuration error.

The remaining external step is to create the owner-controlled GA4 account/property/web stream, add its Measurement ID to the production environment, deploy, and verify receipt in Realtime and DebugView.

## Google account setup

Use an owner-controlled Google account and create this simple structure:

- Account: `Ohio Flow Co`
- Property: `Ohio Flow Co Website`
- Reporting time zone: `United States — Eastern Time`
- Currency: `United States Dollar (USD)`
- Web stream URL: `https://www.toledosewerandwater.com`
- Web stream name: `Ohio Flow Co Website`

Google enables Enhanced Measurement by default. In the web stream's Enhanced Measurement settings:

1. Turn off **Page views** because the application sends one explicit `page_view` for the initial route and each App Router route change.
2. Turn off **Form interactions** because the application sends its own minimized `form_start` and `generate_lead` events.
3. Other Enhanced Measurement options can remain off until they have a defined reporting purpose.

Copy the stream's public Measurement ID and set it in the production deployment:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC1234567
```

An optional Google Search Console HTML-tag verification value can be provided separately:

```dotenv
GOOGLE_SITE_VERIFICATION=verification-value-from-google
```

Neither value is a secret API credential. Do not store a Google password, OAuth token, service-account key, or Analytics Admin API credential in the website.

## Consent behavior

- The Google tag is not requested until a visitor selects **Allow analytics**.
- Declining analytics does not block site content, phone actions, or the service-request form.
- The choice is stored only in first-party local storage under `ohio-flow-co.analytics-consent.v1`.
- Visitors can reopen the choice from the footer or Privacy Policy.
- Revoking consent stops application events, sets Google's per-property disable flag, sends a denied consent update if the tag was already loaded, and removes first-party cookies whose names begin with `_ga`.
- Advertising storage, ad-user data, ad personalization, Google Signals, and personalization storage remain denied or disabled.

The Privacy Policy at `/privacy` describes the implementation and the data excluded from Analytics.

## Event contract

| GA4 event | Allowed parameters | Source | Reporting use |
|---|---|---|---|
| `page_view` | `page_path`, query-free `page_location` | Initial consented view and distinct App Router pathname changes | Page and landing-page reporting |
| `phone_click` | `cta_location` | Every rendered phone link through the shared phone primitives | Call intent; mark as a key event after verification |
| `request_service_click` | `cta_location` | Shared Request Service links | CTA intent |
| `form_start` | `form_id` | First meaningful Request Service form interaction | Form funnel start |
| `generate_lead` | `form_id` | Request Service success state after confirmed external delivery | Lead conversion; mark as a key event |
| `form_error` | `form_id`, `error_type` | Authoritative validation or delivery failure | Aggregate form reliability |

Allowed CTA locations are `header_desktop`, `header_mobile`, `mobile_menu`, `mobile_call_bar`, `footer_contact`, `footer_nav`, and `page_content`.

`PhoneLink` and `CallLink` are the only components that emit `tel:` destinations. The phone event includes only the allowlisted placement; it excludes the displayed number and `tel:` value.

## Data rules

Application analytics events must never contain:

- Names, email addresses, phone numbers, or street addresses
- Form-field values or free-text messages
- Uploaded filenames, file metadata, or image contents
- Query strings, search terms, or raw referrers
- Google or advertising identifiers added by application code

Add future events through the typed helpers in `src/lib/analytics.ts`. Do not call `gtag` directly from page or form components.

## Duplicate-prevention rules

- Maintain one direct Google tag loader in `GoogleAnalytics.tsx`.
- Do not add a parallel GTM loader, second GA library, or framework analytics plugin.
- Keep `send_page_view: false`; the application owns pageviews.
- Keep GA4 Enhanced Measurement **Page views** and **Form interactions** off.
- Do not create GA4 custom events that duplicate an event already sent by the application.

## Verification checklist

After the production Measurement ID is configured and deployed:

1. Open a clean browser session and verify there is no request to `googletagmanager.com` before a consent choice.
2. Select **Decline** and verify the Google tag remains unloaded.
3. Reopen Analytics choices, select **Allow analytics**, and verify exactly one tag request.
4. Navigate across several client-side routes and confirm one `page_view` per distinct pathname.
5. Test a phone link and confirm one `phone_click` with only `cta_location`.
6. Submit a production-like service request and confirm one provider-gated `generate_lead` with only `form_id`.
7. Confirm no query string, contact data, form value, filename, or photo content appears in DebugView.
8. Mark `phone_click` and `generate_lead` as key events after their payloads are verified.
9. Link the GA4 property to the verified Search Console property if Search Console is being used.
