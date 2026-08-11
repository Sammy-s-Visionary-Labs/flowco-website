const gaMeasurementIdPattern = /^G-[A-Z0-9]+$/;

export type AnalyticsConfig =
  | { enabled: false; measurementId: null }
  | { enabled: true; measurementId: string };

export function getAnalyticsConfig(): AnalyticsConfig {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim().toUpperCase() ?? "";

  if (!measurementId) {
    return { enabled: false, measurementId: null };
  }

  if (!gaMeasurementIdPattern.test(measurementId)) {
    throw new Error(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID is invalid. Expected a GA4 Measurement ID such as G-ABC1234567.",
    );
  }

  return { enabled: true, measurementId };
}
