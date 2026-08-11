import { LocationIntentPage } from "@/components/locations/LocationIntentPage";
import { createPageMetadata } from "@/lib/seo";
import { toledoServiceAreaPage } from "@/lib/location-pages";

export const metadata = createPageMetadata({
  title: toledoServiceAreaPage.title,
  description: toledoServiceAreaPage.description,
  path: toledoServiceAreaPage.path,
});

export default function ToledoServiceAreaPage() {
  return <LocationIntentPage page={toledoServiceAreaPage} />;
}
