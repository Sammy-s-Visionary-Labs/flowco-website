import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getAnalyticsConfig } from "@/lib/analytics-config";

export function Analytics() {
  const config = getAnalyticsConfig();

  if (!config.enabled) {
    return null;
  }

  return <GoogleAnalytics measurementId={config.measurementId} />;
}
