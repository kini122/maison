-- ============================================================
-- MAISON — Complete Database Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID gen
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Collections ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  material TEXT,
  care_instructions TEXT,
  country_of_origin TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Product Images ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  blur_data_url TEXT
);

-- ─── Product Variants ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  sku TEXT UNIQUE,
  stock_quantity INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE
);

-- ─── Admin Users ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- ─── Updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access (anon + authenticated)
CREATE POLICY "collections_public_read" ON collections
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "products_public_read" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "product_images_public_read" ON product_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "product_variants_public_read" ON product_variants
  FOR SELECT TO anon, authenticated USING (true);

-- Write access: authenticated only
CREATE POLICY "collections_auth_write" ON collections
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "products_auth_write" ON products
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "product_images_auth_write" ON product_images
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "product_variants_auth_write" ON product_variants
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Admin users: read own record
CREATE POLICY "admin_users_own_read" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════

-- Run in Supabase dashboard → Storage → Create bucket:
-- Name: product-images
-- Public: true
-- Or run:
-- SELECT storage.create_bucket('product-images', '{"public": true}');
