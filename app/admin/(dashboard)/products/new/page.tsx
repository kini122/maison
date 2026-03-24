import { getSupabaseServerPublicClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Collection } from "@/types";

export default async function NewProductPage() {
  const supabase = getSupabaseServerPublicClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const collections = (data as Collection[]) || [];

  return <ProductForm collections={collections} />;
}
