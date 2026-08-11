import { AnalyticsPreferencesButton } from "@/components/analytics/AnalyticsPreferencesButton";
import {
  LegalPage,
  legalHeadingClassName,
  legalListClassName,
  legalParagraphClassName,
} from "@/components/legal/LegalPage";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Learn how ${site.name} handles service-request information, optional project photos, website analytics, and privacy choices.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const analytics = getAnalyticsConfig();

  return (
    <LegalPage
      description={`How ${site.name} handles information submitted through this website and the choices available to visitors.`}
      eyebrow="Website privacy"
      title="Privacy Policy"
    >
      <h2 className={legalHeadingClassName}>Information you provide</h2>
      <p className={legalParagraphClassName}>
        When you request service, we may collect your name, phone number,
        optional email address, project type, relationship to the property or
        organization, requested service, project details, city, ZIP code, and
        how you heard about us. We use this information to review and respond
        to your request.
      </p>

      <h2 className={legalHeadingClassName}>Optional project photos</h2>
      <p className={legalParagraphClassName}>
        You may attach project photos to a service request. Before delivery,
        the website re-encodes accepted images, removes embedded metadata such
        as GPS and camera information, and replaces original filenames. The
        application does not maintain a separate photo library or use request
        photos for marketing. Photos and request details are delivered through
        our email provider and can remain in the provider and company mailbox
        until they are no longer reasonably needed for the request, business
        records, security, or legal obligations.
      </p>

      <h2 className={legalHeadingClassName}>Google Analytics</h2>
      <p className={legalParagraphClassName}>
        If analytics is configured, it remains off unless you select “Allow
        analytics.” After permission, Google Analytics can receive the page
        viewed, general browser and device information, approximate location
        derived by Google, and actions such as a phone-link click or a completed
        service request. We do not send form-field values, names, email
        addresses, phone numbers, street addresses, uploaded photos, filenames,
        query strings, or free-text messages to Analytics.
      </p>
      <p className={legalParagraphClassName}>
        Google Analytics may use first-party cookies or similar identifiers to
        measure visits. Advertising personalization and Google Signals are
        disabled by this website. Google handles Analytics information under
        its own privacy terms.
      </p>
      {analytics.enabled ? (
        <AnalyticsPreferencesButton className="mt-6 min-h-12 border-2 border-brand bg-brand px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-canvas transition-colors hover:border-accent hover:bg-accent hover:text-brand-deep" />
      ) : (
        <p className="mt-5 border-l-4 border-accent bg-accent-soft p-4 text-sm font-bold leading-6 text-brand-deep">
          Google Analytics is not currently configured in this build of the
          website.
        </p>
      )}

      <h2 className={legalHeadingClassName}>How we use and share information</h2>
      <ul className={legalListClassName}>
        <li>Respond to service requests and plan possible work.</li>
        <li>Operate, secure, troubleshoot, and improve the website.</li>
        <li>
          Work with service providers that support website hosting, email
          delivery, and consented analytics.
        </li>
        <li>
          Comply with legal obligations and protect the rights, safety, and
          security of visitors, the company, and others.
        </li>
      </ul>
      <p className={legalParagraphClassName}>
        We do not sell service-request information. We do not use submitted
        photos for advertising or case studies without separate permission.
      </p>

      <h2 className={legalHeadingClassName}>Your choices</h2>
      <p className={legalParagraphClassName}>
        You can decline analytics without losing access to the website or the
        service-request form. If you later change your analytics choice, use
        the “Analytics choices” control in the footer or on this page. You may
        also contact us to ask about, correct, or request deletion of
        service-request information, subject to records we must reasonably keep.
      </p>

      <h2 className={legalHeadingClassName}>Security and external links</h2>
      <p className={legalParagraphClassName}>
        We use reasonable safeguards, but no internet transmission or storage
        system is guaranteed to be completely secure. This website may link to
        services operated by others; their privacy practices are governed by
        their own policies.
      </p>
    </LegalPage>
  );
}
