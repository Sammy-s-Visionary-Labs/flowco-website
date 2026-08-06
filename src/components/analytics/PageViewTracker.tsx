"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackPageView } from "@/lib/analytics";

let lastTrackedPath: string | undefined;

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === lastTrackedPath) {
      return;
    }

    lastTrackedPath = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
