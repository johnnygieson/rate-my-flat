import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMoney(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function avg(reviews: Review[], key: keyof Review) {
  const vals = reviews.map((r) => r[key] as number).filter(Number.isFinite);
  if (!vals.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function countSignal(
  reviews: Review[],
  key: keyof Review
): { yes: number; total: number } {
  const answered = reviews.filter(
    (r) => r[key] !== null && r[key] !== undefined
  );
  const yes = answered.filter((r) => r[key] === true);
  return { yes: yes.length, total: answered.length };
}

// ── Types ──────────────────────────────────────────────────────────────────────

type Flat = {
  id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
};

type Review = {
  id: string;
  created_at: string;
  anonymous_name: string;
  monthly_rent_gbp: number;
  deposit_gbp: number | null;
  bills_included: boolean | null;
  monthly_bills_gbp: number | null;
  tenancy_start: string;
  tenancy_end: string | null;
  letting_type: "agency" | "private" | "unknown" | null;
  letting_agency_name: string | null;
  overall_rating: number;
  landlord_rating: number;
  value_rating: number;
  condition_rating: number;
  has_damp_mold: boolean | null;
  has_reliable_hot_water: boolean | null;
  has_noise_issues: boolean | null;
  has_pest_issues: boolean | null;
  deposit_returned_in_full: boolean | null;
  landlord_responsive: boolean | null;
  bills_higher_than_expected: boolean | null;
  pros: string | null;
  cons: string | null;
  review_text: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const RATING_LABELS: { key: keyof Review; label: string }[] = [
  { key: "overall_rating", label: "Overall" },
  { key: "landlord_rating", label: "Landlord" },
  { key: "value_rating", label: "Value" },
  { key: "condition_rating", label: "Condition" },
];

const BAD_SIGNALS: { key: keyof Review; label: string }[] = [
  { key: "has_damp_mold", label: "Damp / mould" },
  { key: "has_noise_issues", label: "Noise issues" },
  { key: "has_pest_issues", label: "Pest issues" },
  { key: "bills_higher_than_expected", label: "Bills high" },
];

const GOOD_SIGNALS: { key: keyof Review; label: string }[] = [
  { key: "has_reliable_hot_water", label: "Reliable hot water" },
  { key: "deposit_returned_in_full", label: "Deposit returned" },
  { key: "landlord_responsive", label: "Responsive landlord" },
];

const SIGNAL_SUMMARY: {
  key: keyof Review;
  label: string;
  bad: boolean;
}[] = [
  { key: "has_damp_mold", label: "reported damp or mould", bad: true },
  { key: "has_noise_issues", label: "reported noise issues", bad: true },
  { key: "has_pest_issues", label: "reported pests", bad: true },
  {
    key: "bills_higher_than_expected",
    label: "found bills higher than expected",
    bad: true,
  },
  { key: "has_reliable_hot_water", label: "had reliable hot water", bad: false },
  {
    key: "deposit_returned_in_full",
    label: "got their deposit back in full",
    bad: false,
  },
  {
    key: "landlord_responsive",
    label: "found the landlord / agency responsive",
    bad: false,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function RatingChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex flex-col items-center rounded-lg bg-brand-green-50 px-2.5 py-1.5 text-center">
      <span className="text-xs text-brand-green-700 font-medium leading-tight">
        {label}
      </span>
      <span className="text-sm font-bold text-ink-900">{value}/5</span>
    </span>
  );
}

function SignalChips({ review }: { review: Review }) {
  const bad = BAD_SIGNALS.filter((s) => review[s.key] === true);
  const good = GOOD_SIGNALS.filter((s) => review[s.key] === true);
  if (!bad.length && !good.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {bad.map((s) => (
        <span
          key={s.key as string}
          className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
        >
          {s.label}
        </span>
      ))}
      {good.map((s) => (
        <span
          key={s.key as string}
          className="inline-flex items-center rounded-full bg-brand-green-50 px-2.5 py-0.5 text-xs font-medium text-brand-green-700"
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const tenancyEnd = review.tenancy_end
    ? formatMonthYear(review.tenancy_end)
    : "present";

  const letBy =
    review.letting_type === "agency"
      ? review.letting_agency_name ?? "Letting agency"
      : review.letting_type === "private"
      ? "Private landlord"
      : null;

  return (
    <article className="rounded-xl border border-ink-200 bg-white p-6 space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-semibold text-ink-900">{review.anonymous_name}</span>
        <span className="text-sm text-ink-400">{formatDate(review.created_at)}</span>
      </div>

      {/* Rating chips */}
      <div className="flex flex-wrap gap-2">
        <RatingChip label="Overall" value={review.overall_rating} />
        <RatingChip label="Landlord" value={review.landlord_rating} />
        <RatingChip label="Value" value={review.value_rating} />
        <RatingChip label="Condition" value={review.condition_rating} />
      </div>

      {/* Signal chips */}
      <SignalChips review={review} />

      {/* Tenancy meta */}
      <div className="text-sm text-ink-600 space-y-0.5">
        <p>
          {formatMoney(review.monthly_rent_gbp)}/mo
          {review.bills_included === true && (
            <span className="text-ink-400"> (bills included)</span>
          )}
          {review.bills_included === false && review.monthly_bills_gbp && (
            <span className="text-ink-400">
              {" "}+ {formatMoney(review.monthly_bills_gbp)}/mo bills
            </span>
          )}
        </p>
        {review.deposit_gbp !== null && (
          <p>Deposit: {formatMoney(review.deposit_gbp)}</p>
        )}
        <p>
          {formatMonthYear(review.tenancy_start)} — {tenancyEnd}
        </p>
        {letBy && <p className="text-ink-400">Let by: {letBy}</p>}
      </div>

      {/* Pros / Cons */}
      {review.pros && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">
            Pros
          </span>
          <p className="mt-1 text-sm text-ink-700 whitespace-pre-line">
            {review.pros}
          </p>
        </div>
      )}
      {review.cons && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
            Cons
          </span>
          <p className="mt-1 text-sm text-ink-700 whitespace-pre-line">
            {review.cons}
          </p>
        </div>
      )}

      {/* Review text */}
      <p className="text-sm text-ink-800 whitespace-pre-line">{review.review_text}</p>
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function FlatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: flat, error: flatError }, { data: reviews, error: reviewsError }] =
    await Promise.all([
      supabase.from("flats").select("*").eq("id", id).single(),
      supabase
        .from("reviews")
        .select("*")
        .eq("flat_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (flatError || !flat) notFound();

  const typedFlat = flat as Flat;
  const typedReviews: Review[] = (reviewsError ? [] : reviews) ?? [];

  const addressParts = [
    typedFlat.address_line_1,
    typedFlat.address_line_2,
    typedFlat.city,
    typedFlat.postcode,
  ].filter(Boolean);

  const reviewCount = typedReviews.length;

  const ratingAverages =
    reviewCount > 0
      ? RATING_LABELS.map(({ key, label }) => ({
          label,
          value: avg(typedReviews, key),
        }))
      : [];

  // Signal summary for the stats panel
  const signalSummary = SIGNAL_SUMMARY.map((s) => ({
    ...s,
    ...countSignal(typedReviews, s.key),
  })).filter((s) => s.total > 0);

  return (
    <main className="bg-bg py-10 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Back */}
        <a
          href="/"
          className="text-sm font-medium text-brand-green-600 hover:text-brand-green-700 transition-colors motion-reduce:transition-none"
        >
          ← Back
        </a>

        {/* Address */}
        <div>
          <h1 className="text-3xl font-bold text-ink-900 leading-snug">
            {addressParts.join(", ")}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </p>
        </div>

        {reviewCount > 0 && (
          <>
            {/* Average ratings */}
            <section className="rounded-xl border border-ink-200 bg-white p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 mb-4">
                  Average ratings
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {ratingAverages.map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <span className="text-2xl font-bold text-brand-green-600">
                        {value}
                      </span>
                      <span className="text-xs text-ink-500 mt-1 leading-tight">
                        {label}
                      </span>
                      <span className="text-xs text-ink-400">/ 5</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tenant signals panel */}
              {signalSummary.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 mb-3">
                    Tenant signals
                  </h2>
                  <ul className="space-y-1.5">
                    {signalSummary.map((s) => {
                      const isWarning = s.bad && s.yes > 0;
                      const isGood = !s.bad && s.yes === s.total && s.total > 0;
                      return (
                        <li
                          key={s.key as string}
                          className={`flex items-center gap-2 text-sm ${
                            isWarning
                              ? "text-red-600"
                              : isGood
                              ? "text-brand-green-700"
                              : "text-ink-600"
                          }`}
                        >
                          <span className="font-semibold tabular-nums">
                            {s.yes}/{s.total}
                          </span>
                          <span>{s.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          </>
        )}

        {/* CTA */}
        <a
          href="/submit"
          className="block w-full rounded-lg bg-brand-green-600 px-6 py-3 text-center text-white font-semibold hover:bg-brand-green-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:ring-offset-2"
        >
          Leave a review for this flat
        </a>

        {/* Reviews */}
        <section className="space-y-4">
          {reviewCount === 0 ? (
            <p className="text-center text-ink-400 py-12">
              Be the first to review this flat.
            </p>
          ) : (
            typedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
