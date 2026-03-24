import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  
  const authSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}
      }
    }
  );

  const {
    data: { user },
    error: authError,
  } = await authSupabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    }
  );

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const altText = formData.get("altText") as string;
    const isPrimary = formData.get("isPrimary") === "true";
    const displayOrder = Number(formData.get("displayOrder") || 0);

    if (!file || !productId) {
      return NextResponse.json(
        { error: "File and productId required" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate blur placeholder using sharp
    let blurDataUrl: string | null = null;
    try {
      const blurBuffer = await sharp(buffer)
        .resize(10, 10, { fit: "inside" })
        .jpeg({ quality: 50 })
        .toBuffer();
      blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
    } catch (e) {
      console.warn("Could not generate blur placeholder:", e);
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const storagePath = `products/${productId}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(storagePath);

    const pending = formData.get("pending") === "true";

    if (pending) {
      return NextResponse.json({
        image: {
          id: Math.random().toString(36).slice(2),
          product_id: productId,
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: altText || null,
          display_order: displayOrder,
          is_primary: isPrimary,
          blur_data_url: blurDataUrl,
          pending: true
        }
      });
    }

    // Insert into product_images table if NOT pending
    const { data: imageRow, error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        storage_path: storagePath,
        public_url: publicUrl,
        alt_text: altText || null,
        display_order: displayOrder,
        is_primary: isPrimary,
        blur_data_url: blurDataUrl,
      } as any)
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ image: imageRow });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
