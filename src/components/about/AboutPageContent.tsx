import Link from "next/link";

import { PhoneLink } from "@/components/ui/CtaLink";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { WorkPhoto } from "@/components/ui/WorkPhoto";
import { publishedLocationPages } from "@/lib/location-pages";
import { publishedServicePages } from "@/lib/service-pages";
import { confirmedServices, site } from "@/lib/site";
import { workPhotos } from "@/lib/work-photos";

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
    body: "Builders, trades, and public agencies that need a specialist partner for sewer, water, drainage, excavation, and utility trenching scopes.",
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
    question: `What services does ${site.name} provide?`,
    answer:
      "Services include sewer line repair and replacement, water service line repair, replacement, and installation, stormwater management, drainage solutions, site excavation, utility trenching, commercial sewer and water work, and contractor or municipal support.",
  },
] as const;

const publishedServiceHrefById = new Map<string, string>();

for (const page of publishedServicePages) {
  for (const serviceId of page.serviceIds) {
    publishedServiceHrefById.set(serviceId, page.path);
  }
}

const publishedLocationHrefByCity = new Map<string, string>(
  publishedLocationPages.map((page) => [page.city, page.path]),
);

export function AboutPageContent() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: "About" },
        ]}
        description={`${site.name} is a specialized sewer, water, drainage, and excavation contractor serving homes, businesses, contractors, and municipalities throughout ${site.serviceArea}.`}
        eyebrow="About the company"
        title={`About ${site.name}`}
      />

      <Section className="industrial-grid" spacing="default">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(22rem,1.12fr)] lg:items-start lg:gap-16">
          <SectionHeading
            as="h2"
            description={`${site.tagline} Our work centers on underground problems that require practical sewer, water, drainage, excavation, and utility field work.`}
            eyebrow="Who we are"
            title="An underground utility specialist for Northwest Ohio"
          />

          <WorkPhoto
            className="w-full max-w-3xl"
            photo={workPhotos.equipmentMobilization}
          />
        </div>

        <dl className="mt-12 grid gap-4 md:grid-cols-2">
          {[
            ["Operating name", site.name],
            ["Legal name", site.legalName],
            ["Service model", "Service-area contractor. We come to the property and do not operate a public storefront."],
            ["Primary territory", `${site.serviceArea}, led by Toledo and nearby communities.`],
          ].map(([term, description], index) => (
            <div className="brand-card min-h-44 p-6 sm:p-7" key={term}>
              <dt className="flex items-center gap-3 text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-deep">
                <span className="text-accent">0{index + 1}</span>
                {term}
              </dt>
              <dd className="mt-7 max-w-lg font-display text-xl font-black leading-tight tracking-[-0.03em] text-brand-deep sm:text-2xl">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section spacing="default" tone="surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description="Our work centers on the underground services property owners, businesses, contractors, and municipal partners request most often."
            eyebrow="What we do"
            title="Core underground services"
          />

          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {confirmedServices.map((service, index) => {
              const href = publishedServiceHrefById.get(service.id);
              const content = (
                <>
                  <span className="text-[0.625rem] font-black tracking-[0.18em] text-accent-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-5 block font-display text-lg font-black leading-tight tracking-[-0.03em] text-brand-deep">
                    {service.label}
                  </span>
                </>
              );

              return (
                <li key={service.id}>
                  {href ? (
                    <Link
                      className="brand-card block min-h-32 p-5 transition-transform hover:-translate-y-1 hover:border-accent"
                      href={href}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="brand-card min-h-32 p-5">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section className="industrial-grid" spacing="default">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16">
          <SectionHeading
            as="h2"
            description={`${site.name} comes to the property. Toledo is the lead community, with surrounding ${site.serviceArea} cities also served.`}
            eyebrow="Where we work"
            title={`Serving ${site.serviceArea}`}
          />

          <div>
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
                      <span className="inline-flex border border-line bg-surface px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-brand-deep">
                        {city}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-7 text-sm leading-6 text-ink-muted">
              Explore the{" "}
              <Link className="font-bold text-brand underline decoration-accent/50 underline-offset-4" href="/service-areas">
                service areas hub
              </Link>{" "}
              for local coverage details.
            </p>
          </div>
        </div>
      </Section>

      <Section className="industrial-grid-inverse" spacing="default" tone="brand">
        <SectionHeading
          as="h2"
          description="One underground specialty. Different starting points depending on who needs the work done."
          eyebrow="Who we help"
          title="Residential, commercial, and partner customers"
          tone="light"
        />

        <ul className="mt-12 grid gap-4 lg:grid-cols-3" role="list">
          {audiences.map((audience) => (
            <li className="border border-canvas/12 bg-brand-deep/58 p-6 sm:p-8" key={audience.title}>
              <Eyebrow tone="light">{audience.title}</Eyebrow>
              <p className="mt-10 text-base leading-7 text-canvas/70 sm:leading-8">
                {audience.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="default" tone="muted">
        <SectionHeading
          as="h2"
          description="Call, email, or send a service request with the property location and a brief description of the underground work."
          eyebrow="Contact"
          title={`How to reach ${site.name}`}
        />

        <address className="mt-12 grid gap-4 not-italic md:grid-cols-3">
          <div className="brand-card p-6">
            <span className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-deep">Phone</span>
            <PhoneLink
              analyticsLocation="page_content"
              className="mt-6 block break-all font-display text-xl font-black tracking-[-0.03em] text-brand-deep underline decoration-accent/50 underline-offset-4"
            >
              {site.phone}
            </PhoneLink>
          </div>
          <div className="brand-card p-6">
            <span className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-deep">Email</span>
            <a
              className="mt-6 block break-all font-display text-lg font-black tracking-[-0.03em] text-brand-deep underline decoration-accent/50 underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </div>
          <div className="brand-card p-6">
            <span className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-deep">Website</span>
            <span className="mt-6 block break-all font-display text-lg font-black tracking-[-0.03em] text-brand-deep">
              {site.domain.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </address>
      </Section>

      <Section id="faq" spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={`Straightforward answers about ${site.name}, the work we handle, and the communities we serve.`}
          eyebrow="FAQ"
          title={`About ${site.name}`}
        />
        <FaqList faqs={aboutFaqs} />
      </Section>

      <ConversionBand
        body={
          <>
            Call {site.name} or send a service request. Tell us where the
            property is and what underground work you need.
          </>
        }
        eyebrow="Work with us"
        title={`Need underground utility help in ${site.serviceArea}?`}
      />
    </>
  );
}
