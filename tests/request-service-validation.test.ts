import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import sharp from "sharp";

import {
  analyticsEventNames,
  analyticsLocations,
  getPhoneAnalyticsAttributes,
  isAnalyticsLocation,
  trackPhoneClick,
} from "../src/lib/analytics";
import {
  emptyRequestServiceValues,
  initialRequestServiceSubmissionState,
  requestServicePhotoLimits,
  type RequestServiceDeliveryPayload,
  type RequestServiceFormValues,
  validateRequestServiceFormData,
} from "../src/lib/request-service";
import {
  buildRequestServiceEmail,
  isRequestServiceDeliveryAllowed,
  readResendProviderReceipt,
  sendRequestServiceEmailWithResend,
} from "../src/lib/request-service-email";
import { validateRequestServicePhotos } from "../src/lib/request-service-photos";
import {
  createRequestServiceIdempotencyKey,
  processRequestServiceSubmission,
} from "../src/lib/request-service-submission";
import { publishedRoutes } from "../src/lib/routes";
import { leadDelivery, navigation, site } from "../src/lib/site";

const validValues: RequestServiceFormValues = {
  fullName: "Sam Customer",
  phone: "(419) 555-0123",
  email: "sam@example.com",
  audience: "residential",
  service: "sewer_line_repair",
  projectDetails: "Sewer line is backing up near the house.",
  city: "Toledo",
  postalCode: "43604",
  referralSource: "google_search",
  residentialRelationship: "owner",
  organizationName: "",
};

test("defines bounded click-to-call attributes for every allowed placement", () => {
  for (const location of analyticsLocations) {
    assert.equal(isAnalyticsLocation(location), true);
    assert.deepEqual(getPhoneAnalyticsAttributes(location), {
      "data-analytics-event": analyticsEventNames.phoneClick,
      "data-analytics-location": location,
    });
  }

  assert.equal(isAnalyticsLocation(undefined), false);
  assert.equal(isAnalyticsLocation("phone_number"), false);
});

test("emits one privacy-safe click-to-call event without contact data", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const dataLayer: unknown[] = [];

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { dataLayer },
  });

  try {
    trackPhoneClick("page_content");
    assert.deepEqual(dataLayer, [
      {
        cta_location: "page_content",
        event: analyticsEventNames.phoneClick,
      },
    ]);
    assert.equal(JSON.stringify(dataLayer).includes(site.phone), false);
    assert.equal(JSON.stringify(dataLayer).includes(site.email), false);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
});

test("keeps every main navigation destination on a published route", () => {
  const publishedPaths = new Set<string>(publishedRoutes.map(({ path }) => path));

  for (const item of navigation.main) {
    assert.equal(
      publishedPaths.has(item.href),
      true,
      `${item.label} points to unpublished route ${item.href}`,
    );
  }
});

test("keeps direct phone destinations inside the shared phone primitives", () => {
  const sourceRoot = join(process.cwd(), "src");
  const violations: string[] = [];

  function auditDirectory(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        auditDirectory(path);
        continue;
      }

      if (!entry.name.endsWith(".tsx") || entry.name === "CtaLink.tsx") {
        continue;
      }

      const source = readFileSync(path, "utf8");
      if (source.includes("href={site.phoneHref}") || /href=["']tel:/u.test(source)) {
        violations.push(path.replace(`${process.cwd()}/`, ""));
      }
    }
  }

  auditDirectory(sourceRoot);
  assert.deepEqual(violations, []);
});

function createFormData(
  overrides: Partial<RequestServiceFormValues> = {},
): FormData {
  const formData = new FormData();
  const values = { ...validValues, ...overrides };

  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }

  formData.set("website", "");
  return formData;
}

function createTestDeliveryPayload() {
  const validation = validateRequestServiceFormData(createFormData());

  if (!validation.success) {
    assert.fail("Expected the test lead to be valid.");
  }

  const deliveryInput = {
    attachments: [
      {
        content: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]),
        contentType: "image/jpeg" as const,
        filename: "project-photo-1.jpg",
      },
    ],
    lead: validation.data,
  };

  return {
    ...deliveryInput,
    idempotencyKey: createRequestServiceIdempotencyKey(deliveryInput),
  };
}

test("creates stable opaque idempotency keys from the normalized delivery payload", () => {
  const payload = createTestDeliveryPayload();
  const repeatedKey = createRequestServiceIdempotencyKey({
    attachments: payload.attachments.map((attachment) => ({
      ...attachment,
      content: attachment.content.slice(),
    })),
    lead: { ...payload.lead },
  });
  const changedLeadKey = createRequestServiceIdempotencyKey({
    attachments: payload.attachments,
    lead: { ...payload.lead, phone: "(419) 555-9999" },
  });
  const changedPhotoKey = createRequestServiceIdempotencyKey({
    attachments: [
      {
        ...payload.attachments[0],
        content: new Uint8Array([0xff, 0xd8, 0x00, 0xd9]),
      },
    ],
    lead: payload.lead,
  });

  assert.match(
    payload.idempotencyKey,
    /^request-service\/v1\/[a-f0-9]{64}$/,
  );
  assert.equal(repeatedKey, payload.idempotencyKey);
  assert.notEqual(changedLeadKey, payload.idempotencyKey);
  assert.notEqual(changedPhotoKey, payload.idempotencyKey);
  assert.equal(payload.idempotencyKey.includes(payload.lead.fullName), false);
  assert.equal(payload.idempotencyKey.includes(payload.lead.phone), false);
  assert.ok(payload.idempotencyKey.length <= 256);
});

