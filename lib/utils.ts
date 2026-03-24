/**
 * Format a number as Indian Rupee with Indian number system
 * e.g. 124500 → ₹1,24,500
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a given number of words
 */
export function truncateWords(text: string, wordCount: number): string {
  const words = text.split(" ");
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "…";
}

/**
 * Get the first two sentences of a text
 */
export function getFirstTwoSentences(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, 2).join(" ").trim();
}

/**
 * Get the primary image URL from a product's images array
 */
export function getPrimaryImageUrl(
  images: Array<{ public_url: string; is_primary: boolean; alt_text: string | null }>
): { url: string; alt: string } {
  if (!images || images.length === 0) {
    return {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      alt: "Product image",
    };
  }
  const primary = images.find((img) => img.is_primary) || images[0];
  return { url: primary.public_url, alt: primary.alt_text || "Product image" };
}

/**
 * Check if a product is completely out of stock
 */
export function isOutOfStock(
  variants: Array<{ stock_quantity: number; is_available: boolean }>
): boolean {
  if (!variants || variants.length === 0) return true;
  return variants.every((v) => v.stock_quantity === 0 || !v.is_available);
}

/**
 * Get total stock across all variants
 */
export function getTotalStock(
  variants: Array<{ stock_quantity: number }>
): number {
  if (!variants) return 0;
  return variants.reduce((sum, v) => sum + v.stock_quantity, 0);
}

/**
 * clsx helper - combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * localStorage image cache key
 */
export function getImageCacheKey(productId: string): string {
  return `maison_img_cache_${productId}`;
}

/**
 * Format WhatsApp message
 */
export function buildWhatsAppMessage(data: {
  fullName: string;
  phone: string;
  email: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  lat?: number;
  lng?: number;
  notes?: string;
}): string {
  const itemsText = data.items
    .map(
      (item) =>
        `* ${item.name} — Size ${item.size} × ${item.quantity}\n  ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const mapLink =
    data.lat && data.lng
      ? `https://maps.google.com/?q=${data.lat},${data.lng}`
      : "Not provided";

  const addressLine2 = data.addressLine2 ? `\n${data.addressLine2}` : "";

  return `NEW ORDER — MAISON
━━━━━━━━━━━━━━━━━━━━━

CUSTOMER DETAILS
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}

ORDER ITEMS
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
Subtotal: ${formatPrice(data.subtotal)}
Shipping: To be confirmed
Total: ${formatPrice(data.subtotal)}

DELIVERY ADDRESS
${data.addressLine1}${addressLine2}
${data.city}, ${data.state} — ${data.pinCode}

MAP LOCATION
${mapLink}

DELIVERY NOTES
${data.notes || "None"}

━━━━━━━━━━━━━━━━━━━━━
Placed via Maison Website`;
}
