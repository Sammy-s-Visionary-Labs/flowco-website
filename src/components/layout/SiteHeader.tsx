"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CallLink, RequestServiceLink } from "@/components/ui/CtaLink";
import { Container } from "@/components/ui/Container";
import { navigation, site } from "@/lib/site";

function routeIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuIsOpen) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      firstMenuLinkRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleDesktopBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuIsOpen(false);
      }
    }

    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    desktopQuery.addEventListener("change", handleDesktopBreakpoint);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      desktopQuery.removeEventListener("change", handleDesktopBreakpoint);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuIsOpen]);

  function closeMenu() {
    setMenuIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white shadow-header">
      <div className="bg-brand text-white">
        <Container
          className="flex h-[var(--header-mobile-height)] items-center gap-2 sm:gap-3 lg:h-20"
          gutter="compact"
        >
          <Link
            aria-label={`${site.name} home`}
            className="mr-auto flex min-w-0 items-center border-l-[3px] border-accent pl-2.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent lg:pl-3"
            href="/"
            onClick={closeMenu}
          >
            <span className="min-w-0">
              <span className="block whitespace-nowrap font-display text-base font-black tracking-[-0.025em] sm:text-lg lg:text-xl">
                {site.name}
              </span>
              <span className="mt-0.5 hidden text-xs font-medium tracking-wide text-white/70 lg:block">
                {site.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <CallLink
              className="min-w-[11.75rem]"
              label={
                <span className="flex items-baseline gap-2">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                    Call
                  </span>
                  <span>{site.phone}</span>
                </span>
              }
              variant="outline-inverse"
            />
            <RequestServiceLink className="min-w-[9.75rem]" />
          </div>

          <RequestServiceLink
            className="whitespace-nowrap lg:hidden"
            size="sm"
          />

          <button
            ref={menuButtonRef}
            aria-controls="mobile-primary-navigation"
            aria-expanded={menuIsOpen}
            aria-label={menuIsOpen ? "Close main navigation" : "Open main navigation"}
            className="relative grid size-11 shrink-0 place-items-center rounded-sm border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent lg:hidden"
            onClick={() => setMenuIsOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  menuIsOpen ? "translate-y-[0.4375rem] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[0.4375rem] block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                  menuIsOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  menuIsOpen ? "-translate-y-[0.4375rem] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </Container>
      </div>

      <nav
        aria-label="Primary navigation"
        className="mx-auto hidden h-12 max-w-7xl items-stretch justify-between px-[var(--page-gutter)] lg:flex"
      >
        {navigation.main.map((item) => {
          const isActive = routeIsActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative inline-flex items-center px-2 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-accent ${
                isActive
                  ? "text-brand after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-accent"
                  : "text-ink-muted hover:text-brand"
              }`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {menuIsOpen ? (
        <div
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-mobile-height)-var(--mobile-call-bar-height))] overflow-y-auto border-t border-line bg-white shadow-menu lg:hidden"
          id="mobile-primary-navigation"
        >
          <nav
            aria-label="Mobile primary navigation"
            className="mx-auto max-w-2xl px-4 py-4 sm:px-6"
          >
            <ul className="divide-y divide-line" role="list">
              {navigation.main.map((item, index) => {
                const isActive = routeIsActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstMenuLinkRef : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex min-h-12 items-center px-4 py-3 text-base font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-accent ${
                        isActive
                          ? "bg-canvas text-brand before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-accent"
                          : "text-ink-muted hover:bg-canvas hover:text-brand"
                      }`}
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
              <CallLink
                label={`Call ${site.phone}`}
                onClick={closeMenu}
                variant="brand"
              />
              <RequestServiceLink onClick={closeMenu} />
            </div>
            <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
              Serving {site.serviceArea}
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
