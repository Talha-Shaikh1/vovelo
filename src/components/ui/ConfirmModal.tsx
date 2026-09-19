'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E4E4E0] space-y-4 animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-100 text-rose-700'
                : variant === 'warning'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-[#0F5132]'
            }`}
          >
            {variant === 'danger' ? (
              <Trash2 size={20} />
            ) : variant === 'warning' ? (
              <AlertTriangle size={20} />
            ) : (
              <ShieldAlert size={20} />
            )}
          </div>

          <div className="space-y-1 pr-4">
            <h3 className="text-base font-bold text-[#111111] leading-tight">
              {title}
            </h3>
            <p className="text-xs text-[#666660] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F0F0EC] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-[#111111] bg-[#F0F0EC] hover:bg-[#E4E4E0] rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#0F5132] hover:bg-[#0A3622] text-white'
            }`}
          >
            {isLoading && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
