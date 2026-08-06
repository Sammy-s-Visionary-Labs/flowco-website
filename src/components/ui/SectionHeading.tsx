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
      className={`inline-flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.16em] ${
        tone === "light" ? "text-accent-light" : "text-accent-strong"
      } ${className}`}
    >
      <span aria-hidden="true" className="h-0.5 w-7 shrink-0 bg-accent" />
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
  h1: "text-[clamp(2.75rem,7vw,5rem)] leading-[0.96] tracking-[-0.052em]",
  h2: "text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] tracking-[-0.045em]",
  h3: "text-[clamp(1.5rem,3vw,2rem)] leading-[1.08] tracking-[-0.035em]",
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
        className={`font-display font-black text-balance ${headingSizeStyles[as]} ${
          eyebrow ? "mt-5" : ""
        } ${tone === "light" ? "text-white" : "text-brand-deep"}`}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${
            centered ? "mx-auto" : ""
          } ${tone === "light" ? "text-white/72" : "text-ink-muted"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
