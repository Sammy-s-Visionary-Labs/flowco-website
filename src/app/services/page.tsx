import Link from "next/link";

import { ConversionBand } from "@/components/ui/ConversionBand";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { WorkPhoto } from "@/components/ui/WorkPhoto";
import { createPageMetadata } from "@/lib/seo";
import { publishedServicePages } from "@/lib/service-pages";
import { site } from "@/lib/site";
import { workPhotos } from "@/lib/work-photos";

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
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "Services" },
        ]}
        description={`${site.name} handles focused underground sewer, water, drainage, excavation, and utility work for homes, businesses, contractors, and municipalities throughout ${site.serviceArea}.`}
        eyebrow={`${site.serviceArea} underground utility work`}
        title="Services"
      />

      <Section className="industrial-grid" spacing="default">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(22rem,1.12fr)] lg:items-start lg:gap-16">
          <SectionHeading
            as="h2"
            description="Choose the service that best matches the problem or project. If you are not sure where to start, send a service request with the location and what you are seeing."
            eyebrow="Core services"
            title="Underground work built around the property"
          />

          <WorkPhoto
            className="w-full max-w-3xl"
            photo={workPhotos.sewerInstallationSurvey}
          />
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2" role="list">
          {coreServicePages.map((page, index) => (
            <li key={page.path}>
              <Link
                className="brand-card group flex min-h-64 flex-col p-6 transition-transform hover:-translate-y-1 hover:border-accent sm:p-8"
                href={page.path}
              >
                <span className="text-[0.6875rem] font-black tracking-[0.18em] text-accent-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-8 block max-w-md font-display text-2xl font-black leading-none tracking-[-0.04em] text-brand-deep sm:text-3xl">
                  {page.label}
                </span>
                <span className="mt-4 block max-w-xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                  {page.scopeDescription}
                </span>
                <span aria-hidden="true" className="mt-auto pt-8 text-2xl text-accent-deep">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="industrial-grid-inverse" spacing="default" tone="brand">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
          <div>
            <Eyebrow tone="light">Commercial and partner work</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.025em] text-canvas text-balance">
              Planning work for a business, contractor, or municipality?
            </h2>
          </div>
          <div className="border-l-4 border-accent pl-5 sm:pl-8">
            <p className="text-base leading-7 text-canvas/72 sm:text-lg sm:leading-8">
              Start with the commercial services pathway for organization
              details, project context, and underground utility scopes that
              involve property teams or project partners.
            </p>
            <Link
              className="mt-7 inline-flex min-h-12 items-center border-b-2 border-accent text-xs font-black uppercase tracking-[0.1em] text-accent-light transition-colors hover:text-canvas"
              href="/commercial"
            >
              Explore commercial services →
            </Link>
          </div>
        </div>
      </Section>

      <ConversionBand
        body={
          <>
            Call {site.name} or tell us the property location and what is going
            wrong. Photos are optional.
          </>
        }
        eyebrow="Start a service request"
        title={`Need underground utility help in ${site.serviceArea}?`}
      />
    </>
  );
}
