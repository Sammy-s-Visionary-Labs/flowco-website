const gtmIdPattern = /^GTM-[A-Z0-9]+$/;

export type AnalyticsConfig =
  | { enabled: false; gtmId: null }
  | { enabled: true; gtmId: string };

export function getAnalyticsConfig(): AnalyticsConfig {
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";

  if (!enabled) {
    return { enabled: false, gtmId: null };
  }

  if (!gtmIdPattern.test(gtmId)) {
    throw new Error(
      "Analytics is enabled, but NEXT_PUBLIC_GTM_ID is missing or invalid. Expected a value such as GTM-ABC1234.",
    );
  }

  return { enabled: true, gtmId };
}