test("builds a static-header plain-text internal notification with sanitized attachments", () => {
  const payload = createTestDeliveryPayload();
  const email = buildRequestServiceEmail(payload);
  const serializedHeaders = JSON.stringify({
    from: email.from,
    subject: email.subject,
    to: email.to,
  });

  assert.equal(
    email.from,
    `${leadDelivery.senderName} <${leadDelivery.senderEmail}>`,
  );
  assert.deepEqual(email.to, ["Ohioflowcollc@gmail.com"]);
  assert.equal(email.subject, `New ${site.name} service request`);
  assert.equal(Object.hasOwn(email, "html"), false);
  assert.equal(Object.hasOwn(email, "reply_to"), false);
  assert.equal(serializedHeaders.includes(payload.lead.fullName), false);
  assert.equal(serializedHeaders.includes(payload.lead.phone), false);
  assert.equal(serializedHeaders.includes(payload.lead.email), false);
  assert.match(email.text, /Project type: Home or residential property/);
  assert.match(email.text, /Relationship to property: Owner/);
  assert.match(email.text, /Service: Sewer line repair/);
  assert.match(email.text, /How they heard about us: Google Search/);
  assert.match(email.text, /Photos attached: 1/);
  assert.match(email.text, new RegExp(payload.lead.fullName));
  assert.deepEqual(email.attachments, [
    {
      content: Buffer.from(payload.attachments[0].content).toString("base64"),
      filename: "project-photo-1.jpg",
    },
  ]);
});

test("sends the notification through Resend with secret and idempotency headers", async () => {
  const payload = createTestDeliveryPayload();
  let capturedInput: string | URL | Request | undefined;
  let capturedInit: RequestInit | undefined;
  const result = await sendRequestServiceEmailWithResend(
    payload,
    "  re_test_secret  ",
    async (input, init) => {
      capturedInput = input;
      capturedInit = init;
      return Response.json({ id: "resend-receipt-123" });
    },
  );

  assert.deepEqual(result, {
    providerReceipt: "resend-receipt-123",
    status: "confirmed",
  });
  assert.equal(capturedInput, "https://api.resend.com/emails");
  assert.ok(capturedInit);
  const headers = new Headers(capturedInit.headers);
  assert.equal(headers.get("Authorization"), "Bearer re_test_secret");
  assert.equal(headers.get("Content-Type"), "application/json");
  assert.equal(headers.get("Idempotency-Key"), payload.idempotencyKey);
  assert.equal(capturedInit.method, "POST");
  assert.equal(capturedInit.cache, "no-store");
  assert.deepEqual(
    JSON.parse(String(capturedInit.body)),
    buildRequestServiceEmail(payload),
  );
  assert.equal(String(capturedInit.body).includes("re_test_secret"), false);
});

test("fails closed for missing credentials and unconfirmed Resend responses", async () => {
  const payload = createTestDeliveryPayload();
  let fetchCalls = 0;
  const notConfigured = await sendRequestServiceEmailWithResend(
    payload,
    " ",
    async () => {
      fetchCalls += 1;
      return Response.json({ id: "should-not-send" });
    },
  );

  assert.deepEqual(notConfigured, { status: "not_configured" });
  assert.equal(fetchCalls, 0);
  assert.deepEqual(
    await sendRequestServiceEmailWithResend(
      payload,
      "re_test_secret",
      async () => Response.json({ message: "provider error" }, { status: 500 }),
    ),
    { status: "failed" },
  );
  assert.deepEqual(
    await sendRequestServiceEmailWithResend(
      payload,
      "re_test_secret",
      async () => Response.json({ id: " " }),
    ),
    { status: "failed" },
  );
  assert.deepEqual(
    await sendRequestServiceEmailWithResend(
      payload,
      "re_test_secret",
      async () => {
        throw new Error("network unavailable for private@example.com");
      },
    ),
    { status: "failed" },
  );
  assert.equal(readResendProviderReceipt({ id: " receipt " }), "receipt");
  assert.equal(readResendProviderReceipt({ id: 123 }), null);
  assert.equal(readResendProviderReceipt(null), null);
});

test("blocks production delivery until contacts and public safeguards are ready", () => {
  for (const vercelEnvironment of [undefined, "development", "preview"]) {
    assert.equal(
      isRequestServiceDeliveryAllowed({
        contactDataIsProductionReady: false,
        productionDeliveryIsReady: false,
        vercelEnvironment,
      }),
      true,
    );
  }

  assert.equal(
    isRequestServiceDeliveryAllowed({
      contactDataIsProductionReady: false,
      productionDeliveryIsReady: true,
      vercelEnvironment: "production",
    }),
    false,
  );
  assert.equal(
    isRequestServiceDeliveryAllowed({
      contactDataIsProductionReady: true,
      productionDeliveryIsReady: false,
      vercelEnvironment: "production",
    }),
    false,
  );
  assert.equal(
    isRequestServiceDeliveryAllowed({
      contactDataIsProductionReady: true,
      productionDeliveryIsReady: true,
      vercelEnvironment: "production",
    }),
    true,
  );
});

