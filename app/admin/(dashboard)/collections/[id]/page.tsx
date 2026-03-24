import { getSupabaseServerPublicClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CollectionForm from "@/components/admin/CollectionForm";
import type { Collection } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const supabase = getSupabaseServerPublicClient();

  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <CollectionForm collection={data as Collection} />;
}
