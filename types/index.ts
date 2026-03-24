export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  collection_id: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  material: string | null;
  care_instructions: string | null;
  country_of_origin: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  collection?: Collection;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  blur_data_url: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  sku: string | null;
  stock_quantity: number;
  is_available: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  variantId: string;
  size: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl: string;
  imageAlt: string;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryNotes?: string;
  lat?: number;
  lng?: number;
}

export type SortOption = "price_asc" | "price_desc" | "newest";

export interface ProductFilters {
  size?: string;
  sort?: SortOption;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: Collection;
        Insert: Omit<Collection, "id" | "created_at">;
        Update: Partial<Omit<Collection, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id">;
        Update: Partial<Omit<ProductImage, "id">>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, "id">;
        Update: Partial<Omit<ProductVariant, "id">>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "created_at">;
        Update: Partial<Omit<AdminUser, "id" | "created_at">>;
      };
    };
  };
}
