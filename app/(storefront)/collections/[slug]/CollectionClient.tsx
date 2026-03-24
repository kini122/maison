"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Collection, Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { ChevronDown } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const PAGE_SIZE = 20;

interface Props {
  collection: Collection;
  initialProducts: Product[];
  total: number;
  currentSort: string;
  currentSize?: string;
  currentPage: number;
}

export default function CollectionClient({
  collection,
  initialProducts,
  total,
  currentSort,
  currentSize,
  currentPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialProducts.length < total ? true : false
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Infinite scroll load more
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const from = (nextPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: col } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", collection.slug)
      .single();

    if (!col) {
      setLoading(false);
      return;
    }

    const colData = col as unknown as { id: string };

    let query = supabase
      .from("products")
      .select(
        `*,
        images:product_images(*),
        variants:product_variants(*),
        collection:collections(id, name, slug)`
      )
      .eq("collection_id", colData.id)
      .eq("is_active", true);

    if (currentSize) query = query.eq("variants.size", currentSize);

    if (currentSort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (currentSort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, to);
    const { data, error } = await query;

    if (!error && data) {
      setProducts((prev) => [...prev, ...(data as unknown as Product[])]);
      setPage(nextPage);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, page, collection.slug, currentSize, currentSort]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset when filters change
  useEffect(() => {
    setProducts(initialProducts);
    setPage(currentPage);
    setHasMore(initialProducts.length < total);
  }, [initialProducts, currentPage, total]);

  return (
    <div>
      {/* Collection header */}
      <div
        style={{
          position: "relative",
          height: 320,
          overflow: "hidden",
          background: "var(--color-border)",
        }}
      >
        {collection.cover_image_url && (
          <Image
            src={collection.cover_image_url}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,26,26,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
            textAlign: "center",
            padding: 24,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 300,
              color: "#F7F5F2",
              letterSpacing: "-0.01em",
            }}
          >
            {collection.name}
          </h1>
          {collection.description && (
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "rgba(247,245,242,0.8)",
                fontSize: "1rem",
                maxWidth: 500,
              }}
            >
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Sticky filter bar */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 30,
          background: "rgba(247,245,242,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--color-border)",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--color-muted)",
              letterSpacing: "0.05em",
            }}
          >
            {total} pieces
          </p>

          <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
            {/* Size filter */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() =>
                    updateFilter("size", currentSize === sz ? "" : sz)
                  }
                  className={`pill ${currentSize === sz ? "pill-selected" : ""}`}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Sort selector */}
            <div style={{ position: "relative" }}>
              <select
                value={currentSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                style={{
                  appearance: "none",
                  padding: "4px 28px 4px 10px",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
              <ChevronDown
                size={12}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} style={{ height: 40, marginTop: 40 }}>
              {loading && (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "var(--color-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Loading…
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--color-muted)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "1.5rem",
                marginBottom: 16,
              }}
            >
              Nothing here yet.
            </p>
            <p style={{ fontSize: "0.85rem" }}>
              Try adjusting your filters or browse the full collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
