import type { SitePath } from "@/lib/seo";
import { publishedLocationPages } from "./location-pages";
import { publishedServicePages } from "./service-pages";
import { site } from "./site";

type PublishedRoute = {
  description: string;
  label: string;
  path: SitePath;
};

export const publishedRoutes: readonly PublishedRoute[] = [
  {
    path: "/",
    label: "Home",
    description: `Official ${site.name} website entry point.`,
  },
  {
    path: "/services",
    label: "Services",
    description: `${site.name} underground sewer, water, drainage, excavation, and utility service directory.`,
  },
  {
    path: "/about",
    label: "About",
    description: `Company overview for ${site.name}, a ${site.serviceArea} underground utility specialist.`,
  },
  {
    path: "/service-areas",
    label: "Service Areas",
    description: `${site.name} local service-area directory for ${site.serviceArea}.`,
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    description: `${site.name} website privacy, service-request data, photo, and analytics disclosure.`,
  },
  {
    path: "/terms",
    label: "Website Terms",
    description: `Terms for using the ${site.name} website and service-request tools.`,
  },
  {
    path: "/accessibility",
    label: "Accessibility Statement",
    description: `${site.name} website accessibility approach and contact alternatives.`,
  },
  ...publishedServicePages.map((page) => ({
    path: page.path,
    label: page.label,
    description: page.description,
  })),
  ...publishedLocationPages.map((page) => ({
    path: page.path,
    label: page.city,
    description: page.description,
  })),
];
