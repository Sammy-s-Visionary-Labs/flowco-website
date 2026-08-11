import Link from "next/link";

import { ConversionBand } from "@/components/ui/ConversionBand";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import type { LocationPageDefinition } from "@/lib/location-pages";
import { site } from "@/lib/site";

type LocationIntentPageProps = {
  page: LocationPageDefinition;
};

export function LocationIntentPage({ page }: LocationIntentPageProps) {
  const localServices = page.relatedLinks.filter((link) =>
    link.href.startsWith("/services/"),
  );

  return (
    <>
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/service-areas", label: "Service Areas" },
          { label: page.city },
        ]}
        description={page.intro}
        eyebrow={page.eyebrow}
        title={page.title}
      />

      <Section className="industrial-grid" id="services" spacing="default">
        <SectionHeading
          as="h2"
          description={page.servicesDescription}
          eyebrow="Services in this area"
          title={page.servicesTitle}
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {localServices.map((link, index) => (
            <li key={link.href}>
              <Link
                className="brand-card group block min-h-40 p-5 transition-transform hover:-translate-y-1 hover:border-accent sm:p-6"
                href={link.href}
              >
                <span className="text-[0.625rem] font-black tracking-[0.18em] text-accent-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-5 block font-display text-xl font-black leading-tight tracking-[-0.035em] text-brand-deep">
                  {link.label}
                </span>
                <span aria-hidden="true" className="mt-6 block text-xl text-accent-deep">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="industrial-grid-inverse" spacing="default" tone="brand">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description={page.localContextDescription}
            eyebrow="Local context"
            title={page.localContextTitle}
            tone="light"
          />

          <ul className="grid gap-3" role="list">
            {page.localContext.map((item) => (
              <li
                className="flex gap-4 border border-canvas/12 bg-brand-deep/55 p-5 text-base leading-7 text-canvas/82 sm:text-lg sm:leading-8"
                key={item}
              >
                <span className="mt-2 size-2 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={page.processDescription}
          eyebrow="How it works"
          title={page.processTitle}
        />

        <ol className="mt-12 grid gap-px bg-line md:grid-cols-3" role="list">
          {page.process.map((item) => (
            <li className="bg-surface p-6 sm:p-8" key={item.step}>
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

      <Section className="industrial-grid" spacing="default">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16">
          <SectionHeading
            as="h2"
            description={page.nearbyDescription}
            eyebrow="Nearby communities"
            title={`Serving ${page.city} and surrounding ${site.serviceArea}`}
          />

          <ul className="flex flex-wrap gap-3 border-l-4 border-accent pl-5 sm:pl-7" role="list">
            <li className="border-2 border-brand bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-canvas">
              {page.city}
            </li>
            {page.nearbyCommunities.map((city) => (
              <li
                className="border border-line bg-surface px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-brand-deep"
                key={city}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="faq" spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={page.faqDescription}
          eyebrow="FAQ"
          title={page.faqTitle}
        />
        <FaqList faqs={page.faqs} />
      </Section>

      <Section spacing="default" tone="muted">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
          <div>
            <Eyebrow>Related pages</Eyebrow>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
              {page.relatedNote}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2" role="list">
            {page.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="brand-card group flex min-h-28 items-center justify-between gap-4 p-5 font-display text-lg font-black tracking-[-0.03em] text-brand-deep transition-transform hover:-translate-y-1 hover:border-accent"
                  href={link.href}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-xl text-accent-deep">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <ConversionBand
        body={page.ctaBody}
        eyebrow={page.ctaEyebrow}
        title={page.ctaTitle}
      />
    </>
  );
}
