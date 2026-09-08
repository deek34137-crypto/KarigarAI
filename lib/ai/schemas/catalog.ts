import { z } from "zod";

export const CatalogAttributeSchema = z.object({
  attributeNameEn: z.string().min(1).max(50),
  attributeNameHi: z.string().min(1).max(50),
  attributeValueEn: z.string().min(1).max(100),
  attributeValueHi: z.string().min(1).max(100),
});

export const CatalogGenerationSchema = z.object({
  titleEnglish: z.string().min(3).max(150),
  titleHindi: z.string().min(3).max(150),
  descriptionEnglish: z.string().min(10).max(2000),
  descriptionHindi: z.string().min(10).max(2000),
  tagsEnglish: z.array(z.string()).min(2).max(12),
  tagsHindi: z.array(z.string()).min(2).max(12),
  keyAttributes: z.array(CatalogAttributeSchema).min(1).max(10),
});

export type CatalogGenerationResult = z.infer<typeof CatalogGenerationSchema>;
