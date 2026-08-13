import {
  getNextRequestServiceAttempt,
  hasSubmittedRequestServicePhotos,
  requestServiceSubmissionErrorMessage,
  type RequestServiceSubmissionState,
  validateRequestServiceFormData,
} from "./request-service";

type RequestServiceBotVerification = () => Promise<{ isBot: boolean }>;

export async function screenRequestServiceSubmission(
  previousState: RequestServiceSubmissionState,
  formData: FormData,
  verifyBot: RequestServiceBotVerification,
): Promise<RequestServiceSubmissionState | null> {
  let requestIsAllowed = false;

  try {
    requestIsAllowed = (await verifyBot()).isBot === false;
  } catch {
    // Fail closed if the protection service cannot verify the request.
  }

  if (requestIsAllowed) {
    return null;
  }

  const validation = validateRequestServiceFormData(formData);

  return {
    attempt: getNextRequestServiceAttempt(previousState),
    fieldErrors: {},
    formError: requestServiceSubmissionErrorMessage,
    photosNeedReselection: hasSubmittedRequestServicePhotos(formData),
    status: "submission_error",
    values: validation.values,
  };
}
