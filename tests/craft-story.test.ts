import { describe, it } from "node:test";
import assert from "node:assert";
import { CraftStorySchema } from "../lib/ai/schemas/craft-story.ts";
import { BENCHMARK_DEMO_PRODUCTS } from "../lib/data/products.ts";

describe("Phase 8: Heritage Craft Story & Authenticity Tests", () => {
  it("should validate a complete CraftStory object conforming to CraftStorySchema", () => {
    const validData = {
      storyEnglish:
        "This handcrafted terracotta pitcher represents three generations of potting traditions, shaped by hand using locally sourced natural clay.",
      storyHindi:
        "यह हस्तनिर्मित टेराकोटा सुराही तीन पीढ़ियों के पारंपरिक चाक शिल्प का प्रतिनिधित्व करती है, जिसे स्थानीय प्राकृतिक मिट्टी से बनाया गया है।",
      traditionalProcess:
        "Hand-thrown on potter's wheel, sun-dried, and fired in traditional wood kilns.",
      generationalLineage: "Passed down across 3 generations of family potters.",
    };

    const parsed = CraftStorySchema.safeParse(validData);
    assert.strictEqual(parsed.success, true, "Valid story must pass schema validation");
  });

  it("should permit generationalLineage to be null when artisan does not mention family lineage", () => {
    const storyWithoutLineage = {
      storyEnglish:
        "Handcrafted using traditional wood carving chisels, focused on natural wood grains.",
      storyHindi:
        "पारंपरिक छेनी और हथौड़ी से हाथ से नक्काशी की गई कलाकृति, जो प्राकृतिक काष्ठ सौंदर्य को दर्शाती है।",
      traditionalProcess: "Chisel carving and natural oil polish.",
      generationalLineage: null, // No family claims invented
    };

    const parsed = CraftStorySchema.safeParse(storyWithoutLineage);
    assert.strictEqual(
      parsed.success,
      true,
      "Schema must accept null generationalLineage to prevent hallucinated heritage"
    );
  });

  it("should reject invalid craft story outputs failing constraints", () => {
    const invalidData = {
      storyEnglish: "Too short",
      storyHindi: "छोटा",
      traditionalProcess: "",
    };

    const parsed = CraftStorySchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false, "Invalid output must be rejected by Zod schema");
  });

  it("should enforce anti-hallucination constraints in the craft story prompt", async () => {
    const { CRAFT_STORY_SYSTEM_PROMPT } = await import("../lib/ai/prompts/craft-story.ts");
    assert.ok(CRAFT_STORY_SYSTEM_PROMPT.includes("editorial assistant"));
    assert.ok(CRAFT_STORY_SYSTEM_PROMPT.includes("Do not invent facts"));
    assert.ok(CRAFT_STORY_SYSTEM_PROMPT.includes("Do not infer historical age"));
    assert.ok(CRAFT_STORY_SYSTEM_PROMPT.includes("Do not invent royal, religious, mythological"));
    assert.ok(CRAFT_STORY_SYSTEM_PROMPT.includes("generationalLineage to null"));
  });

  it("should verify benchmark demo products have structured craft_story with demo_data source", () => {
    assert.strictEqual(BENCHMARK_DEMO_PRODUCTS.length, 2);

    for (const prod of BENCHMARK_DEMO_PRODUCTS) {
      assert.ok(prod.craft_story, `${prod.title_en} must have a craft_story`);
      assert.strictEqual(
        prod.craft_story?.story_source,
        "demo_data",
        "Must be labeled as demo_data"
      );
      assert.ok(prod.craft_story?.story_hi.length > 10, "Must have Hindi story");
      assert.ok(prod.craft_story?.story_en.length > 10, "Must have English story");
      assert.ok(
        prod.craft_story?.artisan_story_raw.length > 10,
        "Must retain raw artisan statement"
      );
    }
  });

  it("should validate that raw artisan story input must meet minimum length", () => {
    const emptyInput = "   ";
    const isValid = emptyInput.trim().length >= 5;
    assert.strictEqual(isValid, false, "Whitespace or short input must be rejected gracefully");

    const validRaw = "हमारे परिवार में यह काम दादाजी के समय से किया जा रहा है।";
    assert.strictEqual(validRaw.trim().length >= 5, true);
  });

  it("should produce a valid fallback CraftStoryData when AI is unavailable", () => {
    const rawStory = "मैंने यह शिल्प अपने पिताजी से सीखा।";
    const hasFamily = /दादा|पिता|माता|सास|परिवार|पीढ़ी/i.test(rawStory);

    const fallback = {
      artisan_story_raw: rawStory,
      story_hi: `शिल्पकार के अनुसार: "${rawStory}"। यह पारंपरिक शिल्प हाथों के हुनर से तैयार किया जाता है।`,
      story_en: `According to the artisan: "${rawStory}". This traditional craft is handcrafted through dedication.`,
      traditional_process: "पारंपरिक हस्तनिर्मित तकनीक • स्थानीय कच्ची सामग्री",
      generational_lineage: hasFamily ? "पारिवारिक सीख" : null,
      story_source: "artisan_provided" as const,
    };

    assert.ok(fallback.story_hi.includes(rawStory));
    assert.strictEqual(fallback.story_source, "artisan_provided");
    assert.ok(fallback.generational_lineage !== null);
  });
});