function writeAscii(content: Uint8Array, value: string, offset: number) {
  for (const [index, character] of [...value].entries()) {
    content[offset + index] = character.charCodeAt(0);
  }
}

function createJpegFile({
  name = "photo.jpg",
  size = 32,
  type = "image/jpeg",
}: {
  name?: string;
  size?: number;
  type?: string;
} = {}) {
  const content = new Uint8Array(size);

  if (size >= 3) {
    content.set([0xff, 0xd8, 0xff]);
  }

  if (size >= 2) {
    content.set([0xff, 0xd9], size - 2);
  }

  return new File([content], name, { type });
}

function createPngFile({
  name = "photo.png",
  type = "image/png",
}: {
  name?: string;
  type?: string;
} = {}) {
  const content = new Uint8Array(45);
  content.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  content.set([0x00, 0x00, 0x00, 0x0d], 8);
  writeAscii(content, "IHDR", 12);
  content.set(
    [
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60,
      0x82,
    ],
    content.length - 12,
  );

  return new File([content], name, { type });
}

function createWebpFile({
  name = "photo.webp",
  type = "image/webp",
}: {
  name?: string;
  type?: string;
} = {}) {
  const content = new Uint8Array(20);
  writeAscii(content, "RIFF", 0);
  new DataView(content.buffer).setUint32(4, content.length - 8, true);
  writeAscii(content, "WEBP", 8);
  writeAscii(content, "VP8 ", 12);

  return new File([content], name, { type });
}

async function createValidPhotoFile({
  format,
  name = `photo.${format === "jpeg" ? "jpg" : format}`,
  type = `image/${format}`,
  withMetadata = false,
}: {
  format: "jpeg" | "png" | "webp";
  name?: string;
  type?: string;
  withMetadata?: boolean;
}) {
  let image = sharp({
    create: {
      background: { alpha: 1, b: 45, g: 90, r: 130 },
      channels: 4,
      height: 8,
      width: 8,
    },
  });

  if (withMetadata) {
    image = image.withMetadata({ orientation: 6 });
  }

  if (format === "jpeg") {
    image = image.jpeg();
  } else if (format === "png") {
    image = image.png();
  } else {
    image = image.webp();
  }

  const content = await image.toBuffer();
  return new File([new Uint8Array(content)], name, { type });
}

test("accepts and normalizes a valid short service request", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      fullName: "  Sam   Customer  ",
      phone: "+1 (419) 555-0123",
      email: "  SAM@EXAMPLE.COM ",
      projectDetails: "  First line. \r\n  Second   line.  ",
    }),
  );

  assert.equal(result.success, true);

  if (result.success) {
    assert.equal(result.data.fullName, "Sam Customer");
    assert.equal(result.data.email, "SAM@example.com");
    assert.equal(result.data.projectDetails, "First line.\nSecond line.");
  }
});

test("reports each missing required field", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      fullName: " ",
      phone: "",
      audience: "",
      service: "",
      city: "",
      postalCode: "",
      referralSource: "",
    }),
  );

  assert.equal(result.success, false);

  if (!result.success) {
    assert.deepEqual(Object.keys(result.fieldErrors).sort(), [
      "audience",
      "city",
      "fullName",
      "phone",
      "postalCode",
      "referralSource",
      "service",
    ]);
  }
});

test("rejects tampered service and source values", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      service: "general_plumbing",
      referralSource: "unknown-network",
    }),
  );

  assert.equal(result.success, false);

  if (!result.success) {
    assert.ok(result.fieldErrors.service);
    assert.ok(result.fieldErrors.referralSource);
  }
});

test("validates phone, optional email, and ZIP formats", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      phone: "555-0123",
      email: "not-an-email",
      postalCode: "4360",
    }),
  );

  assert.equal(result.success, false);

  if (!result.success) {
    assert.ok(result.fieldErrors.phone);
    assert.ok(result.fieldErrors.email);
    assert.ok(result.fieldErrors.postalCode);
  }

  const blankEmailResult = validateRequestServiceFormData(
    createFormData({ email: "", postalCode: "43604" }),
  );
  assert.equal(blankEmailResult.success, true);

  const zipPlusFourResult = validateRequestServiceFormData(
    createFormData({ postalCode: "43604-1234" }),
  );
  assert.equal(zipPlusFourResult.success, false);

  const phoneLettersResult = validateRequestServiceFormData(
    createFormData({ phone: "call 419-555-0123" }),
  );
  assert.equal(phoneLettersResult.success, false);

  for (const email of [
    "sam@example.com,",
    ".sam@example.com",
    "sam..customer@example.com",
    "sam@example..com",
  ]) {
    const malformedEmailResult = validateRequestServiceFormData(
      createFormData({ email }),
    );
    assert.equal(malformedEmailResult.success, false, email);
  }
});

