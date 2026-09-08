-- ==============================================================================
-- KarigarAI — Initial Database Migration Schema
-- File: supabase/migrations/00001_initial_schema.sql
-- Description: Core schema for artisans, products, bilingual tags, and craft stories
-- Target Engine: PostgreSQL 16 (Supabase)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. UTILITY FUNCTIONS & TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 2. TABLE: profiles
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'hi' CHECK (preferred_language IN ('hi', 'en')),
    craft_type TEXT NOT NULL,
    state TEXT,
    district TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. TABLE: products
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artisan_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    craft_type TEXT NOT NULL,
    material TEXT NOT NULL,
    visual_attributes JSONB NOT NULL DEFAULT '[]'::jsonb,
    original_image_url TEXT NOT NULL,
    processed_image_url TEXT,
    base_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    price_min NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    price_max NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    suggested_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    pricing_reasoning_en TEXT,
    pricing_reasoning_hi TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_products_artisan_id ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- ==============================================================================
-- 4. TABLE: product_tags
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    tag_hi TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON public.product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON public.product_tags(tag);

-- ==============================================================================
-- 5. TABLE: craft_stories
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.craft_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    artisan_story_raw TEXT,
    story_en TEXT NOT NULL,
    story_hi TEXT NOT NULL,
    traditional_process TEXT,
    generational_lineage TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_craft_stories_updated_at
    BEFORE UPDATE ON public.craft_stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_stories ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Products Policies
CREATE POLICY "Published products are viewable by everyone"
    ON public.products FOR SELECT
    USING (status = 'published');

CREATE POLICY "Artisans can view their own products"
    ON public.products FOR SELECT
    USING (auth.uid() = artisan_id);

CREATE POLICY "Artisans can insert their own products"
    ON public.products FOR INSERT
    WITH CHECK (auth.uid() = artisan_id);

CREATE POLICY "Artisans can update their own products"
    ON public.products FOR UPDATE
    USING (auth.uid() = artisan_id);

CREATE POLICY "Artisans can delete their own products"
    ON public.products FOR DELETE
    USING (auth.uid() = artisan_id);

-- Product Tags Policies
CREATE POLICY "Public can view tags of published products"
    ON public.product_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_tags.product_id
            AND (products.status = 'published' OR products.artisan_id = auth.uid())
        )
    );

CREATE POLICY "Artisans can manage tags of their own products"
    ON public.product_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_tags.product_id
            AND products.artisan_id = auth.uid()
        )
    );

-- Craft Stories Policies
CREATE POLICY "Public can view stories of published products"
    ON public.craft_stories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = craft_stories.product_id
            AND (products.status = 'published' OR products.artisan_id = auth.uid())
        )
    );

CREATE POLICY "Artisans can manage stories of their own products"
    ON public.craft_stories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = craft_stories.product_id
            AND products.artisan_id = auth.uid()
        )
    );

-- ==============================================================================
-- 7. STORAGE BUCKET SETUP (Comments for execution in Supabase Dashboard/SQL)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;
