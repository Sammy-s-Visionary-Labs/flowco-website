import Image from "next/image";

type BrandLogoVariant =
  | "mark"
  | "mark-reverse"
  | "monogram"
  | "monogram-reverse"
  | "primary"
  | "primary-reverse";

type BrandLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  variant: BrandLogoVariant;
};

const logoConfig: Record<
  BrandLogoVariant,
  { height: number; src: string; width: number }
> = {
  mark: { height: 197, src: "/brand/logo-mark.svg", width: 197 },
  "mark-reverse": {
    height: 197,
    src: "/brand/logo-mark-reverse.svg",
    width: 197,
  },
  monogram: {
    height: 207,
    src: "/brand/logo-monogram.svg",
    width: 518,
  },
  "monogram-reverse": {
    height: 207,
    src: "/brand/logo-monogram-reverse.svg",
    width: 518,
  },
  primary: {
    height: 512,
    src: "/brand/logo-primary.svg",
    width: 576,
  },
  "primary-reverse": {
    height: 512,
    src: "/brand/logo-primary-reverse.svg",
    width: 576,
  },
};

export function BrandLogo({
  alt = "Ohio Flow Co",
  className = "",
  priority = false,
  variant,
}: BrandLogoProps) {
  const logo = logoConfig[variant];

  return (
    <Image
      alt={alt}
      className={className}
      height={logo.height}
      priority={priority}
      src={logo.src}
      width={logo.width}
    />
  );
}
