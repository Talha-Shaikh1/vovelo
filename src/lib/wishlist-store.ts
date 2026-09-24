'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from './types';
import { toast } from './toast-store';

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
          toast.wishlist(item.name, 'saved');
        }
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        set({ items: get().items.filter((i) => i.id !== id) });
        if (item) {
          toast.wishlist(item.name, 'removed');
        }
      },

      toggleItem: (product) => {
        const current = get().items;
        const exists = current.some((i) => i.id === product.id);
        const name = 'title' in product ? (product as Product).title : (product as WishlistItem).name;

        if (exists) {
          set({ items: current.filter((i) => i.id !== product.id) });
          toast.wishlist(name, 'removed');
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
              ? (product as Product).tenant?.name || 'Volvelo Master'
              : (product as WishlistItem).brand || 'Volvelo Master',
            inStock: isFullProduct
              ? (product as Product).variants?.some((v) => v.stock > 0) ?? true
              : (product as WishlistItem).inStock ?? true,
          };
          set({ items: [item, ...current] });
          toast.wishlist(name, 'saved');
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
