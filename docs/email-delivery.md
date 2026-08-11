# Ohio Flow Co — Request Service Email Delivery

## Current status

Phase 2.6 is complete. On August 11, 2026, a protected Vercel Preview accepted representative no-photo and photo requests, displayed provider-gated same-page success for both, and delivered both internal notifications to the testing mailbox. The generated `project-photo-1.jpg` attachment arrived and opened successfully.

The owner has now supplied the production phone and email configuration, and `contactDataStatus.productionReady` is `true`. Production form delivery remains deliberately blocked through `requestServiceDeliveryStatus.productionReady = false` until public abuse protection is added and the no-photo/photo production paths are re-verified. Retention approval also remains a launch check.

## Locked production configuration

| Concern | Value |
|---|---|
| Provider | Resend |
| Verified sending domain | `notifications.ohioflowco.com` |
| Static sender | `Ohio Flow Co <requests@notifications.ohioflowco.com>` |
| Sole notification recipient | `Ohioflowcollc@gmail.com` |
| Production delivery | Blocked pending public abuse protection and production re-verification |
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
7. Missing credentials, an inactive production-delivery gate, provider errors, malformed responses, timeouts, and network failures all fail closed. The form preserves text values, asks users to reselect any photos, and shows the phone fallback.

No lead text or photo bytes are written to the application filesystem, database, cache, object storage, analytics, or logs.

## Idempotency and retries

The adapter sends keys shaped like `request-service/v1/<sha256>`. An identical normalized payload receives the same key; changed lead data or attachment bytes receive a different key. Resend documents a 24-hour idempotency window, so a timeout followed by an identical retry converges on the original email operation instead of intentionally generating another notification.

The key is opaque and contains no readable name, phone number, email address, location, project text, or filename. It and the provider receipt are excluded from client state and rendered confirmation content.

## Live verification record

Verification ran at `https://flowco-website-9qgrjguo1-svl1.vercel.app/request-service` with `RESEND_API_KEY` available only to the Preview server environment.

- A valid no-photo request returned the same-page “Your service request has been sent” state. Because the application exposes that state only after a nonblank Resend email ID is returned, this verifies the provider-receipt gate without exposing the receipt to the browser.
- A valid photo request returned the same provider-gated state.
- The owner confirmed that both corresponding messages arrived at `needytrooper04@gmail.com`.
- The photo message included the generated `project-photo-1.jpg`, and the owner confirmed that it opened successfully.
- Automated coverage remains the evidence for exact request headers, the absence of any customer autoresponder operation, deterministic retry idempotency, original-filename removal, and EXIF/GPS/ICC/IPTC/XMP stripping. The live mailbox check did not independently inspect embedded metadata or the Resend dashboard.
- The Resend account's content-retention setting and the company mailbox retention/deletion procedure were not reviewed during this test and remain production/privacy inputs.

This evidence closes Phase 2.6 and the remaining external-delivery gates for Phases 2.1 and 2.4. It does not close Phase 2.5 analytics activation.

## Production re-verification checklist

After public abuse protection, retention practices, and the production environment are approved:

1. Submit a valid request without a photo and confirm provider-gated same-page success and one internal message.
2. Submit a representative request with a permitted photo and confirm one generated `.jpg` attachment arrives and opens.
3. Confirm the sender, recipient, readable body labels, and submitted values are correct without exposing customer data in headers.
4. Confirm the received attachment has no original filename or embedded EXIF/GPS/ICC/IPTC/XMP metadata.
5. Confirm no customer autoresponder is sent.
6. Confirm Resend reports a durable email ID and an identical retry does not create a duplicate send.
7. Record the environment, test time, provider outcome, mailbox outcome, and approved retention setting without recording customer or secret values in repository logs.

## Privacy and production gates

Resend processes the message body and sanitized attachments, and the recipient mailbox retains the delivered message until deletion. Resend's standard product can store sent-message content; content-storage disabling is a separate restricted paid capability. The final Privacy Policy and company procedure must state the chosen provider and mailbox retention/deletion practice.

Before production:

- Confirm the production sender and recipient still use static server-owned configuration.
- Add deployment-compatible rate limiting or a bot challenge before exposing the image-processing form publicly.
- Confirm the Resend account's content-retention setting and the company mailbox deletion practice.
- Re-run the no-photo, attachment, timeout/failure, idempotency, and same-page-confirmation checks in the selected production environment.

Provider references: [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [attachments](https://resend.com/docs/dashboard/emails/attachments), [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys), and [message-content storage](https://resend.com/docs/knowledge-base/how-do-i-ensure-sensitive-data-isnt-stored-on-resend).
