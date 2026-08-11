import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publishedLocationPages } from "@/lib/location-pages";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `Service Areas in ${site.serviceArea}`,
  description: `${site.name} serves Toledo and surrounding communities across ${site.serviceArea} with underground sewer, water, drainage, excavation, and utility work. Explore local service coverage.`,
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <Section spacing="compact" tone="surface">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Service Areas" },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)] lg:items-end lg:gap-14">
          <SectionHeading
            as="h1"
            className="max-w-4xl"
            description={`${site.name} is a service-area contractor serving Toledo and nearby communities throughout ${site.serviceArea}. Start with Toledo or contact us to confirm coverage for your property.`}
            eyebrow={`${site.serviceArea} coverage`}
            title="Service areas"
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
          description="Explore detailed service information for the communities at the center of our Northwest Ohio coverage."
          eyebrow="Local coverage"
          title="Featured service areas"
        />

        <ul
          className="mt-10 divide-y divide-line border-y border-line"
          role="list"
        >
          {publishedLocationPages.map((page) => (
            <li className="py-4 sm:py-5" key={page.path}>
              <Link
                className="font-display text-lg font-bold tracking-[-0.02em] text-brand-deep underline decoration-transparent underline-offset-4 transition-colors hover:decoration-accent sm:text-xl"
                href={page.path}
              >
                {page.city}
              </Link>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                {page.description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
            Also serving nearby communities
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted sm:leading-8">
            Beyond Toledo, {site.name} serves{" "}
            {site.primaryCities.join(", ")}, and surrounding communities across{" "}
            {site.serviceArea}. Contact us with the property city or ZIP so we
            can confirm the service area and next step.
          </p>
        </div>
      </Section>
    </>
  );
}
