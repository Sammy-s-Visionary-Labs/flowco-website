import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import {
  analyticsEventNames,
  type AnalyticsLocation,
} from "@/lib/analytics";
import { navigation, site } from "@/lib/site";

export type CtaVariant = "accent" | "brand" | "outline" | "outline-inverse";
export type CtaSize = "sm" | "md" | "lg";

export type CtaLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "children" | "className" | "href"
> & {
  children: ReactNode;
  className?: string;
  href: string;
  size?: CtaSize;
  variant?: CtaVariant;
};

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border text-center font-extrabold leading-none tracking-[0.012em] shadow-control transition-[background-color,border-color,color,box-shadow] duration-150 active:shadow-none";

const variantStyles: Record<CtaVariant, string> = {
  accent:
    "border-accent bg-accent text-white hover:border-accent-strong hover:bg-accent-strong active:border-accent-deep active:bg-accent-deep",
  brand:
    "border-brand bg-brand text-white hover:border-brand-deep hover:bg-brand-deep active:bg-ink",
  outline:
    "border-brand/35 bg-transparent text-brand hover:border-brand hover:bg-brand hover:text-white active:bg-brand-deep",
  "outline-inverse":
    "border-white/55 bg-transparent text-white hover:border-white hover:bg-white hover:text-brand active:bg-canvas",
};

const sizeStyles: Record<CtaSize, string> = {
  sm: "min-h-11 px-3.5 py-2.5 text-[0.8125rem] sm:px-4 sm:text-sm",
  md: "min-h-12 px-5 py-3 text-sm sm:px-6",
  lg: "min-h-[3.25rem] px-5 py-3.5 text-[0.9375rem] sm:px-7 sm:text-base",
};

export function CtaLink({
  children,
  className = "",
  href,
  size = "md",
  variant = "accent",
  ...props
}: CtaLinkProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href.startsWith("/")) {
    return (
      <Link className={classes} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={classes} href={href} {...props}>
      {children}
    </a>
  );
}

type PresetCtaProps = Omit<CtaLinkProps, "children" | "href"> & {
  analyticsLocation: AnalyticsLocation;
  label?: ReactNode;
};

export function CallLink({
  analyticsLocation,
  label = site.phone,
  ...props
}: PresetCtaProps) {
  return (
    <CtaLink
      aria-label={`Call ${site.name} at ${site.phone}`}
      data-analytics-event={analyticsEventNames.phoneClick}
      data-analytics-location={analyticsLocation}
      href={site.phoneHref}
      {...props}
    >
      {label}
    </CtaLink>
  );
}

export function RequestServiceLink({
  analyticsLocation,
  label = navigation.cta.label,
  ...props
}: PresetCtaProps) {
  return (
    <CtaLink
      data-analytics-event={analyticsEventNames.requestServiceClick}
      data-analytics-location={analyticsLocation}
      href={navigation.cta.href}
      {...props}
    >
      {label}
    </CtaLink>
  );
}
