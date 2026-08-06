import type { SitePath } from "@/lib/seo";
import { site } from "@/lib/site";

type PublishedRoute = {
  description: string;
  label: string;
  path: SitePath;
};

export const publishedRoutes = [
  {
    path: "/",
    label: "Home",
    description: `Official ${site.name} website entry point.`,
  },
] as const satisfies readonly PublishedRoute[];
