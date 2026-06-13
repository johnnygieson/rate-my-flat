"use client";

import { Fragment, useState } from "react";
import { useForm, Controller, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Check } from "lucide-react";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import { submitReview } from "./actions";

// ── Progress bar ──────────────────────────────────────────────────────────────

const STEP_LABELS = ["The flat", "Your tenancy", "Your review"] as const;

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-start mb-10" aria-label="Form progress">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = step > n;
        const active = step === n;
        return (
          <Fragment key={n}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                aria-current={active ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ring-2 transition-colors motion-reduce:transition-none ${
                  done
                    ? "bg-brand-green-600 text-white ring-brand-green-600"
                    : active
                    ? "bg-white text-brand-green-600 ring-brand-green-600"
                    : "bg-white text-ink-400 ring-ink-200"
                }`}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : n}
              </div>
              <span
                className={`text-xs font-medium leading-none ${
                  step >= n ? "text-ink-800" : "text-ink-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`h-px flex-1 mt-4 mx-2 transition-colors motion-reduce:transition-none ${
                  step > n ? "bg-brand-green-500" : "bg-ink-200"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

// ── Star rating ────────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  label,
  error,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  error?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div>
      <p className="text-sm font-medium text-ink-800 mb-2.5">{label}</p>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
            tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                onChange(Math.min(5, (value || 0) + 1));
              } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                onChange(Math.max(1, value - 1 || 1));
              } else if ("12345".includes(e.key)) {
                onChange(parseInt(e.key));
              }
            }}
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 focus-visible:ring-offset-1"
          >
            <Star
              className={`size-9 transition-colors motion-reduce:transition-none ${
                n <= display
                  ? "fill-accent text-accent"
                  : "fill-ink-100 text-ink-200"
              }`}
            />
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Yes / No toggle ───────────────────────────────────────────────────────────

