import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

type ConversionBandProps = {
  body: ReactNode;
  eyebrow: ReactNode;
  title: ReactNode;
};

export function ConversionBand({ body, eyebrow, title }: ConversionBandProps) {
  return (
    <section className="conversion-band relative isolate overflow-hidden text-white">
      <BrandLogo
        alt=""
        className="pointer-events-none absolute -bottom-28 right-[4vw] w-[24rem] opacity-[0.07] sm:w-[30rem] lg:-bottom-40 lg:w-[38rem]"
        variant="mark-reverse"
      />
      <Container className="relative z-10 py-[var(--section-space-spacious)]">
        <div className="max-w-4xl border-l-4 border-accent pl-5 sm:pl-8">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-balance">
            {title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            {body}
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
      </Container>
    </section>
  );
}
