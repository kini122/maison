import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/queries";
import ProductClient from "./ProductClient";
import ProductCard from "@/components/ProductCard";
import { getPrimaryImageUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found" };

  const primary = getPrimaryImageUrl(product.images || []);

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Maison`,
      description: product.description.slice(0, 160),
      images: [{ url: primary.url, alt: primary.alt }],
    },
  };
}

export const revalidate = 3600;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = product.collection_id
    ? await getRelatedProducts(product.collection_id, product.id, 4)
    : [];

  return (
    <div>
      <ProductClient product={product} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "64px 24px",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                fontWeight: 400,
                marginBottom: 40,
              }}
            >
              You May Also Like
            </h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
