'use client';

import React from 'react';
import { useToastStore, ToastType } from '@/lib/toast-store';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  ShoppingBag,
  Heart,
  X,
} from 'lucide-react';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle size={18} className="text-rose-400 shrink-0" />;
      case 'cart':
        return <ShoppingBag size={18} className="text-emerald-400 shrink-0" />;
      case 'wishlist':
        return <Heart size={18} className="text-rose-400 fill-rose-400 shrink-0" />;
      default:
        return <Info size={18} className="text-amber-400 shrink-0" />;
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#111111]/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3.5 animate-in slide-in-from-bottom-5 duration-300 transition-all"
        >
          {t.image ? (
            <img
              src={t.image}
              alt=""
              className="w-10 h-10 object-cover rounded-lg bg-neutral-800 shrink-0 border border-white/10"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              {getIcon(t.type)}
            </div>
          )}

          <div className="flex-1 min-w-0 pr-1">
            <h5 className="text-xs font-bold text-white tracking-wide">{t.title}</h5>
            {t.message && (
              <p className="text-[11px] text-[#A0A09A] mt-0.5 line-clamp-2 leading-tight">
                {t.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-[#888880] hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-md"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
