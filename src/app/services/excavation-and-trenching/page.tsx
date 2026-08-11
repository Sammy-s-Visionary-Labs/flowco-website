import { ServiceIntentPage } from "@/components/services/ServiceIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { excavationAndTrenchingPage } from "@/lib/service-pages";

export const metadata = createPageMetadata({
  title: excavationAndTrenchingPage.title,
  description: excavationAndTrenchingPage.description,
  path: excavationAndTrenchingPage.path,
});

export default function ExcavationAndTrenchingPage() {
  return <ServiceIntentPage page={excavationAndTrenchingPage} />;
}
