"use server";

import { runGeminiJsonCall } from "@/lib/ai/gemini";
import {
  CRAFT_STORY_SYSTEM_PROMPT,
  buildCraftStoryPrompt,
} from "@/lib/ai/prompts/craft-story";
import {
  CraftStorySchema,
  CraftStoryResult,
} from "@/lib/ai/schemas/craft-story";
import { CraftStoryData } from "@/types/product";

export interface GenerateCraftStoryInput {
  artisanName: string;
  craftType: string;
  district?: string;
  state?: string;
  artisanStoryRaw: string;
  isDemoExample?: boolean;
}

export interface GenerateCraftStoryResponse {
  success: boolean;
  data?: CraftStoryData;
  error?: string;
}

export async function generateCraftStoryAction(
  input: GenerateCraftStoryInput
): Promise<GenerateCraftStoryResponse> {
  const rawStory = input.artisanStoryRaw?.trim();

  if (!rawStory || rawStory.length < 5) {
    return {
      success: false,
      error: "कृपया अपनी शिल्प कहानी या सीखने की प्रक्रिया के बारे में कुछ शब्द बताएं।",
    };
  }

  const prompt = buildCraftStoryPrompt({
    artisanName: input.artisanName,
    craftType: input.craftType,
    district: input.district,
    state: input.state,
    artisanStoryRaw: rawStory,
  });

  try {
    const aiResult = await runGeminiJsonCall<CraftStoryResult>({
      prompt,
      systemInstruction: CRAFT_STORY_SYSTEM_PROMPT,
      validator: (rawJson) => CraftStorySchema.parse(rawJson),
    });

    const craftStoryData: CraftStoryData = {
      artisan_story_raw: rawStory,
      story_en: aiResult.storyEnglish,
      story_hi: aiResult.storyHindi,
      traditional_process: aiResult.traditionalProcess,
      generational_lineage: aiResult.generationalLineage || null,
      story_source: input.isDemoExample ? "demo_data" : "artisan_provided",
    };

    return {
      success: true,
      data: craftStoryData,
    };
  } catch (err: any) {
    console.warn("Gemini Craft Story Generation failed, falling back to direct structuring:", err?.message);

    // Resilient fallback: preserves artisan's authentic words without hallucination
    const hasFamilyMention =
      /दादा|पिता|माता|सास|परिवार|पीढ़ी|father|grandfather|family|generation/i.test(
        rawStory
      );

    const fallbackData: CraftStoryData = {
      artisan_story_raw: rawStory,
      story_hi: `शिल्पकार के अनुसार: "${rawStory}"। यह पारंपरिक शिल्प हाथों के हुनर और निरंतर अभ्यास से तैयार किया जाता है।`,
      story_en: `According to the artisan: "${rawStory}". This traditional craft is handcrafted through continuous practice and manual dedication.`,
      traditional_process: "पारंपरिक हस्तनिर्मित तकनीक • स्थानीय कच्ची सामग्री • पारंपरिक औजार",
      generational_lineage: hasFamilyMention
        ? "शिल्पकार के परिवार द्वारा सिखाया गया पुश्तैनी हुनर"
        : null,
      story_source: input.isDemoExample ? "demo_data" : "artisan_provided",
    };

    return {
      success: true,
      data: fallbackData,
    };
  }
}
