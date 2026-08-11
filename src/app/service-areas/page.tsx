import Link from "next/link";

import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
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
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Service Areas" },
        ]}
        description={`${site.name} is a service-area contractor serving Toledo and nearby communities throughout ${site.serviceArea}. Start with Toledo or contact us to confirm coverage for your property.`}
        eyebrow={`${site.serviceArea} coverage`}
        title="Service areas"
      />

      <Section className="industrial-grid" spacing="default">
        <SectionHeading
          as="h2"
          description="Explore detailed service information for the communities at the center of our Northwest Ohio coverage."
          eyebrow="Local coverage"
          title="Featured service areas"
        />

        <ul className="mt-12 grid gap-5" role="list">
          {publishedLocationPages.map((page, index) => (
            <li key={page.path}>
              <Link
                className="brand-card group grid gap-6 p-6 transition-transform hover:-translate-y-1 hover:border-accent sm:p-8 lg:grid-cols-[8rem_minmax(0,1fr)_auto] lg:items-center"
                href={page.path}
              >
                <span className="font-display text-6xl font-black leading-none tracking-[-0.07em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-3xl font-black tracking-[-0.045em] text-brand-deep">
                    {page.city}
                  </span>
                  <span className="mt-3 block max-w-3xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                    {page.description}
                  </span>
                </span>
                <span aria-hidden="true" className="text-3xl text-accent-deep">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <h2 className="font-display text-3xl font-black leading-none tracking-[-0.045em] text-brand-deep sm:text-4xl">
            Also serving nearby communities
          </h2>
          <div>
            <ul className="flex flex-wrap gap-3" role="list">
              {site.primaryCities.map((city) => (
                <li
                  className="border border-line bg-surface px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-brand-deep"
                  key={city}
                >
                  {city}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-base leading-7 text-ink-muted sm:leading-8">
              Contact us with the property city or ZIP so we can confirm the
              service area and next step.
            </p>
          </div>
        </div>
      </Section>

      <ConversionBand
        body="Tell us the property city or ZIP and what underground work you need. We will confirm coverage and the right next step."
        eyebrow="Confirm your service area"
        title={`Planning underground work in ${site.serviceArea}?`}
      />
    </>
  );
}
