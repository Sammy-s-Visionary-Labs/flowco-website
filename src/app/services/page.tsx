import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/seo";
import { publishedServicePages } from "@/lib/service-pages";
import { site } from "@/lib/site";

const coreServicePages = publishedServicePages.filter((page) =>
  page.path.startsWith("/services/"),
);

export const metadata = createPageMetadata({
  title: `Underground Utility Services in ${site.serviceArea}`,
  description: `${site.name} provides underground sewer, water service line, stormwater, drainage, excavation, and utility trenching services across ${site.serviceArea}.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section spacing="compact" tone="surface">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Services" },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)] lg:items-end lg:gap-14">
          <SectionHeading
            as="h1"
            className="max-w-4xl"
            description={`${site.name} handles focused underground sewer, water, drainage, excavation, and utility work for homes, businesses, contractors, and municipalities throughout ${site.serviceArea}.`}
            eyebrow={`${site.serviceArea} underground utility work`}
            title="Services"
          />

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <CallLink
              analyticsLocation="page_content"
              className="w-full"
              label={`Call ${site.phone}`}
              size="lg"
            />
            <RequestServiceLink
              analyticsLocation="page_content"
              className="w-full"
              size="lg"
              variant="outline"
            />
          </div>
        </div>
      </Section>

      <Section className="industrial-grid" spacing="default">
        <SectionHeading
          as="h2"
          description="Choose the service that best matches the problem or project. If you are not sure where to start, send a service request with the location and what you are seeing."
          eyebrow="Core services"
          title="Underground work built around the property"
        />

        <ul className="mt-10 divide-y divide-line border-y border-line" role="list">
          {coreServicePages.map((page) => (
            <li className="py-6 sm:py-7" key={page.path}>
              <Link
                className="font-display text-xl font-black tracking-[-0.03em] text-brand-deep underline decoration-transparent underline-offset-4 transition-colors hover:decoration-accent sm:text-2xl"
                href={page.path}
              >
                {page.label}
              </Link>
              <p className="mt-3 max-w-3xl text-base leading-7 text-ink-muted sm:leading-8">
                {page.scopeDescription}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="default" tone="surface">
        <Eyebrow>Commercial and partner work</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-none tracking-[-0.045em] text-brand-deep text-balance">
          Planning work for a business, contractor, or municipality?
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
          Start with the commercial services pathway for organization details,
          project context, and underground utility scopes that involve property
          teams or project partners.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center font-bold text-brand underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          href="/commercial"
        >
          Explore commercial services
        </Link>
      </Section>

      <Section className="industrial-grid-inverse" spacing="spacious" tone="brand">
        <div className="max-w-3xl">
          <Eyebrow tone="light">Start a service request</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[0.96] tracking-[-0.045em] text-balance">
            Need underground utility help in {site.serviceArea}?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Call {site.name} or tell us the property location and what is going
            wrong. Photos are optional.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CallLink
              analyticsLocation="page_content"
              label={`Call ${site.phone}`}
              size="lg"
              variant="accent"
            />
            <RequestServiceLink
              analyticsLocation="page_content"
              size="lg"
              variant="outline-inverse"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
