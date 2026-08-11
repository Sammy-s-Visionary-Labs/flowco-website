import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { publishedLocationPages } from "@/lib/location-pages";
import { publishedServicePages } from "@/lib/service-pages";
import { confirmedServices, site } from "@/lib/site";

const audiences = [
  {
    title: "Residential",
    body: "Homeowners and property managers who need underground sewer, water, drainage, or excavation help on private property.",
  },
  {
    title: "Commercial",
    body: "Businesses and property teams that need clear communication and dependable underground utility field work.",
  },
  {
    title: "Contractors & municipalities",
    body: "Builders, trades, and public agencies that need a specialist partner for confirmed underground utility scopes.",
  },
] as const;

const aboutFaqs = [
  {
    question: `What kind of company is ${site.name}?`,
    answer: `${site.name} is a specialized underground sewer, water, drainage, and excavation contractor serving residential, commercial, contractor, and municipal customers throughout ${site.serviceArea}. We are not a general indoor plumbing company.`,
  },
  {
    question: "Where does Ohio Flow Co work?",
    answer: `${site.name} is a service-area contractor focused on ${site.serviceArea}, led by Toledo and surrounding communities including Holland, Maumee, Perrysburg, Whitehouse, Sylvania, Waterville, and Monclova. There is no public storefront address.`,
  },
  {
    question: "How can someone contact Ohio Flow Co?",
    answer: `Call ${site.phone}, email ${site.email}, or use Request Service on this website.`,
  },
  {
    question: "What services are confirmed today?",
    answer:
      "Confirmed services include sewer line repair and replacement, water service line repair, replacement, and installation, stormwater management, drainage solutions, site excavation, utility trenching, commercial sewer and water work, and contractor or municipal support.",
  },
] as const;

const publishedServiceHrefById = new Map<string, string>();

for (const page of publishedServicePages) {
  for (const serviceId of page.serviceIds) {
    publishedServiceHrefById.set(serviceId, page.path);
  }
}

const publishedServiceLinks = publishedServicePages.filter((page) =>
  page.path.startsWith("/services/"),
);

const publishedLocationHrefByCity = new Map<string, string>(
  publishedLocationPages.map((page) => [page.city, page.path]),
);

export function AboutPageContent() {
  return (
    <>
      <Section spacing="compact" tone="surface">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "About" },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)] lg:items-end lg:gap-14">
          <SectionHeading
            as="h1"
            className="max-w-4xl"
            description={`${site.name} is a specialized sewer, water, drainage, and excavation contractor serving homes, businesses, contractors, and municipalities throughout ${site.serviceArea}.`}
            eyebrow="About the company"
            title={`About ${site.name}`}
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
          description={`${site.tagline} Our strongest positioning is handling underground problems that require practical field work—not presenting ourselves as another general plumbing shop.`}
          eyebrow="Who we are"
          title="An underground utility specialist for Northwest Ohio"
        />

        <dl className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          <div>
            <dt className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
              Operating name
            </dt>
            <dd className="mt-3 font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
              {site.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
              Legal name
            </dt>
            <dd className="mt-3 font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
              {site.legalName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
              Service model
            </dt>
            <dd className="mt-3 text-base leading-7 text-ink-muted sm:leading-8">
              Service-area contractor. No public storefront address is
              published.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
              Primary territory
            </dt>
            <dd className="mt-3 text-base leading-7 text-ink-muted sm:leading-8">
              {site.serviceArea}, led by Toledo and nearby communities.
            </dd>
          </div>
        </dl>
      </Section>

      <Section spacing="default" tone="muted">
        <SectionHeading
          as="h2"
          description="Every service listed here is part of the confirmed underground scope used across the site."
          eyebrow="What we do"
          title="Core underground services"
        />

        <ul
          className="mt-10 divide-y divide-line border-y border-line"
          role="list"
        >
          {confirmedServices.map((service) => {
            const href = publishedServiceHrefById.get(service.id);

            return (
              <li className="py-4 sm:py-5" key={service.id}>
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

        {publishedServiceLinks.length > 0 ? (
          <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
            Dedicated service pages are live for{" "}
            {publishedServiceLinks.map((page) => page.label).join(", ")}.
          </p>
        ) : null}
      </Section>

      <Section spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={`${site.name} comes to the property. Toledo is the lead community, with surrounding ${site.serviceArea} cities also served.`}
          eyebrow="Where we work"
          title={`Serving ${site.serviceArea}`}
        />

        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3" role="list">
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

        <p className="mt-8 max-w-3xl text-base leading-7 text-ink-muted sm:leading-8">
          Explore the{" "}
          <Link
            className="font-bold text-brand underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            href="/service-areas"
          >
            service areas
          </Link>{" "}
          hub and the dedicated{" "}
          <Link
            className="font-bold text-brand underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            href="/service-areas/toledo"
          >
            Toledo
          </Link>{" "}
          page for local detail.
        </p>
      </Section>

      <Section className="industrial-grid" spacing="default">
        <SectionHeading
          as="h2"
          description="One underground specialty. Different starting points depending on who needs the work done."
          eyebrow="Who we help"
          title="Residential, commercial, and partner customers"
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

        <p className="mt-10 max-w-3xl text-base leading-7 text-ink-muted sm:leading-8">
          Commercial, contractor, and municipal pathways are covered in more
          detail on the{" "}
          <Link
            className="font-bold text-brand underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            href="/commercial"
          >
            commercial services
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section spacing="default" tone="muted">
        <SectionHeading
          as="h2"
          description="Use the same public contact details everywhere on this site."
          eyebrow="Contact"
          title={`How to reach ${site.name}`}
        />

        <address className="mt-10 not-italic">
          <ul className="divide-y divide-line border-y border-line" role="list">
            <li className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
                Phone
              </span>
              <a
                className="font-display text-xl font-bold tracking-[-0.02em] text-brand-deep underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                href={site.phoneHref}
              >
                {site.phone}
              </a>
            </li>
            <li className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
                Email
              </span>
              <a
                className="break-all font-display text-xl font-bold tracking-[-0.02em] text-brand-deep underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
            </li>
            <li className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink-subtle">
                Website
              </span>
              <span className="font-display text-xl font-bold tracking-[-0.02em] text-brand-deep">
                {site.domain.replace(/^https?:\/\//, "")}
              </span>
            </li>
          </ul>
        </address>
      </Section>

      <Section id="faq" spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description="Short answers based only on confirmed public business information."
          eyebrow="FAQ"
          title={`About ${site.name}`}
        />

        <div className="mt-10 divide-y divide-line border-y border-line">
          {aboutFaqs.map((faq) => (
            <div className="py-6 sm:py-7" key={faq.question}>
              <h3 className="font-display text-xl font-black tracking-[-0.03em] text-brand-deep sm:text-2xl">
                {faq.question}
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-7 text-ink-muted sm:leading-8">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        className="industrial-grid-inverse"
        spacing="spacious"
        tone="brand"
      >
        <div className="max-w-3xl">
          <Eyebrow tone="light">Work with us</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[0.96] tracking-[-0.045em] text-balance">
            Need underground utility help in {site.serviceArea}?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Call {site.name} or send a service request. Tell us where the
            property is and what underground work you need.
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
