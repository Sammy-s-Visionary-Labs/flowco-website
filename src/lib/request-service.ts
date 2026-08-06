import { confirmedServices } from "./site";

export const requestServiceOptions = [
  ...confirmedServices,
  { id: "not_sure", label: "Not sure yet" },
] as const;

export const referralSourceOptions = [
  { id: "google_search", label: "Google Search" },
  { id: "google_maps", label: "Google Maps" },
  { id: "facebook_instagram", label: "Facebook or Instagram" },
  { id: "referral", label: "Referral from someone I know" },
  { id: "repeat_customer", label: "Previous customer" },
  { id: "truck_sign_jobsite", label: "Truck, sign, or jobsite" },
  { id: "other_website_directory", label: "Another website or directory" },
  { id: "other", label: "Other" },
] as const;

export const requestAudienceOptions = [
  {
    description: "A home, rental, or other residential property",
    id: "residential",
    label: "Home or residential property",
  },
  {
    description: "A business location, multi-unit property, or commercial site",
    id: "commercial",
    label: "Business or commercial property",
  },
  {
    description: "Utility, excavation, or site work for a construction project",
    id: "contractor",
    label: "Contractor or construction project",
  },
  {
    description: "Public infrastructure or agency-supported work",
    id: "municipal",
    label: "Municipality or public agency",
  },
] as const;

export const residentialRelationshipOptions = [
  { id: "owner", label: "Owner" },
  { id: "tenant", label: "Tenant or occupant" },
  { id: "property_manager", label: "Landlord or property manager" },
  { id: "other", label: "Other" },
] as const;

export type RequestServiceAudience =
  (typeof requestAudienceOptions)[number]["id"];
export type ResidentialRelationship =
  (typeof residentialRelationshipOptions)[number]["id"];

export type RequestServiceFieldName =
  | "fullName"
  | "phone"
  | "email"
  | "audience"
  | "service"
  | "projectDetails"
  | "city"
  | "postalCode"
  | "referralSource"
  | "residentialRelationship"
  | "organizationName";

export type RequestServiceFormValues = Record<RequestServiceFieldName, string>;
export type RequestServiceFieldErrors = Partial<
  Record<RequestServiceFieldName, string>
>;

type SharedRequestServiceLead = Omit<
  RequestServiceFormValues,
  "audience" | "organizationName" | "residentialRelationship"
>;

export type RequestServiceLead =
  | (SharedRequestServiceLead & {
      audience: "residential";
      residentialRelationship: ResidentialRelationship;
    })
  | (SharedRequestServiceLead & {
      audience: Exclude<RequestServiceAudience, "residential">;
      organizationName: string;
    });

export type RequestServiceDeliveryResult =
  | { providerReceipt: string; status: "confirmed" }
  | { status: "failed" | "not_configured" };

export type RequestServiceDelivery = (
  lead: RequestServiceLead,
) => Promise<RequestServiceDeliveryResult>;

export type RequestServiceSubmissionState = {
  attempt: number;
  fieldErrors: RequestServiceFieldErrors;
  formError?: string;
  status: "idle" | "invalid" | "submission_error" | "success";
  values: RequestServiceFormValues;
};

export type RequestServiceValidationResult =
  | {
      data: RequestServiceLead;
      success: true;
      values: RequestServiceFormValues;
    }
  | {
      fieldErrors: RequestServiceFieldErrors;
      spam: boolean;
      success: false;
      values: RequestServiceFormValues;
    };

export const emptyRequestServiceValues: RequestServiceFormValues = {
  fullName: "",
  phone: "",
  email: "",
  audience: "",
  service: "",
  projectDetails: "",
  city: "",
  postalCode: "",
  referralSource: "",
  residentialRelationship: "",
  organizationName: "",
};

export const initialRequestServiceSubmissionState: RequestServiceSubmissionState =
  {
    attempt: 0,
    fieldErrors: {},
    status: "idle",
    values: emptyRequestServiceValues,
  };

const fieldNames = Object.keys(
  emptyRequestServiceValues,
) as RequestServiceFieldName[];
const conditionalFieldNames = [
  "residentialRelationship",
  "organizationName",
] as const satisfies readonly RequestServiceFieldName[];
const conditionalFieldNameSet = new Set<RequestServiceFieldName>(
  conditionalFieldNames,
);
const singleLineControlCharacterPattern = /[\u0000-\u001f\u007f]/;
const multilineControlCharacterPattern = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const emailPattern =
  /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const phoneCharacterPattern = /^[\d\s()+.\-]+$/;
const postalCodePattern = /^\d{5}$/;

function readStringField(formData: FormData, name: string) {
  const entries = formData.getAll(name);

  if (entries.length !== 1 || typeof entries[0] !== "string") {
    return null;
  }

  return entries[0];
}

function readConditionalStringField(formData: FormData, name: string) {
  const entries = formData.getAll(name);

  if (entries.length === 0) {
    return "";
  }

  if (entries.length !== 1 || typeof entries[0] !== "string") {
    return null;
  }

  return entries[0];
}

function normalizeSingleLine(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: string) {
  const normalized = normalizeSingleLine(value);
  const atIndex = normalized.lastIndexOf("@");

  if (atIndex < 0) {
    return normalized;
  }

  return `${normalized.slice(0, atIndex)}@${normalized
    .slice(atIndex + 1)
    .toLowerCase()}`;
}

function normalizeMultiline(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim().replace(/[\t ]+/g, " "))
    .join("\n")
    .trim();
}

function hasControlCharacters(value: string, multiline = false) {
  return (multiline
    ? multilineControlCharacterPattern
    : singleLineControlCharacterPattern
  ).test(value);
}

