"use server";

import { runGeminiJsonCall } from "@/lib/ai/gemini";
import {
  PRODUCT_ANALYSIS_SYSTEM_PROMPT,
  buildProductAnalysisPrompt,
} from "@/lib/ai/prompts/product-analysis";
import {
  CATALOG_GENERATION_SYSTEM_PROMPT,
  buildCatalogGenerationPrompt,
} from "@/lib/ai/prompts/catalog-generation";
import {
  ProductAnalysisSchema,
  ProductAnalysisResult,
} from "@/lib/ai/schemas/product-analysis";
import {
  CatalogGenerationSchema,
  CatalogGenerationResult,
} from "@/lib/ai/schemas/catalog";

export interface PipelineSuccessResponse {
  success: true;
  visionData: ProductAnalysisResult;
  catalogData: CatalogGenerationResult;
}

export interface PipelineErrorResponse {
  success: false;
  error: string;
  fallbackData?: Partial<CatalogGenerationResult>;
}

export type PipelineResponse = PipelineSuccessResponse | PipelineErrorResponse;

/**
 * Step A: Analyze product image using Gemini Multimodal Vision
 */
export async function analyzeProductImageAction(params: {
  imageBase64: string;
  mimeType?: string;
  craftHint?: string;
}): Promise<ProductAnalysisResult> {
  const mimeType = params.mimeType || "image/jpeg";
  const prompt = buildProductAnalysisPrompt(params.craftHint);

  return runGeminiJsonCall<ProductAnalysisResult>({
    systemInstruction: PRODUCT_ANALYSIS_SYSTEM_PROMPT,
    prompt,
    imagePart: {
      inlineData: {
        data: params.imageBase64,
        mimeType,
      },
    },
    validator: (raw) => ProductAnalysisSchema.parse(raw),
  });
}

/**
 * Step B: Generate structured bilingual catalog from vision data & artisan oral notes
 */
export async function generateBilingualCatalogAction(params: {
  visionData: Record<string, unknown>;
  artisanRawNote?: string;
  craftCluster?: string;
}): Promise<CatalogGenerationResult> {
  const prompt = buildCatalogGenerationPrompt({
    visionData: params.visionData,
    artisanRawNote: params.artisanRawNote,
    craftCluster: params.craftCluster,
  });

  return runGeminiJsonCall<CatalogGenerationResult>({
    systemInstruction: CATALOG_GENERATION_SYSTEM_PROMPT,
    prompt,
    validator: (raw) => CatalogGenerationSchema.parse(raw),
  });
}

/**
 * Full Pipeline: Executes Vision Analysis + Bilingual Catalog Generation in one streamlined call
 */
export async function generateCompleteCatalogPipelineAction(params: {
  imageBase64: string;
  mimeType?: string;
  artisanRawNote?: string;
  craftHint?: string;
  craftCluster?: string;
}): Promise<PipelineResponse> {
  try {
    // 1. Run Gemini Multimodal Vision Analysis
    const visionData = await analyzeProductImageAction({
      imageBase64: params.imageBase64,
      mimeType: params.mimeType,
      craftHint: params.craftHint,
    });

    // 2. Generate Bilingual Catalog
    const catalogData = await generateBilingualCatalogAction({
      visionData: visionData as unknown as Record<string, unknown>,
      artisanRawNote: params.artisanRawNote,
      craftCluster: params.craftCluster,
    });

    return {
      success: true,
      visionData,
      catalogData,
    };
  } catch (err: any) {
    console.error("[Catalog Pipeline Action Error]:", err?.message || err);

    // Fallback template for resilient degradation (Never leave artisan stuck)
    const fallbackTitle = params.craftHint || "Handcrafted Traditional Artisan Craft";
    return {
      success: false,
      error: err?.message || "AI catalog generation timed out or failed.",
      fallbackData: {
        titleEnglish: fallbackTitle,
        titleHindi: `हस्तनिर्मित पारंपरिक शिल्प (${fallbackTitle})`,
        descriptionEnglish:
          params.artisanRawNote ||
          "Authentic handcrafted product created using traditional Indian artisanal techniques and natural materials.",
        descriptionHindi:
          params.artisanRawNote ||
          "पारंपरिक भारतीय शिल्प तकनीकों और प्राकृतिक सामग्रियों से हस्तनिर्मित प्रामाणिक उत्पाद।",
        tagsEnglish: ["handmade", "traditional-craft", "artisan-made"],
        tagsHindi: ["हस्तनिर्मित", "पारंपरिक-शिल्प", "कारीगर"],
        keyAttributes: [
          {
            attributeNameEn: "Craft Technique",
            attributeNameHi: "शिल्प तकनीक",
            attributeValueEn: "Handcrafted",
            attributeValueHi: "हस्तनिर्मित",
          },
        ],
      },
    };
  }
}
