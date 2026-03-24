"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CartPage() {
  const {
    items,
    wishlist,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeFromWishlist,
    getSubtotal,
  } = useCartStore();

  const subtotal = getSubtotal();

  const [isMounted, setIsMounted] = useState(false);

  // Real-time stock validation
  useEffect(() => {
    setIsMounted(true);
    const validateStock = async () => {
      if (items.length === 0) return;
      const variantIds = items.map((i) => i.variantId);
      const { data } = await supabase
        .from("product_variants")
        .select("id, stock_quantity, is_available")
        .in("id", variantIds);

      if (data) {
        const { updateStockValidation } = useCartStore.getState();
        data.forEach((v: any) => {
          const item = items.find((i) => i.variantId === v.id);
          if (item && v.is_available) {
            updateStockValidation(item.productId, v.id, v.stock_quantity);
          }
        });
      }
    };
    validateStock();
  }, []); // eslint-disable-line

  if (!isMounted) return null;

  if (items.length === 0 && wishlist.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 24,
          textAlign: "center",
          padding: 24,
        }}
      >
        <ShoppingBag size={48} strokeWidth={0.75} style={{ opacity: 0.3 }} />
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "2rem",
              fontWeight: 400,
              marginBottom: 8,
            }}
          >
            Your bag is empty.
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", marginBottom: 24 }}>
            There&apos;s nothing here yet. Browse the collection to find
            something worth keeping.
          </p>
          <Link href="/collections" className="btn-ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.5rem",
          fontWeight: 400,
          marginBottom: 48,
        }}
      >
        Your Bag
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 64,
          alignItems: "start",
        }}
        className="cart-layout"
      >
        {/* Cart items */}
        <div>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 16,
              padding: "0 0 12px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              Item
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                textAlign: "right",
              }}
            >
              Total
            </span>
          </div>

          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: 16,
                padding: "20px 0",
                borderBottom: "1px solid var(--color-border)",
                alignItems: "center",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: 80,
                  height: 108,
                  position: "relative",
                  background: "var(--color-border)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Info */}
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    fontWeight: 400,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {item.productName}
                </Link>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-muted)",
                    marginBottom: 12,
                  }}
                >
                  Size: {item.size}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  {/* Qty stepper */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                        opacity: item.quantity <= 1 ? 0.3 : 1,
                      }}
                    >
                      <Minus size={12} strokeWidth={1.5} />
                    </button>
                    <span
                      style={{
                        width: 32,
                        textAlign: "center",
                        fontSize: "0.85rem",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= item.maxQuantity}
                      style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor:
                          item.quantity >= item.maxQuantity
                            ? "not-allowed"
                            : "pointer",
                        opacity: item.quantity >= item.maxQuantity ? 0.3 : 1,
                      }}
                    >
                      <Plus size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <button
                    onClick={() =>
                      saveForLater(item.productId, item.variantId)
                    }
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--color-muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    Save for later
                  </button>
                </div>
              </div>

              {/* Price + remove */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1rem",
                    fontWeight: 400,
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0.4,
                    transition: "opacity 200ms",
                  }}
                  aria-label="Remove item"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}

          {/* Wishlist/Saved items */}
          {wishlist.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                  color: "var(--color-muted)",
                }}
              >
                Saved for Later
              </h2>
              {wishlist.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-border)",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 72,
                      position: "relative",
                      background: "var(--color-border)",
                      flexShrink: 0,
                    }}
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.9rem",
                        marginBottom: 2,
                      }}
                    >
                      {item.productName}
                    </p>
                    <p
                      style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}
                    >
                      Size: {item.size} · {formatPrice(item.price)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => moveToCart(item.productId, item.variantId)}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: "none",
                        border: "1px solid var(--color-text)",
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Move to Bag
                    </button>
                    <button
                      onClick={() =>
                        removeFromWishlist(item.productId, item.variantId)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.4,
                      }}
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary panel — sticky */}
        <div
          style={{
            position: "sticky",
            top: 88,
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 32,
          }}
          className="cart-summary"
        >
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 400,
              marginBottom: 24,
            }}
          >
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
                Subtotal
              </span>
              <span
                style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
                Shipping
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
                Calculated at checkout
              </span>
            </div>
          </div>

          <div
            className="divider"
            style={{ margin: "16px 0" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Estimated Total
            </span>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.15rem",
                fontWeight: 400,
              }}
            >
              {formatPrice(subtotal)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="btn-solid"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/collections"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 16,
              fontSize: "0.72rem",
              color: "var(--color-muted)",
              opacity: 0.7,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cart-summary { position: static !important; }
        }
      `}</style>
    </div>
  );
}
