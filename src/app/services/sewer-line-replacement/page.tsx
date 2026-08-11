import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { sewerLineReplacementPage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: sewerLineReplacementPage.title,
  description: sewerLineReplacementPage.description,
  path: sewerLineReplacementPage.path,
});

export default function SewerLineReplacementPage() {
  return <ServiceIntentPage page={sewerLineReplacementPage} />;
}
