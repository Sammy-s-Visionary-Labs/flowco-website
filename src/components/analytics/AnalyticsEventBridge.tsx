"use client";

import { useEffect } from "react";

import {
  analyticsEventNames,
  isAnalyticsLocation,
  trackPhoneClick,
  trackRequestServiceClick,
} from "@/lib/analytics";

export function AnalyticsEventBridge({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const trackedElement = event.target.closest<HTMLElement>(
        "[data-analytics-event]",
      );

      if (!trackedElement) {
        return;
      }

      const eventName = trackedElement.dataset.analyticsEvent;
      const location = trackedElement.dataset.analyticsLocation;

      if (!isAnalyticsLocation(location)) {
        return;
      }

      if (eventName === analyticsEventNames.phoneClick) {
        trackPhoneClick(location);
      }

      if (eventName === analyticsEventNames.requestServiceClick) {
        trackRequestServiceClick(location);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [active]);

  return null;
}
