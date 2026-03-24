import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const replacements = [
  { 
    name: "Sandwashed Silk Slip Dress", 
    img1: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    img2: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
  },
  { 
    name: "Washed Linen Kaftan", 
    img1: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    img2: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
  },
  { 
    name: "Felted Wool A-Line Dress", 
    img1: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    img2: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"
  },
  { 
    name: "Bias-Cut Satin Skirt", 
    img1: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&q=80",
    img2: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"
  }
];

async function updateImages() {
  console.log("Updating product images...");
  for (const { name, img1, img2 } of replacements) {
    const { data: prod } = await supabase
      .from("products")
      .select("id")
      .eq("name", name)
      .single();
      
    if (prod) {
      await supabase
        .from("product_images")
        .update({ public_url: img1 })
        .eq("product_id", prod.id)
        .eq("is_primary", true);
        
      await supabase
        .from("product_images")
        .update({ public_url: img2 })
        .eq("product_id", prod.id)
        .eq("is_primary", false);
        
      console.log(`✓ Updated images for: ${name}`);
    } else {
      console.log(`✗ Product not found: ${name}`);
    }
  }
}

updateImages().catch(console.error);
