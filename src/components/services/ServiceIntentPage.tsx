import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { ConversionBand } from "@/components/ui/ConversionBand";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { WorkPhoto } from "@/components/ui/WorkPhoto";
import type { ServicePageDefinition } from "@/lib/service-pages";
import { createServiceStructuredData } from "@/lib/structured-data";

type ServiceIntentPageProps = {
  page: ServicePageDefinition;
};

export function ServiceIntentPage({ page }: ServiceIntentPageProps) {
  return (
    <>
      <JsonLd data={createServiceStructuredData(page)} />
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: page.label },
        ]}
        description={page.intro}
        eyebrow={page.eyebrow}
        title={page.title}
      />

      <Section className="industrial-grid" id="scope" spacing="default">
        <div
          className={
            page.photo
              ? "grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(22rem,1.12fr)] lg:items-start lg:gap-16"
              : undefined
          }
        >
          <SectionHeading
            as="h2"
            description={page.scopeDescription}
            eyebrow="What this service covers"
            title="What this service includes"
          />

          {page.photo ? (
            <WorkPhoto
              aspect="landscape"
              className="w-full max-w-3xl"
              photo={page.photo}
            />
          ) : null}
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2" role="list">
          {page.scope.map((item, index) => (
            <li className="brand-card flex min-h-36 gap-5 p-5 sm:p-6" key={item}>
              <span className="font-display text-3xl font-black leading-none tracking-[-0.05em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-7 text-ink sm:text-lg sm:leading-8">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="industrial-grid-inverse" spacing="default" tone="brand">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <SectionHeading
            as="h2"
            description={page.signsDescription}
            eyebrow="When to call"
            title={page.signsTitle}
            tone="light"
          />

          <ul className="grid gap-3" role="list">
            {page.signs.map((sign) => (
              <li
                className="flex gap-4 border border-canvas/12 bg-brand-deep/55 p-5 text-base leading-7 text-canvas/82 sm:text-lg sm:leading-8"
                key={sign}
              >
                <span className="mt-2 size-2 shrink-0 bg-accent" />
                {sign}
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

      <Section className="industrial-grid" id="faq" spacing="default">
        <SectionHeading
          as="h2"
          description={page.faqDescription}
          eyebrow="FAQ"
          title={page.faqTitle}
        />
        <FaqList faqs={page.faqs} />
      </Section>

      <Section spacing="default" tone="surface">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
          <div>
            <Eyebrow>Related work</Eyebrow>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
              {page.relatedNote}
            </p>
          </div>
          {page.relatedLinks.length > 0 ? (
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
          ) : null}
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
