import { getSupabaseServerPublicClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/types";

export default async function AdminCollectionsPage() {
  const supabase = getSupabaseServerPublicClient();
  const { data } = await supabase
    .from("collections")
    .select("*, product_count:products(count)")
    .order("display_order");

  const collections = ((data || []).map((c: any) => ({
    ...c,
    product_count: c.product_count?.[0]?.count ?? 0,
  })) as (Collection & { product_count: number })[]);

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
          Collections
        </h1>
        <Link href="/admin/collections/new" className="btn-solid">
          + New Collection
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
              <th style={{ width: 60 }}>Cover</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id}>
                <td>
                  <div
                    style={{
                      width: 40,
                      height: 30,
                      position: "relative",
                      background: "var(--color-border)",
                      overflow: "hidden",
                    }}
                  >
                    {col.cover_image_url && (
                      <Image
                        src={col.cover_image_url}
                        alt={col.name}
                        fill
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                </td>
                <td>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {col.name}
                  </p>
                </td>
                <td
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-muted)",
                    fontFamily: "monospace",
                  }}
                >
                  {col.slug}
                </td>
                <td style={{ fontSize: "0.85rem" }}>{col.product_count}</td>
                <td style={{ fontSize: "0.85rem" }}>{col.display_order}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      fontSize: "0.62rem",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: col.is_active
                        ? "rgba(61,107,79,0.1)"
                        : "rgba(176,71,71,0.1)",
                      color: col.is_active
                        ? "var(--color-success)"
                        : "var(--color-error)",
                    }}
                  >
                    {col.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link
                    href={`/admin/collections/${col.id}`}
                    className="btn-ghost"
                    style={{ padding: "4px 12px", fontSize: "0.68rem" }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
