import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerPublicClient, getSupabaseServerClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      collection:collections(id, name, slug)
    `)
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  // Fetch images linked to this product to wipe them from storage
  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", id);

  if (images && images.length > 0) {
    const paths = images.map((img) => img.storage_path);
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(paths);
    
    if (storageError) {
      console.error("Failed to scrub storage bucket images:", storageError);
    }
  }

  // Deleting the product will cascade delete variant and image rows in PG
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
