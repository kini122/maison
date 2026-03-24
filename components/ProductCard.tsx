"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice, getPrimaryImageUrl, isOutOfStock } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const images = product.images || [];
  const primary = getPrimaryImageUrl(images);
  const secondary =
    images.length > 1
      ? { url: images[1].public_url, alt: images[1].alt_text || product.name }
      : null;

  const outOfStock = isOutOfStock(product.variants || []);
  const hasComparePrice =
    product.compare_at_price && product.compare_at_price > product.price;

  // Low stock sizes
  const lowStockSizes = (product.variants || [])
    .filter((v) => v.stock_quantity > 0 && v.stock_quantity <= 2)
    .map((v) => v.size);

  return (
    <Link href={`/products/${product.slug}`} className="product-card" style={{ display: "block" }}>
      {/* Image Container */}
      <div className="product-card-image-wrap">
        {/* Primary image */}
        <Image
          src={imageError ? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" : primary.url}
          alt={primary.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />

        {/* Secondary image (hover) */}
        {secondary && (
          <div className="product-card-secondary">
            <Image
              src={secondary.url}
              alt={secondary.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Sold out overlay */}
        {outOfStock && (
          <div className="sold-out-overlay">
            <span>Sold Out</span>
          </div>
        )}

        {/* Low stock pill */}
        {!outOfStock && lowStockSizes.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              padding: "2px 8px",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Last {lowStockSizes.join(", ")}
          </div>
        )}

        {/* Featured tag */}
        {product.is_featured && !outOfStock && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "var(--color-text)",
              color: "var(--color-white)",
              padding: "2px 8px",
              fontSize: "0.58rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: "12px 0 4px" }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.05rem",
            fontWeight: 400,
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 400,
              color: hasComparePrice ? "var(--color-muted)" : "var(--color-text)",
              textDecoration: hasComparePrice ? "line-through" : "none",
            }}
          >
            {formatPrice(product.price)}
          </span>
          {hasComparePrice && (
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: "var(--color-error)",
              }}
            >
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
