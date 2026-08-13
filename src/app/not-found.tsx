import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="industrial-grid grid min-h-[65svh] items-center py-20">
      <Container>
        <div className="mx-auto max-w-3xl border border-line bg-surface p-7 shadow-panel sm:p-10 lg:p-14">
          <p className="text-[0.6875rem] font-black uppercase tracking-[0.2em] text-accent-deep">
            404 · Page not found
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.025em] text-brand-deep sm:text-6xl">
            This page is not in the current flow.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
            The address may be outdated or typed incorrectly. Start from the
            homepage, explore underground utility services, or call {site.name}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center border-2 border-brand bg-brand px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-canvas transition-colors hover:border-accent hover:bg-accent hover:text-brand-deep"
              href="/"
            >
              Return home
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center border-2 border-brand px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-brand-deep transition-colors hover:border-accent hover:bg-accent-soft"
              href="/services"
            >
              Explore services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
