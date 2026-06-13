"use server";

import { redirect } from "next/navigation";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import { supabase } from "@/lib/supabase";

export type FormState = {
  errors?: Record<string, string[]> & { _form?: string[] };
};

const orNull = (v: string | null | undefined) =>
  !v || v.trim() === "" ? null : v;

export async function submitReview(input: ReviewInput): Promise<FormState> {
  const result = reviewSchema.safeParse(input);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors as FormState["errors"],
    };
  }

  const d = result.data;

  if (d.letting_type === "agency" && !d.letting_agency_name?.trim()) {
    return { errors: { letting_agency_name: ["Agency name is required"] } };
  }

  const normalizedPostcode = d.postcode.toUpperCase().replace(/\s+/g, "");
  const normalizedAddress = d.address_line_1.trim().toLowerCase();

  const { data: existingFlats, error: lookupError } = await supabase
    .from("flats")
    .select("id")
    .eq("normalized_postcode", normalizedPostcode)
    .eq("normalized_address_line_1", normalizedAddress)
    .limit(1);

  if (lookupError) {
    return { errors: { _form: [lookupError.message] } };
  }

  let flatId: string;

  if (existingFlats && existingFlats.length > 0) {
    flatId = existingFlats[0].id;
  } else {
    const { data: newFlat, error: insertFlatError } = await supabase
      .from("flats")
      .insert({
        address_line_1: d.address_line_1,
        address_line_2: orNull(d.address_line_2),
        city: d.city,
        postcode: d.postcode,
      })
      .select("id")
      .single();

    if (insertFlatError || !newFlat) {
      return {
        errors: {
          _form: [insertFlatError?.message ?? "Failed to save the flat"],
        },
      };
    }

    flatId = newFlat.id;
  }

  const { error: reviewError } = await supabase.from("reviews").insert({
    flat_id: flatId,
    monthly_rent_gbp: d.monthly_rent_gbp,
    deposit_gbp: d.deposit_gbp ?? null,
    bills_included: d.bills_included,
    monthly_bills_gbp: d.monthly_bills_gbp ?? null,
    bills_higher_than_expected: d.bills_higher_than_expected ?? null,
    tenancy_start: d.tenancy_start,
    tenancy_end: orNull(d.tenancy_end),
    letting_type: d.letting_type,
    letting_agency_name: orNull(d.letting_agency_name),
    overall_rating: d.overall_rating,
    landlord_rating: d.landlord_rating,
    value_rating: d.value_rating,
    condition_rating: d.condition_rating,
    has_damp_mold: d.has_damp_mold ?? null,
    has_reliable_hot_water: d.has_reliable_hot_water ?? null,
    has_noise_issues: d.has_noise_issues ?? null,
    has_pest_issues: d.has_pest_issues ?? null,
    deposit_returned_in_full: d.deposit_returned_in_full ?? null,
    landlord_responsive: d.landlord_responsive ?? null,
    pros: orNull(d.pros),
    cons: orNull(d.cons),
    review_text: d.review_text,
    anonymous_name: "Anonymous",
  });

  if (reviewError) {
    return { errors: { _form: [reviewError.message] } };
  }

  redirect(`/flats/${flatId}`);
}
