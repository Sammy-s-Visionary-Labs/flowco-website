import type { Metadata } from "next";

import { site } from "@/lib/site";

export const defaultSeoTitle = `${site.name} | Sewer, Water, Drainage & Excavation`;
export const defaultSeoDescription = `${site.name} provides underground sewer, water line, drainage, and excavation services for homes and businesses across ${site.serviceArea}.`;

type SitePath = "/" | `/${string}`;
type TitleMode = "absolute" | "append-brand";

type SocialImage = {
  alt: string;
  height: number;
  url: SitePath;
  width: number;
};

export type PageMetadataInput = {
  description: string;
  image?: SocialImage;
  path: SitePath;
  title: string;
  titleMode?: TitleMode;
};

export const defaultSocialImage: SocialImage = {
  alt: `${site.name} — ${site.tagline}`,
  height: 630,
  url: "/og.png",
  width: 1200,
};

function normalizeSitePath(path: SitePath) {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`SEO paths must be site-relative: ${path}`);
  }

  const [pathWithoutQuery = "/"] = path.split(/[?#]/, 1);
  const collapsedPath = pathWithoutQuery.replace(/\/{2,}/g, "/");

  if (collapsedPath === "/") {
    return collapsedPath;
  }

  return collapsedPath.replace(/\/$/, "");
}

export function absoluteSiteUrl(path: SitePath = "/") {
  return new URL(normalizeSitePath(path), `${site.domain}/`).toString();
}

function buildSocialTitle(title: string, titleMode: TitleMode) {
  return titleMode === "absolute" ? title : `${title} | ${site.name}`;
}

export function createPageMetadata({
  description,
  image = defaultSocialImage,
  path,
  title,
  titleMode = "append-brand",
}: PageMetadataInput): Metadata {
  const canonical = absoluteSiteUrl(path);
  const imageUrl = absoluteSiteUrl(image.url);
  const resolvedTitle = buildSocialTitle(title, titleMode);

  return {
    title: {
      absolute: resolvedTitle,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: image.alt,
        },
      ],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.domain),
  applicationName: site.name,
  title: {
    default: defaultSeoTitle,
    template: `%s | ${site.name}`,
  },
  description: defaultSeoDescription,
  creator: site.name,
  publisher: site.legalName,
  category: "construction",
  openGraph: {
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: absoluteSiteUrl(defaultSocialImage.url),
        width: defaultSocialImage.width,
        height: defaultSocialImage.height,
        alt: defaultSocialImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    images: [
      {
        url: absoluteSiteUrl(defaultSocialImage.url),
        alt: defaultSocialImage.alt,
      },
    ],
  },
};
