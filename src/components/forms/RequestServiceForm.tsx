"use client";

import type { ChangeEvent, FocusEvent } from "react";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitRequestServiceAction } from "@/app/request-service/actions";
import {
  requestAudienceOptions,
  initialRequestServiceSubmissionState,
  referralSourceOptions,
  residentialRelationshipOptions,
  type RequestServiceFieldName,
  requestServiceOptions,
} from "@/lib/request-service";
import {
  trackLeadFormError,
  trackLeadFormStart,
  trackLeadFormSuccess,
} from "@/lib/analytics";
import { site } from "@/lib/site";

const fieldLabels: Record<RequestServiceFieldName, string> = {
  fullName: "Full name",
  phone: "Phone number",
  email: "Email address",
  audience: "Project type",
  service: "Service needed",
  projectDetails: "Project details",
  city: "Project city",
  postalCode: "Project ZIP code",
  referralSource: "How you heard about us",
  residentialRelationship: "Relationship to the residential property",
  organizationName: "Company or organization name",
};

const inputStyles =
  "min-h-12 w-full rounded-sm border border-line-strong bg-white px-3.5 py-2.5 text-base text-ink shadow-sm transition-colors placeholder:text-ink-subtle/75 hover:border-brand/55 focus:border-brand aria-invalid:border-accent-deep aria-invalid:bg-accent-soft/40 disabled:cursor-not-allowed disabled:bg-surface-muted";

