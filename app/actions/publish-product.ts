"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { CraftStoryData, Profile } from "@/types/product";

export interface PublishProductInput {
  slug: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  craft_type: string;
  material: string;
  visual_attributes?: Record<string, any>;
  original_image_url: string;
  processed_image_url?: string | null;
  base_cost: number;
  price_min: number;
  price_max: number;
  suggested_price: number;
  pricing_reasoning_en?: string | null;
  pricing_reasoning_hi?: string | null;
  tags?: string[];
  tags_hi?: string[];
  craft_story?: CraftStoryData | null;
  artisan?: Partial<Profile> | null;
}

export interface PublishProductResponse {
  success: boolean;
  slug?: string;
  id?: string;
  error?: string;
}

export async function publishProductAction(
  input: PublishProductInput
): Promise<PublishProductResponse> {
  try {
    const admin = createAdminClient() as any;

    // 1. Ensure artisan profile exists
    const artisanId =
      input.artisan?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.artisan.id)
        ? input.artisan.id
        : "00000000-0000-0000-0000-000000000001";

    // Check if user exists in auth.users, create if missing
    try {
      const { data: userRes } = await admin.auth.admin.getUserById(artisanId);
      if (!userRes?.user) {
        await admin.auth.admin.createUser({
          id: artisanId,
          email: `artisan.${artisanId.slice(0, 8)}@karigarai.app`,
          email_confirm: true,
          user_metadata: {
            full_name: input.artisan?.full_name || "रामेश्वर प्रजापति (Rameshwar Prajapati)",
          },
        });
      }
    } catch (authErr) {
      console.warn("Artisan auth user verification note:", authErr);
    }

    // Upsert artisan profile
    try {
      await admin.from("profiles").upsert({
        id: artisanId,
        full_name: input.artisan?.full_name || "रामेश्वर प्रजापति (Rameshwar Prajapati)",
        phone_number: input.artisan?.phone_number || "+919876543210",
        preferred_language: (input.artisan?.preferred_language as "hi" | "en") || "hi",
        craft_type: input.artisan?.craft_type || input.craft_type,
        state: input.artisan?.state || "Uttar Pradesh",
        district: input.artisan?.district || "Gorakhpur",
        bio: input.artisan?.bio || "पारंपरिक शिल्पकार, हस्तनिर्मित कलाकृतियों का निर्माण।",
      });
    } catch (profileErr) {
      console.warn("Profile upsert note:", profileErr);
    }

    // 2. Ensure unique slug
    let finalSlug = input.slug.toLowerCase().trim();
    const { data: existingProduct } = await admin
      .from("products")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (existingProduct) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // 3. Insert Product into Supabase
    const { data: productData, error: productErr } = await admin
      .from("products")
      .insert({
        artisan_id: artisanId,
        slug: finalSlug,
        title_en: input.title_en,
        title_hi: input.title_hi,
        description_en: input.description_en,
        description_hi: input.description_hi,
        category: input.category,
        craft_type: input.craft_type,
        material: input.material,
        visual_attributes: input.visual_attributes || {},
        original_image_url: input.original_image_url,
        processed_image_url: input.processed_image_url || null,
        base_cost: input.base_cost,
        price_min: input.price_min,
        price_max: input.price_max,
        suggested_price: input.suggested_price,
        pricing_reasoning_en: input.pricing_reasoning_en || null,
        pricing_reasoning_hi: input.pricing_reasoning_hi || null,
        status: "published",
      })
      .select()
      .single();

    if (productErr || !productData) {
      console.error("Product insert error:", productErr);
      return {
        success: false,
        error: productErr?.message || "Failed to persist product to cloud catalog.",
        slug: finalSlug,
      };
    }

    // 4. Insert Tags if present
    if (input.tags && input.tags.length > 0) {
      try {
        const tagPayload = input.tags.map((t, idx) => ({
          product_id: productData.id,
          tag: t,
          tag_hi: input.tags_hi?.[idx] || null,
        }));
        await admin.from("product_tags").insert(tagPayload);
      } catch (tagErr) {
        console.warn("Product tags insert warning:", tagErr);
      }
    }

    // 5. Insert Craft Story if present
    if (input.craft_story && (input.craft_story.story_en || input.craft_story.story_hi)) {
      try {
        const cs = input.craft_story;
        const processText = Array.isArray(cs.traditional_process)
          ? cs.traditional_process.join("\n")
          : typeof cs.traditional_process === "string"
          ? cs.traditional_process
          : null;

        await admin.from("craft_stories").insert({
          product_id: productData.id,
          artisan_story_raw: cs.artisan_story_raw || null,
          story_en: cs.story_en,
          story_hi: cs.story_hi,
          traditional_process: processText,
          generational_lineage: cs.generational_lineage || null,
        });
      } catch (storyErr) {
        console.warn("Craft story insert warning:", storyErr);
      }
    }

    return {
      success: true,
      slug: finalSlug,
      id: productData.id,
    };
  } catch (err: any) {
    console.error("publishProductAction fatal error:", err);
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during publishing.",
      slug: input.slug,
    };
  }
}
