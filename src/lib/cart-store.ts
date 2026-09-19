'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, PromoCode } from './types';

interface CartState {
  items: CartItem[];
  appliedPromo: PromoCode | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedPromo: (promo: PromoCode | null) => void;
  removeAppliedPromo: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: (threshold?: number, standardFee?: number) => number;
  getTotal: (threshold?: number, standardFee?: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        const addQty = newItem.quantity || 1;

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const currentItem = updatedItems[existingIndex];
          const newQuantity = Math.min(
            currentItem.quantity + addQty,
            currentItem.maxStock || 99
          );
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: newQuantity,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [
              ...currentItems,
              {
                ...newItem,
                quantity: Math.min(addQty, newItem.maxStock || 99),
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (variantId: string) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.variantId === variantId) {
              return {
                ...item,
                quantity: Math.min(quantity, item.maxStock || 99),
              };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [], appliedPromo: null }),

      setAppliedPromo: (promo) => set({ appliedPromo: promo }),

      removeAppliedPromo: () => set({ appliedPromo: null }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo || !promo.isActive) return 0;
        if (promo.minSpend && subtotal < promo.minSpend) return 0;

        if (promo.discountType === 'PERCENTAGE') {
          return Math.round(((subtotal * promo.discountValue) / 100) * 100) / 100;
        }
        if (promo.discountType === 'FIXED') {
          return Math.min(promo.discountValue, subtotal);
        }
        if (promo.discountType === 'FREE_SHIPPING') {
          return 4.9; // Handled in shipping fee
        }
        return 0;
      },

      getShippingFee: (threshold = 50, standardFee = 4.9) => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (subtotal >= threshold || promo?.discountType === 'FREE_SHIPPING') {
          return 0;
        }
        return standardFee;
      },

      getTotal: (threshold = 50, standardFee = 4.9) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee(threshold, standardFee);
        return Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);
      },
    }),
    {
      name: 'volvelo-guest-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    }
  )
);
