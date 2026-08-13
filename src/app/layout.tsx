import type { ReactNode } from "react";
import { Barlow_Semi_Condensed, Source_Sans_3 } from "next/font/google";

import { Analytics } from "@/components/analytics/Analytics";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { rootMetadata } from "@/lib/seo";
import { createSiteStructuredData } from "@/lib/structured-data";

import "./globals.css";

const barlowSemiCondensed = Barlow_Semi_Condensed({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-barlow-semi-condensed",
  weight: ["700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  weight: "variable",
});

export const metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={`${barlowSemiCondensed.variable} ${sourceSans.variable}`}
      lang="en"
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
        <JsonLd data={createSiteStructuredData()} />
        <a
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-sm bg-accent px-4 py-3 text-sm font-black text-brand-deep shadow-menu transition-transform focus:translate-y-0 focus:outline-3 focus:outline-offset-3 focus:outline-accent"
          href="#main-content"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main
          className="site-main flex-1 focus:outline-none"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
        <SiteFooter />
        <MobileCallBar />
        <Analytics />
      </body>
    </html>
  );
}
