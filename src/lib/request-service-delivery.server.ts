import "server-only";

import type {
  RequestServiceDeliveryPayload,
  RequestServiceDeliveryResult,
} from "./request-service";
import {
  isRequestServiceDeliveryAllowed,
  sendRequestServiceEmailWithResend,
} from "./request-service-email";
import { contactDataStatus, requestServiceDeliveryStatus } from "./site";

export async function deliverRequestServiceLead(
  payload: RequestServiceDeliveryPayload,
): Promise<RequestServiceDeliveryResult> {
  if (!isRequestServiceDeliveryAllowed({
    contactDataIsProductionReady: contactDataStatus.productionReady,
    productionDeliveryIsReady: requestServiceDeliveryStatus.productionReady,
    vercelEnvironment: process.env.VERCEL_ENV,
  })) {
    return { status: "not_configured" };
  }

  return sendRequestServiceEmailWithResend(
    payload,
    process.env.RESEND_API_KEY ?? "",
  );
}
