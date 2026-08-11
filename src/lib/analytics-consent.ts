export const analyticsConsentStorageKey = "ohio-flow-co.analytics-consent.v1";
export const analyticsPreferencesEventName = "ofc:open-analytics-preferences";

export type AnalyticsConsent = "denied" | "granted";

export function isAnalyticsConsent(value: string | null): value is AnalyticsConsent {
  return value === "denied" || value === "granted";
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(analyticsConsentStorageKey);
    return isAnalyticsConsent(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(analyticsConsentStorageKey, consent);
  } catch {
    // The current page still honors the choice when storage is unavailable.
  }
}

export function openAnalyticsPreferences() {
  window.dispatchEvent(new Event(analyticsPreferencesEventName));
}
