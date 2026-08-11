import Link from "next/link";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import type { LocationPageDefinition } from "@/lib/location-pages";
import { site } from "@/lib/site";

type LocationIntentPageProps = {
  page: LocationPageDefinition;
};

export function LocationIntentPage({ page }: LocationIntentPageProps) {
  return (
    <>
      <Section spacing="compact" tone="surface">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/service-areas", label: "Service Areas" },
            { label: page.city },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.7fr)] lg:items-end lg:gap-14">
          <SectionHeading
            as="h1"
            className="max-w-4xl"
            description={page.intro}
            eyebrow={page.eyebrow}
            title={page.title}
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

      <Section className="industrial-grid" id="services" spacing="default">
        <SectionHeading
          as="h2"
          description={page.servicesDescription}
          eyebrow="Services in this area"
          title={page.servicesTitle}
        />

        <ul
          className="mt-10 divide-y divide-line border-y border-line"
          role="list"
        >
          {page.relatedLinks
            .filter((link) => link.href.startsWith("/services/"))
            .map((link) => (
              <li className="py-4 sm:py-5" key={link.href}>
                <Link
                  className="font-display text-lg font-bold tracking-[-0.02em] text-brand-deep underline decoration-transparent underline-offset-4 transition-colors hover:decoration-accent sm:text-xl"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </Section>

      <Section spacing="default" tone="muted">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description={page.localContextDescription}
            eyebrow="Local context"
            title={page.localContextTitle}
          />

          <ul className="space-y-4" role="list">
            {page.localContext.map((item) => (
              <li
                className="flex gap-4 border-l-2 border-accent pl-4 text-base leading-7 text-ink sm:text-lg sm:leading-8"
                key={item}
              >
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

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8" role="list">
          {page.process.map((item) => (
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

      <Section className="industrial-grid" spacing="default">
        <SectionHeading
          as="h2"
          description={page.nearbyDescription}
          eyebrow="Nearby communities"
          title={`Serving ${page.city} and surrounding ${site.serviceArea}`}
        />

        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3" role="list">
          <li className="border border-brand bg-brand px-4 py-2.5 text-sm font-bold text-white">
            {page.city}
          </li>
          {page.nearbyCommunities.map((city) => (
            <li
              className="border border-line bg-canvas px-4 py-2.5 text-sm font-bold text-brand-deep"
              key={city}
            >
              {city}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" spacing="default" tone="surface">
        <SectionHeading
          as="h2"
          description={page.faqDescription}
          eyebrow="FAQ"
          title={page.faqTitle}
        />

        <div className="mt-10 divide-y divide-line border-y border-line">
          {page.faqs.map((faq) => (
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

      <Section spacing="default" tone="muted">
        <Eyebrow>Related pages</Eyebrow>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
          {page.relatedNote}
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3" role="list">
          {page.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                className="inline-flex min-h-11 items-center font-bold text-brand underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        className="industrial-grid-inverse"
        spacing="spacious"
        tone="brand"
      >
        <div className="max-w-3xl">
          <Eyebrow tone="light">{page.ctaEyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[0.96] tracking-[-0.045em] text-balance">
            {page.ctaTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            {page.ctaBody}
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
