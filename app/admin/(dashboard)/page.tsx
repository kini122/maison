import { getSupabaseServerPublicClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, FolderOpen, AlertTriangle, TrendingDown } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServerPublicClient();

  // Fetch stats in parallel
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalCollections },
    { count: outOfStock },
    { count: lowStock },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("collections").select("*", { count: "exact", head: true }),
    supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .eq("stock_quantity", 0),
    supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .gt("stock_quantity", 0)
      .lte("stock_quantity", 3),
  ]);

  const stats = [
    {
      label: "Active Products",
      value: `${activeProducts} / ${totalProducts}`,
      icon: Package,
      sub: "Total across all collections",
    },
    {
      label: "Collections",
      value: String(totalCollections || 0),
      icon: FolderOpen,
      sub: "Active product sections",
    },
    {
      label: "Out of Stock",
      value: String(outOfStock || 0),
      icon: AlertTriangle,
      sub: "Variants with 0 units",
      alert: (outOfStock || 0) > 0,
    },
    {
      label: "Low Stock",
      value: String(lowStock || 0),
      icon: TrendingDown,
      sub: "Variants with ≤ 3 units",
      alert: (lowStock || 0) > 0,
    },
  ];

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
          Dashboard
        </h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/products/new" className="btn-ghost">
            + New Product
          </Link>
          <Link href="/admin/collections" className="btn-solid">
            + New Collection
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stats-card"
            style={{
              borderLeft: stat.alert
                ? "3px solid var(--color-error)"
                : "3px solid var(--color-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                {stat.label}
              </p>
              <stat.icon
                size={16}
                strokeWidth={1.5}
                style={{
                  color: stat.alert
                    ? "var(--color-error)"
                    : "var(--color-muted)",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2rem",
                fontWeight: 400,
                marginBottom: 4,
                color: stat.alert ? "var(--color-error)" : "var(--color-text)",
              }}
            >
              {stat.value}
            </p>
            <p
              style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}
            >
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 16,
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/admin/products/new" className="btn-ghost">
            Add New Product
          </Link>
          <Link href="/admin/collections" className="btn-ghost">
            Manage Collections
          </Link>
          <Link href="/admin/products" className="btn-ghost">
            View All Products
          </Link>
          <Link
            href="/"
            target="_blank"
            className="btn-ghost"
            style={{ opacity: 0.6 }}
          >
            View Storefront ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
