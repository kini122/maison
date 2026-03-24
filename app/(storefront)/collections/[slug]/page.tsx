import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCollectionBySlug,
  getProductsByCollection,
  getAllCollectionSlugs,
} from "@/lib/queries";
import CollectionClient from "./CollectionClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; size?: string; page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Not Found" };
  return {
    title: collection.name,
    description:
      collection.description ||
      `Shop the ${collection.name} collection at Maison.`,
    openGraph: {
      title: `${collection.name} | Maison`,
      description: collection.description || "",
      images: collection.cover_image_url ? [collection.cover_image_url] : [],
    },
  };
}

export const revalidate = 3600;

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = (sp.sort as "price_asc" | "price_desc" | "newest") || "newest";
  const size = sp.size;
  const page = Number(sp.page || 1);

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const { products, total } = await getProductsByCollection(
    slug,
    page,
    20,
    sort,
    size
  );

  return (
    <CollectionClient
      collection={collection}
      initialProducts={products}
      total={total}
      currentSort={sort}
      currentSize={size}
      currentPage={page}
    />
  );
}
