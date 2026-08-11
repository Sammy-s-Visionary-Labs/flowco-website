import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: `${site.name}: ${site.tagline}`,
    start_url: "/",
    display: "standalone",
    background_color: "#f7eddf",
    theme_color: "#2b2825",
    icons: [
      {
        src: "/brand/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
