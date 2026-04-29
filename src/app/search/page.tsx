import { redirect } from "next/navigation";
import { searchFlats, type FlatWithStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

function FlatRow({ flat }: { flat: FlatWithStats }) {
  const address = [flat.address_line_1, flat.city, flat.postcode]
    .filter(Boolean)
    .join(", ");

  return (
    <a
      href={`/flats/${flat.id}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">{address}</p>
        <p className="text-sm text-gray-400 mt-0.5">
          {flat.review_count} review{flat.review_count === 1 ? "" : "s"}
        </p>
      </div>
      {flat.avg_overall && (
        <div className="shrink-0 text-right">
          <span className="text-lg font-bold text-indigo-700">{flat.avg_overall}</span>
          <span className="text-xs text-gray-400">/5</span>
          <p className="text-xs text-gray-400">overall</p>
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
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-xl space-y-8">
        <a href="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to home
        </a>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {results.length} flat{results.length === 1 ? "" : "s"} found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-gray-500">
              No flats matching &ldquo;{query}&rdquo; yet.
            </p>
            <a
              href="/submit"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Be the first to review one
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((flat) => (
              <FlatRow key={flat.id} flat={flat} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
