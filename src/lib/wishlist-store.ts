'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from './types';

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  brand?: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: WishlistItem | Product) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const current = get().items;
        if (!current.some((i) => i.id === item.id)) {
          set({ items: [item, ...current] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      toggleItem: (product) => {
        const current = get().items;
        const exists = current.some((i) => i.id === product.id);

        if (exists) {
          set({ items: current.filter((i) => i.id !== product.id) });
        } else {
          const isFullProduct = 'title' in product;
          const item: WishlistItem = {
            id: product.id,
            slug: product.slug,
            name: isFullProduct ? (product as Product).title : (product as WishlistItem).name,
            price: isFullProduct ? (product as Product).basePrice : (product as WishlistItem).price,
            compareAtPrice: isFullProduct
              ? (product as Product).compareAtPrice || undefined
              : (product as WishlistItem).compareAtPrice,
            image: isFullProduct
              ? (product as Product).images?.[0]?.url || ''
              : (product as WishlistItem).image,
            brand: isFullProduct
              ? (product as Product).tenant?.name || 'Volvelo Atelier'
              : (product as WishlistItem).brand || 'Volvelo Atelier',
            inStock: isFullProduct
              ? (product as Product).variants?.some((v) => v.stock > 0) ?? true
              : (product as WishlistItem).inStock ?? true,
          };
          set({ items: [item, ...current] });
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      clearWishlist: () => set({ items: [] }),

      getTotalItems: () => get().items.length,
    }),
    {
      name: 'volvelo_wishlist_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
