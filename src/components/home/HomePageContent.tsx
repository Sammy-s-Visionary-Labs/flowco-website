import Link from "next/link";

import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { publishedLocationPages } from "@/lib/location-pages";
import { publishedServicePages } from "@/lib/service-pages";
import { confirmedServices, site } from "@/lib/site";

const publishedServiceHrefById = new Map<string, string>();

for (const page of publishedServicePages) {
  for (const serviceId of page.serviceIds) {
    publishedServiceHrefById.set(serviceId, page.path);
  }
}

const publishedLocationHrefByCity = new Map<string, string>(
  publishedLocationPages.map((page) => [page.city, page.path]),
);

const trustPoints = [
  {
    title: "Underground specialists",
    body: "Focused on sewer, water, drainage, and excavation—not general plumbing.",
  },
  {
    title: "Built for serious jobs",
    body: "Repair, replacement, and site work for properties that need dependable underground utility crews.",
  },
  {
    title: "Local Northwest Ohio coverage",
    body: `Serving Toledo and nearby communities across ${site.serviceArea}.`,
  },
] as const;

const needSigns = [
  "Recurring sewer backups or slow drains that keep returning",
  "Wet spots, sinkholes, or settling ground over buried lines",
  "Water service issues that point to the line, not only fixtures",
  "Standing water, poor drainage, or stormwater that needs a lasting fix",
  "New utility trenches or excavation for a build or site upgrade",
] as const;

const processSteps = [
  {
    step: "01",
    title: "Tell us what is going wrong",
    body: "Call or request service with the property location and a clear description of the problem.",
  },
  {
    step: "02",
    title: "We review the work needed",
    body: "We confirm whether the job fits our underground sewer, water, drainage, or excavation scope.",
  },
  {
    step: "03",
    title: "Plan the right field response",
    body: "You get a straightforward next step for repair, replacement, drainage, or site utility work.",
  },
] as const;

const audiences = [
  {
    title: "Residential",
    body: "Homeowners and property managers dealing with sewer, water service, drainage, or excavation problems on private property.",
  },
  {
    title: "Commercial",
    body: "Businesses and property teams that need dependable underground utility repair and site work with clear communication.",
  },
  {
    title: "Contractors & municipalities",
    body: "Builders, trades, and public agencies that need a specialist partner for sewer, water, stormwater, and utility trenching support.",
  },
] as const;

export function HomePageContent() {
  return (
    <>
      <Section spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={`${site.name} handles focused underground sewer, water, drainage, excavation, and utility work for properties across ${site.serviceArea}.`}
          eyebrow="Why Ohio Flow Co"
          title="The right focus for work below grade"
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-3" role="list">
          {trustPoints.map((point, index) => (
            <li className="brand-card min-h-full p-6 sm:p-7" key={point.title}>
              <span className="font-display text-5xl font-black tracking-[-0.06em] text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-8 max-w-xs font-display text-2xl font-black leading-none tracking-[-0.04em] text-brand-deep">
                {point.title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                {point.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="industrial-grid" id="services" spacing="default">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div>
            <SectionHeading
              as="h2"
              description="Start with the underground service that best matches the problem. If you are unsure, describe what is happening and we will help identify the right next step."
              eyebrow="Core services"
              title="What we work on"
            />
            <div className="mt-8 hidden h-1 w-32 bg-accent lg:block" />
          </div>

          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {confirmedServices.map((service, index) => {
              const href = publishedServiceHrefById.get(service.id);
              const content = (
                <>
                  <span className="text-[0.625rem] font-black tracking-[0.18em] text-accent-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-5 block font-display text-xl font-black leading-tight tracking-[-0.035em] text-brand-deep">
                    {service.label}
                  </span>
                  {href ? (
                    <span aria-hidden="true" className="mt-6 block text-xl text-accent-deep">
                      →
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={service.id}>
                  {href ? (
                    <Link
                      className="brand-card group block min-h-40 p-5 transition-transform hover:-translate-y-1 hover:border-accent sm:p-6"
                      href={href}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="brand-card min-h-40 p-5 sm:p-6">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section className="industrial-grid-inverse" spacing="default" tone="brand">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description="If the problem is underground, buried, or tied to site drainage and utility lines, start here."
            eyebrow="When to reach out"
            title="Signs you may need Ohio Flow Co"
            tone="light"
          />

          <ul className="grid gap-3" role="list">
            {needSigns.map((sign, index) => (
              <li
                className="flex gap-4 border border-canvas/12 bg-brand-deep/55 p-4 text-base leading-7 text-canvas/82 sm:p-5 sm:text-lg sm:leading-8"
                key={sign}
              >
                <span className="mt-2 size-2 shrink-0 bg-accent" />
                <span>
                  <span className="mr-3 text-[0.625rem] font-black tracking-[0.14em] text-accent-light">
                    0{index + 1}
                  </span>
                  {sign}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description="No runaround. Tell us the issue, we confirm the fit, and we move toward a clear field plan."
          eyebrow="How it works"
          title="A direct path from problem to crew"
        />

        <ol className="mt-12 grid gap-px bg-line md:grid-cols-3" role="list">
          {processSteps.map((item) => (
            <li className="relative bg-surface p-6 sm:p-8" key={item.step}>
              <p className="font-display text-6xl font-black leading-none tracking-[-0.07em] text-accent/70">
                {item.step}
              </p>
              <h3 className="mt-8 font-display text-2xl font-black leading-none tracking-[-0.04em] text-brand-deep">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="industrial-grid" spacing="default" tone="canvas">
        <SectionHeading
          as="h2"
          description="One company for the underground work. Different starting points depending on who you are."
          eyebrow="Who we help"
          title="Residential, commercial, and partner pathways"
        />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3" role="list">
          {audiences.map((audience) => (
            <li className="brand-card-dark min-h-64 p-6 sm:p-8" key={audience.title}>
              <Eyebrow tone="light">{audience.title}</Eyebrow>
              <p className="mt-12 text-base leading-7 text-canvas/70 sm:leading-8">
                {audience.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <RequestServiceLink analyticsLocation="page_content" size="lg" />
          <CallLink
            analyticsLocation="page_content"
            label={`Call ${site.phone}`}
            size="lg"
            variant="outline"
          />
        </div>
      </Section>

      <Section spacing="default" tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16">
          <SectionHeading
            as="h2"
            description={`${site.name} is a service-area contractor. We come to the property—there is no public storefront address.`}
            eyebrow="Communities served"
            title={`Working across ${site.serviceArea}`}
          />

          <ul className="flex flex-wrap gap-3 border-l-4 border-accent pl-5 sm:pl-7" role="list">
            {site.primaryCities.map((city) => {
              const href = publishedLocationHrefByCity.get(city);

              return (
                <li key={city}>
                  {href ? (
                    <Link
                      className="inline-flex border-2 border-brand bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-canvas transition-colors hover:border-accent hover:bg-accent hover:text-brand-deep"
                      href={href}
                    >
                      {city}
                    </Link>
                  ) : (
                    <span className="inline-flex border border-line bg-canvas px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-brand-deep">
                      {city}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <ConversionBand
        body={
          <>
            Call {site.name} or send a service request. We will follow up about
            the work and the next step.
          </>
        }
        eyebrow="Ready to talk"
        title="Need underground sewer, water, drainage, or excavation help?"
      />
    </>
  );
}
