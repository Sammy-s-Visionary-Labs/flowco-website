import Link from "next/link";

import { AnalyticsPreferencesButton } from "@/components/analytics/AnalyticsPreferencesButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  CallLink,
  PhoneLink,
  RequestServiceLink,
} from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { analyticsEventNames } from "@/lib/analytics";
import { getAnalyticsConfig } from "@/lib/analytics-config";
import { publishedRoutes } from "@/lib/routes";
import { navigation, site } from "@/lib/site";

export function SiteFooter() {
  const analytics = getAnalyticsConfig();
  const publishedPaths = new Set<string>(
    publishedRoutes.map(({ path }) => path),
  );
  const publishedLegalNavigation = navigation.legal.filter((item) =>
    publishedPaths.has(item.href),
  );

  return (
    <footer className="site-footer industrial-grid-inverse border-t-4 border-accent bg-brand-deep text-canvas">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-11 lg:grid-cols-12 lg:gap-8">
          <section aria-labelledby="footer-company-heading" className="lg:col-span-5">
            <h2 className="sr-only" id="footer-company-heading">
              {site.name}
            </h2>
            <BrandLogo
              alt={site.name}
              className="h-auto w-full max-w-[17rem]"
              variant="primary-reverse"
            />

            <p className="mt-6 max-w-md border-l-2 border-accent pl-4 text-sm leading-6 text-canvas/72">
              Underground sewer, water line, drainage, and excavation work for
              homes, businesses, and properties across {site.serviceArea}.
            </p>

            <address className="mt-5 space-y-2 not-italic">
              <PhoneLink
                analyticsLocation="footer_contact"
                className="flex min-h-11 w-fit items-center text-base font-bold text-canvas underline decoration-canvas/35 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                {site.phone}
              </PhoneLink>
              <a
                className="flex min-h-11 w-fit items-center break-all text-sm text-canvas/72 underline decoration-canvas/25 underline-offset-4 transition-colors hover:text-canvas hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
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
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent-light"
              id="footer-navigation-heading"
            >
              Explore
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:max-w-md lg:grid-cols-1" role="list">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-11 items-center font-semibold text-canvas/78 underline decoration-transparent underline-offset-4 transition-colors hover:text-canvas hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2 mt-1 lg:col-span-1">
                <Link
                  className="inline-flex min-h-11 items-center font-bold text-accent-light underline decoration-accent/50 underline-offset-4 transition-colors hover:text-canvas hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
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
              className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent-light"
              id="footer-service-area-heading"
            >
              Service Area
            </h2>
            <p className="mt-5 text-lg font-bold">{site.serviceArea}</p>
            <ul className="mt-4 flex flex-wrap gap-2" role="list">
              {site.primaryCities.map((city) => (
                <li
                  className="rounded-sm border border-canvas/15 bg-brand/35 px-3 py-2 text-sm font-medium text-canvas/75"
                  key={city}
                >
                  {city}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-canvas/58">
              Also serving surrounding communities. {site.name} is a service-area
              contractor and does not maintain a public storefront.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-canvas/15 pt-7 sm:mt-14 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="text-xs leading-5 text-canvas/48">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          {publishedLegalNavigation.length > 0 ? (
            <nav aria-label="Legal" className="mt-4 sm:mt-0">
              <ul className="flex flex-wrap gap-x-5 gap-y-3" role="list">
                {publishedLegalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="inline-flex min-h-11 items-center text-xs font-semibold text-canvas/60 underline decoration-transparent underline-offset-4 transition-colors hover:text-canvas hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {analytics.enabled ? (
                  <li>
                    <AnalyticsPreferencesButton className="inline-flex min-h-11 items-center text-xs font-semibold text-canvas/60 underline decoration-transparent underline-offset-4 transition-colors hover:text-canvas hover:decoration-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent" />
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
