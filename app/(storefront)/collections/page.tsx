import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCollections } from "@/lib/queries";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse all Maison collections — Ready-to-Wear, Outerwear, Knitwear, Trousers & Skirts, and Shirts & Blouses.",
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: "80px 24px 48px",
          borderBottom: "1px solid var(--color-border)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 12,
          }}
        >
          The Wardrobe
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 400,
          }}
        >
          Collections
        </h1>
      </div>

      {/* Collections list */}
      <div className="container" style={{ padding: "64px 24px" }}>
        {collections.map((col, i) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            style={{
              display: "grid",
              gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
              gap: 48,
              alignItems: "center",
              padding: "48px 0",
              borderBottom: "1px solid var(--color-border)",
              textDecoration: "none",
            }}
          >
            {/* Alternate layout */}
            {i % 2 === 0 ? (
              <>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/2",
                    overflow: "hidden",
                    background: "var(--color-border)",
                  }}
                >
                  {col.cover_image_url && (
                    <Image
                      src={col.cover_image_url}
                      alt={col.name}
                      fill
                      sizes="50vw"
                      style={{ objectFit: "cover", transition: "transform 400ms ease" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginBottom: 12,
                    }}
                  >
                    {(col as any).product_count || 0} pieces
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 400,
                      marginBottom: 16,
                    }}
                  >
                    {col.name}
                  </h2>
                  {col.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        color: "var(--color-muted)",
                        lineHeight: 1.6,
                        maxWidth: 400,
                        marginBottom: 24,
                      }}
                    >
                      {col.description}
                    </p>
                  )}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid var(--color-text)",
                      paddingBottom: 2,
                    }}
                  >
                    Explore <ArrowRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginBottom: 12,
                    }}
                  >
                    {(col as any).product_count || 0} pieces
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 400,
                      marginBottom: 16,
                    }}
                  >
                    {col.name}
                  </h2>
                  {col.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        color: "var(--color-muted)",
                        lineHeight: 1.6,
                        maxWidth: 400,
                        marginBottom: 24,
                      }}
                    >
                      {col.description}
                    </p>
                  )}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid var(--color-text)",
                      paddingBottom: 2,
                    }}
                  >
                    Explore <ArrowRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/2",
                    overflow: "hidden",
                    background: "var(--color-border)",
                  }}
                >
                  {col.cover_image_url && (
                    <Image
                      src={col.cover_image_url}
                      alt={col.name}
                      fill
                      sizes="50vw"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
