import { getRecentFlats, type FlatWithStats } from "@/lib/queries";

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

export default async function Home() {
  const recentFlats = await getRecentFlats(10);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200 px-4 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Rate My Flat{" "}
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600 align-middle">
              BETA
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Honest reviews of UK rentals, from the people who&apos;ve lived there.
          </p>

          {/* Search */}
          <form action="/search" method="GET" className="mt-8 flex gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search by city or postcode"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Secondary CTA */}
          <a
            href="/submit"
            className="mt-4 inline-block rounded-lg border border-indigo-300 px-6 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Leave a review
          </a>
        </div>
      </section>

      {/* Recent flats */}
      <section className="mx-auto max-w-xl px-4 py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
          Recently reviewed flats
        </h2>

        {recentFlats.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No reviews yet — be the first.{" "}
            <a href="/submit" className="text-indigo-600 hover:underline">
              Leave a review
            </a>
          </p>
        ) : (
          <div className="space-y-3">
            {recentFlats.map((flat) => (
              <FlatRow key={flat.id} flat={flat} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