function fieldDescriptionIds(
  fieldName: RequestServiceFieldName,
  hasHint: boolean,
  hasError: boolean,
) {
  return [
    hasHint ? `${fieldName}-hint` : null,
    hasError ? `${fieldName}-error` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;
}

function fieldTargetId(fieldName: RequestServiceFieldName) {
  return fieldName === "audience" ? "audience-residential" : fieldName;
}

export function RequestServiceForm() {
  const [state, formAction, isPending] = useActionState(
    submitRequestServiceAction,
    initialRequestServiceSubmissionState,
  );
  const feedbackRef = useRef<HTMLDivElement>(null);
  const formStartTrackedRef = useRef(false);
  const [audienceSelection, setAudienceSelection] = useState({
    attempt: 0,
    value: "",
  });
  const [dismissedErrors, setDismissedErrors] = useState<{
    attempt: number;
    fields: Set<RequestServiceFieldName>;
  }>({ attempt: 0, fields: new Set() });

  useEffect(() => {
    if (state.attempt === 0) {
      return;
    }

    if (state.status === "success") {
      trackLeadFormSuccess("request_service");
    } else {
      trackLeadFormError(
        "request_service",
        state.status === "invalid" ? "validation" : "submission",
      );
    }

    feedbackRef.current?.focus();
  }, [state]);

  function handleFormFocus(event: FocusEvent<HTMLFormElement>) {
    if (
      formStartTrackedRef.current ||
      !(event.target instanceof HTMLElement) ||
      !event.target.matches(
        'input:not([name="website"]), select, textarea',
      )
    ) {
      return;
    }

    formStartTrackedRef.current = true;
    trackLeadFormStart("request_service");
  }

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const fieldName = event.target.name as RequestServiceFieldName;

    if (!(fieldName in fieldLabels)) {
      return;
    }

    if (fieldName === "audience") {
      setAudienceSelection({
        attempt: state.attempt,
        value: event.target.value,
      });
    }

    setDismissedErrors((current) => {
      const fields =
        current.attempt === state.attempt
          ? new Set(current.fields)
          : new Set<RequestServiceFieldName>();

      const fieldsToDismiss: RequestServiceFieldName[] = [fieldName];
      const hasEveryField = fieldsToDismiss.every((name) => fields.has(name));

      if (hasEveryField) {
        return current;
      }

      for (const name of fieldsToDismiss) {
        fields.add(name);
      }

      return { attempt: state.attempt, fields };
    });
  }

  const selectedAudience =
    audienceSelection.attempt === state.attempt
      ? audienceSelection.value
      : state.values.audience;
  const visibleFieldErrors = Object.fromEntries(
    Object.entries(state.fieldErrors).filter(
      ([fieldName]) => {
        const errorIsForInactiveAudiencePath =
          (fieldName === "residentialRelationship" &&
            selectedAudience !== "residential") ||
          (fieldName === "organizationName" &&
            selectedAudience === "residential");

        return (
          !errorIsForInactiveAudiencePath &&
          (dismissedErrors.attempt !== state.attempt ||
            !dismissedErrors.fields.has(fieldName as RequestServiceFieldName))
        );
      },
    ),
  ) as typeof state.fieldErrors;
  const errorEntries = Object.entries(visibleFieldErrors) as [
    RequestServiceFieldName,
    string,
  ][];

  return (
    <form
      action={formAction}
      aria-busy={isPending}
      className="space-y-9"
      id="request-form"
      noValidate
      onFocusCapture={handleFormFocus}
    >
      <p className="text-sm font-semibold text-ink-muted">
        All fields are required unless marked optional.
      </p>

      {state.status === "invalid" && errorEntries.length > 0 ? (
        <div
          ref={feedbackRef}
          aria-labelledby="request-service-error-heading"
          className="rounded-sm border-l-4 border-accent bg-accent-soft p-4 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          role="alert"
          tabIndex={-1}
        >
          <h2
            className="font-display text-lg font-black text-brand-deep"
            id="request-service-error-heading"
          >
            Please correct these fields
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(([fieldName, message]) => (
              <li key={fieldName}>
                <a
                  className="font-semibold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
                  href={`#${fieldTargetId(fieldName)}`}
                >
                  {fieldLabels[fieldName]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === "submission_error" ? (
        <div
          ref={feedbackRef}
          className="rounded-sm border-l-4 border-accent bg-accent-soft p-4 text-sm leading-6 text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          role="alert"
          tabIndex={-1}
        >
          <h2 className="font-display text-lg font-black text-brand-deep">
            Request not confirmed
          </h2>
          <p className="mt-1">
            {state.formError} Call{" "}
            <a
              className="font-bold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
              href={site.phoneHref}
            >
              {site.phone}
            </a>
            .
          </p>
        </div>
      ) : null}

      {state.status === "success" ? (
        <div
          ref={feedbackRef}
          className="rounded-sm border-l-4 border-brand bg-surface-muted p-4 text-sm leading-6 text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          role="status"
          tabIndex={-1}
        >
          <h2 className="font-display text-lg font-black text-brand-deep">
            Your request was received
          </h2>
          <p className="mt-1">
            Thank you. We’ll use the contact details you provided to follow up
            about the project.
          </p>
        </div>
      ) : null}

      <fieldset
        className="space-y-5"
        disabled={isPending}
        key={`contact-${state.attempt}`}
      >
        <legend className="font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
          Contact details
        </legend>
        <p className="text-sm leading-6 text-ink-muted">
          We need a name and phone number so we can follow up. Email is optional.
        </p>

        <div>
          <label className="text-sm font-bold text-brand-deep" htmlFor="fullName">
            Full name
          </label>
          <input
            aria-describedby={fieldDescriptionIds(
              "fullName",
              false,
              Boolean(visibleFieldErrors.fullName),
            )}
            aria-invalid={Boolean(visibleFieldErrors.fullName)}
            autoComplete="name"
            className={`${inputStyles} mt-2`}
            defaultValue={state.values.fullName}
            id="fullName"
            maxLength={100}
            name="fullName"
            onChange={handleFieldChange}
            required
            type="text"
          />
          {visibleFieldErrors.fullName ? (
            <p className="mt-2 text-sm font-semibold text-accent-deep" id="fullName-error">
              {visibleFieldErrors.fullName}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-brand-deep" htmlFor="phone">
              Phone number
            </label>
            <input
              aria-describedby={fieldDescriptionIds(
                "phone",
                true,
                Boolean(visibleFieldErrors.phone),
              )}
              aria-invalid={Boolean(visibleFieldErrors.phone)}
              autoComplete="tel"
              className={`${inputStyles} mt-2`}
              defaultValue={state.values.phone}
              id="phone"
              inputMode="tel"
              maxLength={30}
              name="phone"
              onChange={handleFieldChange}
              required
              type="tel"
            />
            <p className="mt-2 text-xs leading-5 text-ink-muted" id="phone-hint">
              Use a 10-digit U.S. phone number.
            </p>
            {visibleFieldErrors.phone ? (
              <p className="mt-2 text-sm font-semibold text-accent-deep" id="phone-error">
                {visibleFieldErrors.phone}
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-bold text-brand-deep" htmlFor="email">
              Email address <span className="font-medium text-ink-muted">(optional)</span>
            </label>
            <input
              aria-describedby={fieldDescriptionIds(
                "email",
                false,
                Boolean(visibleFieldErrors.email),
              )}
              aria-invalid={Boolean(visibleFieldErrors.email)}
              autoComplete="email"
              className={`${inputStyles} mt-2`}
              defaultValue={state.values.email}
              id="email"
              inputMode="email"
              maxLength={254}
              name="email"
              onChange={handleFieldChange}
              type="email"
            />
            {visibleFieldErrors.email ? (
              <p className="mt-2 text-sm font-semibold text-accent-deep" id="email-error">
                {visibleFieldErrors.email}
              </p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
        key={`honeypot-${state.attempt}`}
      >
        <label htmlFor="website">Website</label>
        <input
          autoComplete="off"
          id="website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <fieldset
        className="space-y-5"
        disabled={isPending}
        key={`project-${state.attempt}`}
      >
        <legend className="font-display text-2xl font-black tracking-[-0.03em] text-brand-deep">
          Project details
        </legend>
        <p className="text-sm leading-6 text-ink-muted">
          Tell us what kind of work you need and where it is located.
        </p>

        <div
          className={`audience-switcher rounded-md border bg-white p-4 sm:p-5 ${
            visibleFieldErrors.audience
              ? "border-accent-deep bg-accent-soft/20"
              : "border-line"
          }`}
        >
          <fieldset disabled={isPending}>
            <legend className="text-base font-black text-brand-deep">
              What type of project is this?
            </legend>
            <p className="mt-2 text-sm leading-6 text-ink-muted" id="audience-hint">
              Choose the option that best describes who the work is for. Only
              the follow-up field for that project type is required.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {requestAudienceOptions.map((option, index) => (
                <label
                  className="flex min-h-16 cursor-pointer items-start gap-3 rounded-sm border border-line-strong bg-canvas p-3.5 transition-colors hover:border-brand/55 has-checked:border-brand has-checked:bg-surface-muted"
                  htmlFor={`audience-${option.id}`}
                  key={option.id}
                >
                  <input
                    aria-describedby={fieldDescriptionIds(
                      "audience",
                      true,
                      Boolean(visibleFieldErrors.audience),
                    )}
                    className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
                    defaultChecked={state.values.audience === option.id}
                    id={`audience-${option.id}`}
                    name="audience"
                    onChange={handleFieldChange}
                    required={index === 0}
                    type="radio"
                    value={option.id}
                  />
                  <span>
                    <span className="block text-sm font-extrabold text-brand-deep">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-ink-muted">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {visibleFieldErrors.audience ? (
              <p
                className="mt-3 text-sm font-semibold text-accent-deep"
                id="audience-error"
              >
                {visibleFieldErrors.audience}
              </p>
            ) : null}
          </fieldset>

          <div className="audience-path audience-residential-path mt-5 border-t border-line pt-5">
            <h3 className="font-display text-lg font-black text-brand-deep">
              For residential requests
            </h3>
            <div className="mt-4">
              <label
                className="text-sm font-bold text-brand-deep"
                htmlFor="residentialRelationship"
              >
                What is your relationship to the property?
              </label>
              <select
                aria-describedby={fieldDescriptionIds(
                  "residentialRelationship",
                  false,
                  Boolean(visibleFieldErrors.residentialRelationship),
                )}
                aria-invalid={Boolean(
                  visibleFieldErrors.residentialRelationship,
                )}
                className={`${inputStyles} mt-2`}
                defaultValue={state.values.residentialRelationship}
                id="residentialRelationship"
                name="residentialRelationship"
                onChange={handleFieldChange}
                required
              >
                <option value="">Choose your relationship</option>
                {residentialRelationshipOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {visibleFieldErrors.residentialRelationship ? (
                <p
                  className="mt-2 text-sm font-semibold text-accent-deep"
                  id="residentialRelationship-error"
                >
                  {visibleFieldErrors.residentialRelationship}
                </p>
              ) : null}
            </div>
          </div>

          <div className="audience-path audience-organization-path mt-5 border-t border-line pt-5">
            <h3 className="font-display text-lg font-black text-brand-deep">
              For business and project partners
            </h3>
            <div className="mt-4">
              <label
                className="text-sm font-bold text-brand-deep"
                htmlFor="organizationName"
              >
                Company or organization name
              </label>
              <input
                aria-describedby={fieldDescriptionIds(
                  "organizationName",
                  false,
                  Boolean(visibleFieldErrors.organizationName),
                )}
                aria-invalid={Boolean(visibleFieldErrors.organizationName)}
                autoComplete="organization"
                className={`${inputStyles} mt-2`}
                defaultValue={state.values.organizationName}
                id="organizationName"
                maxLength={150}
                name="organizationName"
                onChange={handleFieldChange}
                required
                type="text"
              />
              {visibleFieldErrors.organizationName ? (
                <p
                  className="mt-2 text-sm font-semibold text-accent-deep"
                  id="organizationName-error"
                >
                  {visibleFieldErrors.organizationName}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-brand-deep" htmlFor="service">
            What can we help with?
          </label>
          <select
            aria-describedby={fieldDescriptionIds(
              "service",
              false,
              Boolean(visibleFieldErrors.service),
            )}
            aria-invalid={Boolean(visibleFieldErrors.service)}
            className={`${inputStyles} mt-2`}
            defaultValue={state.values.service}
            id="service"
            name="service"
            onChange={handleFieldChange}
            required
          >
            <option value="">Choose a service</option>
            {requestServiceOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {visibleFieldErrors.service ? (
            <p className="mt-2 text-sm font-semibold text-accent-deep" id="service-error">
              {visibleFieldErrors.service}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <div>
            <label className="text-sm font-bold text-brand-deep" htmlFor="city">
              Project city
            </label>
            <input
              aria-describedby={fieldDescriptionIds(
                "city",
                false,
                Boolean(visibleFieldErrors.city),
              )}
              aria-invalid={Boolean(visibleFieldErrors.city)}
              autoComplete="address-level2"
              className={`${inputStyles} mt-2`}
              defaultValue={state.values.city}
              id="city"
              maxLength={100}
              name="city"
              onChange={handleFieldChange}
              required
              type="text"
            />
            {visibleFieldErrors.city ? (
              <p className="mt-2 text-sm font-semibold text-accent-deep" id="city-error">
                {visibleFieldErrors.city}
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-bold text-brand-deep" htmlFor="postalCode">
              ZIP code
            </label>
            <input
              aria-describedby={fieldDescriptionIds(
                "postalCode",
                false,
                Boolean(visibleFieldErrors.postalCode),
              )}
              aria-invalid={Boolean(visibleFieldErrors.postalCode)}
              autoComplete="postal-code"
              className={`${inputStyles} mt-2`}
              defaultValue={state.values.postalCode}
              id="postalCode"
              inputMode="numeric"
              maxLength={5}
              name="postalCode"
              onChange={handleFieldChange}
              required
              type="text"
            />
            {visibleFieldErrors.postalCode ? (
              <p
                className="mt-2 text-sm font-semibold text-accent-deep"
                id="postalCode-error"
              >
                {visibleFieldErrors.postalCode}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            className="text-sm font-bold text-brand-deep"
            htmlFor="projectDetails"
          >
            Briefly describe the issue or project{" "}
            <span className="font-medium text-ink-muted">(optional)</span>
          </label>
          <textarea
            aria-describedby={fieldDescriptionIds(
              "projectDetails",
              true,
              Boolean(visibleFieldErrors.projectDetails),
            )}
            aria-invalid={Boolean(visibleFieldErrors.projectDetails)}
            className={`${inputStyles} mt-2 min-h-32 resize-y`}
            defaultValue={state.values.projectDetails}
            id="projectDetails"
            maxLength={1000}
            name="projectDetails"
            onChange={handleFieldChange}
            rows={4}
          />
          <p className="mt-2 text-xs leading-5 text-ink-muted" id="projectDetails-hint">
            Include anything that will help us understand the work. Do not add
            sensitive information.
          </p>
          {visibleFieldErrors.projectDetails ? (
            <p
              className="mt-2 text-sm font-semibold text-accent-deep"
              id="projectDetails-error"
            >
              {visibleFieldErrors.projectDetails}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="text-sm font-bold text-brand-deep"
            htmlFor="referralSource"
          >
            How did you hear about us?
          </label>
          <select
            aria-describedby={fieldDescriptionIds(
              "referralSource",
              false,
              Boolean(visibleFieldErrors.referralSource),
            )}
            aria-invalid={Boolean(visibleFieldErrors.referralSource)}
            className={`${inputStyles} mt-2`}
            defaultValue={state.values.referralSource}
            id="referralSource"
            name="referralSource"
            onChange={handleFieldChange}
            required
          >
            <option value="">Choose one</option>
            {referralSourceOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {visibleFieldErrors.referralSource ? (
            <p
              className="mt-2 text-sm font-semibold text-accent-deep"
              id="referralSource-error"
            >
              {visibleFieldErrors.referralSource}
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="border-t border-line pt-6">
        <button
          className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-sm border border-accent bg-accent px-6 py-3.5 text-base font-extrabold text-white shadow-control transition-colors hover:border-accent-strong hover:bg-accent-strong focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-wait disabled:border-ink-subtle disabled:bg-ink-subtle sm:w-auto"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Sending…" : "Send service request"}
        </button>
        <p className="mt-3 text-xs leading-5 text-ink-muted">
          By sending this request, you’re asking {site.name} to contact you about
          this project.
        </p>
      </div>
    </form>
  );
}
