import { Search, Star, Pencil } from "lucide-react";
import { getRecentFlats, getCounts, type FlatWithStats } from "@/lib/queries";

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
          <Star className="size-4 text-accent fill-accent" />
          <span className="text-sm font-bold text-ink-900">{flat.avg_overall}</span>
          <span className="text-xs text-ink-400">/5</span>
        </div>
      )}
    </a>
  );
}

export default async function Home() {
  const [recentFlats, { reviewCount, flatCount }] = await Promise.all([
    getRecentFlats(10),
    getCounts(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-white px-4 py-20 md:py-28 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-ink-900 leading-[1.1] text-balance">
            Find out the truth about your next flat.
          </h1>
          <p className="mt-5 text-xl text-ink-500 leading-relaxed">
            Real rents, real landlords, real experiences — from past tenants.
          </p>

          {/* Search */}
          <form
            action="/search"
            method="GET"
            className="mt-10 flex overflow-hidden rounded-xl border-2 border-ink-200 bg-white shadow-sm focus-within:border-brand-green-500 transition-colors motion-reduce:transition-none"
          >
            <div className="flex items-center pl-4 text-ink-400">
              <Search className="size-5 shrink-0" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Search by city or postcode"
              className="flex-1 min-w-0 py-4 px-3 text-base text-ink-900 placeholder:text-ink-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-brand-green-600 px-6 py-4 text-sm font-semibold text-white hover:bg-brand-green-700 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            >
              Find reviews
            </button>
          </form>

          {reviewCount > 0 && flatCount > 0 && (
            <p className="mt-4 text-sm text-ink-400">
              {reviewCount.toLocaleString()} review{reviewCount === 1 ? "" : "s"} of{" "}
              {flatCount.toLocaleString()} flat{flatCount === 1 ? "" : "s"} so far
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-ink-200 bg-ink-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: Search,
                step: "1. Search a flat",
                caption: "Enter a city or postcode to find a property.",
              },
              {
                icon: Star,
                step: "2. Read honest reviews",
                caption:
                  "See what past tenants say about rent, landlords, and conditions.",
              },
              {
                icon: Pencil,
                step: "3. Share your own",
                caption:
                  "Lived there? Help others with your firsthand experience.",
              },
            ].map(({ icon: Icon, step, caption }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-600">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-ink-900">{step}</h3>
                <p className="text-sm text-ink-500">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently reviewed */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-ink-900 mb-6">Recently reviewed</h2>

          {recentFlats.length === 0 ? (
            <p className="text-center text-ink-400 py-12">
              No reviews yet — be the first.{" "}
              <a href="/submit" className="text-brand-green-600 hover:underline">
                Leave a review
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentFlats.map((flat) => (
                <FlatCard key={flat.id} flat={flat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
