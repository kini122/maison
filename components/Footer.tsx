import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-text)",
        color: "var(--color-bg)",
        padding: "64px 24px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
          paddingBottom: 48,
          borderBottom: "1px solid rgba(200,190,178,0.2)",
        }}
      >
        {/* Brand */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.75rem",
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Maison
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: "var(--color-accent)",
              maxWidth: 220,
              lineHeight: 1.5,
            }}
          >
            Clothing as considered as the life it accompanies.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 16,
            }}
          >
            Shop
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Ready-to-Wear", "/collections/ready-to-wear"],
              ["Outerwear", "/collections/outerwear"],
              ["Knitwear", "/collections/knitwear"],
              ["Trousers & Skirts", "/collections/trousers-skirts"],
              ["Shirts & Blouses", "/collections/shirts-blouses"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(247,245,242,0.75)",
                  transition: "color 200ms ease",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Info */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 16,
            }}
          >
            Information
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Collections", "/collections"],
              ["About Maison", "/about"],
              ["Care Guide", "/care"],
              ["Returns & Exchanges", "/returns"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(247,245,242,0.75)",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Newsletter */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: 16,
            }}
          >
            Stay in the Season
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(247,245,242,0.65)",
              marginBottom: 16,
              lineHeight: 1.6,
            }}
          >
            New arrivals and editorial notes, delivered rarely.
          </p>
          <form
            action="#"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(200,190,178,0.3)",
                color: "var(--color-bg)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
            <button
              type="button"
              style={{
                padding: "10px 14px",
                background: "var(--color-accent)",
                border: "none",
                color: "var(--color-text)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          paddingTop: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(247,245,242,0.4)",
          }}
        >
          © {new Date().getFullYear()} Maison. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{ color: "rgba(247,245,242,0.5)" }}
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
