import { z } from "zod";

export const ConfidenceScoresSchema = z.object({
  categoryConfidence: z.number().min(0).max(1),
  materialConfidence: z.number().min(0).max(1),
  craftTypeConfidence: z.number().min(0).max(1),
});

export const ProductAnalysisSchema = z.object({
  detectedTitle: z.string().min(2).max(120),
  category: z.string().min(2).max(60),
  craftType: z.string().min(2).max(60),
  primaryMaterial: z.string().min(2).max(60),
  visualAttributes: z.array(z.string()).min(1).max(10),
  suggestedTags: z.array(z.string()).min(2).max(12),
  confidenceScores: ConfidenceScoresSchema,
});

export type ProductAnalysisResult = z.infer<typeof ProductAnalysisSchema>;
