import { AboutPageContent } from "@/components/about/AboutPageContent";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: `About ${site.name}`,
  description: `${site.name} is a specialized underground sewer, water, drainage, and excavation contractor serving homes, businesses, contractors, and municipalities across ${site.serviceArea}. Call ${site.phone}.`,
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
