"use client";

import { openAnalyticsPreferences } from "@/lib/analytics-consent";

type AnalyticsPreferencesButtonProps = {
  className?: string;
};

export function AnalyticsPreferencesButton({
  className = "",
}: AnalyticsPreferencesButtonProps) {
  return (
    <button
      className={className}
      onClick={openAnalyticsPreferences}
      type="button"
    >
      Analytics choices
    </button>
  );
}