test("accepts Unicode names and cities", () => {
  const result = validateRequestServiceFormData(
    createFormData({ fullName: "José O’Connor", city: "São José" }),
  );

  assert.equal(result.success, true);
});

test("accepts allowlisted fallback choices, leading-zero ZIPs, and blank optional details", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      email: "",
      projectDetails: "",
      postalCode: "01234",
      referralSource: "other",
      service: "not_sure",
    }),
  );

  assert.equal(result.success, true);
});

test("accepts every residential relationship and omits inactive organization data", () => {
  for (const residentialRelationship of [
    "owner",
    "tenant",
    "property_manager",
    "other",
  ]) {
    const result = validateRequestServiceFormData(
      createFormData({
        audience: "residential",
        organizationName: "Injected Organization",
        residentialRelationship,
      }),
    );

    assert.equal(result.success, true, residentialRelationship);

    if (result.success) {
      assert.equal(result.values.organizationName, "");
      assert.equal(result.data.audience, "residential");
      assert.equal(result.data.residentialRelationship, residentialRelationship);
      assert.equal(
        Object.hasOwn(result.data, "organizationName"),
        false,
      );
    }
  }
});

test("accepts every non-residential audience and omits residential data", () => {
  for (const audience of ["commercial", "contractor", "municipal"]) {
    const result = validateRequestServiceFormData(
      createFormData({
        audience,
        organizationName: "  Northwest   Project Group  ",
        residentialRelationship: "owner",
      }),
    );

    assert.equal(result.success, true, audience);

    if (result.success) {
      assert.equal(result.values.organizationName, "Northwest Project Group");
      assert.equal(result.values.residentialRelationship, "");
      assert.equal(result.data.audience, audience);
      if (result.data.audience === "residential") {
        assert.fail(`Expected non-residential lead for ${audience}.`);
      }
      assert.equal(result.data.organizationName, "Northwest Project Group");
      assert.equal(
        Object.hasOwn(result.data, "residentialRelationship"),
        false,
      );
    }
  }
});

test("validates only the active audience-specific field", () => {
  const missingRelationship = validateRequestServiceFormData(
    createFormData({
      audience: "residential",
      organizationName: "Valid Company",
      residentialRelationship: "",
    }),
  );
  assert.equal(missingRelationship.success, false);

  if (!missingRelationship.success) {
    assert.ok(missingRelationship.fieldErrors.residentialRelationship);
    assert.equal(missingRelationship.fieldErrors.organizationName, undefined);
  }

  const missingOrganization = validateRequestServiceFormData(
    createFormData({
      audience: "commercial",
      organizationName: "",
      residentialRelationship: "owner",
    }),
  );
  assert.equal(missingOrganization.success, false);

  if (!missingOrganization.success) {
    assert.ok(missingOrganization.fieldErrors.organizationName);
    assert.equal(
      missingOrganization.fieldErrors.residentialRelationship,
      undefined,
    );
  }
});

test("rejects missing, tampered, duplicate, and non-string audience values", () => {
  const cases = [
    (() => {
      const data = createFormData();
      data.delete("audience");
      return data;
    })(),
    createFormData({ audience: "emergency" }),
    (() => {
      const data = createFormData();
      data.append("audience", "commercial");
      return data;
    })(),
    (() => {
      const data = createFormData();
      data.set("audience", new Blob(["residential"]));
      return data;
    })(),
  ];

  for (const data of cases) {
    const result = validateRequestServiceFormData(data);
    assert.equal(result.success, false);

    if (!result.success) {
      assert.ok(result.fieldErrors.audience);
      assert.equal(result.fieldErrors.residentialRelationship, undefined);
      assert.equal(result.fieldErrors.organizationName, undefined);
      assert.equal(result.values.residentialRelationship, "");
      assert.equal(result.values.organizationName, "");
    }
  }
});

test("rejects tampered active conditional fields", () => {
  const relationshipData = createFormData({ audience: "residential" });
  relationshipData.set("residentialRelationship", "administrator");
  const relationshipResult = validateRequestServiceFormData(relationshipData);
  assert.equal(relationshipResult.success, false);

  if (!relationshipResult.success) {
    assert.ok(relationshipResult.fieldErrors.residentialRelationship);
  }

  for (const organizationName of ["A", "A".repeat(151), "Bad\u0000Name"]) {
    const organizationResult = validateRequestServiceFormData(
      createFormData({ audience: "commercial", organizationName }),
    );
    assert.equal(
      organizationResult.success,
      false,
      String(organizationName.length),
    );

    if (!organizationResult.success) {
      assert.ok(organizationResult.fieldErrors.organizationName);
    }
  }
});

