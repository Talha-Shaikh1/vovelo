import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'cart' | 'wishlist';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  image?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id, duration: toast.duration || 3500 };

    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast], // Keep max 5 active
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, newToast.duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Quick helper functions
export const toast = {
  success: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'error', title, message });
  },
  info: (title: string, message?: string) => {
    useToastStore.getState().addToast({ type: 'info', title, message });
  },
  cart: (title: string, action: 'added' | 'removed' = 'added', image?: string) => {
    useToastStore.getState().addToast({
      type: 'cart',
      title: action === 'added' ? 'Added to Shopping Bag' : 'Removed from Bag',
      message: title,
      image,
    });
  },
  wishlist: (title: string, action: 'saved' | 'removed' = 'saved') => {
    useToastStore.getState().addToast({
      type: 'wishlist',
      title: action === 'saved' ? 'Saved to Wishlist' : 'Removed from Wishlist',
      message: title,
    });
  },
};
