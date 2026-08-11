"use client";

import type { ChangeEvent, FocusEvent } from "react";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitRequestServiceAction } from "@/app/request-service/actions";
import { PhoneLink } from "@/components/ui/CtaLink";
import {
  getRequestServicePhotoMetadataError,
  requestAudienceOptions,
  initialRequestServiceSubmissionState,
  referralSourceOptions,
  requestServicePhotoLimits,
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
  photos: "Project photos",
};

const inputStyles =
  "min-h-12 w-full rounded-sm border border-line-strong bg-white px-3.5 py-2.5 text-base text-ink shadow-sm transition-colors placeholder:text-ink-subtle/75 hover:border-brand/55 focus:border-brand aria-invalid:border-accent-deep aria-invalid:bg-accent-soft/40 disabled:cursor-not-allowed disabled:bg-surface-muted";

function fieldDescriptionIds(
  fieldName: RequestServiceFieldName,
  hasHint: boolean,
  hasError: boolean,
  additionalIds: string[] = [],
) {
  return [
    hasHint ? `${fieldName}-hint` : null,
    hasError ? `${fieldName}-error` : null,
    ...additionalIds,
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
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formStartTrackedRef = useRef(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [restartedAfterAttempt, setRestartedAfterAttempt] = useState<
    number | null
  >(null);
  const [audienceSelection, setAudienceSelection] = useState({
    attempt: 0,
    value: "",
  });
  const [photoSelection, setPhotoSelection] = useState<{
    attempt: number;
    clearedByUser?: boolean;
    error?: string;
    hasFiles: boolean;
  }>({ attempt: 0, hasFiles: false });
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

  useEffect(() => {
    if (restartedAfterAttempt === state.attempt) {
      firstFieldRef.current?.focus();
    }
  }, [restartedAfterAttempt, state.attempt]);

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

    if (fieldName === "photos" && event.target instanceof HTMLInputElement) {
      const files = Array.from(event.target.files ?? []);
      setPhotoSelection({
        attempt: state.attempt,
        clearedByUser: false,
        error: getRequestServicePhotoMetadataError(files),
        hasFiles: files.length > 0,
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

  function handleRemovePhotos() {
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }

    setPhotoSelection({
      attempt: state.attempt,
      clearedByUser: true,
      hasFiles: false,
    });
    photoInputRef.current?.focus();
  }

  function handleStartAnotherRequest() {
    formStartTrackedRef.current = false;
    setRestartedAfterAttempt(state.attempt);
  }

  const selectedAudience =
    audienceSelection.attempt === state.attempt
      ? audienceSelection.value
      : state.values.audience;
  const photosWereReselected =
    photoSelection.attempt === state.attempt && photoSelection.hasFiles;
  const photosWereClearedByUser =
    photoSelection.attempt === state.attempt && photoSelection.clearedByUser;
  const clientPhotoError =
    photoSelection.attempt === state.attempt
      ? photoSelection.error
      : undefined;
  const showPhotoReselectionNotice =
    state.photosNeedReselection &&
    !photosWereReselected &&
    !photosWereClearedByUser;
  const visibleServerFieldErrors = Object.fromEntries(
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
  const visibleFieldErrors = {
    ...visibleServerFieldErrors,
    ...(clientPhotoError ? { photos: clientPhotoError } : {}),
  };
  const errorEntries = Object.entries(visibleFieldErrors) as [
    RequestServiceFieldName,
    string,
  ][];
  const showConfirmation =
    state.status === "success" && restartedAfterAttempt !== state.attempt;

  if (showConfirmation) {
    return (
      <div
        ref={feedbackRef}
        aria-labelledby="request-service-confirmation-heading"
        className="space-y-8 rounded-md border border-brand/20 bg-surface-muted p-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent sm:p-8"
        id="request-form"
        role="status"
        tabIndex={-1}
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-accent-deep">
            Request confirmed
          </p>
          <h2
            className="mt-3 font-display text-3xl font-black tracking-[-0.035em] text-brand-deep sm:text-4xl"
            id="request-service-confirmation-heading"
          >
            Your service request has been sent
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
            Thank you. Your request was accepted for delivery to {site.name}.
            You do not need to submit it again.
          </p>
        </div>

        <div className="border-t border-line pt-6">
          <h3 className="font-display text-xl font-black text-brand-deep">
            What happens next
          </h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            <li className="rounded-sm border border-line bg-white p-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                1
              </span>
              <p className="mt-3 font-extrabold text-brand-deep">
                We review the request
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                We’ll review the project location, service details, and any
                photos you provided.
              </p>
            </li>
            <li className="rounded-sm border border-line bg-white p-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                2
              </span>
              <p className="mt-3 font-extrabold text-brand-deep">
                We follow up with you
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                We’ll use the phone number or email you provided to discuss the
                work and the appropriate next step.
              </p>
            </li>
          </ol>
        </div>

        <div className="border-t border-line pt-6">
          <p className="text-sm leading-6 text-ink-muted">
            Need to add something or discuss the project now? Call {site.name} at{" "}
            <PhoneLink
              analyticsLocation="page_content"
              className="font-bold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
            >
              {site.phone}
            </PhoneLink>
            .
          </p>
          <button
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-sm border border-line-strong bg-white px-4 py-2 text-sm font-bold text-brand-deep transition-colors hover:border-brand hover:bg-surface focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
            onClick={handleStartAnotherRequest}
            type="button"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

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
          {showPhotoReselectionNotice ? (
            <p className="mt-3">
              Photo selections were cleared.{" "}
              <a
                className="font-semibold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
                href="#photos"
              >
                Choose them again
              </a>{" "}
              before resubmitting.
            </p>
          ) : null}
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
            <PhoneLink
              analyticsLocation="page_content"
              className="font-bold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
            >
              {site.phone}
            </PhoneLink>
            .
          </p>
          {showPhotoReselectionNotice ? (
            <p className="mt-2">
              Photo selections were cleared.{" "}
              <a
                className="font-semibold text-brand underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
                href="#photos"
              >
                Choose them again
              </a>{" "}
              before resubmitting.
            </p>
          ) : null}
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
            ref={firstFieldRef}
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
          <label className="text-sm font-bold text-brand-deep" htmlFor="photos">
            Project photos{" "}
            <span className="font-medium text-ink-muted">(optional)</span>
          </label>
          <input
            accept={requestServicePhotoLimits.acceptValue}
            aria-describedby={fieldDescriptionIds(
              "photos",
              true,
              Boolean(visibleFieldErrors.photos),
              showPhotoReselectionNotice ? ["photos-reset"] : [],
            )}
            aria-invalid={Boolean(visibleFieldErrors.photos)}
            className={`${inputStyles} mt-2 cursor-pointer py-2 file:mr-4 file:rounded-sm file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-brand-soft`}
            id="photos"
            key={`photos-${state.attempt}`}
            multiple
            name="photos"
            onChange={handleFieldChange}
            ref={photoInputRef}
            type="file"
          />
          {photosWereReselected ? (
            <button
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-sm border border-line-strong bg-white px-4 py-2 text-sm font-bold text-brand-deep transition-colors hover:border-brand hover:bg-surface-muted focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
              onClick={handleRemovePhotos}
              type="button"
            >
              Remove selected photos
            </button>
          ) : null}
          <div className="mt-2 space-y-1 text-xs leading-5 text-ink-muted" id="photos-hint">
            <p>Add up to 3 photos totaling 3 MB. Use JPG, PNG, or WebP.</p>
            <p>
              Upload project photos only—avoid IDs, account documents, or other
              sensitive information. Photos are handled only with this request
              and are not added to separate website storage.
            </p>
          </div>
          {showPhotoReselectionNotice ? (
            <p className="mt-2 text-sm font-semibold text-ink-muted" id="photos-reset">
              Your other entries were preserved. Photo selections were cleared;
              choose them again before resubmitting.
            </p>
          ) : null}
          {visibleFieldErrors.photos ? (
            <p
              className="mt-2 text-sm font-semibold text-accent-deep"
              id="photos-error"
              role={clientPhotoError ? "alert" : undefined}
            >
              {visibleFieldErrors.photos}
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
          disabled={isPending || Boolean(clientPhotoError)}
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
