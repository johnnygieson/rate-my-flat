import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Sub-components ────────────────────────────────────────────────────────────

function RatingChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex flex-col items-center rounded-md bg-indigo-50 px-2 py-1 text-center">
      <span className="text-xs text-indigo-500 font-medium leading-tight">{label}</span>
      <span className="text-sm font-bold text-indigo-800">{value}/5</span>
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const tenancyEnd = review.tenancy_end
    ? formatMonthYear(review.tenancy_end)
    : "present";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-semibold text-gray-900">{review.anonymous_name}</span>
        <span className="text-sm text-gray-400">{formatDate(review.created_at)}</span>
      </div>

      {/* Rating chips */}
      <div className="flex flex-wrap gap-2">
        <RatingChip label="Overall" value={review.overall_rating} />
        <RatingChip label="Landlord" value={review.landlord_rating} />
        <RatingChip label="Value" value={review.value_rating} />
        <RatingChip label="Condition" value={review.condition_rating} />
        <RatingChip label="Cleanliness" value={review.mold_rating} />
        <RatingChip label="Noise" value={review.noise_rating} />
      </div>

      {/* Tenancy meta */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          {formatMoney(review.monthly_rent_gbp)}/mo&nbsp;
          <span className="text-gray-400">
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

      {/* Pros / Cons */}
      {review.pros && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600">Pros</span>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{review.pros}</p>
        </div>
      )}
      {review.cons && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-500">Cons</span>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{review.cons}</p>
        </div>
      )}

      {/* Review text */}
      <div>
        <p className="text-sm text-gray-800 whitespace-pre-line">{review.review_text}</p>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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
  const reviewLabel = `${reviewCount} review${reviewCount === 1 ? "" : "s"}`;

  const ratingAverages = reviewCount > 0
    ? [
        { label: "Overall", value: avg(typedReviews, "overall_rating") },
        { label: "Landlord", value: avg(typedReviews, "landlord_rating") },
        { label: "Value", value: avg(typedReviews, "value_rating") },
        { label: "Condition", value: avg(typedReviews, "condition_rating") },
        { label: "Cleanliness / damp", value: avg(typedReviews, "mold_rating") },
        { label: "Noise", value: avg(typedReviews, "noise_rating") },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
          ← Rate My Flat
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
            BETA
          </span>
        </a>

        {/* Address header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {addressParts.join(", ")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{reviewLabel}</p>
        </div>

        {/* Average ratings */}
        {ratingAverages.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
              Average ratings
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {ratingAverages.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-indigo-700">{value}</span>
                  <span className="text-xs text-gray-500 mt-1 leading-tight">{label}</span>
                  <span className="text-xs text-gray-400">/ 5</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <a
          href="/submit"
          className="block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          Leave a review
        </a>

        {/* Reviews list */}
        <section className="space-y-4">
          {reviewCount === 0 ? (
            <p className="text-center text-gray-400 py-12">
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
