"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { formatPrice, getFirstTwoSentences } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  const images = product.images || [];
  const variants = product.variants || [];

  const [mainIdx, setMainIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    "description"
  );

  const addItem = useCartStore((s) => s.addItem);

  const mainImage = images[mainIdx] || null;
  const hasComparePrice =
    product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      price: product.price,
      quantity: 1,
      maxQuantity: selectedVariant.stock_quantity,
      imageUrl: images[0]?.public_url || "",
      imageAlt: images[0]?.alt_text || product.name,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const accordions = [
    {
      id: "description",
      label: "Full Description",
      content: product.description,
    },
    {
      id: "material",
      label: "Material & Composition",
      content: [
        product.material && `Material: ${product.material}`,
        product.country_of_origin &&
          `Country of Origin: ${product.country_of_origin}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: product.care_instructions,
    },
    {
      id: "delivery",
      label: "Delivery & Returns",
      content:
        "Standard delivery within 5–7 working days. Express delivery available at checkout. Returns accepted within 14 days of delivery in original, unworn condition. Please retain all tags and packaging.",
    },
  ].filter((a) => a.content);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60% 40%",
          minHeight: "calc(100vh - 64px)",
          maxWidth: 1400,
          margin: "0 auto",
        }}
        className="product-layout"
      >
        {/* Image gallery */}
        <div className="image-gallery" style={{ padding: "32px 32px 32px 24px" }}>
          {/* Thumbnails */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            className="thumb-strip"
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setMainIdx(i)}
                style={{
                  width: 72,
                  height: 96,
                  position: "relative",
                  border:
                    i === mainIdx
                      ? "1.5px solid var(--color-text)"
                      : "1.5px solid transparent",
                  cursor: "pointer",
                  overflow: "hidden",
                  background: "none",
                  flexShrink: 0,
                  transition: "border-color 200ms",
                }}
              >
                <Image
                  src={img.public_url}
                  alt={img.alt_text || product.name}
                  fill
                  sizes="72px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              cursor: "zoom-in",
              background: "var(--color-border)",
              overflow: "hidden",
            }}
            onClick={() => setLightbox(true)}
          >
            {mainImage && (
              <Image
                src={mainImage.public_url}
                alt={mainImage.alt_text || product.name}
                fill
                priority
                sizes="60vw"
                style={{ objectFit: "cover" }}
                placeholder={mainImage.blur_data_url ? "blur" : "empty"}
                blurDataURL={mainImage.blur_data_url || undefined}
              />
            )}
          </div>
        </div>

        {/* Product info — sticky */}
        <div
          style={{
            padding: "48px 32px 48px 24px",
            position: "sticky",
            top: 64,
            alignSelf: "start",
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
          className="product-info-panel"
        >
          {/* Collection */}
          {product.collection && (
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: 8,
              }}
            >
              {product.collection.name}
            </p>
          )}

          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            {hasComparePrice && (
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.2rem",
                  color: "var(--color-muted)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.price)}
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                fontWeight: 400,
                color: hasComparePrice ? "var(--color-error)" : "var(--color-text)",
              }}
            >
              {formatPrice(hasComparePrice ? product.compare_at_price! : product.price)}
            </span>
          </div>

          {/* Short description */}
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "var(--color-muted)",
              marginBottom: 28,
            }}
          >
            {getFirstTwoSentences(product.description)}
          </p>

          <div className="divider" style={{ marginBottom: 24 }} />

          {/* Size selector */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Select Size{" "}
              {!selectedVariant && (
                <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>
                  — Required
                </span>
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {variants.map((v) => {
                const isUnavailable =
                  v.stock_quantity === 0 || !v.is_available;
                const isLowStock = v.stock_quantity > 0 && v.stock_quantity <= 2;
                const isSelected = selectedVariant?.id === v.id;

                return (
                  <button
                    key={v.id}
                    onClick={() => !isUnavailable && setSelectedVariant(v)}
                    className={`pill ${isSelected ? "pill-selected" : ""} ${isUnavailable ? "pill-disabled" : ""}`}
                    style={{
                      cursor: isUnavailable ? "not-allowed" : "pointer",
                      border: "none",
                      position: "relative",
                    }}
                    disabled={isUnavailable}
                  >
                    {v.size}
                    {isLowStock && (
                      <span
                        className="low-stock-dot"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to bag */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className={selectedVariant ? "btn-solid" : "btn-ghost"}
            style={{
              width: "100%",
              marginBottom: 16,
              opacity: selectedVariant ? 1 : 0.4,
              cursor: selectedVariant ? "pointer" : "not-allowed",
              transition: "all 200ms ease",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
            }}
          >
            {addedToCart
              ? "Added to Bag ✓"
              : selectedVariant
              ? "Add to Bag"
              : "Select a Size"}
          </button>

          <div className="divider" style={{ margin: "24px 0" }} />

          {/* Accordions */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {accordions.map((acc) => (
              <div key={acc.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <button
                  onClick={() =>
                    setExpandedAccordion(
                      expandedAccordion === acc.id ? null : acc.id
                    )
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {acc.label}
                  </span>
                  {expandedAccordion === acc.id ? (
                    <ChevronUp size={14} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={1.5} />
                  )}
                </button>
                {expandedAccordion === acc.id && (
                  <div style={{ paddingBottom: 16 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        lineHeight: 1.75,
                        color: "var(--color-muted)",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {acc.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && mainImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image lightbox"
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightbox(false);
            if (e.key === "ArrowRight")
              setMainIdx((i) => Math.min(i + 1, images.length - 1));
            if (e.key === "ArrowLeft") setMainIdx((i) => Math.max(i - 1, 0));
          }}
          tabIndex={0}
          style={{ outline: "none" }}
        >
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "none",
              color: "#F7F5F2",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="Close lightbox"
          >
            <X size={28} strokeWidth={1} />
          </button>
          <div
            style={{
              position: "relative",
              width: "min(90vw, 700px)",
              height: "min(90vh, 900px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={mainImage.public_url}
              alt={mainImage.alt_text || product.name}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          {/* Thumbnail strip in lightbox */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setMainIdx(i)}
                style={{
                  width: 40,
                  height: 52,
                  position: "relative",
                  border:
                    i === mainIdx
                      ? "1px solid rgba(247,245,242,0.8)"
                      : "1px solid transparent",
                  background: "none",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={img.public_url}
                  alt=""
                  fill
                  sizes="40px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .product-layout {
            grid-template-columns: 1fr !important;
          }
          .image-gallery {
            grid-template-columns: 1fr !important;
          }
          .thumb-strip {
            flex-direction: row !important;
            overflow-x: auto !important;
            max-height: none !important;
          }
          .product-info-panel {
            position: static !important;
            max-height: none !important;
            padding: 24px !important;
          }
        }
      `}</style>
    </>
  );
}
