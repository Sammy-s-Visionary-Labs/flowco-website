import type { ComponentPropsWithoutRef } from "react";

type SurfaceTone = "accent-edge" | "brand" | "muted" | "surface";
type SurfacePadding = "compact" | "default" | "spacious";

type SurfaceProps = ComponentPropsWithoutRef<"div"> & {
  padding?: SurfacePadding;
  tone?: SurfaceTone;
};

const toneStyles: Record<SurfaceTone, string> = {
  "accent-edge":
    "relative overflow-hidden border border-line bg-white shadow-panel before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-accent",
  brand: "border border-brand bg-brand text-white shadow-panel",
  muted: "border border-line bg-surface-muted text-ink",
  surface: "border border-line bg-white text-ink shadow-panel",
};

const paddingStyles: Record<SurfacePadding, string> = {
  compact: "p-5",
  default: "p-6 sm:p-8",
  spacious: "p-7 sm:p-10 lg:p-12",
};

export function Surface({
  className = "",
  padding = "default",
  tone = "surface",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={`rounded-md ${toneStyles[tone]} ${paddingStyles[padding]} ${className}`}
      {...props}
    />
  );
}
