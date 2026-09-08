import { z } from "zod";

export const ConfidenceScoresSchema = z
  .object({
    categoryConfidence: z.number().optional(),
    materialConfidence: z.number().optional(),
    craftTypeConfidence: z.number().optional(),
    category: z.number().optional(),
    material: z.number().optional(),
    craftType: z.number().optional(),
  })
  .passthrough()
  .transform((data) => ({
    categoryConfidence: data.categoryConfidence ?? data.category ?? 0.95,
    materialConfidence: data.materialConfidence ?? data.material ?? 0.95,
    craftTypeConfidence: data.craftTypeConfidence ?? data.craftType ?? 0.95,
  }));

export const ProductAnalysisSchema = z.object({
  detectedTitle: z.string().min(2).max(180),
  category: z.string().min(2).max(100),
  craftType: z.string().min(2).max(100),
  primaryMaterial: z.string().min(2).max(100),
  visualAttributes: z.array(z.string()).min(1).max(20),
  suggestedTags: z.array(z.string()).min(2).max(20),
  confidenceScores: ConfidenceScoresSchema.optional().default({
    categoryConfidence: 0.95,
    materialConfidence: 0.95,
    craftTypeConfidence: 0.95,
  }),
});

export type ProductAnalysisResult = z.infer<typeof ProductAnalysisSchema>;
