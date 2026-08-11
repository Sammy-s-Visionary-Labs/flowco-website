import { HomeHero } from "@/components/home/HomeHero";
import { HomePageContent } from "@/components/home/HomePageContent";
import {
  createPageMetadata,
  defaultSeoDescription,
  defaultSeoTitle,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: defaultSeoTitle,
  titleMode: "absolute",
  description: defaultSeoDescription,
  path: "/",
});

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomePageContent />
    </>
  );
}
