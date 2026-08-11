import Link from "next/link";

import {
  CallLink,
  PhoneLink,
  RequestServiceLink,
} from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { analyticsEventNames } from "@/lib/analytics";
import { publishedRoutes } from "@/lib/routes";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  const publishedPaths = new Set<string>(
    publishedRoutes.map(({ path }) => path),
  );
  const publishedLegalNavigation = navigation.legal.filter((item) =>
    publishedPaths.has(item.href),
  );

  return (
    <footer className="site-footer industrial-grid-inverse bg-brand-deep text-white">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-11 lg:grid-cols-12 lg:gap-8">
          <section aria-labelledby="footer-company-heading" className="lg:col-span-5">
            <div className="border-l-4 border-accent pl-4">
              <h2
                className="font-display text-2xl font-black tracking-[-0.025em]"
                id="footer-company-heading"
              >
                {site.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-white/70">
                {site.tagline}
              </p>
            </div>

            <p className="mt-6 max-w-md text-sm leading-6 text-white/75">
              Underground sewer, water line, drainage, and excavation work for
              homes, businesses, and properties across {site.serviceArea}.
            </p>

            <address className="mt-5 space-y-2 not-italic">
              <PhoneLink
                analyticsLocation="footer_contact"
                className="flex min-h-11 w-fit items-center text-base font-bold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                {site.phone}
              </PhoneLink>
              <a
                className="flex min-h-11 w-fit items-center break-all text-sm text-white/75 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
            </address>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CallLink
                analyticsLocation="footer_contact"
                label={`Call ${site.phone}`}
                variant="outline-inverse"
              />
              <RequestServiceLink analyticsLocation="footer_contact" />
            </div>
          </section>

          <nav
            aria-labelledby="footer-navigation-heading"
            className="lg:col-span-3 lg:pl-4"
          >
            <h2
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/55"
              id="footer-navigation-heading"
            >
              Explore
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:max-w-md lg:grid-cols-1" role="list">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-11 items-center font-semibold text-white/80 underline decoration-transparent underline-offset-4 transition-colors hover:text-white hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2 mt-1 lg:col-span-1">
                <Link
                  className="inline-flex min-h-11 items-center font-bold text-accent-light underline decoration-accent/50 underline-offset-4 transition-colors hover:text-white hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                  data-analytics-event={analyticsEventNames.requestServiceClick}
                  data-analytics-location="footer_nav"
                  href={navigation.cta.href}
                >
                  {navigation.cta.label}
                </Link>
              </li>
            </ul>
          </nav>

          <section aria-labelledby="footer-service-area-heading" className="lg:col-span-4">
            <h2
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/55"
              id="footer-service-area-heading"
            >
              Service Area
            </h2>
            <p className="mt-5 text-lg font-bold">{site.serviceArea}</p>
            <ul className="mt-4 flex flex-wrap gap-2" role="list">
              {site.primaryCities.map((city) => (
                <li
                  className="rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/75"
                  key={city}
                >
                  {city}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-white/60">
              Also serving surrounding communities. {site.name} is a service-area
              contractor and does not maintain a public storefront.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-white/15 pt-7 sm:mt-14 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="text-xs leading-5 text-white/50">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          {publishedLegalNavigation.length > 0 ? (
            <nav aria-label="Legal" className="mt-4 sm:mt-0">
              <ul className="flex flex-wrap gap-x-5 gap-y-3" role="list">
                {publishedLegalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="inline-flex min-h-11 items-center text-xs font-semibold text-white/60 underline decoration-transparent underline-offset-4 transition-colors hover:text-white hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
