import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerPublicClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      collection:collections(id, name, slug)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
