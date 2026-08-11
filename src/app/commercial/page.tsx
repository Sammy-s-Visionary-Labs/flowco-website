import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { commercialServicesPage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: commercialServicesPage.title,
  description: commercialServicesPage.description,
  path: commercialServicesPage.path,
});

export default function CommercialServicesPage() {
  return <ServiceIntentPage page={commercialServicesPage} />;
}
