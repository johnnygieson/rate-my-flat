import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
  bills_included: boolean;
  tenancy_start: string;
  tenancy_end: string | null;
  overall_rating: number;
  landlord_rating: number;
  value_rating: number;
  condition_rating: number;
  mold_rating: number;
  noise_rating: number;
  pros: string | null;
  cons: string | null;
  review_text: string;
};

const RATING_LABELS: { key: keyof Review; label: string }[] = [
  { key: "overall_rating", label: "Overall" },
  { key: "landlord_rating", label: "Landlord" },
  { key: "value_rating", label: "Value" },
  { key: "condition_rating", label: "Condition" },
  { key: "mold_rating", label: "Cleanliness" },
  { key: "noise_rating", label: "Noise" },
];

function RatingChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex flex-col items-center rounded-lg bg-brand-green-50 px-2.5 py-1.5 text-center">
      <span className="text-xs text-brand-green-700 font-medium leading-tight">{label}</span>
      <span className="text-sm font-bold text-ink-900">{value}/5</span>
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const tenancyEnd = review.tenancy_end
    ? formatMonthYear(review.tenancy_end)
    : "present";

  return (
    <article className="rounded-xl border border-ink-200 bg-white p-6 space-y-4">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-semibold text-ink-900">{review.anonymous_name}</span>
        <span className="text-sm text-ink-400">{formatDate(review.created_at)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <RatingChip label="Overall" value={review.overall_rating} />
        <RatingChip label="Landlord" value={review.landlord_rating} />
        <RatingChip label="Value" value={review.value_rating} />
        <RatingChip label="Condition" value={review.condition_rating} />
        <RatingChip label="Cleanliness" value={review.mold_rating} />
        <RatingChip label="Noise" value={review.noise_rating} />
      </div>

      <div className="text-sm text-ink-600 space-y-1">
        <p>
          {formatMoney(review.monthly_rent_gbp)}/mo{" "}
          <span className="text-ink-400">
            ({review.bills_included ? "bills included" : "bills not included"})
          </span>
        </p>
        {review.deposit_gbp !== null && (
          <p>Deposit: {formatMoney(review.deposit_gbp)}</p>
        )}
        <p>
          Lived here from {formatMonthYear(review.tenancy_start)} to {tenancyEnd}
        </p>
      </div>

      {review.pros && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">
            Pros
          </span>
          <p className="mt-1 text-sm text-ink-700 whitespace-pre-line">{review.pros}</p>
        </div>
      )}
      {review.cons && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-500">
            Cons
          </span>
          <p className="mt-1 text-sm text-ink-700 whitespace-pre-line">{review.cons}</p>
        </div>
      )}

      <p className="text-sm text-ink-800 whitespace-pre-line">{review.review_text}</p>
    </article>
  );
}

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

        {/* Average ratings */}
        {ratingAverages.length > 0 && (
          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 mb-5">
              Average ratings
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {ratingAverages.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-brand-green-600">{value}</span>
                  <span className="text-xs text-ink-500 mt-1 leading-tight">{label}</span>
                  <span className="text-xs text-ink-400">/ 5</span>
                </div>
              ))}
            </div>
          </section>
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
