export const analyticsEventNames = {
  pageView: "ofc_page_view",
  phoneClick: "ofc_phone_click",
  requestServiceClick: "ofc_request_service_click",
  formStart: "ofc_form_start",
  generateLead: "ofc_generate_lead",
  formError: "ofc_form_error",
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

type AnalyticsDataLayerEvent =
  | {
      event: typeof analyticsEventNames.pageView;
      page_path: string;
    }
  | {
      cta_location: AnalyticsLocation;
      event:
        | typeof analyticsEventNames.phoneClick
        | typeof analyticsEventNames.requestServiceClick;
    }
  | {
      event:
        | typeof analyticsEventNames.formStart
        | typeof analyticsEventNames.generateLead;
      form_id: LeadFormId;
    }
  | {
      error_type: LeadFormErrorType;
      event: typeof analyticsEventNames.formError;
      form_id: LeadFormId;
    };

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
};

function pushAnalyticsEvent(event: AnalyticsDataLayerEvent) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.dataLayer.push(event);
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

export function trackPageView(pathname: string) {
  pushAnalyticsEvent({
    event: analyticsEventNames.pageView,
    page_path: normalizePagePath(pathname),
  });
}

export function trackPhoneClick(location: AnalyticsLocation) {
  pushAnalyticsEvent({
    cta_location: location,
    event: analyticsEventNames.phoneClick,
  });
}

export function trackRequestServiceClick(location: AnalyticsLocation) {
  pushAnalyticsEvent({
    cta_location: location,
    event: analyticsEventNames.requestServiceClick,
  });
}

export function trackLeadFormStart(formId: LeadFormId) {
  pushAnalyticsEvent({
    event: analyticsEventNames.formStart,
    form_id: formId,
  });
}

export function trackLeadFormSuccess(formId: LeadFormId) {
  pushAnalyticsEvent({
    event: analyticsEventNames.generateLead,
    form_id: formId,
  });
}

export function trackLeadFormError(
  formId: LeadFormId,
  errorType: LeadFormErrorType,
) {
  pushAnalyticsEvent({
    error_type: errorType,
    event: analyticsEventNames.formError,
    form_id: formId,
  });
}
