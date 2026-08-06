import "server-only";

import type {
  RequestServiceDeliveryResult,
  RequestServiceLead,
} from "./request-service";

export async function deliverRequestServiceLead(
  lead: RequestServiceLead,
): Promise<RequestServiceDeliveryResult> {
  // Phase 2.1 establishes the delivery boundary but intentionally does not
  // discard leads into logs, memory, or temporary files while email delivery
  // is unconfigured. Phase 2.4/2.6 will replace this fail-closed result with a
  // confirmed provider receipt.
  void lead;

  return { status: "not_configured" };
}
