import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice, getPrimaryImageUrl, getTotalStock } from "@/lib/utils";

export default async function AdminProductsPage() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      collection:collections(id, name, slug)
    `)
    .order("created_at", { ascending: false });

  const products = (data as unknown as Product[]) || [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: 400,
          }}
        >
          Products
        </h1>
        <Link href="/admin/products/new" className="btn-solid">
          + New Product
        </Link>
      </div>

      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
          overflow: "auto",
        }}
      >
        <table className="maison-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Image</th>
              <th>Name</th>
              <th>Collection</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const primary = getPrimaryImageUrl(product.images || []);
              const stock = getTotalStock(product.variants || []);
              return (
                <tr key={product.id}>
                  <td>
                    <div
                      style={{
                        width: 40,
                        height: 52,
                        position: "relative",
                        background: "var(--color-border)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={primary.url}
                        alt={primary.alt}
                        fill
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td>
                    <p
                      style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{ fontSize: "0.7rem", color: "var(--color-muted)" }}
                    >
                      {product.slug}
                    </p>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                    {(product.collection as any)?.name || "—"}
                  </td>
                  <td style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem" }}>
                    {formatPrice(product.price)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color:
                          stock === 0
                            ? "var(--color-error)"
                            : stock <= 3
                            ? "var(--color-error)"
                            : "var(--color-success)",
                        fontWeight: 500,
                      }}
                    >
                      {stock === 0
                        ? "Out of Stock"
                        : stock <= 3
                        ? `Low (${stock})`
                        : stock}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        fontSize: "0.62rem",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background: product.is_active
                          ? "rgba(61,107,79,0.1)"
                          : "rgba(176,71,71,0.1)",
                        color: product.is_active
                          ? "var(--color-success)"
                          : "var(--color-error)",
                      }}
                    >
                      {product.is_active ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-muted)",
                          opacity: 0.7,
                        }}
                      >
                        View ↗
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="btn-ghost"
                        style={{ padding: "4px 12px", fontSize: "0.68rem" }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--color-muted)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "1.25rem",
                marginBottom: 12,
              }}
            >
              No products yet.
            </p>
            <Link href="/admin/products/new" className="btn-ghost">
              Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
