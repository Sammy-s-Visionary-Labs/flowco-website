import assert from "node:assert/strict";
import { test } from "node:test";

import {
  emptyRequestServiceValues,
  initialRequestServiceSubmissionState,
  type RequestServiceLead,
  type RequestServiceFormValues,
  validateRequestServiceFormData,
} from "../src/lib/request-service";
import { processRequestServiceSubmission } from "../src/lib/request-service-submission";

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

test("does not call delivery when server validation fails", async () => {
  let deliveryCalls = 0;
  const result = await processRequestServiceSubmission(
    initialRequestServiceSubmissionState,
    createFormData({ fullName: "" }),
    async () => {
      deliveryCalls += 1;
      return { providerReceipt: "provider-123", status: "confirmed" };
    },
  );

  assert.equal(result.status, "invalid");
  assert.equal(deliveryCalls, 0);
  assert.equal(result.attempt, 1);
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
});

test("delivers a discriminated lead with inactive audience data omitted", async () => {
  const deliveredLeads: RequestServiceLead[] = [];
  const deliver = async (lead: RequestServiceLead) => {
    deliveredLeads.push(lead);
    return {
      providerReceipt: `provider-${deliveredLeads.length}`,
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
  assert.equal(deliveredLeads.length, 2);

  const [residentialLead, commercialLead] = deliveredLeads;
  assert.ok(residentialLead);
  assert.ok(commercialLead);
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
