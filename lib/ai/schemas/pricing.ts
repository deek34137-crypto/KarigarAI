import { z } from "zod";

export const PricingReasoningSchema = z.object({
  baseCost: z.number().nonnegative(),
  suggestedMarkupPercent: z.number().min(5).max(200),
  suggestedMinPrice: z.number().positive(),
  suggestedMaxPrice: z.number().positive(),
  recommendedPrice: z.number().positive(),
  reasoningEnglish: z.string().min(5).max(600),
  reasoningHindi: z.string().min(5).max(600),
  basis: z.literal("cost_assisted_ai_estimate"),
});

export type PricingReasoningResult = z.infer<typeof PricingReasoningSchema>;
