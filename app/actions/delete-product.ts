"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface DeleteProductInput {
  id?: string;
  slug?: string;
}

export interface DeleteProductResponse {
  success: boolean;
  error?: string;
}

export async function deleteProductAction(
  input: DeleteProductInput
): Promise<DeleteProductResponse> {
  const { id, slug } = input || {};
  if (!id && !slug) {
    return { success: false, error: "Product ID or slug is required for deletion." };
  }

  try {
    const admin = createAdminClient() as any;

    let targetId = id;
    let targetSlug = slug;

    // Check if ID is a valid UUID
    const isUuid = Boolean(targetId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId));

    // If targetId is not a UUID, resolve it via slug
    if (!isUuid && targetSlug) {
      const { data } = await admin
        .from("products")
        .select("id")
        .eq("slug", targetSlug)
        .maybeSingle();
      if (data?.id) {
        targetId = data.id;
      }
    }

    // 1. Delete associated craft stories
    if (targetId && isUuid) {
      try {
        await admin.from("craft_stories").delete().eq("product_id", targetId);
      } catch (err) {
        console.warn("Craft stories cleanup warning:", err);
      }

      // 2. Delete associated product tags
      try {
        await admin.from("product_tags").delete().eq("product_id", targetId);
      } catch (err) {
        console.warn("Product tags cleanup warning:", err);
      }

      // 3. Delete the product by ID
      const { error: delErr } = await admin
        .from("products")
        .delete()
        .eq("id", targetId);

      if (delErr) {
        console.error("Failed to delete product by id:", delErr);
        return { success: false, error: delErr.message };
      }
    } else if (targetSlug) {
      // Delete directly by unique slug
      const { error: delErr } = await admin
        .from("products")
        .delete()
        .eq("slug", targetSlug);

      if (delErr) {
        console.error("Failed to delete product by slug:", delErr);
        return { success: false, error: delErr.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("deleteProductAction fatal error:", err);
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during deletion.",
    };
  }
}
