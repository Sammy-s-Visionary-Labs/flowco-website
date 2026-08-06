import type { ComponentPropsWithoutRef } from "react";

export type ContainerSize = "content" | "narrow" | "site";
type ContainerGutter = "compact" | "default" | "none";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  gutter?: ContainerGutter;
  size?: ContainerSize;
};

const sizeStyles: Record<ContainerSize, string> = {
  content: "max-w-3xl",
  narrow: "max-w-5xl",
  site: "max-w-7xl",
};

const gutterStyles: Record<ContainerGutter, string> = {
  compact: "px-[var(--header-gutter)]",
  default: "px-[var(--page-gutter)]",
  none: "px-0",
};

export function Container({
  className = "",
  gutter = "default",
  size = "site",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${gutterStyles[gutter]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}
