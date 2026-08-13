import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3";
type HeadingTone = "dark" | "light";
type HeadingAlign = "center" | "left";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  tone?: HeadingTone;
};

export function Eyebrow({
  children,
  className = "",
  tone = "dark",
}: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[0.6875rem] font-black uppercase tracking-[0.2em] ${
        tone === "light" ? "text-accent-light" : "text-accent-deep"
      } ${className}`}
    >
      <span aria-hidden="true" className="size-2 shrink-0 bg-accent" />
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent/70" />
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  align?: HeadingAlign;
  as?: HeadingLevel;
  className?: string;
  description?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  tone?: HeadingTone;
};

const headingSizeStyles: Record<HeadingLevel, string> = {
  h1: "text-[clamp(3rem,7vw,5.75rem)] leading-[0.98] tracking-[-0.025em]",
  h2: "text-[clamp(2.25rem,5vw,4.15rem)] leading-none tracking-[-0.02em]",
  h3: "text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.05] tracking-[-0.015em]",
};

export function SectionHeading({
  align = "left",
  as = "h2",
  className = "",
  description,
  eyebrow,
  title,
  tone = "dark",
}: SectionHeadingProps) {
  const Heading = as;
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? (
        <Eyebrow className={centered ? "justify-center" : ""} tone={tone}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading
        className={`font-display font-extrabold text-balance ${headingSizeStyles[as]} ${
          eyebrow ? "mt-5" : ""
        } ${tone === "light" ? "text-canvas" : "text-brand-deep"}`}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${
            centered ? "mx-auto" : ""
          } ${tone === "light" ? "text-canvas/72" : "text-ink-muted"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
