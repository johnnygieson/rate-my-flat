import { z } from "zod";

export const reviewSchema = z.object({
  // Step 1 — The flat
  address_line_1: z.string().min(1, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),

  // Step 2 — Your tenancy
  monthly_rent_gbp: z.number().min(0, "Must be 0 or more"),
  deposit_gbp: z.number().min(0).nullable().optional(),
  tenancy_start: z.string().min(1, "Start date is required"),
  tenancy_end: z.string().nullable().optional(),
  bills_included: z.boolean().nullable(),
  monthly_bills_gbp: z.number().min(0).nullable().optional(),
  bills_higher_than_expected: z.boolean().nullable().optional(),
  letting_type: z.enum(["agency", "private", "unknown"]),
  letting_agency_name: z.string().nullable().optional(),

  // Step 3 — Your review
  overall_rating: z.number().int().min(1, "Please give a rating").max(5),
  landlord_rating: z.number().int().min(1, "Please give a rating").max(5),
  value_rating: z.number().int().min(1, "Please give a rating").max(5),
  condition_rating: z.number().int().min(1, "Please give a rating").max(5),
  has_damp_mold: z.boolean().nullable().optional(),
  has_reliable_hot_water: z.boolean().nullable().optional(),
  has_noise_issues: z.boolean().nullable().optional(),
  has_pest_issues: z.boolean().nullable().optional(),
  deposit_returned_in_full: z.boolean().nullable().optional(),
  landlord_responsive: z.boolean().nullable().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  review_text: z.string().min(1, "Please write a review"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
