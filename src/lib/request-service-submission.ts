import { createHash } from "node:crypto";

import {
  emptyRequestServiceValues,
  getNextRequestServiceAttempt,
  requestServiceSubmissionErrorMessage,
  type RequestServiceDelivery,
  type RequestServiceDeliveryPayload,
  type RequestServiceLead,
  type RequestServiceAttachment,
  type RequestServiceSubmissionState,
  validateRequestServiceFormData,
} from "./request-service";
import { validateRequestServicePhotos } from "./request-service-photos";

export function createRequestServiceIdempotencyKey(payload: Readonly<{
  attachments: readonly RequestServiceAttachment[];
  lead: RequestServiceLead;
}>) {
  const hash = createHash("sha256");

  hash.update("ohio-flow-request-service/v1\0", "utf8");
  hash.update(JSON.stringify(payload.lead), "utf8");

  for (const attachment of payload.attachments) {
    hash.update("\0attachment\0", "utf8");
    hash.update(attachment.contentType, "utf8");
    hash.update("\0", "utf8");
    hash.update(attachment.filename, "utf8");
    hash.update("\0", "utf8");
    hash.update(attachment.content);
  }

  return `request-service/v1/${hash.digest("hex")}`;
}

export async function processRequestServiceSubmission(
  previousState: RequestServiceSubmissionState,
  formData: FormData,
  deliver: RequestServiceDelivery,
): Promise<RequestServiceSubmissionState> {
  const attempt = getNextRequestServiceAttempt(previousState);
  const validation = validateRequestServiceFormData(formData);

  if (!validation.success && validation.spam) {
    return {
      attempt,
      fieldErrors: {},
      formError: requestServiceSubmissionErrorMessage,
      photosNeedReselection: false,
      status: "submission_error",
      values: validation.values,
    };
  }

  const photoValidation = await validateRequestServicePhotos(formData);

  if (!validation.success || !photoValidation.success) {
    return {
      attempt,
      fieldErrors: {
        ...(!validation.success ? validation.fieldErrors : {}),
        ...(!photoValidation.success ? { photos: photoValidation.error } : {}),
      },
      photosNeedReselection: photoValidation.hadPhotos,
      status: "invalid",
      values: validation.values,
    };
  }

  try {
    const deliveryInput = {
      attachments: photoValidation.attachments,
      lead: validation.data,
    } satisfies Omit<RequestServiceDeliveryPayload, "idempotencyKey">;
    const delivery = await deliver({
      ...deliveryInput,
      idempotencyKey: createRequestServiceIdempotencyKey(deliveryInput),
    });
    const deliveryIsConfirmed =
      delivery.status === "confirmed" &&
      delivery.providerReceipt.trim().length > 0;

    if (!deliveryIsConfirmed) {
      return {
        attempt,
        fieldErrors: {},
        formError: requestServiceSubmissionErrorMessage,
        photosNeedReselection: photoValidation.hadPhotos,
        status: "submission_error",
        values: validation.values,
      };
    }

    return {
      attempt,
      fieldErrors: {},
      photosNeedReselection: false,
      status: "success",
      values: emptyRequestServiceValues,
    };
  } catch {
    return {
      attempt,
      fieldErrors: {},
      formError: requestServiceSubmissionErrorMessage,
      photosNeedReselection: photoValidation.hadPhotos,
      status: "submission_error",
      values: validation.values,
    };
  }
}
