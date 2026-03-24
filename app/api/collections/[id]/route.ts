import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ collection: data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("collections")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ collection: data });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  if (collection?.cover_image_url) {
    const url = collection.cover_image_url;
    // URL format: https://[URL]/storage/v1/object/public/product-images/collections/[id]/cover.jpg
    const match = url.match(/product-images\/(collections\/.*)$/);
    if (match && match[1]) {
      const storagePath = match[1];
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([storagePath]);
      if (storageError) {
        console.error("Failed to scrub collection cover image:", storageError);
      }
    }
  }

  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
