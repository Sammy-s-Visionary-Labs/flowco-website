import { BrandLogo } from "@/components/brand/BrandLogo";
import { RequestServiceForm } from "@/components/forms/RequestServiceForm";
import { CallLink } from "@/components/ui/CtaLink";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
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
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Request Service" },
        ]}
        description="Tell us where the work is and how to reach you. We’ll follow up to discuss the project."
        eyebrow={`${site.serviceArea} service requests`}
        showRequestService={false}
        title="Request service from Ohio Flow Co"
      />

      <Section className="industrial-grid" spacing="compact">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
          <Surface padding="spacious" tone="accent-edge">
            <RequestServiceForm />
          </Surface>

          <aside className="space-y-5" aria-label="Request service help">
            <Surface className="relative overflow-hidden" tone="brand">
              <BrandLogo
                alt=""
                className="absolute -right-10 -top-10 w-40 opacity-10"
                variant="mark-reverse"
              />
              <div className="relative">
                <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-light">
                  Direct contact
                </p>
                <h2 className="mt-4 font-display text-3xl font-black leading-none tracking-[-0.04em]">
                  Prefer to talk?
                </h2>
                <p className="mt-4 text-sm leading-6 text-canvas/72">
                  Call {site.name} to discuss sewer, water line, drainage,
                  excavation, or utility work.
                </p>
                <CallLink
                  analyticsLocation="page_content"
                  className="mt-6 w-full"
                  label={`Call ${site.phone}`}
                  variant="accent"
                />
              </div>
            </Surface>

            <Surface tone="muted">
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-deep">
                Coverage
              </p>
              <h2 className="mt-4 font-display text-2xl font-black leading-none text-brand-deep">
                {site.serviceArea}
              </h2>
              <p className="mt-4 text-sm leading-6 text-ink-muted">
                A city and ZIP code help us understand where the project is
                located and confirm the next step.
              </p>
            </Surface>
          </aside>
        </div>
      </Section>
    </>
  );
}
