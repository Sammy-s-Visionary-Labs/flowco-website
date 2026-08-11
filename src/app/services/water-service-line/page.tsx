import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { waterServiceLinePage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: waterServiceLinePage.title,
  description: waterServiceLinePage.description,
  path: waterServiceLinePage.path,
});

export default function WaterServiceLinePage() {
  return <ServiceIntentPage page={waterServiceLinePage} />;
}
