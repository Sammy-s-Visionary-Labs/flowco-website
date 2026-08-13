"use server";

import { checkBotId } from "botid/server";

import { screenRequestServiceSubmission } from "@/lib/request-service-abuse";
import { deliverRequestServiceLead } from "@/lib/request-service-delivery.server";
import type { RequestServiceSubmissionState } from "@/lib/request-service";
import { processRequestServiceSubmission } from "@/lib/request-service-submission";

export async function submitRequestServiceAction(
  previousState: RequestServiceSubmissionState,
  formData: FormData,
): Promise<RequestServiceSubmissionState> {
  const blockedState = await screenRequestServiceSubmission(
    previousState,
    formData,
    () =>
      checkBotId({
        advancedOptions: { checkLevel: "basic" },
      }),
  );

  if (blockedState) {
    return blockedState;
  }

  return processRequestServiceSubmission(
    previousState,
    formData,
    deliverRequestServiceLead,
  );
}
