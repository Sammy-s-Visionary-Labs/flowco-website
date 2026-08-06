import { Eyebrow } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import {
  createPageMetadata,
  defaultSeoDescription,
  defaultSeoTitle,
} from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: defaultSeoTitle,
  titleMode: "absolute",
  description: defaultSeoDescription,
  path: "/",
});

export default function Home() {
  return (
    <Section
      className="industrial-grid relative overflow-hidden"
      containerClassName="relative"
      spacing="spacious"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-32 size-80 rounded-full border-[4rem] border-brand/5"
      />
      <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:gap-16">
        <SectionHeading
          as="h1"
          description={site.tagline}
          eyebrow={`${site.serviceArea} underground utility specialists`}
          title={site.name}
        />

        <Surface className="max-w-xl lg:justify-self-end" tone="accent-edge">
          <Eyebrow>Phase 1.3</Eyebrow>
          <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.035em] text-brand-deep sm:text-3xl">
            Design foundation active
          </h2>
          <p className="mt-4 text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
            Brand colors, typography, spacing, surfaces, and reusable interface
            components are ready for the full homepage and service pages in
            Phase 3.
          </p>
        </Surface>
      </div>
    </Section>
  );
}
