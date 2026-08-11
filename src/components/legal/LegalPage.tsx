import type { ReactNode } from "react";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

type LegalPageProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export const legalHeadingClassName =
  "mt-12 font-display text-2xl font-black tracking-[-0.035em] text-brand-deep first:mt-0 sm:text-3xl";
export const legalParagraphClassName =
  "mt-4 text-base leading-7 text-ink-muted sm:leading-8";
export const legalListClassName =
  "mt-5 list-disc space-y-3 pl-6 text-base leading-7 text-ink-muted sm:leading-8";

export function LegalPage({
  children,
  description,
  eyebrow,
  title,
}: LegalPageProps) {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { href: "/", label: "Home" },
          { label: title },
        ]}
        description={description}
        eyebrow={eyebrow}
        title={title}
      />
      <Section className="industrial-grid" spacing="default">
        <article className="mx-auto max-w-4xl border border-line bg-surface p-6 shadow-panel sm:p-9 lg:p-12">
          {children}
          <p className="mt-12 border-t border-line pt-6 text-sm leading-6 text-ink-subtle">
            Last updated August 11, 2026. Questions can be sent to{" "}
            <a
              className="font-bold text-brand underline decoration-accent/60 underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
            .
          </p>
        </article>
      </Section>
    </>
  );
}
