import { supabase } from "@/lib/supabase";

export type FlatWithStats = {
  id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
  review_count: number;
  avg_overall: string | null;
};

type RawFlat = {
  id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
  reviews: { overall_rating: number }[];
};

function toFlatWithStats(flat: RawFlat): FlatWithStats {
  const ratings = flat.reviews.map((r) => r.overall_rating).filter(Number.isFinite);
  const avg =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;
  return {
    id: flat.id,
    address_line_1: flat.address_line_1,
    address_line_2: flat.address_line_2,
    city: flat.city,
    postcode: flat.postcode,
    review_count: ratings.length,
    avg_overall: avg,
  };
}

const FLAT_SELECT = "id, address_line_1, address_line_2, city, postcode, reviews(overall_rating)";

export async function getRecentFlats(limit = 10): Promise<FlatWithStats[]> {
  const { data, error } = await supabase
    .from("flats")
    .select(FLAT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as RawFlat[]).map(toFlatWithStats);
}

export async function searchFlats(q: string): Promise<FlatWithStats[]> {
  const normalized = q.toUpperCase().replace(/\s+/g, "");

  const { data, error } = await supabase
    .from("flats")
    .select(FLAT_SELECT)
    .or(`city.ilike.%${q}%,postcode.ilike.%${q}%,normalized_postcode.ilike.%${normalized}%`);

  if (error || !data) return [];
  return (data as RawFlat[]).map(toFlatWithStats);
}

export async function getCounts(): Promise<{ reviewCount: number; flatCount: number }> {
  const [{ count: flatCount }, { count: reviewCount }] = await Promise.all([
    supabase.from("flats").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
  ]);
  return {
    flatCount: flatCount ?? 0,
    reviewCount: reviewCount ?? 0,
  };
}
