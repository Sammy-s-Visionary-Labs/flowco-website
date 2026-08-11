import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import {
  analyticsEventNames,
  getPhoneAnalyticsAttributes,
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
  "relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-sm border-2 text-center text-xs font-black uppercase leading-none tracking-[0.09em] shadow-control transition-[background-color,border-color,color,box-shadow,transform] duration-150 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none";

const variantStyles: Record<CtaVariant, string> = {
  accent:
    "border-accent bg-accent text-brand-deep hover:border-accent-light hover:bg-accent-light active:border-accent-strong active:bg-accent-strong",
  brand:
    "border-brand bg-brand text-canvas hover:border-brand-deep hover:bg-brand-deep active:bg-ink",
  outline:
    "border-brand/45 bg-transparent text-brand hover:border-brand hover:bg-brand hover:text-canvas active:bg-brand-deep",
  "outline-inverse":
    "border-canvas/55 bg-transparent text-canvas hover:border-canvas hover:bg-canvas hover:text-brand-deep active:bg-surface-muted",
};

const sizeStyles: Record<CtaSize, string> = {
  sm: "min-h-11 px-3.5 py-2.5 sm:px-4",
  md: "min-h-12 px-5 py-3 sm:px-6 sm:text-[0.8125rem]",
  lg: "min-h-[3.5rem] px-5 py-3.5 text-[0.8125rem] sm:px-7 sm:text-sm",
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

type PhoneLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  analyticsLocation: AnalyticsLocation;
  children?: ReactNode;
};

export function PhoneLink({
  analyticsLocation,
  children = site.phone,
  ...props
}: PhoneLinkProps) {
  return (
    <a
      {...props}
      aria-label={props["aria-label"] ?? `Call ${site.name} at ${site.phone}`}
      {...getPhoneAnalyticsAttributes(analyticsLocation)}
      href={site.phoneHref}
    >
      {children}
    </a>
  );
}

export function CallLink({
  analyticsLocation,
  label = site.phone,
  ...props
}: PresetCtaProps) {
  return (
    <CtaLink
      {...props}
      aria-label={`Call ${site.name} at ${site.phone}`}
      {...getPhoneAnalyticsAttributes(analyticsLocation)}
      href={site.phoneHref}
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
