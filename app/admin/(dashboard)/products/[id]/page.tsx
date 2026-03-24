import { getSupabaseServerPublicClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import type { Product, Collection } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = getSupabaseServerPublicClient();

  const [{ data: productData }, { data: collectionsData }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        collection:collections(id, name, slug)
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("collections")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ]);

  if (!productData) notFound();

  const product = productData as unknown as Product;
  // Sort images
  if (product.images) {
    product.images.sort((a, b) => a.display_order - b.display_order);
  }

  return (
    <ProductForm
      product={product}
      collections={(collectionsData as Collection[]) || []}
    />
  );
}
