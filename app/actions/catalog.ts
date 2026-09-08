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
    const rawNote = params.artisanRawNote?.trim() || "";
    const hasDevanagari = /[\u0900-\u097F]/.test(rawNote);

    let descEn = "Authentic handcrafted product created using traditional Indian artisanal techniques and natural materials.";
    let descHi = "पारंपरिक भारतीय शिल्प तकनीकों और प्राकृतिक सामग्रियों से हस्तनिर्मित प्रामाणिक उत्पाद। यह विशेष कलाकृति समृद्ध सांस्कृतिक धरोहर का प्रतीक है।";

    if (rawNote) {
      if (hasDevanagari) {
        descHi = rawNote;
        descEn = `Authentic handcrafted craft (${params.craftHint || "Traditional Indian Art"}), meticulously prepared with ancestral artisan methods and eco-friendly raw elements.`;
      } else {
        descEn = rawNote;
        descHi = `पारंपरिक हस्तशिल्प कला द्वारा निर्मित एक अनूठी व प्रामाणिक कृति (${params.craftHint || "पारंपरिक शिल्प"})। यह हस्तशिल्प पीढ़ियों से चली आ रही सांस्कृतिक परंपरा और कारीगर के समर्पण का सजीव प्रमाण है।`;
      }
    }

    return {
      success: false,
      error: err?.message || "AI catalog generation timed out or failed.",
      fallbackData: {
        titleEnglish: fallbackTitle,
        titleHindi: `हस्तनिर्मित पारंपरिक शिल्प (${fallbackTitle})`,
        descriptionEnglish: descEn,
        descriptionHindi: descHi,
        tagsEnglish: ["handmade", "traditional-craft", "artisan-made"],
        tagsHindi: ["हस्तनिर्मित", "पारंपरिक-शिल्प", "कारीगर"],
        keyAttributes: [
          {
            attributeNameEn: "Craft Technique",
            attributeNameHi: "शिल्प तकनीक",
            attributeValueEn: "Handcrafted",
            attributeValueHi: "हस्तनिर्मित",
          },
          {
            attributeNameEn: "Material",
            attributeNameHi: "सामग्री",
            attributeValueEn: "Natural Earth / Traditional",
            attributeValueHi: "प्राकृतिक माटी / पारंपरिक",
          },
        ],
      },
    };
  }
}
