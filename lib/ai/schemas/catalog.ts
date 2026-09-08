import { z } from "zod";

export const CatalogAttributeSchema = z
  .object({
    attributeNameEn: z.string().optional(),
    attributeNameHi: z.string().optional(),
    attributeValueEn: z.string().optional(),
    attributeValueHi: z.string().optional(),
    englishLabel: z.string().optional(),
    hindiLabel: z.string().optional(),
    englishValue: z.string().optional(),
    hindiValue: z.string().optional(),
    nameEn: z.string().optional(),
    nameHi: z.string().optional(),
    valueEn: z.string().optional(),
    valueHi: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
  })
  .passthrough()
  .transform((data) => ({
    attributeNameEn:
      data.attributeNameEn ??
      data.englishLabel ??
      data.nameEn ??
      data.name ??
      "Feature",
    attributeNameHi:
      data.attributeNameHi ??
      data.hindiLabel ??
      data.nameHi ??
      "विशेषता",
    attributeValueEn:
      data.attributeValueEn ??
      data.englishValue ??
      data.valueEn ??
      data.value ??
      "Handcrafted",
    attributeValueHi:
      data.attributeValueHi ??
      data.hindiValue ??
      data.valueHi ??
      "हस्तनिर्मित",
  }));

export const CatalogGenerationSchema = z.object({
  titleEnglish: z.string().min(2).max(180),
  titleHindi: z.string().min(2).max(180),
  descriptionEnglish: z.string().min(10).max(3000),
  descriptionHindi: z.string().min(10).max(3000),
  tagsEnglish: z.array(z.string()).min(2).max(20),
  tagsHindi: z.array(z.string()).min(2).max(20),
  keyAttributes: z.array(CatalogAttributeSchema).min(1).max(15),
});

export type CatalogGenerationResult = z.infer<typeof CatalogGenerationSchema>;
