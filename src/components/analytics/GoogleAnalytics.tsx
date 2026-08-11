"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { AnalyticsEventBridge } from "@/components/analytics/AnalyticsEventBridge";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import {
  disableGoogleAnalytics,
  initializeGoogleAnalytics,
} from "@/lib/analytics";
import {
  analyticsPreferencesEventName,
  readAnalyticsConsent,
  type AnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/analytics-consent";

type GoogleAnalyticsProps = {
  measurementId: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [active, setActive] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const resolvedConsent = readAnalyticsConsent();

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setConsent(resolvedConsent);
      setPreferencesOpen(resolvedConsent === null);

      if (resolvedConsent === "granted") {
        initializeGoogleAnalytics(measurementId);
        setActive(true);
      }
    });

    function handleOpenPreferences() {
      setPreferencesOpen(true);
    }

    window.addEventListener(
      analyticsPreferencesEventName,
      handleOpenPreferences,
    );

    return () => {
      cancelled = true;
      window.removeEventListener(
        analyticsPreferencesEventName,
        handleOpenPreferences,
      );
    };
  }, [measurementId]);

  function saveConsent(nextConsent: AnalyticsConsent) {
    writeAnalyticsConsent(nextConsent);
    setConsent(nextConsent);
    setPreferencesOpen(false);

    if (nextConsent === "granted") {
      initializeGoogleAnalytics(measurementId);
      setActive(true);
      return;
    }

    disableGoogleAnalytics(measurementId);
    setActive(false);
  }

  return (
    <>
      <PageViewTracker active={active} />
      <AnalyticsEventBridge active={active} />

      {active ? (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
        />
      ) : null}

      {preferencesOpen ? (
        <section
          aria-label="Analytics choices"
          aria-live="polite"
          className="fixed inset-x-3 bottom-[calc(var(--mobile-call-bar-height)+1rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-3xl border-2 border-accent bg-brand-deep p-5 text-canvas shadow-menu sm:inset-x-6 sm:p-6 lg:bottom-6"
          role="dialog"
        >
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="text-[0.6875rem] font-black uppercase tracking-[0.18em] text-accent-light">
                Analytics choice
              </p>
              <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.035em]">
                Help us improve this website?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-canvas/72">
                With your permission, Google Analytics measures page visits and
                service-request actions. We do not send your form entries,
                contact details, or uploaded photos to Analytics. See our{" "}
                <Link
                  className="font-bold text-accent-light underline decoration-accent/60 underline-offset-4"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-44">
              <button
                className="min-h-12 border-2 border-accent bg-accent px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-brand-deep transition-colors hover:bg-accent-light"
                onClick={() => saveConsent("granted")}
                type="button"
              >
                Allow analytics
              </button>
              <button
                className="min-h-12 border border-canvas/35 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-canvas transition-colors hover:border-canvas hover:bg-canvas/8"
                onClick={() => saveConsent("denied")}
                type="button"
              >
                Decline
              </button>
              {consent ? (
                <button
                  className="min-h-11 px-4 py-2 text-xs font-bold text-canvas/65 underline decoration-transparent underline-offset-4 hover:text-canvas hover:decoration-accent"
                  onClick={() => setPreferencesOpen(false)}
                  type="button"
                >
                  Keep current choice
                </button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
