import {
  LegalPage,
  legalHeadingClassName,
  legalListClassName,
  legalParagraphClassName,
} from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Website Terms",
  description: `Terms for using the ${site.name} website and submitting an online service request.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      description={`Terms for using the ${site.name} website and its online service-request tools.`}
      eyebrow="Website use"
      title="Website Terms"
    >
      <h2 className={legalHeadingClassName}>Website information</h2>
      <p className={legalParagraphClassName}>
        This website provides general information about {site.name} and the
        underground sewer, water, drainage, excavation, and utility services we
        may provide. Website content is not an estimate, engineering opinion,
        diagnosis, permit approval, warranty, or promise that a particular job
        can be accepted.
      </p>

      <h2 className={legalHeadingClassName}>Service requests</h2>
      <p className={legalParagraphClassName}>
        Sending a form, email, or photo does not create a customer relationship
        or contract. Work is accepted only after scope, availability, site
        conditions, price, and any required agreement are confirmed. This
        website is not an emergency service channel; call the appropriate
        emergency or utility authority when immediate safety is at risk.
      </p>

      <h2 className={legalHeadingClassName}>Your submissions</h2>
      <ul className={legalListClassName}>
        <li>Provide information that is accurate to the best of your knowledge.</li>
        <li>Submit only photos and information you are authorized to share.</li>
        <li>
          Do not upload unlawful, harmful, confidential third-party, or
          malicious material.
        </li>
        <li>
          Do not interfere with the website, attempt unauthorized access, or
          use automated tools to abuse the request system.
        </li>
      </ul>

      <h2 className={legalHeadingClassName}>Website content</h2>
      <p className={legalParagraphClassName}>
        Unless otherwise stated, the website design, brand assets, and original
        content belong to {site.legalName} or are used with permission. You may
        view and print pages for ordinary personal or business evaluation, but
        may not republish or commercially exploit the content without permission.
      </p>

      <h2 className={legalHeadingClassName}>Availability and third parties</h2>
      <p className={legalParagraphClassName}>
        We may update, suspend, or correct the website at any time. Links and
        services supplied by third parties are provided for convenience and are
        governed by their own terms. To the extent permitted by law, the website
        is provided as available without a guarantee that it will always be
        uninterrupted or error-free.
      </p>
    </LegalPage>
  );
}
