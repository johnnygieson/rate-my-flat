"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Coerces blank/whitespace strings to undefined before further validation
const optionalString = z
  .string()
  .optional()
  .transform((v) => (v?.trim() === "" ? undefined : v));

const schema = z.object({
  address_line_1: z.string().min(1, "Address line 1 is required"),
  address_line_2: optionalString,
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  monthly_rent_gbp: z.coerce.number().min(0, "Must be 0 or more"),
  deposit_gbp: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.number().min(0, "Must be 0 or more").optional()
  ),
  bills_included: z.coerce.boolean().optional().default(false),
  tenancy_start: z.string().min(1, "Tenancy start date is required"),
  tenancy_end: optionalString,
  overall_rating: z.coerce.number().int().min(1).max(5),
  landlord_rating: z.coerce.number().int().min(1).max(5),
  value_rating: z.coerce.number().int().min(1).max(5),
  condition_rating: z.coerce.number().int().min(1).max(5),
  mold_rating: z.coerce.number().int().min(1).max(5),
  noise_rating: z.coerce.number().int().min(1).max(5),
  pros: optionalString,
  cons: optionalString,
  review_text: z.string().min(1, "Review text is required"),
  anonymous_name: z.string().min(1, "Name is required"),
});

export type FormState = {
  errors?: Partial<Record<keyof z.infer<typeof schema>, string[]>> & { _form?: string[] };
  values?: Record<string, string>;
};

const orNull = (v: string | undefined) => (v === undefined || v.trim() === "" ? null : v);

export async function submitReview(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());

  // Checkboxes are absent from FormData when unchecked
  if (!raw.bills_included) raw.bills_included = "false";

  const result = schema.safeParse(raw);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors as FormState["errors"],
      values: Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, String(v)])
      ),
    };
  }

  const d = result.data;

  // Normalize for matching
  const normalizedPostcode = d.postcode.toUpperCase().replace(/\s+/g, "");
  const normalizedAddress = d.address_line_1.trim().toLowerCase();

  // Look up existing flat
  const { data: existingFlats, error: lookupError } = await supabase
    .from("flats")
    .select("id")
    .eq("normalized_postcode", normalizedPostcode)
    .eq("normalized_address_line_1", normalizedAddress)
    .limit(1);

  if (lookupError) {
    return {
      errors: { _form: [lookupError.message] },
      values: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)])),
    };
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
        errors: { _form: [insertFlatError?.message ?? "Failed to create flat"] },
        values: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)])),
      };
    }

    flatId = newFlat.id;
  }

  const { error: reviewError } = await supabase.from("reviews").insert({
    flat_id: flatId,
    monthly_rent_gbp: d.monthly_rent_gbp,
    deposit_gbp: d.deposit_gbp ?? null,
    bills_included: d.bills_included,
    tenancy_start: d.tenancy_start,
    tenancy_end: orNull(d.tenancy_end),
    overall_rating: d.overall_rating,
    landlord_rating: d.landlord_rating,
    value_rating: d.value_rating,
    condition_rating: d.condition_rating,
    mold_rating: d.mold_rating,
    noise_rating: d.noise_rating,
    pros: orNull(d.pros),
    cons: orNull(d.cons),
    review_text: d.review_text,
    anonymous_name: d.anonymous_name,
  });

  if (reviewError) {
    return {
      errors: { _form: [reviewError.message] },
      values: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)])),
    };
  }

  redirect(`/flats/${flatId}`);
}
