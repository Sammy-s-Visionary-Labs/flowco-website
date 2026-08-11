import type { ServicePageDefinition } from "@/lib/service-pages";
import { absoluteSiteUrl, defaultSeoDescription } from "@/lib/seo";
import { confirmedServices, site } from "@/lib/site";

export const organizationStructuredDataId = `${site.domain}/#organization`;
export const websiteStructuredDataId = `${site.domain}/#website`;

const structuredServiceArea = [
  {
    "@type": "AdministrativeArea",
    name: site.serviceArea,
  },
  ...site.primaryCities.map((city) => ({
    "@type": "City",
    name: city,
  })),
];

export function createSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": organizationStructuredDataId,
        "@type": "Organization",
        additionalType: "https://schema.org/HomeAndConstructionBusiness",
        areaServed: structuredServiceArea,
        contactPoint: {
          "@type": "ContactPoint",
          areaServed: "US-OH",
          contactType: "customer service",
          email: site.email,
          telephone: site.phone,
        },
        description: defaultSeoDescription,
        email: site.email,
        image: absoluteSiteUrl("/og.png"),
        knowsAbout: confirmedServices.map((service) => service.label),
        logo: absoluteSiteUrl("/brand/logo-primary.svg"),
        name: site.name,
        slogan: site.tagline,
        telephone: site.phone,
        url: site.domain,
      },
      {
        "@id": websiteStructuredDataId,
        "@type": "WebSite",
        inLanguage: "en-US",
        name: site.name,
        publisher: {
          "@id": organizationStructuredDataId,
        },
        url: site.domain,
      },
    ],
  };
}

export function createServiceStructuredData(page: ServicePageDefinition) {
  const url = absoluteSiteUrl(page.path);

  return {
    "@context": "https://schema.org",
    "@id": `${url}#service`,
    "@type": "Service",
    areaServed: structuredServiceArea,
    description: page.description,
    mainEntityOfPage: url,
    name: page.label,
    provider: {
      "@id": organizationStructuredDataId,
    },
    serviceType: page.serviceIds.map(
      (serviceId) =>
        confirmedServices.find((service) => service.id === serviceId)?.label ??
        page.label,
    ),
    url,
  };
}
