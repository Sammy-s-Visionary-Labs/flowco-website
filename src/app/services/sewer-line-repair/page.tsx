import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { sewerLineRepairPage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: sewerLineRepairPage.title,
  description: sewerLineRepairPage.description,
  path: sewerLineRepairPage.path,
});

export default function SewerLineRepairPage() {
  return <ServiceIntentPage page={sewerLineRepairPage} />;
}