function YesNoToggle({
  question,
  helper,
  value,
  onChange,
  positiveIsGood = true,
}: {
  question: string;
  helper?: string;
  value: boolean | null | undefined;
  onChange: (v: boolean | null) => void;
  positiveIsGood?: boolean;
}) {
  const yesSelected = value === true;
  const noSelected = value === false;

  const yesActive = positiveIsGood
    ? "bg-brand-green-100 border-brand-green-500 text-brand-green-700 font-semibold"
    : "bg-red-100 border-red-400 text-red-700 font-semibold";
  const noActive = positiveIsGood
    ? "bg-red-100 border-red-400 text-red-700 font-semibold"
    : "bg-brand-green-100 border-brand-green-500 text-brand-green-700 font-semibold";
  const inactive =
    "bg-white border-ink-200 text-ink-600 hover:bg-ink-50 font-medium";

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-ink-800">{question}</p>
      {helper && <p className="text-xs text-ink-400">{helper}</p>}
      <div className="flex w-fit overflow-hidden rounded-lg border border-ink-200">
        <button
          type="button"
          onClick={() => onChange(yesSelected ? null : true)}
          className={`px-6 py-2.5 text-sm border-r border-ink-200 transition-colors motion-reduce:transition-none ${
            yesSelected ? yesActive : inactive
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(noSelected ? null : false)}
          className={`px-6 py-2.5 text-sm transition-colors motion-reduce:transition-none ${
            noSelected ? noActive : inactive
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ── Shared field primitives ───────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-ink-300 px-3 py-2.5 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-green-500 focus:ring-1 focus:ring-brand-green-500 focus-visible:ring-2 focus-visible:ring-brand-green-500 bg-white";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-700 mb-1">
      {children}
      {optional && <span className="ml-1 text-ink-400 font-normal">(optional)</span>}
    </label>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-ink-200 p-4 sm:p-6 space-y-5">
      <h2 className="text-base font-semibold text-ink-900 border-b border-ink-100 pb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Nav buttons ───────────────────────────────────────────────────────────────

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  pending = false,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  pending?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-2"
        >
          ← Back
        </button>
      )}
      <button
        type={onNext ? "button" : "submit"}
        onClick={onNext}
        disabled={pending}
        className="flex-1 rounded-lg bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:ring-offset-2"
      >
        {pending ? "Submitting…" : nextLabel}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SubmitForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      address_line_1: "",
      address_line_2: "",
      city: "",
      postcode: "",
      monthly_rent_gbp: undefined,
      deposit_gbp: null,
      tenancy_start: "",
      tenancy_end: "",
      bills_included: null,
      monthly_bills_gbp: null,
      bills_higher_than_expected: null,
      letting_type: undefined,
      letting_agency_name: "",
      overall_rating: 0,
      landlord_rating: 0,
      value_rating: 0,
      condition_rating: 0,
      has_damp_mold: null,
      has_reliable_hot_water: null,
      has_noise_issues: null,
      has_pest_issues: null,
      deposit_returned_in_full: null,
      landlord_responsive: null,
      pros: "",
      cons: "",
      review_text: "",
    },
  });

  const billsIncluded = watch("bills_included");
  const lettingType = watch("letting_type");
  const tenancyEnd = watch("tenancy_end");

  const goTo2 = async () => {
    const ok = await trigger([
      "address_line_1",
      "city",
      "postcode",
    ] as FieldPath<ReviewInput>[]);
    if (ok) { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const goTo3 = async () => {
    const fields: FieldPath<ReviewInput>[] = [
      "monthly_rent_gbp",
      "tenancy_start",
      "letting_type",
    ];
    if (lettingType === "agency") {
      const name = watch("letting_agency_name");
      if (!name?.trim()) {
        setError("letting_agency_name", { message: "Agency name is required" });
        return;
      }
    }
    const ok = await trigger(fields);
    if (ok) { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const onSubmit = async (data: ReviewInput) => {
    setPending(true);
    setFormError(null);
    const result = await submitReview(data);
    if (result?.errors?._form) {
      setFormError(result.errors._form[0]);
      setPending(false);
    }
  };

  return (
    <main className="bg-bg px-4 py-10">
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
          <p className="mt-1 text-sm text-ink-500">
            Anonymous. Honest. Useful.
          </p>
        </div>

        <ProgressBar step={step} />

        {formError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

          {/* ── Step 1: The flat ────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <SectionCard title="The flat">
                <div>
                  <Label htmlFor="address_line_1">Address line 1</Label>
                  <input
                    id="address_line_1"
                    {...register("address_line_1")}
                    className={inputCls}
                    placeholder="e.g. 42 Elm Street"
                  />
                  <FieldError msg={errors.address_line_1?.message} />
                </div>
                <div>
                  <Label htmlFor="address_line_2" optional>
                    Address line 2
                  </Label>
                  <input
                    id="address_line_2"
                    {...register("address_line_2")}
                    className={inputCls}
                    placeholder="Flat number, building name…"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <input
                    id="city"
                    {...register("city")}
                    className={inputCls}
                    placeholder="e.g. Manchester"
                  />
                  <FieldError msg={errors.city?.message} />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <input
                    id="postcode"
                    {...register("postcode")}
                    className={inputCls}
                    placeholder="e.g. M1 1AE"
                  />
                  <FieldError msg={errors.postcode?.message} />
                </div>
              </SectionCard>

              <NavButtons nextLabel="Next →" onNext={goTo2} />
            </>
          )}

          {/* ── Step 2: Your tenancy ────────────────────────────────────── */}
          {step === 2 && (
            <>
              <SectionCard title="Your tenancy">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly_rent_gbp">Monthly rent (£)</Label>
                    <Controller
                      name="monthly_rent_gbp"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="monthly_rent_gbp"
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                          className={inputCls}
                          placeholder="950"
                        />
                      )}
                    />
                    <FieldError msg={errors.monthly_rent_gbp?.message} />
                  </div>
                  <div>
                    <Label htmlFor="deposit_gbp" optional>
                      Deposit (£)
                    </Label>
                    <Controller
                      name="deposit_gbp"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="deposit_gbp"
                          type="number"
                          min={0}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? null : Number(e.target.value)
                            )
                          }
                          className={inputCls}
                          placeholder="1425"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenancy_start">Tenancy start</Label>
                    <input
                      id="tenancy_start"
                      type="date"
                      {...register("tenancy_start")}
                      className={inputCls}
                    />
                    <FieldError msg={errors.tenancy_start?.message} />
                  </div>
                  <div>
                    <Label htmlFor="tenancy_end" optional>
                      Tenancy end
                    </Label>
                    <input
                      id="tenancy_end"
                      type="date"
                      {...register("tenancy_end")}
                      className={inputCls}
                    />
                    <p className="mt-1 text-xs text-ink-400">
                      Leave blank if you still live here
                    </p>
                  </div>
                </div>

                {/* Bills included */}
                <Controller
                  name="bills_included"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Were bills included in the rent?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={true}
                    />
                  )}
                />

                {/* Conditional: bills not included */}
                {billsIncluded === false && (
                  <>
                    <div>
                      <Label htmlFor="monthly_bills_gbp" optional>
                        Typical monthly bills (£)
                      </Label>
                      <Controller
                        name="monthly_bills_gbp"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="monthly_bills_gbp"
                            type="number"
                            min={0}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === "" ? null : Number(e.target.value)
                              )
                            }
                            className={inputCls}
                            placeholder="120"
                          />
                        )}
                      />
                      <p className="mt-1 text-xs text-ink-400">
                        Gas, electricity, water — roughly how much a month?
                      </p>
                    </div>
                    <Controller
                      name="bills_higher_than_expected"
                      control={control}
                      render={({ field }) => (
                        <YesNoToggle
                          question="Were bills higher than you expected?"
                          helper="Old boiler, poor insulation, drafts — anything that pushed bills up?"
                          value={field.value}
                          onChange={field.onChange}
                          positiveIsGood={false}
                        />
                      )}
                    />
                  </>
                )}
              </SectionCard>

              <SectionCard title="Who let the property?">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink-700">Let by</p>
                  <Controller
                    name="letting_type"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            { value: "agency", label: "Letting agency" },
                            { value: "private", label: "Private landlord" },
                            { value: "unknown", label: "Don't know" },
                          ] as const
                        ).map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => field.onChange(value)}
                            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 focus-visible:ring-offset-1 ${
                              field.value === value
                                ? "bg-brand-green-600 border-brand-green-600 text-white"
                                : "bg-white border-ink-300 text-ink-700 hover:border-brand-green-400"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                  <FieldError msg={errors.letting_type?.message} />
                </div>

                {/* Conditional: agency name */}
                {lettingType === "agency" && (
                  <div>
                    <Label htmlFor="letting_agency_name">Agency name</Label>
                    <input
                      id="letting_agency_name"
                      {...register("letting_agency_name")}
                      className={inputCls}
                      placeholder="e.g. Foxtons, Purple Bricks…"
                    />
                    <FieldError msg={errors.letting_agency_name?.message} />
                  </div>
                )}
              </SectionCard>

              <NavButtons
                onBack={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onNext={goTo3}
                nextLabel="Next →"
              />
            </>
          )}

          {/* ── Step 3: Your review ─────────────────────────────────────── */}
          {step === 3 && (
            <>
              <SectionCard title="Your ratings">
                <Controller
                  name="overall_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      label="Overall experience"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.overall_rating?.message}
                    />
                  )}
                />
                <Controller
                  name="landlord_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      label="Landlord / letting agent"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.landlord_rating?.message}
                    />
                  )}
                />
                <Controller
                  name="value_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      label="Value for money"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.value_rating?.message}
                    />
                  )}
                />
                <Controller
                  name="condition_rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      label="Condition of the property"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.condition_rating?.message}
                    />
                  )}
                />
              </SectionCard>

              <SectionCard title="Quick questions">
                <p className="text-xs text-ink-400 -mt-2">
                  Optional — answer as many or as few as you like. Click again to unselect.
                </p>
                <Controller
                  name="has_damp_mold"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Was there damp, mould, or condensation?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={false}
                    />
                  )}
                />
                <Controller
                  name="has_reliable_hot_water"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Did the boiler / hot water work reliably?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={true}
                    />
                  )}
                />
                <Controller
                  name="has_noise_issues"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Significant noise from neighbours, traffic, or pubs?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={false}
                    />
                  )}
                />
                <Controller
                  name="has_pest_issues"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Any mice, bedbugs, or other pests?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={false}
                    />
                  )}
                />
                {tenancyEnd && (
                  <Controller
                    name="deposit_returned_in_full"
                    control={control}
                    render={({ field }) => (
                      <YesNoToggle
                        question="Was your deposit returned in full?"
                        value={field.value}
                        onChange={field.onChange}
                        positiveIsGood={true}
                      />
                    )}
                  />
                )}
                <Controller
                  name="landlord_responsive"
                  control={control}
                  render={({ field }) => (
                    <YesNoToggle
                      question="Was the landlord / agency responsive when you reported issues?"
                      value={field.value}
                      onChange={field.onChange}
                      positiveIsGood={true}
                    />
                  )}
                />
              </SectionCard>

              <SectionCard title="Your review">
                <div>
                  <Label htmlFor="review_text">
                    If a friend was about to view this flat, what would you tell them?
                  </Label>
                  <textarea
                    id="review_text"
                    {...register("review_text")}
                    rows={5}
                    className={`${inputCls} resize-y`}
                    placeholder="If a friend was about to view this flat, what would you tell them?"
                  />
                  <FieldError msg={errors.review_text?.message} />
                </div>
                <div>
                  <Label htmlFor="pros" optional>
                    Pros
                  </Label>
                  <textarea
                    id="pros"
                    {...register("pros")}
                    rows={3}
                    className={`${inputCls} resize-y`}
                    placeholder="What was a nice surprise? (e.g. natural light, the local pub, the upstairs neighbour who waters your plants)"
                  />
                </div>
                <div>
                  <Label htmlFor="cons" optional>
                    Cons
                  </Label>
                  <textarea
                    id="cons"
                    {...register("cons")}
                    rows={3}
                    className={`${inputCls} resize-y`}
                    placeholder="What did the listing not mention? (e.g. damp behind the bed, the boiler breaking three times, the upstairs piano hour)"
                  />
                </div>
              </SectionCard>

              <NavButtons
                onBack={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                nextLabel="Submit review"
                pending={pending}
              />
            </>
          )}
        </form>
      </div>
    </main>
  );
}
