import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { searchFlats, type FlatWithStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

function FlatCard({ flat }: { flat: FlatWithStats }) {
  const address = [flat.address_line_1, flat.city, flat.postcode]
    .filter(Boolean)
    .join(", ");

  return (
    <a
      href={`/flats/${flat.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 bg-white p-5 hover:border-brand-green-400 hover:shadow-md transition-all duration-150 motion-reduce:transition-none"
    >
      <div className="min-w-0">
        <p className="font-semibold text-ink-900 truncate">{address}</p>
        <p className="text-sm text-ink-400 mt-0.5">
          {flat.review_count} review{flat.review_count === 1 ? "" : "s"}
        </p>
      </div>
      {flat.avg_overall && (
        <div className="shrink-0 flex items-center gap-1.5 rounded-lg bg-brand-green-50 px-3 py-1.5">
          <Star className="size-4 text-accent fill-accent" aria-hidden="true" />
          <span className="text-sm font-bold text-ink-900">{flat.avg_overall}</span>
          <span className="text-xs text-ink-400">/5</span>
        </div>
      )}
    </a>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) redirect("/");

  const results = await searchFlats(query);

  return (
    <main className="bg-bg px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <a
          href="/"
          className="text-sm font-medium text-brand-green-600 hover:text-brand-green-700 transition-colors motion-reduce:transition-none"
        >
          ← Back
        </a>

        <div>
          <h1 className="text-3xl font-bold text-ink-900">
            Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {results.length} flat{results.length === 1 ? "" : "s"} found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-ink-500">
              No flats matching &ldquo;{query}&rdquo; yet.
            </p>
            <a
              href="/submit"
              className="inline-flex items-center rounded-lg bg-brand-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-600 focus-visible:ring-offset-2"
            >
              Be the first to review one
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((flat) => (
              <FlatCard key={flat.id} flat={flat} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
