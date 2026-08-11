"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand/BrandLogo";
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
    if (!menuIsOpen) return;

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
      if (event.matches) setMenuIsOpen(false);
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
    <header className="sticky top-0 z-50 border-b-2 border-accent bg-brand-deep text-canvas shadow-header">
      <Container
        className="flex h-[var(--header-mobile-height)] items-center gap-2 sm:gap-3 lg:h-[6.125rem] lg:gap-5"
        gutter="compact"
      >
        <Link
          aria-label={`${site.name} home`}
          className="mr-auto flex shrink-0 items-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent lg:mr-1"
          href="/"
          onClick={closeMenu}
        >
          <BrandLogo
            alt=""
            className="h-auto w-[7.25rem] sm:w-[8.25rem] lg:w-[9.75rem]"
            priority
            variant="monogram-reverse"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 flex-1 items-stretch justify-center self-stretch lg:flex"
        >
          {navigation.main.map((item) => {
            const isActive = routeIsActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex items-center px-2.5 text-[0.6875rem] font-black uppercase tracking-[0.08em] transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-4px] focus-visible:outline-accent xl:px-3.5 xl:text-xs ${
                  isActive
                    ? "text-accent after:absolute after:inset-x-2.5 after:bottom-5 after:h-0.5 after:bg-accent"
                    : "text-canvas/66 hover:text-canvas"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <CallLink
            analyticsLocation="header_desktop"
            className="min-w-[10.5rem]"
            label={site.phone}
            size="sm"
            variant="outline-inverse"
          />
          <RequestServiceLink
            analyticsLocation="header_desktop"
            className="min-w-[9.5rem]"
            size="sm"
          />
        </div>

        <RequestServiceLink
          analyticsLocation="header_mobile"
          className="whitespace-nowrap lg:hidden"
          label="Request"
          size="sm"
        />

        <button
          ref={menuButtonRef}
          aria-controls="mobile-primary-navigation"
          aria-expanded={menuIsOpen}
          aria-label={menuIsOpen ? "Close main navigation" : "Open main navigation"}
          className="relative grid size-11 shrink-0 place-items-center rounded-sm border border-canvas/35 text-canvas transition-colors hover:border-accent hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent lg:hidden"
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

      {menuIsOpen ? (
        <div
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-mobile-height)-var(--mobile-call-bar-height))] overflow-y-auto border-t border-canvas/10 bg-brand-deep shadow-menu lg:hidden"
          id="mobile-primary-navigation"
        >
          <nav
            aria-label="Mobile primary navigation"
            className="mx-auto max-w-2xl px-4 py-5 sm:px-6"
          >
            <div className="mb-4 flex items-center gap-3 border-b border-canvas/12 pb-4">
              <span className="size-2 bg-accent" />
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-light">
                {site.serviceArea}
              </p>
            </div>
            <ul className="divide-y divide-canvas/10" role="list">
              {navigation.main.map((item, index) => {
                const isActive = routeIsActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstMenuLinkRef : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex min-h-13 items-center px-4 py-3 text-sm font-black uppercase tracking-[0.08em] transition-colors focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-accent ${
                        isActive
                          ? "bg-brand text-accent before:absolute before:inset-y-2 before:left-0 before:w-1 before:bg-accent"
                          : "text-canvas/72 hover:bg-brand/50 hover:text-canvas"
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

            <div className="mt-5 grid gap-3 border-t border-canvas/12 pt-5 sm:grid-cols-2">
              <CallLink
                analyticsLocation="mobile_menu"
                label={`Call ${site.phone}`}
                onClick={closeMenu}
                variant="outline-inverse"
              />
              <RequestServiceLink
                analyticsLocation="mobile_menu"
                onClick={closeMenu}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