function isAllowedOption(
  value: string,
  options: readonly { id: string }[],
) {
  return options.some((option) => option.id === value);
}

export function validateRequestServiceFormData(
  formData: FormData,
): RequestServiceValidationResult {
  const rawValues = Object.fromEntries(
    fieldNames.map((name) => [
      name,
      (conditionalFieldNameSet.has(name)
        ? readConditionalStringField(formData, name)
        : readStringField(formData, name)) ?? "",
    ]),
  ) as RequestServiceFormValues;
  const values: RequestServiceFormValues = {
    fullName: normalizeSingleLine(rawValues.fullName),
    phone: normalizeSingleLine(rawValues.phone),
    email: normalizeEmail(rawValues.email),
    audience: normalizeSingleLine(rawValues.audience),
    service: normalizeSingleLine(rawValues.service),
    projectDetails: normalizeMultiline(rawValues.projectDetails),
    city: normalizeSingleLine(rawValues.city),
    postalCode: normalizeSingleLine(rawValues.postalCode),
    referralSource: normalizeSingleLine(rawValues.referralSource),
    residentialRelationship: normalizeSingleLine(
      rawValues.residentialRelationship,
    ),
    organizationName: normalizeSingleLine(rawValues.organizationName),
  };
  const fieldErrors: RequestServiceFieldErrors = {};
  const website = readStringField(formData, "website");
  const malformedFields = fieldNames.filter(
    (name) =>
      !conditionalFieldNameSet.has(name) && readStringField(formData, name) === null,
  );

  if (malformedFields.length > 0) {
    for (const name of malformedFields) {
      fieldErrors[name] = "Enter this field again.";
    }
  }

  if (
    website === null ||
    website.trim() !== "" ||
    hasControlCharacters(website)
  ) {
    return { fieldErrors: {}, spam: true, success: false, values };
  }

  if (!values.fullName) {
    fieldErrors.fullName = "Enter your full name.";
  } else if (
    values.fullName.length < 2 ||
    values.fullName.length > 100 ||
    hasControlCharacters(rawValues.fullName)
  ) {
    fieldErrors.fullName = "Enter a name between 2 and 100 characters.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  const phoneIsValid =
    phoneDigits.length === 10 ||
    (phoneDigits.length === 11 && phoneDigits.startsWith("1"));

  if (!values.phone) {
    fieldErrors.phone = "Enter your phone number.";
  } else if (
    values.phone.length > 30 ||
    !phoneIsValid ||
    !phoneCharacterPattern.test(values.phone) ||
    hasControlCharacters(rawValues.phone)
  ) {
    fieldErrors.phone = "Enter a 10-digit U.S. phone number.";
  }

  if (
    values.email &&
    (values.email.length > 254 ||
      !emailPattern.test(values.email) ||
      hasControlCharacters(rawValues.email))
  ) {
    fieldErrors.email = "Enter a valid email address or leave this blank.";
  }

  if (!isAllowedOption(values.audience, requestAudienceOptions)) {
    fieldErrors.audience = "Choose what type of project this is.";
    values.residentialRelationship = "";
    values.organizationName = "";
  } else if (values.audience === "residential") {
    values.organizationName = "";
    const rawResidentialRelationship = readConditionalStringField(
      formData,
      "residentialRelationship",
    );

    if (rawResidentialRelationship === null) {
      fieldErrors.residentialRelationship = "Enter this field again.";
    } else if (
      !isAllowedOption(
        values.residentialRelationship,
        residentialRelationshipOptions,
      )
    ) {
      fieldErrors.residentialRelationship =
        "Choose your relationship to the residential property.";
    }
  } else {
    values.residentialRelationship = "";
    const rawOrganizationName = readConditionalStringField(
      formData,
      "organizationName",
    );

    if (rawOrganizationName === null) {
      fieldErrors.organizationName = "Enter this field again.";
    } else if (!values.organizationName) {
      fieldErrors.organizationName = "Enter the company or organization name.";
    } else if (
      values.organizationName.length < 2 ||
      values.organizationName.length > 150 ||
      hasControlCharacters(rawValues.organizationName)
    ) {
      fieldErrors.organizationName =
        "Enter a company or organization name between 2 and 150 characters.";
    }
  }

  if (!isAllowedOption(values.service, requestServiceOptions)) {
    fieldErrors.service = "Choose the service that best matches your project.";
  }

  if (
    values.projectDetails.length > 1000 ||
    hasControlCharacters(rawValues.projectDetails, true)
  ) {
    fieldErrors.projectDetails =
      "Keep project details to 1,000 characters or fewer.";
  }

  if (!values.city) {
    fieldErrors.city = "Enter the project city.";
  } else if (
    values.city.length < 2 ||
    values.city.length > 100 ||
    hasControlCharacters(rawValues.city)
  ) {
    fieldErrors.city = "Enter a city between 2 and 100 characters.";
  }

  if (!postalCodePattern.test(values.postalCode)) {
    fieldErrors.postalCode = "Enter a 5-digit ZIP code.";
  }

  if (!isAllowedOption(values.referralSource, referralSourceOptions)) {
    fieldErrors.referralSource = "Choose how you heard about us.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, spam: false, success: false, values };
  }

  const {
    audience,
    organizationName,
    residentialRelationship,
    ...sharedLeadValues
  } = values;
  const data: RequestServiceLead =
    audience === "residential"
      ? {
          ...sharedLeadValues,
          audience: "residential",
          residentialRelationship:
            residentialRelationship as ResidentialRelationship,
        }
      : {
          ...sharedLeadValues,
          audience: audience as Exclude<
            RequestServiceAudience,
            "residential"
          >,
          organizationName,
        };

  return { data, success: true, values };
}
