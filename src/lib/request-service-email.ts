import {
  referralSourceOptions,
  requestAudienceOptions,
  requestServiceOptions,
  residentialRelationshipOptions,
  type RequestServiceDeliveryPayload,
  type RequestServiceDeliveryResult,
} from "./request-service";
import { contactDataStatus, leadDelivery, site } from "./site";

const resendEndpoint = "https://api.resend.com/emails";
const resendRequestTimeoutMs = 10_000;

type FetchImplementation = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type ResendEmailRequest = Readonly<{
  attachments: readonly Readonly<{
    content: string;
    filename: string;
  }>[];
  from: string;
  subject: string;
  text: string;
  to: readonly [string];
}>;

function getOptionLabel(
  value: string,
  options: readonly Readonly<{ id: string; label: string }>[],
) {
  return options.find((option) => option.id === value)?.label ?? value;
}

export function buildRequestServiceEmail(
  payload: RequestServiceDeliveryPayload,
): ResendEmailRequest {
  const { lead } = payload;
  const audienceLabel = getOptionLabel(lead.audience, requestAudienceOptions);
  const audienceDetail =
    lead.audience === "residential"
      ? `Relationship to property: ${getOptionLabel(
          lead.residentialRelationship,
          residentialRelationshipOptions,
        )}`
      : `Company or organization: ${lead.organizationName}`;
  const subjectPrefix = contactDataStatus.productionReady ? "" : "[TEST] ";
  const text = [
    `New ${site.name} Request Service inquiry`,
    "",
    "CONTACT",
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    "",
    "PROJECT",
    `Project type: ${audienceLabel}`,
    audienceDetail,
    `Service: ${getOptionLabel(lead.service, requestServiceOptions)}`,
    `City: ${lead.city}`,
    `ZIP code: ${lead.postalCode}`,
    `How they heard about us: ${getOptionLabel(
      lead.referralSource,
      referralSourceOptions,
    )}`,
    `Photos attached: ${payload.attachments.length}`,
    "",
    "PROJECT DETAILS",
    lead.projectDetails || "Not provided",
    "",
    "This message was generated from the Ohio Flow Co Request Service form.",
  ].join("\n");

  return {
    attachments: payload.attachments.map((attachment) => ({
      content: Buffer.from(attachment.content).toString("base64"),
      filename: attachment.filename,
    })),
    from: `${leadDelivery.senderName} <${leadDelivery.senderEmail}>`,
    subject: `${subjectPrefix}New ${site.name} service request`,
    text,
    to: [leadDelivery.recipientEmail],
  };
}

export function readResendProviderReceipt(value: unknown) {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string"
  ) {
    return null;
  }

  const receipt = value.id.trim();

  return receipt.length > 0 && receipt.length <= 256 ? receipt : null;
}

export function isRequestServiceDeliveryAllowed({
  contactDataIsProductionReady,
  previewDeliveryIsEnabled,
  productionDeliveryIsReady,
  vercelEnvironment,
}: Readonly<{
  contactDataIsProductionReady: boolean;
  previewDeliveryIsEnabled: boolean;
  productionDeliveryIsReady: boolean;
  vercelEnvironment: string | undefined;
}>) {
  if (vercelEnvironment === "preview") {
    return previewDeliveryIsEnabled;
  }

  if (vercelEnvironment === "production") {
    return contactDataIsProductionReady && productionDeliveryIsReady;
  }

  return true;
}

export async function sendRequestServiceEmailWithResend(
  payload: RequestServiceDeliveryPayload,
  apiKey: string,
  fetchImplementation: FetchImplementation = fetch,
): Promise<RequestServiceDeliveryResult> {
  const normalizedApiKey = apiKey.trim();

  if (!normalizedApiKey) {
    return { status: "not_configured" };
  }

  try {
    const response = await fetchImplementation(resendEndpoint, {
      body: JSON.stringify(buildRequestServiceEmail(payload)),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${normalizedApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": payload.idempotencyKey,
      },
      method: "POST",
      signal: AbortSignal.timeout(resendRequestTimeoutMs),
    });

    if (!response.ok) {
      return { status: "failed" };
    }

    const providerReceipt = readResendProviderReceipt(await response.json());

    return providerReceipt
      ? { providerReceipt, status: "confirmed" }
      : { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}
