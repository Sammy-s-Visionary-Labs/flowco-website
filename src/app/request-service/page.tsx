import { RequestServiceForm } from "@/components/forms/RequestServiceForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CallLink } from "@/components/ui/CtaLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = {
  ...createPageMetadata({
    title: "Request Service",
    description: `Request underground sewer, water line, drainage, excavation, or utility service from ${site.name} in ${site.serviceArea}.`,
    path: "/request-service",
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function RequestServicePage() {
  return (
    <>
      <Section spacing="compact" tone="surface">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Request Service" },
          ]}
        />
        <SectionHeading
          as="h1"
          className="mt-8 max-w-4xl"
          description="Tell us where the work is and how to reach you. We’ll follow up to discuss the project."
          eyebrow={`${site.serviceArea} service requests`}
          title="Request service from Ohio Flow Co"
        />
      </Section>

      <Section className="industrial-grid" spacing="compact">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
          <Surface padding="spacious" tone="accent-edge">
            <RequestServiceForm />
          </Surface>

          <aside className="space-y-5" aria-label="Request service help">
            <Surface tone="brand">
              <h2 className="font-display text-2xl font-black tracking-[-0.03em]">
                Prefer to talk?
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Call {site.name} to discuss sewer, water line, drainage,
                excavation, or utility work.
              </p>
              <CallLink
                analyticsLocation="page_content"
                className="mt-6 w-full"
                label={`Call ${site.phone}`}
                variant="outline-inverse"
              />
            </Surface>

            <Surface tone="muted">
              <h2 className="font-display text-xl font-black text-brand-deep">
                Service area
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Serving Toledo and surrounding communities across{" "}
                {site.serviceArea}. A city and ZIP code help us understand where
                the project is located.
              </p>
            </Surface>
          </aside>
        </div>
      </Section>
    </>
  );
}
