"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackPageView } from "@/lib/analytics";

let lastTrackedPath: string | undefined;

export function PageViewTracker({ active }: { active: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!active || !pathname || pathname === lastTrackedPath) {
      return;
    }

    lastTrackedPath = pathname;
    trackPageView(pathname);
  }, [active, pathname]);

  return null;
}
