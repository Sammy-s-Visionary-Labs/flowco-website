import type { ComponentPropsWithoutRef } from "react";

import { Container, type ContainerSize } from "@/components/ui/Container";

type SectionTone = "brand" | "canvas" | "muted" | "surface";
type SectionSpacing = "compact" | "default" | "spacious";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  containerClassName?: string;
  containerSize?: ContainerSize;
  spacing?: SectionSpacing;
  tone?: SectionTone;
};

const toneStyles: Record<SectionTone, string> = {
  brand: "bg-brand-deep text-canvas",
  canvas: "bg-canvas text-ink",
  muted: "bg-surface-muted text-ink",
  surface: "bg-surface text-ink",
};

const spacingStyles: Record<SectionSpacing, string> = {
  compact: "py-[var(--section-space-compact)]",
  default: "py-[var(--section-space)]",
  spacious: "py-[var(--section-space-spacious)]",
};

export function Section({
  children,
  className = "",
  containerClassName = "",
  containerSize = "site",
  spacing = "default",
  tone = "canvas",
  ...props
}: SectionProps) {
  return (
    <section
      className={`${toneStyles[tone]} ${spacingStyles[spacing]} ${className}`}
      {...props}
    >
      <Container className={containerClassName} size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
