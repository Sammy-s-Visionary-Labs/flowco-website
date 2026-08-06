"use server";

import { deliverRequestServiceLead } from "@/lib/request-service-delivery.server";
import type { RequestServiceSubmissionState } from "@/lib/request-service";
import { processRequestServiceSubmission } from "@/lib/request-service-submission";

export async function submitRequestServiceAction(
  previousState: RequestServiceSubmissionState,
  formData: FormData,
): Promise<RequestServiceSubmissionState> {
  return processRequestServiceSubmission(
    previousState,
    formData,
    deliverRequestServiceLead,
  );
}
