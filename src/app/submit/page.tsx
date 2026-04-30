"use client";

import { useActionState } from "react";
import { submitReview, type FormState } from "./actions";

const ratingOptions = [1, 2, 3, 4, 5];

function RatingSelect({
  name,
  label,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 bg-white shadow-sm focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500 focus-visible:ring-2 focus-visible:ring-brand-green-500"
      >
        <option value="" disabled>
          Select…
        </option>
        {ratingOptions.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = true,
  placeholder,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  error?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-ink-400 font-normal">(optional)</span>
        )}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={type === "number" ? 0 : undefined}
        className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500 focus-visible:ring-2 focus-visible:ring-brand-green-500"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

function TextareaField({
  name,
  label,
  required = true,
  placeholder,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  error?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}{" "}
        {required ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-ink-400 font-normal">(optional)</span>
        )}
      </label>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={4}
        className="w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500 focus-visible:ring-2 focus-visible:ring-brand-green-500 resize-y"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

const initialState: FormState = {};

export default function SubmitPage() {
  const [state, action, pending] = useActionState(submitReview, initialState);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <main className="bg-bg px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-brand-green-600 hover:text-brand-green-700 transition-colors motion-reduce:transition-none"
          >
            ← Back
          </a>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
            Leave a review
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            All reviews are anonymous. Help others make informed decisions.
          </p>
        </div>

        {e._form && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {e._form[0]}
          </div>
        )}

        <form action={action} className="space-y-6">
          {/* About the flat */}
          <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
              About the flat
            </h2>
            <Field name="address_line_1" label="Address line 1" defaultValue={v.address_line_1} error={e.address_line_1} />
            <Field name="address_line_2" label="Address line 2" required={false} defaultValue={v.address_line_2} error={e.address_line_2} />
            <Field name="city" label="City" defaultValue={v.city} error={e.city} />
            <Field name="postcode" label="Postcode" placeholder="e.g. SW1A 1AA" defaultValue={v.postcode} error={e.postcode} />
          </section>

          {/* Your tenancy */}
          <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
              Your tenancy
            </h2>
            <Field name="monthly_rent_gbp" label="Monthly rent (£)" type="number" defaultValue={v.monthly_rent_gbp} error={e.monthly_rent_gbp} />
            <Field name="deposit_gbp" label="Deposit (£)" type="number" required={false} defaultValue={v.deposit_gbp} error={e.deposit_gbp} />
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="bills_included"
                  value="true"
                  defaultChecked={v.bills_included === "true"}
                  className="rounded border-ink-300 text-brand-green-600 focus:ring-brand-green-500"
                />
                Bills included in rent
              </label>
            </div>
            <Field name="tenancy_start" label="Tenancy start" type="date" defaultValue={v.tenancy_start} error={e.tenancy_start} />
            <Field name="tenancy_end" label="Tenancy end" type="date" required={false} defaultValue={v.tenancy_end} error={e.tenancy_end} />
          </section>

          {/* Your ratings */}
          <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
              Your ratings{" "}
              <span className="text-sm font-normal text-ink-400">(1 = poor, 5 = excellent)</span>
            </h2>
            <RatingSelect name="overall_rating" label="Overall" defaultValue={v.overall_rating} error={e.overall_rating} />
            <RatingSelect name="landlord_rating" label="Landlord / letting agent" defaultValue={v.landlord_rating} error={e.landlord_rating} />
            <RatingSelect name="value_rating" label="Value for money" defaultValue={v.value_rating} error={e.value_rating} />
            <RatingSelect name="condition_rating" label="Condition of the property" defaultValue={v.condition_rating} error={e.condition_rating} />
            <RatingSelect name="mold_rating" label="Cleanliness / damp (5 = spotless, 1 = serious mould)" defaultValue={v.mold_rating} error={e.mold_rating} />
            <RatingSelect name="noise_rating" label="Noise level (5 = peaceful, 1 = couldn't sleep)" defaultValue={v.noise_rating} error={e.noise_rating} />
          </section>

          {/* Your review */}
          <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
              Your review
            </h2>
            <TextareaField name="review_text" label="What was it really like?" placeholder="Tell future tenants what it was really like to live there…" defaultValue={v.review_text} error={e.review_text} />
            <TextareaField name="pros" label="Pros" required={false} placeholder="What did you love about it?" defaultValue={v.pros} error={e.pros} />
            <TextareaField name="cons" label="Cons" required={false} placeholder="What drove you mad?" defaultValue={v.cons} error={e.cons} />
          </section>

          {/* About you */}
          <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
              About you
            </h2>
            <Field name="anonymous_name" label="Your name / handle" placeholder="e.g. Ex-tenant, M. from Leeds" defaultValue={v.anonymous_name} error={e.anonymous_name} />
          </section>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-green-600 px-6 py-3.5 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:ring-offset-2"
          >
            {pending ? "Submitting…" : "Submit review"}
          </button>
        </form>
      </div>
    </main>
  );
}