test("rejects duplicate and non-string active conditional fields", () => {
  const cases: FormData[] = [];

  const duplicateRelationship = createFormData({ audience: "residential" });
  duplicateRelationship.append("residentialRelationship", "tenant");
  cases.push(duplicateRelationship);

  const fileRelationship = createFormData({ audience: "residential" });
  fileRelationship.set(
    "residentialRelationship",
    new Blob(["owner"]),
  );
  cases.push(fileRelationship);

  const duplicateOrganization = createFormData({
    audience: "commercial",
    organizationName: "Northwest Project Group",
  });
  duplicateOrganization.append("organizationName", "Second Company");
  cases.push(duplicateOrganization);

  const fileOrganization = createFormData({
    audience: "contractor",
    organizationName: "Northwest Project Group",
  });
  fileOrganization.set(
    "organizationName",
    new Blob(["Northwest Project Group"]),
  );
  cases.push(fileOrganization);

  for (const [index, data] of cases.entries()) {
    const result = validateRequestServiceFormData(data);
    assert.equal(result.success, false, String(index));

    if (!result.success) {
      const activeField =
        index < 2 ? "residentialRelationship" : "organizationName";
      assert.ok(result.fieldErrors[activeField]);
    }
  }
});

test("ignores duplicate, file, and unknown inactive data", () => {
  const residentialData = createFormData({ audience: "residential" });
  residentialData.delete("organizationName");
  residentialData.append("organizationName", new Blob(["ignored"]));
  residentialData.append("organizationName", "also ignored");
  residentialData.set("recipient", "attacker@example.com");
  const residentialResult = validateRequestServiceFormData(residentialData);
  assert.equal(residentialResult.success, true);

  if (residentialResult.success) {
    assert.equal(Object.hasOwn(residentialResult.data, "organizationName"), false);
    assert.equal(Object.hasOwn(residentialResult.data, "recipient"), false);
  }

  const commercialData = createFormData({
    audience: "contractor",
    organizationName: "Contractor Group",
  });
  commercialData.delete("residentialRelationship");
  commercialData.append("residentialRelationship", new Blob(["ignored"]));
  commercialData.append("residentialRelationship", "owner");
  const commercialResult = validateRequestServiceFormData(commercialData);
  assert.equal(commercialResult.success, true);

  if (commercialResult.success) {
    assert.equal(
      Object.hasOwn(commercialResult.data, "residentialRelationship"),
      false,
    );
  }
});

test("enforces field length and control-character limits", () => {
  const result = validateRequestServiceFormData(
    createFormData({
      fullName: "A".repeat(101),
      projectDetails: "A".repeat(1001),
      city: "Toledo\u0000",
    }),
  );

  assert.equal(result.success, false);

  if (!result.success) {
    assert.ok(result.fieldErrors.fullName);
    assert.ok(result.fieldErrors.projectDetails);
    assert.ok(result.fieldErrors.city);
  }
});

test("rejects duplicate and non-string form values", () => {
  const duplicateResultData = createFormData();
  duplicateResultData.append("fullName", "Second Name");
  const duplicateResult = validateRequestServiceFormData(duplicateResultData);

  assert.equal(duplicateResult.success, false);

  if (!duplicateResult.success) {
    assert.ok(duplicateResult.fieldErrors.fullName);
  }

  const fileResultData = createFormData();
  fileResultData.set("projectDetails", new Blob(["not accepted"]));
  const fileResult = validateRequestServiceFormData(fileResultData);

  assert.equal(fileResult.success, false);

  if (!fileResult.success) {
    assert.ok(fileResult.fieldErrors.projectDetails);
  }
});

test("rejects an omitted field instead of treating it as trusted input", () => {
  const formData = createFormData();
  formData.delete("fullName");
  const result = validateRequestServiceFormData(formData);

  assert.equal(result.success, false);

  if (!result.success) {
    assert.ok(result.fieldErrors.fullName);
  }
});

test("treats a populated honeypot as spam without field detail", () => {
  const formData = createFormData();
  formData.set("website", "https://spam.example");
  const result = validateRequestServiceFormData(formData);

  assert.equal(result.success, false);

  if (!result.success) {
    assert.equal(result.spam, true);
    assert.deepEqual(result.fieldErrors, {});
  }
});

test("accepts no photos and normalizes empty browser and server-action file placeholders", async () => {
  const noPhotoResult = await validateRequestServicePhotos(createFormData());
  assert.deepEqual(noPhotoResult, {
    attachments: [],
    hadPhotos: false,
    success: true,
  });

  const emptyInputData = createFormData();
  emptyInputData.append(
    "photos",
    new File([], "", { type: "application/octet-stream" }),
  );
  const emptyInputResult = await validateRequestServicePhotos(emptyInputData);
  assert.deepEqual(emptyInputResult, {
    attachments: [],
    hadPhotos: false,
    success: true,
  });

  const serverActionData = createFormData();
  serverActionData.append(
    "photos",
    new File([], "blob", { type: "application/octet-stream" }),
  );
  const serverActionResult = await validateRequestServicePhotos(serverActionData);
  assert.deepEqual(serverActionResult, {
    attachments: [],
    hadPhotos: false,
    success: true,
  });
});

