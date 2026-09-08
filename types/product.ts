import { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type ProductTag = Database["public"]["Tables"]["product_tags"]["Row"];
export type CraftStory = Database["public"]["Tables"]["craft_stories"]["Row"];

export type ProductStatus = "draft" | "published" | "archived";

export interface KeyAttribute {
  attributeNameEn: string;
  attributeNameHi: string;
  attributeValueEn: string;
  attributeValueHi: string;
}

export interface CraftStoryData {
  id?: string;
  product_id?: string;
  artisan_story_raw: string;
  story_en: string;
  story_hi: string;
  traditional_process?: string[] | string | null;
  generational_lineage?: string | null;
  story_source: "artisan_provided" | "demo_data";
  created_at?: string;
}

export interface FullProductWithDetails extends Product {
  artisan?: Profile;
  tags?: ProductTag[];
  craft_story?: CraftStoryData | null;
  is_demo?: boolean;
}
