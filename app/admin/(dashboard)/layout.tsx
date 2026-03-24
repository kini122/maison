"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import Providers from "@/components/Providers";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }: any) => {
      if (error || !data?.user) {
        router.push("/admin/login");
        return;
      }
      setUserEmail(data.user.email || "");
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/admin"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.3rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            display: "block",
          }}
        >
          Maison
        </Link>
        <span
          style={{
            fontSize: "0.58rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          Admin Console
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                background: isActive ? "var(--color-bg)" : "transparent",
                borderLeft: isActive
                  ? "2px solid var(--color-text)"
                  : "2px solid transparent",
                transition: "all 200ms ease",
                color: isActive ? "var(--color-text)" : "var(--color-muted)",
              }}
            >
              <item.icon size={16} strokeWidth={1.5} />
              <span className="admin-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <p
          className="admin-sidebar-label"
          style={{
            fontSize: "0.7rem",
            color: "var(--color-muted)",
            marginBottom: 10,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userEmail}
        </p>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "var(--color-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          <span className="admin-sidebar-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div className="admin-main">
          <div style={{ padding: 32 }}>{children}</div>
        </div>
      </div>
    </Providers>
  );
}
