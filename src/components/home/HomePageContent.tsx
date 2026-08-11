import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { publishedLocationPages } from "@/lib/location-pages";
import { publishedServicePages } from "@/lib/service-pages";
import { confirmedServices, site } from "@/lib/site";
import Link from "next/link";

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
          description={`${site.name} handles underground utility work that keeps properties flowing—without stretching into unsupported plumbing claims.`}
          eyebrow="Why call us"
          title="Serious underground work for Northwest Ohio properties"
        />

        <ul
          className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8"
          role="list"
        >
          {trustPoints.map((point) => (
            <li key={point.title}>
              <h3 className="font-display text-xl font-black tracking-[-0.03em] text-brand-deep sm:text-2xl">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="industrial-grid" id="services" spacing="default">
        <SectionHeading
          as="h2"
          description="Every service below is part of our confirmed underground scope. If a job falls outside it, we will say so."
          eyebrow="Core services"
          title="What we work on"
        />

        <ul
          className="mt-10 divide-y divide-line border-y border-line"
          role="list"
        >
          {confirmedServices.map((service) => {
            const href = publishedServiceHrefById.get(service.id);

            return (
              <li
                className="flex items-baseline justify-between gap-6 py-4 sm:py-5"
                key={service.id}
              >
                {href ? (
                  <Link
                    className="font-display text-lg font-bold tracking-[-0.02em] text-brand-deep underline decoration-transparent underline-offset-4 transition-colors hover:decoration-accent sm:text-xl"
                    href={href}
                  >
                    {service.label}
                  </Link>
                ) : (
                  <span className="font-display text-lg font-bold tracking-[-0.02em] text-brand-deep sm:text-xl">
                    {service.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section spacing="default" tone="muted">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description="If the problem is underground, buried, or tied to site drainage and utility lines, start here."
            eyebrow="When to reach out"
            title="Signs you may need Ohio Flow Co"
          />

          <ul className="space-y-4" role="list">
            {needSigns.map((sign) => (
              <li
                className="flex gap-4 border-l-2 border-accent pl-4 text-base leading-7 text-ink sm:text-lg sm:leading-8"
                key={sign}
              >
                {sign}
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
          title="A simple path from problem to crew"
        />

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8" role="list">
          {processSteps.map((item) => (
            <li key={item.step}>
              <p className="font-display text-sm font-extrabold tracking-[0.14em] text-accent-strong">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
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

        <ul
          className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-3 lg:gap-8"
          role="list"
        >
          {audiences.map((audience) => (
            <li key={audience.title}>
              <Eyebrow>{audience.title}</Eyebrow>
              <p className="mt-4 text-base leading-7 text-ink-muted sm:leading-8">
                {audience.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
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
        <SectionHeading
          as="h2"
          description={`${site.name} is a service-area contractor. We come to the property—there is no public storefront address.`}
          eyebrow="Communities served"
          title={`Working across ${site.serviceArea}`}
        />

        <ul
          className="mt-10 flex flex-wrap gap-x-3 gap-y-3"
          role="list"
        >
          {site.primaryCities.map((city) => {
            const href = publishedLocationHrefByCity.get(city);

            return (
              <li key={city}>
                {href ? (
                  <Link
                    className="inline-flex border border-brand bg-brand px-4 py-2.5 text-sm font-bold text-white underline decoration-transparent underline-offset-4 transition-colors hover:decoration-white"
                    href={href}
                  >
                    {city}
                  </Link>
                ) : (
                  <span className="inline-flex border border-line bg-canvas px-4 py-2.5 text-sm font-bold text-brand-deep">
                    {city}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        className="industrial-grid-inverse"
        spacing="spacious"
        tone="brand"
      >
        <div className="max-w-3xl">
          <Eyebrow tone="light">Ready to talk</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.96] tracking-[-0.045em] text-balance">
            Need underground sewer, water, drainage, or excavation help?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Call {site.name} or send a service request. We will follow up about
            the work and the next step.
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
