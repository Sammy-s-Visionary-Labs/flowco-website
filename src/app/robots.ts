import type { MetadataRoute } from "next";

import { absoluteSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: absoluteSiteUrl("/"),
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
