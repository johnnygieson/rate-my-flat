import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.ratemyflat.uk");

  const { data: flats } = await supabase
    .from("flats")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  const flatEntries: MetadataRoute.Sitemap = (flats ?? []).map((flat) => ({
    url: `${base}/flats/${flat.id}`,
    lastModified: flat.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/submit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/search`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    ...flatEntries,
  ];
}
