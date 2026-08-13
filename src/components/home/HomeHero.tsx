import { BrandLogo } from "@/components/brand/BrandLogo";
import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="home-hero relative isolate overflow-hidden bg-brand-deep text-canvas"
    >
      <div
        aria-hidden="true"
        className="home-hero-atmosphere pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="industrial-grid-inverse pointer-events-none absolute inset-0 opacity-45"
      />

      <Container className="relative z-10 grid min-h-[min(88svh,54rem)] items-center gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.72fr)] lg:gap-16 lg:py-20">
        <div className="home-hero-copy max-w-4xl">
          <p className="flex items-center gap-3 text-[0.6875rem] font-black uppercase tracking-[0.21em] text-accent-light">
            <span aria-hidden="true" className="size-2 bg-accent" />
            {site.serviceArea}
          </p>

          <h1
            className="mt-6 font-display text-[clamp(3.5rem,9vw,7.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-balance"
            id="home-hero-heading"
          >
            Underground utility specialists.
          </h1>

          <p className="mt-7 max-w-2xl border-l-4 border-accent pl-5 text-lg font-semibold leading-8 text-canvas/88 sm:text-xl sm:leading-9">
            Sewer, water, drainage, and excavation work for Northwest Ohio
            properties and project partners.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-7 text-canvas/66 sm:text-lg sm:leading-8">
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

        <div className="relative mx-auto w-full max-w-md border border-canvas/15 bg-brand/38 p-7 shadow-panel backdrop-blur-[2px] sm:p-9 lg:max-w-none">
          <span className="absolute -left-px -top-px h-1.5 w-24 bg-accent" />
          <span className="absolute -bottom-px -right-px h-1.5 w-24 bg-accent" />
          <BrandLogo
            alt={`${site.name}: sewer, water, drainage and excavation`}
            className="mx-auto h-auto w-full max-w-[23rem]"
            priority
            variant="primary-reverse"
          />
          <div className="mt-7 grid grid-cols-2 gap-px bg-canvas/15 text-center text-[0.625rem] font-black uppercase tracking-[0.13em] text-canvas/74">
            {[
              "Residential",
              "Commercial",
              "Contractors",
              "Municipal",
            ].map((label) => (
              <span className="bg-brand-deep/75 px-3 py-3" key={label}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
