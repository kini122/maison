import type { Product, Collection, ProductImage } from "@/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const IMAGE_SELECT = `
  id,
  product_id,
  storage_path,
  public_url,
  alt_text,
  display_order,
  is_primary,
  blur_data_url
`;

const VARIANT_SELECT = `
  id,
  product_id,
  size,
  sku,
  stock_quantity,
  is_available
`;

const PRODUCT_SELECT = `
  id,
  collection_id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  material,
  care_instructions,
  country_of_origin,
  is_active,
  is_featured,
  created_at,
  updated_at,
  images:product_images(${IMAGE_SELECT}),
  variants:product_variants(${VARIANT_SELECT}),
  collection:collections(id, name, slug)
`;

export async function getAllCollections(): Promise<Collection[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*, product_count:products(count)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  return (data || []).map((col: any) => ({
    ...col,
    product_count: col.product_count?.[0]?.count ?? 0,
  }));
}

export async function getCollectionBySlug(
  slug: string
): Promise<Collection | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getProductsByCollection(
  collectionSlug: string,
  page = 1,
  pageSize = 20,
  sort: "price_asc" | "price_desc" | "newest" = "newest",
  size?: string
): Promise<{ products: Product[]; total: number }> {
  const supabase = getSupabaseServerClient();

  // Get collection id first
  const { data: col } = await supabase
    .from("collections")
    .select("id")
    .eq("slug", collectionSlug)
    .single();

  if (!col) return { products: [], total: 0 };

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("collection_id", col.id)
    .eq("is_active", true);

  if (size) {
    query = query.eq("variants.size", size);
  }

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }

  return { products: (data as unknown as Product[]) || [], total: count || 0 };
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;

  // Sort images by display_order
  if (data && data.images) {
    (data as any).images = (data as any).images.sort(
      (a: ProductImage, b: ProductImage) => a.display_order - b.display_order
    );
  }

  return data as unknown as Product;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(limit);

  if (error) return [];
  return (data as unknown as Product[]) || [];
}

export async function getRelatedProducts(
  collectionId: string,
  currentProductId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("collection_id", collectionId)
    .neq("id", currentProductId)
    .eq("is_active", true)
    .limit(limit);

  if (error) return [];
  return (data as unknown as Product[]) || [];
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);
  return (data || []).map((p: any) => p.slug);
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("collections")
    .select("slug")
    .eq("is_active", true);
  return (data || []).map((c: any) => c.slug);
}