test("accepts JPEG, PNG, and WebP photos and normalizes their filenames and bytes", async () => {
  const formData = createFormData();
  formData.append(
    "photos",
    await createValidPhotoFile({
      format: "jpeg",
      name: "../../customer\r\nBcc-test.jpg",
    }),
  );
  formData.append(
    "photos",
    await createValidPhotoFile({
      format: "png",
      name: "private-location.png",
    }),
  );
  formData.append(
    "photos",
    await createValidPhotoFile({ format: "webp", name: "jobsite.webp" }),
  );

  const result = await validateRequestServicePhotos(formData);
  assert.equal(result.success, true);

  if (result.success) {
    assert.equal(result.hadPhotos, true);
    assert.deepEqual(
      result.attachments.map(({ contentType, filename }) => ({
        contentType,
        filename,
      })),
      [
        { contentType: "image/jpeg", filename: "project-photo-1.jpg" },
        { contentType: "image/jpeg", filename: "project-photo-2.jpg" },
        { contentType: "image/jpeg", filename: "project-photo-3.jpg" },
      ],
    );

    for (const attachment of result.attachments) {
      assert.deepEqual(Object.keys(attachment).sort(), [
        "content",
        "contentType",
        "filename",
      ]);
      assert.ok(attachment.content instanceof Uint8Array);
      const metadata = await sharp(attachment.content).metadata();
      assert.equal(metadata.format, "jpeg");
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.xmp, undefined);
    }
  }
});

test("rejects excessive, empty, oversized, and structurally malformed photo fields", async () => {
  const tooManyData = createFormData();
  for (let index = 0; index < requestServicePhotoLimits.maxFiles + 1; index += 1) {
    tooManyData.append("photos", createJpegFile());
  }

  const mixedData = createFormData();
  mixedData.append("photos", createJpegFile());
  mixedData.append("photos", "not-a-file");

  const emptyData = createFormData();
  emptyData.append(
    "photos",
    new File([], "empty.jpg", { type: "image/jpeg" }),
  );

  const namedEmptyOctetStreamData = createFormData();
  namedEmptyOctetStreamData.append(
    "photos",
    new File([], "empty.bin", { type: "application/octet-stream" }),
  );

  const wrongTypePlaceholderData = createFormData();
  wrongTypePlaceholderData.append(
    "photos",
    new File([], "", { type: "image/jpeg" }),
  );

  const repeatedPlaceholderData = createFormData();
  repeatedPlaceholderData.append(
    "photos",
    new File([], "blob", { type: "application/octet-stream" }),
  );
  repeatedPlaceholderData.append(
    "photos",
    new File([], "blob", { type: "application/octet-stream" }),
  );

  const mixedPlaceholderData = createFormData();
  mixedPlaceholderData.append(
    "photos",
    new File([], "blob", { type: "application/octet-stream" }),
  );
  mixedPlaceholderData.append("photos", createJpegFile());

  const oversizedData = createFormData();
  oversizedData.append(
    "photos",
    createJpegFile({ size: requestServicePhotoLimits.maxBytesPerFile + 1 }),
  );

  for (const data of [
    tooManyData,
    mixedData,
    emptyData,
    namedEmptyOctetStreamData,
    wrongTypePlaceholderData,
    repeatedPlaceholderData,
    mixedPlaceholderData,
    oversizedData,
  ]) {
    const result = await validateRequestServicePhotos(data);
    assert.equal(result.success, false);

    if (!result.success) {
      assert.equal(result.hadPhotos, true);
      assert.ok(result.error);
    }
  }
});

test("rejects photo selections above the combined byte limit", async () => {
  const formData = createFormData();
  const halfLimit = Math.floor(requestServicePhotoLimits.maxTotalBytes / 2) + 1;
  formData.append("photos", createJpegFile({ size: halfLimit }));
  formData.append("photos", createJpegFile({ size: halfLimit }));

  const result = await validateRequestServicePhotos(formData);
  assert.equal(result.success, false);

  if (!result.success) {
    assert.match(result.error, /total 3 MB or less/);
  }
});

test("rejects unsupported, mismatched, truncated, and malformed photo content", async () => {
  const malformedWebpContent = new Uint8Array(20);
  writeAscii(malformedWebpContent, "RIFF", 0);
  new DataView(malformedWebpContent.buffer).setUint32(4, 1, true);
  writeAscii(malformedWebpContent, "WEBP", 8);
  writeAscii(malformedWebpContent, "VP8 ", 12);

  const files = [
    createJpegFile({ type: "application/pdf" }),
    createPngFile({ type: "image/jpeg" }),
    createJpegFile(),
    createPngFile(),
    createWebpFile(),
    new File([Uint8Array.of(0xff, 0xd8, 0xff)], "truncated.jpg", {
      type: "image/jpeg",
    }),
    new File([malformedWebpContent], "malformed.webp", {
      type: "image/webp",
    }),
  ];

  for (const file of files) {
    const formData = createFormData();
    formData.append("photos", file);
    const result = await validateRequestServicePhotos(formData);
    assert.equal(result.success, false, file.name);

    if (!result.success) {
      assert.match(result.error, /JPG, PNG, or WebP|safely prepared/);
    }
  }
});

