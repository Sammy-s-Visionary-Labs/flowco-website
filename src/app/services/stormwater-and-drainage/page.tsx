import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { stormwaterAndDrainagePage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: stormwaterAndDrainagePage.title,
  description: stormwaterAndDrainagePage.description,
  path: stormwaterAndDrainagePage.path,
});

export default function StormwaterAndDrainagePage() {
  return <ServiceIntentPage page={stormwaterAndDrainagePage} />;
}
