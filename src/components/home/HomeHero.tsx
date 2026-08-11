import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="home-hero relative isolate overflow-hidden bg-brand-deep text-white"
    >
      <div
        aria-hidden="true"
        className="home-hero-atmosphere pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="industrial-grid-inverse pointer-events-none absolute inset-0 opacity-70"
      />

      <Container className="relative flex min-h-[min(88svh,52rem)] flex-col justify-end pb-14 pt-16 sm:pb-16 sm:pt-20 lg:min-h-[min(82svh,48rem)] lg:pb-20 lg:pt-24">
        <div className="home-hero-copy max-w-4xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-light">
            {site.serviceArea}
          </p>

          <h1
            className="mt-5 font-display text-[clamp(3.25rem,12vw,7.5rem)] font-black leading-[0.86] tracking-[-0.055em] text-balance"
            id="home-hero-heading"
          >
            {site.name}
          </h1>

          <p className="mt-6 max-w-3xl font-display text-[clamp(1.35rem,3.4vw,2.35rem)] font-bold leading-[1.12] tracking-[-0.03em] text-white/92 text-balance">
            Sewer, water line, drainage &amp; excavation specialists serving
            Northwest Ohio.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Professional underground utility work for homes, businesses,
            contractors, and municipalities throughout the Toledo area.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <CallLink
              analyticsLocation="page_content"
              className="home-hero-cta w-full sm:w-auto"
              label={`Call ${site.phone}`}
              size="lg"
              variant="accent"
            />
            <RequestServiceLink
              analyticsLocation="page_content"
              className="home-hero-cta home-hero-cta-secondary w-full sm:w-auto"
              size="lg"
              variant="outline-inverse"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
