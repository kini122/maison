"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import type { Collection } from "@/types";
import { Upload, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Props {
  collection?: Collection;
}

export default function CollectionForm({ collection }: Props) {
  const router = useRouter();
  const isEdit = !!collection;

  const [name, setName] = useState(collection?.name || "");
  const [slug, setSlug] = useState(collection?.slug || "");
  const [description, setDescription] = useState(collection?.description || "");
  const [displayOrder, setDisplayOrder] = useState(
    collection?.display_order?.toString() || "0"
  );
  const [isActive, setIsActive] = useState(collection?.is_active ?? true);
  const [coverImageUrl, setCoverImageUrl] = useState(
    collection?.cover_image_url || ""
  );
  const [previewUrl, setPreviewUrl] = useState(
    collection?.cover_image_url || ""
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const uploadCoverImage = async (file: File) => {
    if (!collection?.id && !isEdit) {
      setError("Save the collection first to upload an image.");
      return;
    }
    setUploading(true);
    const collectionId = collection?.id || "temp";
    const ext = file.name.split(".").pop() || "jpg";
    const path = `collections/${collectionId}/cover.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    setCoverImageUrl(publicUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(false);
  };

  const handleSave = async () => {
    setError("");
    if (!name || !slug) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);

    const payload = {
      name,
      slug,
      description: description || null,
      display_order: Number(displayOrder),
      is_active: isActive,
      cover_image_url: coverImageUrl || null,
    };

    try {
      if (isEdit && collection) {
        const res = await fetch(`/api/collections/${collection.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create");
      }
      router.push("/admin/collections");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!collection) return;
    if (
      !confirm(
        "Delete this collection? Products will not be deleted but will lose their collection assignment."
      )
    )
      return;
    const res = await fetch(`/api/collections/${collection.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/collections");
      router.refresh();
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <Link
          href="/admin/collections"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.75rem",
            color: "var(--color-muted)",
          }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Collections
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 400,
          }}
        >
          {isEdit ? "Edit Collection" : "New Collection"}
        </h1>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 24,
            padding: "12px 16px",
            background: "rgba(176,71,71,0.06)",
            border: "1px solid rgba(176,71,71,0.2)",
            color: "var(--color-error)",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <label className="field-label" htmlFor="c-name">Name</label>
          <input
            id="c-name"
            className="field-input"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ready-to-Wear"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="c-slug">Slug</label>
          <input
            id="c-slug"
            className="field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ready-to-wear"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="c-desc">Description</label>
          <textarea
            id="c-desc"
            className="field-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
            placeholder="Seasonal pieces for everyday consideration."
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="field-label" htmlFor="c-order">Display Order</label>
            <input
              id="c-order"
              className="field-input"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
            <label className="toggle">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: "0.8rem" }}>Active</span>
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="field-label">Cover Image</label>
          {previewUrl && (
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 300,
                aspectRatio: "4/3",
                marginBottom: 12,
                background: "var(--color-border)",
                overflow: "hidden",
              }}
            >
              <Image
                src={previewUrl}
                alt={name}
                fill
                sizes="300px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files[0]) uploadCoverImage(e.dataTransfer.files[0]);
            }}
          >
            <Upload size={20} strokeWidth={1} style={{ marginBottom: 6, opacity: 0.4 }} />
            <p style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
              {uploading ? "Uploading…" : "Upload cover image"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) uploadCoverImage(e.target.files[0]);
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-solid"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Save size={14} strokeWidth={1.5} />
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Collection"}
          </button>
          <Link href="/admin/collections" className="btn-ghost">
            Cancel
          </Link>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                marginLeft: "auto",
                fontSize: "0.72rem",
                color: "var(--color-error)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
