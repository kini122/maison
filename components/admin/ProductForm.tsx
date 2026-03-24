"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import type { Product, ProductImage, ProductVariant, Collection } from "@/types";
import {
  Upload,
  X,
  Plus,
  Star,
  Save,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const MIN_WORDS = 80;

interface VariantRow {
  id?: string;
  size: string;
  sku: string;
  stock_quantity: number;
  is_available: boolean;
}

interface Props {
  product?: Product;
  collections: Collection[];
}

export default function ProductForm({ product, collections }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  // Basic info
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [collectionId, setCollectionId] = useState(product?.collection_id || "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const [draftId] = useState(() => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)));
  const effectiveProductId = product?.id || draftId;

  // Pricing
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() || ""
  );

  // Description & details
  const [description, setDescription] = useState(product?.description || "");
  const [material, setMaterial] = useState(product?.material || "");
  const [careInstructions, setCareInstructions] = useState(
    product?.care_instructions || ""
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    product?.country_of_origin || ""
  );

  // Images
  const [images, setImages] = useState<any[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      size: v.size,
      sku: v.sku || "",
      stock_quantity: v.stock_quantity,
      is_available: v.is_available,
    })) || []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  // Auto-save draft
  useEffect(() => {
    if (!isEdit) {
      const interval = setInterval(() => {
        const draft = {
          name,
          slug,
          collectionId,
          price,
          description,
          material,
          isFeatured,
          isActive,
          updatedAt: Date.now(),
        };
        localStorage.setItem("maison_product_draft", JSON.stringify(draft));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [name, slug, collectionId, price, description, material, isFeatured, isActive, isEdit]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  };

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      setUploading(true);
      const token = await getAuthToken();

      for (let i = 0; i < Math.min(files.length, 8 - images.length); i++) {
        const file = files[i];
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          setError(`Skipped ${file.name}: unsupported format`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(`Skipped ${file.name}: exceeds 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", effectiveProductId);
        formData.append("altText", name);
        formData.append("isPrimary", String(images.length === 0 && i === 0));
        formData.append("displayOrder", String(images.length + i));
        // Flag to tell the API to ONLY upload to storage and NOT insert to DB
        formData.append("pending", !isEdit ? "true" : "false");

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();
          if (data.image) {
            setImages((prev) => [...prev, data.image]);
          }
        } catch (e) {
          setError("Upload failed. Please try again.");
        }
      }
      setUploading(false);
    },
    [product?.id, images.length, name, isEdit]
  );

  const handleDeleteImage = async (img: ProductImage) => {
    const { error: storageErr } = await supabase.storage
      .from("product-images")
      .remove([img.storage_path]);
    if (storageErr) console.warn("Storage delete error:", storageErr);

    const { error: dbErr } = await supabase
      .from("product_images")
      .delete()
      .eq("id", img.id);
    if (!dbErr) {
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    }

    // Invalidate image cache
    localStorage.setItem("maison_cache_invalidated", String(Date.now()));
  };

  const handleSetPrimary = async (img: any) => {
    if (img.pending) {
      setImages((prev) =>
        prev.map((i) => ({ ...i, is_primary: i.id === img.id }))
      );
      return;
    }

    const sb = supabase as any;
    await sb
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", product!.id);
    await sb
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", img.id);
      
    setImages((prev) =>
      prev.map((i) => ({ ...i, is_primary: i.id === img.id }))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "M", sku: "", stock_quantity: 0, is_available: true },
    ]);
  };

  const updateVariant = (idx: number, key: keyof VariantRow, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [key]: value } : v))
    );
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!window.confirm("Are you incredibly sure? This will permanently delete the product and ALL of its associated images from the CMS and Storage bucket.")) return;
    
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      localStorage.setItem("maison_cache_invalidated", String(Date.now()));
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to delete product");
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!name || !slug || !price || !description) {
      setError("Name, slug, price, and description are required.");
      return;
    }
    setSaving(true);

    try {
      let productId = product?.id;

      const productData = {
        name,
        slug,
        collection_id: collectionId || null,
        is_featured: isFeatured,
        is_active: isActive,
        price: parseFloat(price),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
        description,
        material: material || null,
        care_instructions: careInstructions || null,
        country_of_origin: countryOfOrigin || null,
      };

      if (isEdit && productId) {
        const res = await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        if (!data.product?.id) throw new Error("API returned no product ID");
        productId = data.product.id;
      }

      if (!productId) throw new Error("Failed to save product");

      // Save variants
      const sb = supabase as any;
      for (const v of variants) {
        if (v.id) {
          const { error: vErr } = await sb
            .from("product_variants")
            .update({
              size: v.size,
              sku: v.sku || null,
              stock_quantity: v.stock_quantity,
              is_available: v.is_available,
            })
            .eq("id", v.id);
          if (vErr) throw new Error("Variant update failed: " + vErr.message);
        } else {
          const { error: vErr } = await sb.from("product_variants").insert({
            product_id: productId,
            size: v.size,
            sku: v.sku || null,
            stock_quantity: v.stock_quantity,
            is_available: v.is_available,
          });
          if (vErr) throw new Error("Variant creation failed: " + vErr.message);
        }
      }

      // Finalize pending images in DB
      for (const img of images) {
        if (img.pending) {
          const { error: imgErr } = await sb.from("product_images").insert({
            product_id: productId,
            storage_path: img.storage_path,
            public_url: img.public_url,
            alt_text: img.alt_text || null,
            display_order: img.display_order,
            is_primary: img.is_primary,
            blur_data_url: img.blur_data_url || null,
          });
          if (imgErr) throw new Error("Image linking failed: " + imgErr.message);
        }
      }

      // Invalidate cache
      localStorage.setItem("maison_cache_invalidated", String(Date.now()));
      localStorage.removeItem("maison_product_draft");

      if (!isEdit) {
        router.push(`/admin/products/${productId}`);
      } else {
        setError("Saved successfully!");
      }
      setTimeout(() => router.refresh(), 100);
    } catch (e: any) {
      setError(e.message || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <Link
          href="/admin/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.75rem",
            color: "var(--color-muted)",
          }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Products
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 400,
          }}
        >
          {isEdit ? "Edit Product" : "New Product"}
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

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Section 1 — Basic info */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: 20,
            }}
          >
            Basic Information
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label" htmlFor="p-name">Product Name</label>
              <input
                id="p-name"
                className="field-input"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Brushed Cashmere Overcoat"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label" htmlFor="p-slug">Slug</label>
              <input
                id="p-slug"
                className="field-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="brushed-cashmere-overcoat"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="p-collection">Collection</label>
              <select
                id="p-collection"
                className="field-input"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                style={{ appearance: "none" }}
              >
                <option value="">— None —</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div
              style={{ display: "flex", gap: 24, alignItems: "center" }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: "0.8rem" }}>Featured</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: "0.8rem" }}>Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2 — Pricing */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: 20,
            }}
          >
            Pricing
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className="field-label" htmlFor="p-price">Price (₹)</label>
              <input
                id="p-price"
                className="field-input"
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="12500"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="p-compare">
                Compare-at Price (₹){" "}
                <span style={{ color: "var(--color-muted)" }}>(optional)</span>
              </label>
              <input
                id="p-compare"
                className="field-input"
                type="number"
                min={0}
                step={0.01}
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="15000"
              />
            </div>
          </div>
        </div>

        {/* Section 3 — Description & Details */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: 20,
            }}
          >
            Description & Details
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <label className="field-label" htmlFor="p-desc" style={{ marginBottom: 0 }}>
                  Description
                </label>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color:
                      wordCount < MIN_WORDS
                        ? "var(--color-error)"
                        : "var(--color-muted)",
                  }}
                >
                  {wordCount} / {MIN_WORDS} words min
                </span>
              </div>
              <textarea
                id="p-desc"
                className="field-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                style={{ resize: "vertical" }}
                placeholder="Write an editorial description (minimum 80 words)..."
              />
            </div>
            <div>
              <label className="field-label" htmlFor="p-material">Material & Composition</label>
              <input
                id="p-material"
                className="field-input"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="100% Merino Wool"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="p-care">Care Instructions</label>
              <textarea
                id="p-care"
                className="field-input"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                rows={3}
                style={{ resize: "vertical" }}
                placeholder="Dry clean only. Store folded."
              />
            </div>
            <div>
              <label className="field-label" htmlFor="p-origin">Country of Origin</label>
              <input
                id="p-origin"
                className="field-input"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                placeholder="Italy"
              />
            </div>
          </div>
        </div>

        {/* Section 4 — Images */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 24,
          }}
        >
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              marginBottom: 20,
            }}
          >
            Images {images.length > 0 && `(${images.length}/8)`}
          </h2>

          {/* Upload zone */}
          {images.length < 8 && (
            <div
              className={`upload-zone ${dragOver ? "drag-over" : ""}`}
              style={{ marginBottom: 20 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
              }}
            >
              <Upload size={24} strokeWidth={1} style={{ marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                {uploading
                  ? "Uploading…"
                  : "Drag & drop or click to upload"}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-muted)", marginTop: 4 }}>
                JPEG, PNG, WEBP · Max 5MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                }}
              />
            </div>
          )}

          {/* Image grid */}
          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    background: "var(--color-border)",
                    overflow: "hidden",
                    border: img.is_primary
                      ? "2px solid var(--color-text)"
                      : "2px solid transparent",
                  }}
                >
                  <Image
                    src={img.public_url}
                    alt={img.alt_text || "Product"}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      display: "flex",
                      gap: 4,
                    }}
                  >
                    <button
                      onClick={() => handleSetPrimary(img)}
                      title="Set as primary"
                      style={{
                        width: 24,
                        height: 24,
                        background: img.is_primary ? "var(--color-text)" : "rgba(255,255,255,0.85)",
                        border: "none",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: img.is_primary ? "white" : "var(--color-text)",
                      }}
                    >
                      <Star size={12} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img)}
                      title="Delete image"
                      style={{
                        width: 24,
                        height: 24,
                        background: "rgba(176,71,71,0.85)",
                        border: "none",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5 — Variants */}
        <div
          style={{
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
              }}
            >
              Sizes & Stock
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="btn-ghost"
              style={{ padding: "4px 12px", fontSize: "0.68rem" }}
            >
              <Plus size={12} />
              Add Size
            </button>
          </div>

          {variants.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontStyle: "italic" }}>
              No sizes added yet. Add sizes to track inventory.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 100px auto auto",
                  gap: 8,
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  padding: "0 0 8px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span>Size</span>
                <span>SKU</span>
                <span>Stock</span>
                <span>Available</span>
                <span />
              </div>
              {variants.map((v, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 100px auto auto",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <select
                    value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="field-input"
                    style={{ appearance: "none", padding: "8px 12px" }}
                  >
                    {SIZES.map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                  <input
                    className="field-input"
                    value={v.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    placeholder="SKU-001"
                    style={{ padding: "8px 12px" }}
                  />
                  <input
                    className="field-input"
                    type="number"
                    min={0}
                    value={v.stock_quantity}
                    onChange={(e) =>
                      updateVariant(i, "stock_quantity", Number(e.target.value))
                    }
                    style={{ padding: "8px 12px" }}
                  />
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={v.is_available}
                      onChange={(e) =>
                        updateVariant(i, "is_available", e.target.checked)
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-muted)",
                      opacity: 0.5,
                    }}
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-solid"
            style={{
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Save size={14} strokeWidth={1.5} />
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
          <Link href="/admin/products" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