test("rejects decodable images above the input pixel limit", async () => {
  const dimension = Math.ceil(
    Math.sqrt(requestServicePhotoLimits.maxInputPixels),
  );
  const content = await sharp({
    create: {
      background: { b: 20, g: 40, r: 60 },
      channels: 3,
      height: dimension,
      width: dimension,
    },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
  assert.ok(content.byteLength < requestServicePhotoLimits.maxTotalBytes);

  const formData = createFormData();
  formData.append(
    "photos",
    new File([new Uint8Array(content)], "huge-dimensions.png", {
      type: "image/png",
    }),
  );
  const result = await validateRequestServicePhotos(formData);
  assert.equal(result.success, false);

  if (!result.success) {
    assert.match(result.error, /safely prepared/);
  }
});

test("does not call delivery when photo validation fails", async () => {
  const formData = createFormData();
  formData.append(
    "photos",
    new File(["not an image"], "fake.jpg", { type: "image/jpeg" }),
  );
  let deliveryCalls = 0;

  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    formData,
    async () => {
      deliveryCalls += 1;
      return { providerReceipt: "provider-123", status: "confirmed" };
    },
  );

  assert.equal(result.status, "invalid");
  assert.ok(result.fieldErrors.photos);
  assert.equal(result.photosNeedReselection, true);
  assert.equal(deliveryCalls, 0);
});

test("does not call delivery when server validation fails", async () => {
  let deliveryCalls = 0;
  const formData = createFormData({ fullName: "" });
  formData.append(
    "photos",
    await createValidPhotoFile({ format: "jpeg" }),
  );
  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    formData,
    async () => {
      deliveryCalls += 1;
      return { providerReceipt: "provider-123", status: "confirmed" };
    },
  );

  assert.equal(result.status, "invalid");
  assert.equal(deliveryCalls, 0);
  assert.equal(result.attempt, 1);
  assert.equal(result.photosNeedReselection, true);
});

test("preserves values and returns a safe error when delivery is unavailable", async () => {
  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData(),
    async () => ({ status: "not_configured" }),
  );

  assert.equal(result.status, "submission_error");
  assert.equal(result.values.fullName, validValues.fullName);
  assert.ok(result.formError);
  assert.equal(result.formError?.includes(validValues.fullName), false);
  assert.deepEqual(result.fieldErrors, {});
  assert.equal(result.photosNeedReselection, false);

  const contractorResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData({
      audience: "contractor",
      organizationName: "  Northwest   Project Group  ",
      residentialRelationship: "owner",
    }),
    async () => ({ status: "not_configured" }),
  );

  assert.equal(contractorResult.status, "submission_error");
  assert.equal(contractorResult.values.audience, "contractor");
  assert.equal(
    contractorResult.values.organizationName,
    "Northwest Project Group",
  );
  assert.equal(contractorResult.values.residentialRelationship, "");

  const photoData = createFormData();
  photoData.append(
    "photos",
    await createValidPhotoFile({
      format: "png",
      name: "customer-private-name.png",
    }),
  );
  const photoResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    photoData,
    async () => ({ status: "not_configured" }),
  );

  assert.equal(photoResult.status, "submission_error");
  assert.equal(photoResult.photosNeedReselection, true);
  assert.equal(photoResult.values.fullName, validValues.fullName);
  assert.equal(
    JSON.stringify(photoResult).includes("customer-private-name"),
    false,
  );
});

test("delivers a server-action no-photo placeholder as an empty attachment list", async () => {
  const formData = createFormData();
  formData.append(
    "photos",
    new File([], "blob", { type: "application/octet-stream" }),
  );
  const deliveredPayloads: RequestServiceDeliveryPayload[] = [];

  const unavailableResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    formData,
    async () => ({ status: "not_configured" }),
  );

  assert.equal(unavailableResult.status, "submission_error");
  assert.deepEqual(unavailableResult.fieldErrors, {});
  assert.equal(unavailableResult.photosNeedReselection, false);
  assert.equal(unavailableResult.values.fullName, validValues.fullName);

  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    formData,
    async (payload) => {
      deliveredPayloads.push(payload);
      return { providerReceipt: "provider-no-photo", status: "confirmed" };
    },
  );

  assert.equal(result.status, "success");
  assert.equal(result.photosNeedReselection, false);
  assert.equal(deliveredPayloads.length, 1);
  assert.deepEqual(deliveredPayloads[0]?.attachments, []);
});

test("requires a nonblank provider receipt before returning success", async () => {
  const blankReceiptResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData(),
    async () => ({ providerReceipt: " ", status: "confirmed" }),
  );
  assert.equal(blankReceiptResult.status, "submission_error");

  const confirmedResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData(),
    async () => ({ providerReceipt: "provider-123", status: "confirmed" }),
  );
  assert.equal(confirmedResult.status, "success");
  assert.deepEqual(confirmedResult.values, emptyRequestServiceValues);
  assert.deepEqual(confirmedResult.fieldErrors, {});
  assert.equal(confirmedResult.formError, undefined);
  assert.equal(confirmedResult.photosNeedReselection, false);
  assert.equal(Object.hasOwn(confirmedResult, "providerReceipt"), false);
});

