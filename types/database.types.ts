export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone_number: string | null;
          preferred_language: "hi" | "en";
          craft_type: string;
          state: string | null;
          district: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone_number?: string | null;
          preferred_language?: "hi" | "en";
          craft_type: string;
          state?: string | null;
          district?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone_number?: string | null;
          preferred_language?: "hi" | "en";
          craft_type?: string;
          state?: string | null;
          district?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          artisan_id: string;
          slug: string;
          title_en: string;
          title_hi: string;
          description_en: string;
          description_hi: string;
          category: string;
          craft_type: string;
          material: string;
          visual_attributes: Json;
          original_image_url: string;
          processed_image_url: string | null;
          base_cost: number;
          price_min: number;
          price_max: number;
          suggested_price: number;
          pricing_reasoning_en: string | null;
          pricing_reasoning_hi: string | null;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          slug: string;
          title_en: string;
          title_hi: string;
          description_en: string;
          description_hi: string;
          category: string;
          craft_type: string;
          material: string;
          visual_attributes?: Json;
          original_image_url: string;
          processed_image_url?: string | null;
          base_cost?: number;
          price_min?: number;
          price_max?: number;
          suggested_price?: number;
          pricing_reasoning_en?: string | null;
          pricing_reasoning_hi?: string | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          slug?: string;
          title_en?: string;
          title_hi?: string;
          description_en?: string;
          description_hi?: string;
          category?: string;
          craft_type?: string;
          material?: string;
          visual_attributes?: Json;
          original_image_url?: string;
          processed_image_url?: string | null;
          base_cost?: number;
          price_min?: number;
          price_max?: number;
          suggested_price?: number;
          pricing_reasoning_en?: string | null;
          pricing_reasoning_hi?: string | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag: string;
          tag_hi: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag: string;
          tag_hi?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          tag?: string;
          tag_hi?: string | null;
          created_at?: string;
        };
      };
      craft_stories: {
        Row: {
          id: string;
          product_id: string;
          artisan_story_raw: string | null;
          story_en: string;
          story_hi: string;
          traditional_process: string | null;
          generational_lineage: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          artisan_story_raw?: string | null;
          story_en: string;
          story_hi: string;
          traditional_process?: string | null;
          generational_lineage?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          artisan_story_raw?: string | null;
          story_en?: string;
          story_hi?: string;
          traditional_process?: string | null;
          generational_lineage?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
