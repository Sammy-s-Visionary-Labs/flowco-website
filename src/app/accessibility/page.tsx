import {
  LegalPage,
  legalHeadingClassName,
  legalListClassName,
  legalParagraphClassName,
} from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Accessibility Statement",
  description: `${site.name} is committed to providing an accessible website and alternative ways to request underground utility service.`,
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      description={`${site.name} aims to make this website usable for people with a wide range of abilities, devices, and assistive technologies.`}
      eyebrow="Inclusive access"
      title="Accessibility Statement"
    >
      <h2 className={legalHeadingClassName}>Our approach</h2>
      <p className={legalParagraphClassName}>
        Accessibility is an ongoing part of maintaining this website. We use
        established accessibility guidance as a reference and work to support
        keyboard navigation, visible focus, meaningful headings and labels,
        readable contrast, text alternatives, reduced motion preferences, and
        responsive layouts. This statement does not claim that every page or
        third-party service is free of all accessibility barriers.
      </p>

      <h2 className={legalHeadingClassName}>Alternative ways to contact us</h2>
      <p className={legalParagraphClassName}>
        If the online form is difficult to use, call {site.phone} or email{" "}
        {site.email}. We can discuss a service request through a different
        communication method when reasonably available.
      </p>

      <h2 className={legalHeadingClassName}>Report a barrier</h2>
      <p className={legalParagraphClassName}>
        If you encounter an accessibility problem, please tell us which page or
        feature caused difficulty, the device or assistive technology involved
        if you are comfortable sharing it, and a way to respond. Helpful reports
        include:
      </p>
      <ul className={legalListClassName}>
        <li>The page address or name.</li>
        <li>A short description of the task you were trying to complete.</li>
        <li>The format or accommodation that would help.</li>
      </ul>

      <h2 className={legalHeadingClassName}>Third-party content</h2>
      <p className={legalParagraphClassName}>
        Some linked tools or services are controlled by third parties. We
        welcome reports about those experiences and will provide a reasonable
        alternative when we can, even when we cannot directly change the
        third-party interface.
      </p>
    </LegalPage>
  );
}
