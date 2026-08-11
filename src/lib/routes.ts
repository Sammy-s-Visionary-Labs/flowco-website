import type { SitePath } from "@/lib/seo";
import { publishedLocationPages } from "@/lib/location-pages";
import { publishedServicePages } from "@/lib/service-pages";
import { site } from "@/lib/site";

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
    path: "/about",
    label: "About",
    description: `Company overview for ${site.name}, a ${site.serviceArea} underground utility specialist.`,
  },
  {
    path: "/service-areas",
    label: "Service Areas",
    description: `${site.name} local service-area directory for ${site.serviceArea}.`,
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