test("accepts a new request after confirmation without retaining the prior receipt", async () => {
  const firstResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData(),
    async () => ({
      providerReceipt: "private-provider-receipt-1",
      status: "confirmed",
    }),
  );
  assert.equal(firstResult.status, "success");

  const secondResult = await processRequestServiceSubmission(
    firstResult,
    createFormData({ fullName: "Second Customer" }),
    async () => ({
      providerReceipt: "private-provider-receipt-2",
      status: "confirmed",
    }),
  );

  assert.equal(secondResult.status, "success");
  assert.equal(secondResult.attempt, 2);
  assert.deepEqual(secondResult.values, emptyRequestServiceValues);
  assert.equal(
    JSON.stringify(secondResult).includes("private-provider-receipt"),
    false,
  );
});

test("delivers a discriminated lead with inactive audience data omitted", async () => {
  const deliveredPayloads: RequestServiceDeliveryPayload[] = [];
  const deliver = async (payload: RequestServiceDeliveryPayload) => {
    deliveredPayloads.push(payload);
    return {
      providerReceipt: `provider-${deliveredPayloads.length}`,
      status: "confirmed" as const,
    };
  };

  const residentialResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData({
      audience: "residential",
      organizationName: "Injected Organization",
      residentialRelationship: "tenant",
    }),
    deliver,
  );
  const commercialResult = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData({
      audience: "commercial",
      organizationName: "Northwest Project Group",
      residentialRelationship: "owner",
    }),
    deliver,
  );

  assert.equal(residentialResult.status, "success");
  assert.equal(commercialResult.status, "success");
  assert.equal(deliveredPayloads.length, 2);

  const [residentialPayload, commercialPayload] = deliveredPayloads;
  assert.ok(residentialPayload);
  assert.ok(commercialPayload);
  assert.deepEqual(residentialPayload.attachments, []);
  assert.deepEqual(commercialPayload.attachments, []);
  const residentialLead = residentialPayload.lead;
  const commercialLead = commercialPayload.lead;
  assert.equal(residentialLead.audience, "residential");
  assert.equal(Object.hasOwn(residentialLead, "residentialRelationship"), true);
  assert.equal(Object.hasOwn(residentialLead, "organizationName"), false);
  if (residentialLead.audience === "residential") {
    assert.equal(residentialLead.residentialRelationship, "tenant");
  }
  assert.equal(commercialLead.audience, "commercial");
  assert.equal(Object.hasOwn(commercialLead, "organizationName"), true);
  assert.equal(
    Object.hasOwn(commercialLead, "residentialRelationship"),
    false,
  );
  assert.equal(commercialLead.organizationName, "Northwest Project Group");
});

test("delivers generated request-scoped attachments without original photo metadata", async () => {
  const formData = createFormData();
  const metadataPhoto = await createValidPhotoFile({
    format: "jpeg",
    name: "../../private-address.jpg",
    withMetadata: true,
  });
  const inputMetadata = await sharp(
    new Uint8Array(await metadataPhoto.arrayBuffer()),
  ).metadata();
  assert.ok(inputMetadata.exif);
  formData.append("photos", metadataPhoto);
  formData.append(
    "photos",
    await createValidPhotoFile({
      format: "webp",
      name: "customer-name.webp",
    }),
  );
  formData.append(
    "untrustedUpload",
    new File(["ignored"], "invoice.pdf", { type: "application/pdf" }),
  );
  let deliveredPayload: RequestServiceDeliveryPayload | undefined;

  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    formData,
    async (payload) => {
      deliveredPayload = payload;
      return { providerReceipt: "provider-photos", status: "confirmed" };
    },
  );

  assert.equal(result.status, "success");
  assert.ok(deliveredPayload);
  assert.deepEqual(
    deliveredPayload.attachments.map(({ contentType, filename }) => ({
      contentType,
      filename,
    })),
    [
      { contentType: "image/jpeg", filename: "project-photo-1.jpg" },
      { contentType: "image/jpeg", filename: "project-photo-2.jpg" },
    ],
  );
  for (const attachment of deliveredPayload.attachments) {
    const metadata = await sharp(attachment.content).metadata();
    assert.equal(metadata.format, "jpeg");
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
  }
  assert.equal(Object.hasOwn(deliveredPayload, "untrustedUpload"), false);
  assert.equal(Object.hasOwn(deliveredPayload.lead, "photos"), false);
  assert.equal(result.photosNeedReselection, false);
  assert.equal(JSON.stringify(result).includes("private-address"), false);
});

test("converts a thrown delivery failure into a safe retryable state", async () => {
  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData(),
    async () => {
      throw new Error("Provider unavailable for sam@example.com");
    },
  );

  assert.equal(result.status, "submission_error");
  assert.equal(result.values.email, validValues.email);
  assert.equal(result.formError?.includes(validValues.email), false);
});

test("sanitizes an invalid client-supplied attempt counter", async () => {
  const malformedState = {
    ...initialRequestServiceSubmissionState,
    attempt: Number.NaN,
  };
  const result = await processRequestServiceSubmission(
    malformedState,
    createFormData({ fullName: "" }),
    async () => ({ status: "not_configured" }),
  );

  assert.equal(result.attempt, 1);
  assert.equal(result.status, "invalid");
});
