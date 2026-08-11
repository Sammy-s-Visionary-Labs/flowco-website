export const analyticsEventNames = {
  pageView: "page_view",
  phoneClick: "phone_click",
  requestServiceClick: "request_service_click",
  formStart: "form_start",
  generateLead: "generate_lead",
  formError: "form_error",
} as const;

export const analyticsLocations = [
  "header_desktop",
  "header_mobile",
  "mobile_menu",
  "mobile_call_bar",
  "footer_contact",
  "footer_nav",
  "page_content",
] as const;

export type AnalyticsLocation = (typeof analyticsLocations)[number];
export type LeadFormId = "request_service";
export type LeadFormErrorType = "validation" | "submission";

type GoogleAnalyticsEvent =
  | {
      eventName: typeof analyticsEventNames.pageView;
      page_location: string;
      page_path: string;
    }
  | {
      cta_location: AnalyticsLocation;
      eventName:
        | typeof analyticsEventNames.phoneClick
        | typeof analyticsEventNames.requestServiceClick;
    }
  | {
      eventName:
        | typeof analyticsEventNames.formStart
        | typeof analyticsEventNames.generateLead;
      form_id: LeadFormId;
    }
  | {
      error_type: LeadFormErrorType;
      eventName: typeof analyticsEventNames.formError;
      form_id: LeadFormId;
    };

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const googleAnalyticsConsentDefaults = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "granted",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
} as const;

function setGoogleAnalyticsDisabled(measurementId: string, disabled: boolean) {
  const analyticsWindow = window as unknown as Record<string, unknown>;
  analyticsWindow[`ga-disable-${measurementId}`] = disabled;
}

function clearGoogleAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=", 1)[0]?.trim();

    if (name?.startsWith("_ga")) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
}

export function initializeGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  const analyticsState = analyticsWindow as unknown as Record<string, unknown>;
  const initializedKey = `ofc-ga-initialized-${measurementId}`;
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= function gtag() {
    // Google gtag.js requires the function's Arguments object, not a rest array.
    // eslint-disable-next-line prefer-rest-params
    analyticsWindow.dataLayer?.push(arguments);
  };

  setGoogleAnalyticsDisabled(measurementId, false);

  if (analyticsState[initializedKey] === true) {
    analyticsWindow.gtag(
      "consent",
      "update",
      googleAnalyticsConsentDefaults,
    );
    return;
  }

  analyticsState[initializedKey] = true;
  analyticsWindow.gtag(
    "consent",
    "default",
    googleAnalyticsConsentDefaults,
  );
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("set", {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
  });
  analyticsWindow.gtag("config", measurementId, {
    send_page_view: false,
  });
}

export function disableGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  setGoogleAnalyticsDisabled(measurementId, true);
  analyticsWindow.gtag?.("consent", "update", {
    ...googleAnalyticsConsentDefaults,
    analytics_storage: "denied",
  });
  clearGoogleAnalyticsCookies();
}

function sendAnalyticsEvent({ eventName, ...parameters }: GoogleAnalyticsEvent) {
  if (typeof window === "undefined") {
    return;
  }

  (window as AnalyticsWindow).gtag?.("event", eventName, parameters);
}

function normalizePagePath(pathname: string) {
  const [path = "/"] = pathname.split(/[?#]/, 1);
  return path.startsWith("/") ? path : "/";
}

export function isAnalyticsLocation(
  value: string | undefined,
): value is AnalyticsLocation {
  return analyticsLocations.includes(value as AnalyticsLocation);
}

export function getPhoneAnalyticsAttributes(location: AnalyticsLocation) {
  return {
    "data-analytics-event": analyticsEventNames.phoneClick,
    "data-analytics-location": location,
  } as const;
}

export function trackPageView(pathname: string) {
  const pagePath = normalizePagePath(pathname);
  const pageLocation = `${window.location.origin}${pagePath}`;

  sendAnalyticsEvent({
    eventName: analyticsEventNames.pageView,
    page_location: pageLocation,
    page_path: pagePath,
  });
}

export function trackPhoneClick(location: AnalyticsLocation) {
  sendAnalyticsEvent({
    cta_location: location,
    eventName: analyticsEventNames.phoneClick,
  });
}

export function trackRequestServiceClick(location: AnalyticsLocation) {
  sendAnalyticsEvent({
    cta_location: location,
    eventName: analyticsEventNames.requestServiceClick,
  });
}

export function trackLeadFormStart(formId: LeadFormId) {
  sendAnalyticsEvent({
    eventName: analyticsEventNames.formStart,
    form_id: formId,
  });
}

export function trackLeadFormSuccess(formId: LeadFormId) {
  sendAnalyticsEvent({
    eventName: analyticsEventNames.generateLead,
    form_id: formId,
  });
}

export function trackLeadFormError(
  formId: LeadFormId,
  errorType: LeadFormErrorType,
) {
  sendAnalyticsEvent({
    error_type: errorType,
    eventName: analyticsEventNames.formError,
    form_id: formId,
  });
}
