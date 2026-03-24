"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  wishlist: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: string, variantId: string) => void;
  moveToCart: (productId: string, variantId: string) => void;
  removeFromWishlist: (productId: string, variantId: string) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  updateStockValidation: (productId: string, variantId: string, newMax: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + item.quantity,
                        i.maxQuantity
                      ),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId: string, variantId: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId: string, variantId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      saveForLater: (productId: string, variantId: string) => {
        set((state) => {
          const item = state.items.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (!item) return state;
          return {
            items: state.items.filter(
              (i) => !(i.productId === productId && i.variantId === variantId)
            ),
            wishlist: [...state.wishlist, item],
          };
        });
      },

      moveToCart: (productId: string, variantId: string) => {
        set((state) => {
          const item = state.wishlist.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (!item) return state;
          return {
            wishlist: state.wishlist.filter(
              (i) => !(i.productId === productId && i.variantId === variantId)
            ),
            items: [...state.items, item],
          };
        });
      },

      removeFromWishlist: (productId: string, variantId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }));
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      updateStockValidation: (
        productId: string,
        variantId: string,
        newMax: number
      ) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? {
                  ...i,
                  maxQuantity: newMax,
                  quantity: Math.min(i.quantity, newMax),
                }
              : i
          ),
        }));
      },
    }),
    {
      name: "maison-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
