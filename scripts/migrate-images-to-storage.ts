import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

// Ensure Node 18+ for native fetch

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateImages() {
  console.log("Starting image migration to Supabase Storage...");

  // 1. Ensure bucket exists
  console.log("Checking bucket 'product-images'...");
  const { data: bucketData, error: bucketCheckError } = await supabase
    .storage
    .getBucket("product-images");

  if (bucketCheckError && bucketCheckError.message.includes("not found")) {
    console.log("Bucket not found. Creating...");
    const { error: createError } = await supabase.storage.createBucket("product-images", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    if (createError) {
      console.error("Failed to create bucket:", createError);
      process.exit(1);
    }
    console.log("✓ Bucket created.");
  } else if (bucketCheckError) {
    console.error("Error checking bucket:", bucketCheckError);
  } else {
    console.log("✓ Bucket exists.");
  }

  // 2. Fetch all product images pointing to Unsplash
  console.log("Fetching images to migrate...");
  const { data: images, error: fetchError } = await supabase
    .from("product_images")
    .select("*");

  if (fetchError) {
    console.error("Failed to fetch product_images:", fetchError);
    process.exit(1);
  }

  const unsplashImages = images?.filter(img => img.public_url && img.public_url.includes("unsplash.com")) || [];
  console.log(`Found ${unsplashImages.length} images to migrate from Unsplash.`);

  if (unsplashImages.length === 0) {
    console.log("Nothing to do!");
    return;
  }

  for (const [index, img] of unsplashImages.entries()) {
    try {
      console.log(`[${index + 1}/${unsplashImages.length}] Migrating image for product ${img.product_id}...`);
      
      // Fetch image from Unsplash
      const res = await fetch(img.public_url);
      if (!res.ok) {
        throw new Error(`Failed to download ${img.public_url}. Status: ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.jpg`;
      const storagePath = `products/${img.product_id}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(storagePath, buffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(storagePath);

      // Update Database record
      const { error: updateError } = await supabase
        .from("product_images")
        .update({
          public_url: publicUrl,
          storage_path: storagePath
        })
        .eq("id", img.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`  ✓ Successfully migrated to ${storagePath}`);
    } catch (e: any) {
      console.error(`  ✗ Failed to migrate image ${img.id}:`, e.message);
    }

    // Rate limiting prevention for Unsplash (50 requests per hr if anon, simple delay just in case)
    await new Promise(r => setTimeout(r, 800));
  }

  // 3. Migrate Collection Covers as well
  const { data: collections, error: colError } = await supabase.from("collections").select("*");
  if (!colError && collections) {
    const unsplashCollections = collections.filter(c => c.cover_image_url && c.cover_image_url.includes("unsplash.com"));
    console.log(`\nFound ${unsplashCollections.length} collection covers to migrate.`);
    
    for (const [index, col] of unsplashCollections.entries()) {
      try {
        console.log(`[${index + 1}/${unsplashCollections.length}] Migrating cover for collection ${col.slug}...`);
        
        const res = await fetch(col.cover_image_url!);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.jpg`;
        const storagePath = `collections/${col.id}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(storagePath, buffer, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(storagePath);

        await supabase.from("collections").update({ cover_image_url: publicUrl }).eq("id", col.id);
        console.log(`  ✓ Successfully migrated collection cover.`);
      } catch (e: any) {
        console.error(`  ✗ Failed to migrate collection ${col.id}:`, e.message);
      }
      await new Promise(r => setTimeout(r, 800));
    }
  }

  console.log("\n✅ Migration complete! All images are now hosted natively on Supabase Storage.");
}

migrateImages().catch(console.error);
