"use server";

import { runGeminiJsonCall } from "@/lib/ai/gemini";
import {
  PRICING_REASONING_SYSTEM_PROMPT,
  buildPricingReasoningPrompt,
} from "@/lib/ai/prompts/pricing";
import {
  PricingReasoningSchema,
  PricingReasoningResult,
} from "@/lib/ai/schemas/pricing";

export interface PricingInputParams {
  materialCost: number;
  labourHours: number;
  hourlyWage?: number;
  overheadCost?: number;
  craftType?: string;
  material?: string;
  intricacyLevel?: "Standard" | "Detailed" | "Masterpiece";
}

export interface PricingActionResponse {
  success: boolean;
  data: PricingReasoningResult;
  error?: string;
}

/**
 * Calculates deterministic base cost and generates AI-assisted fair market markup reasoning.
 */
export async function calculatePricingAction(
  params: PricingInputParams
): Promise<PricingActionResponse> {
  const hourlyWage = params.hourlyWage || 100;
  const overheadCost = params.overheadCost || 50;

  // 1. Strict Deterministic Base Cost Calculation
  const baseCost = Number(
    (params.materialCost + params.labourHours * hourlyWage + overheadCost).toFixed(2)
  );

  const craftType = params.craftType || "Traditional Indian Handicraft";
  const material = params.material || "Natural Clay / Textile / Metal";
  const intricacyLevel = params.intricacyLevel || "Detailed";

  try {
    const prompt = buildPricingReasoningPrompt({
      baseCost,
      craftType,
      intricacyLevel,
      material,
    });

    const aiResult = await runGeminiJsonCall<PricingReasoningResult>({
      systemInstruction: PRICING_REASONING_SYSTEM_PROMPT,
      prompt,
      validator: (raw) => PricingReasoningSchema.parse(raw),
    });

    return {
      success: true,
      data: aiResult,
    };
  } catch (err: any) {
    console.warn("[Pricing Action Warning]: Gemini reasoning fallback applied:", err?.message || err);

    // Fallback deterministic economic formula (35% markup baseline)
    const markupPercent = intricacyLevel === "Masterpiece" ? 50 : intricacyLevel === "Detailed" ? 35 : 25;
    const suggestedMin = Math.round(baseCost * 1.20);
    const suggestedMax = Math.round(baseCost * (1 + (markupPercent + 15) / 100));
    const recommended = Math.round(baseCost * (1 + markupPercent / 100));

    return {
      success: true,
      data: {
        baseCost,
        suggestedMarkupPercent: markupPercent,
        suggestedMinPrice: suggestedMin,
        suggestedMaxPrice: suggestedMax,
        recommendedPrice: recommended,
        reasoningEnglish: `Calculated from base production cost of ₹${baseCost} (Materials ₹${params.materialCost} + Labour ₹${params.labourHours * hourlyWage} + Overhead ₹${overheadCost}). A ${markupPercent}% markup ensures a fair artisan livelihood margin while factoring in safe transit packing.`,
        reasoningHindi: `कुल उत्पादन लागत ₹${baseCost} (कच्चा माल ₹${params.materialCost} + श्रम ₹${params.labourHours * hourlyWage} + अन्य ₹${overheadCost}) पर आधारित। ${markupPercent}% का उचित लाभ कारीगर की मेहनत और सुरक्षित पैकेजिंग को सुनिश्चित करता है।`,
        basis: "cost_assisted_ai_estimate",
      },
    };
  }
}
