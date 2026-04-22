import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { count, error } = await supabase
    .from("flats")
    .select("*", { count: "exact", head: true });

  const dbStatus =
    error ? `Database connection: ERROR — ${error.message}` : `Database connection: OK — ${count ?? 0} flats so far`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Rate My Flat
      </h1>
      <p className="mt-4 text-xl text-gray-500">
        Honest reviews of UK rentals, from the people who&apos;ve lived there.
      </p>
      <p className="mt-6 text-sm text-gray-400">{dbStatus}</p>
    </main>
  );
}
