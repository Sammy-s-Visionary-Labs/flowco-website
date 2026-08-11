# Ohio Flow Co — Request Service Email Delivery

## Current status

The Phase 2.6 Resend adapter is implemented and validated locally. Live delivery remains unverified until a Vercel preview submission returns a provider receipt and the notification, including a sanitized test attachment, is confirmed in the testing mailbox.

Production delivery is deliberately blocked while `contactDataStatus.productionReady` is `false`. Use a Vercel Preview deployment for development testing; do not promote the current test phone or email configuration to production.

## Locked testing configuration

| Concern | Value |
|---|---|
| Provider | Resend |
| Verified sending domain | `notifications.ohioflowco.com` |
| Static sender | `Ohio Flow Co <requests@notifications.ohioflowco.com>` |
| Sole testing recipient | `needytrooper04@gmail.com` |
| Customer autoresponder | Disabled; not authorized |
| Credential | `RESEND_API_KEY`, stored only as a server-side Vercel secret |

Submitted values never control the sender, recipient, subject, or reply headers. The customer's optional email appears only in the internal plain-text message body.

## Delivery flow

1. The Server Action validates and normalizes the lead and any optional photos.
2. Sharp converts accepted photos to generated JPEG attachments with metadata removed.
3. The submission layer derives a versioned SHA-256 idempotency key from the complete normalized lead-and-attachment payload.
4. The email layer creates a static-header, plain-text notification and Base64-encodes the request-scoped JPEG bytes.
5. The server-only adapter reads `RESEND_API_KEY` and posts the message to Resend with the idempotency header and a 10-second timeout.
6. Only a successful response containing a nonblank Resend email ID counts as confirmed handoff. The receipt remains on the server and is not returned to the browser.
7. Missing credentials, Vercel production with test contacts, provider errors, malformed responses, timeouts, and network failures all fail closed. The form preserves text values, asks users to reselect any photos, and shows the phone fallback.

No lead text or photo bytes are written to the application filesystem, database, cache, object storage, analytics, or logs.

## Idempotency and retries

The adapter sends keys shaped like `request-service/v1/<sha256>`. An identical normalized payload receives the same key; changed lead data or attachment bytes receive a different key. Resend documents a 24-hour idempotency window, so a timeout followed by an identical retry converges on the original email operation instead of intentionally generating another notification.

The key is opaque and contains no readable name, phone number, email address, location, project text, or filename. It and the provider receipt are excluded from client state and rendered confirmation content.

## Live verification checklist

Use a non-production Vercel Preview where `RESEND_API_KEY` is available.

1. Submit a valid request without a photo.
2. Confirm the same-page “Your service request has been sent” experience appears only after the provider response.
3. Confirm exactly one message arrives at `needytrooper04@gmail.com` from `requests@notifications.ohioflowco.com` with readable labels and the submitted values in the body.
4. Submit a second representative request with a permitted photo.
5. Confirm exactly one generated `.jpg` attachment arrives, opens successfully, is reasonably sized, and exposes no original filename or embedded EXIF/GPS/ICC/IPTC/XMP metadata.
6. Confirm neither submission sends a customer autoresponder.
7. Confirm the Resend dashboard reports a durable email ID for each request and no duplicate send for an identical retry.
8. Record the preview URL, test time, receipt outcome, mailbox outcome, and any provider-retention setting reviewed. Do not record customer or secret values in repository logs.

Completing this checklist closes Phase 2.6 and the remaining external-delivery gates for Phases 2.1 and 2.4. It does not close Phase 2.5 analytics activation.

## Privacy and production gates

Resend processes the message body and sanitized attachments, and the recipient mailbox retains the delivered message until deletion. Resend's standard product can store sent-message content; content-storage disabling is a separate restricted paid capability. The final Privacy Policy and company procedure must state the chosen provider and mailbox retention/deletion practice.

Before production:

- Replace the test phone, public email, and lead recipient with owner-confirmed production values and set `contactDataStatus.productionReady` only after that review.
- Confirm the production sender and recipient still use static server-owned configuration.
- Add deployment-compatible rate limiting or a bot challenge before exposing the image-processing form publicly.
- Confirm the Resend account's content-retention setting and the company mailbox deletion practice.
- Re-run the no-photo, attachment, timeout/failure, idempotency, and same-page-confirmation checks in the selected production environment.

Provider references: [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [attachments](https://resend.com/docs/dashboard/emails/attachments), [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys), and [message-content storage](https://resend.com/docs/knowledge-base/how-do-i-ensure-sensitive-data-isnt-stored-on-resend).
