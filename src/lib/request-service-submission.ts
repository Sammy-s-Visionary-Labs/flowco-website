import {
  emptyRequestServiceValues,
  type RequestServiceDelivery,
  type RequestServiceSubmissionState,
  validateRequestServiceFormData,
} from "./request-service";

const submissionErrorMessage =
  "We couldn't confirm your request was sent. Please try again later.";

export async function processRequestServiceSubmission(
  previousState: RequestServiceSubmissionState,
  formData: FormData,
  deliver: RequestServiceDelivery,
): Promise<RequestServiceSubmissionState> {
  const submittedAttempt =
    typeof previousState === "object" &&
    previousState !== null &&
    Number.isSafeInteger(previousState.attempt) &&
    previousState.attempt >= 0
      ? previousState.attempt
      : 0;
  const attempt =
    submittedAttempt < Number.MAX_SAFE_INTEGER ? submittedAttempt + 1 : 1;
  const validation = validateRequestServiceFormData(formData);

  if (!validation.success) {
    if (validation.spam) {
      return {
        attempt,
        fieldErrors: {},
        formError: submissionErrorMessage,
        status: "submission_error",
        values: validation.values,
      };
    }

    return {
      attempt,
      fieldErrors: validation.fieldErrors,
      status: "invalid",
      values: validation.values,
    };
  }

  try {
    const delivery = await deliver(validation.data);
    const deliveryIsConfirmed =
      delivery.status === "confirmed" &&
      delivery.providerReceipt.trim().length > 0;

    if (!deliveryIsConfirmed) {
      return {
        attempt,
        fieldErrors: {},
        formError: submissionErrorMessage,
        status: "submission_error",
        values: validation.values,
      };
    }

    return {
      attempt,
      fieldErrors: {},
      status: "success",
      values: emptyRequestServiceValues,
    };
  } catch {
    return {
      attempt,
      fieldErrors: {},
      formError: submissionErrorMessage,
      status: "submission_error",
      values: validation.values,
    };
  }
}
