import type { MetadataRoute } from "next";

import { publishedRoutes } from "@/lib/routes";
import { absoluteSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publishedRoutes.map((route) => ({
    url: absoluteSiteUrl(route.path),
  }));
}
