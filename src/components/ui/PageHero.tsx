import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

type PageHeroProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  description: string;
  eyebrow: ReactNode;
  showRequestService?: boolean;
  title: ReactNode;
};

export function PageHero({
  breadcrumbs,
  description,
  eyebrow,
  showRequestService = true,
  title,
}: PageHeroProps) {
  return (
    <section className="page-hero relative isolate overflow-hidden text-white">
      <BrandLogo
        alt=""
        className="page-hero-mark pointer-events-none absolute -right-16 top-1/2 hidden w-[28rem] -translate-y-1/2 opacity-[0.075] lg:block xl:right-8 xl:w-[32rem]"
        variant="mark-reverse"
      />

      <Container className="relative z-10 py-10 sm:py-14 lg:py-20">
        <Breadcrumbs items={breadcrumbs} tone="light" />

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_19rem] lg:items-end lg:gap-16">
          <SectionHeading
            as="h1"
            className="max-w-5xl"
            description={description}
            eyebrow={eyebrow}
            title={title}
            tone="light"
          />

          <aside className="border border-white/15 bg-brand/40 p-5 shadow-panel backdrop-blur-sm sm:p-6">
            <p className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-accent-light">
              Start the conversation
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Tell us where the property is and what is happening below grade.
            </p>
            <div className="mt-5 grid gap-3">
              <CallLink
                analyticsLocation="page_content"
                className="w-full"
                label={`Call ${site.phone}`}
                size="lg"
                variant="accent"
              />
              {showRequestService ? (
                <RequestServiceLink
                  analyticsLocation="page_content"
                  className="w-full"
                  size="lg"
                  variant="outline-inverse"
                />
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
