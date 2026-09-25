'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { PriceDisplay } from './PriceDisplay';
import { InstagramIcon } from './InstagramIcon';
import { initiateMultiItemInstagramOrder } from '@/lib/instagram-order';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const setAppliedPromo = useCartStore((state) => state.setAppliedPromo);
  const removeAppliedPromo = useCartStore((state) => state.removeAppliedPromo);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotal = useCartStore((state) => state.getTotal);

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = getShippingFee();
  const grandTotal = getTotal();

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoLoading(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();
      if (data.valid && data.promo) {
        setAppliedPromo(data.promo);
        setPromoSuccess(`Promo code ${data.promo.code} applied!`);
        setPromoInput('');
      } else {
        setPromoError(data.message || 'Invalid promo code');
      }
    } catch {
      setPromoError('Failed to validate promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFAF8] shadow-2xl flex flex-col border-l border-[#E4E4E0] animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E4E4E0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#0F5132]" />
              <h2 className="text-base font-bold text-[#111111]">Your Bag</h2>
              <span className="text-xs text-[#666660]">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#E8F3EE] border-b border-[#d2e8dd]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#0F5132]">
                {subtotal >= freeShippingThreshold || appliedPromo?.discountType === 'FREE_SHIPPING' ? (
                  '🎉 You unlocked FREE European Shipping!'
                ) : (
                  <>Add <PriceDisplay amount={amountNeeded} /> more for FREE shipping</>
                )}
              </span>
              <span className="text-[11px] text-[#0F5132] font-mono">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#c5e3d4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F5132] rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0F0EC] flex items-center justify-center text-[#666660]">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111111]">Your bag is empty</h3>
                  <p className="text-xs text-[#666660] mt-1 max-w-xs">
                    Discover our consciously crafted apparel, shoes, and bags designed for everyday wear.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-[#111111] text-white text-xs font-semibold rounded-lg hover:bg-[#0F5132] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3.5 p-3.5 bg-white rounded-xl border border-[#E4E4E0] shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 object-cover object-center rounded-lg bg-[#F0F0EC] shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#111111] line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-[#999990] hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#666660] mt-0.5">
                        {item.variantTitle}
                      </p>
                      <p className="text-xs font-bold text-[#111111] mt-1">
                        <PriceDisplay amount={item.price} />
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F0EC]">
                      <div className="flex items-center border border-[#E4E4E0] rounded-md bg-[#FAFAF8]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-[#F0F0EC] text-[#111111] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:bg-[#F0F0EC] text-[#111111] transition-colors disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#111111]">
                        <PriceDisplay amount={item.price * item.quantity} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Promo Input & Guest Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E4E4E0] space-y-4 shadow-lg">
              {/* Promo Code Input or Applied Badge */}
              <div className="pt-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-[#0F5132]" />
                      <div>
                        <span className="font-bold text-[#0F5132] font-mono">
                          {appliedPromo.code}
                        </span>
                        <span className="text-[11px] text-neutral-600 block">
                          {appliedPromo.discountType === 'PERCENTAGE' && `${appliedPromo.discountValue}% off`}
                          {appliedPromo.discountType === 'FIXED' && `€${appliedPromo.discountValue} off`}
                          {appliedPromo.discountType === 'FREE_SHIPPING' && 'Free Shipping'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAppliedPromo}
                      className="text-xs text-neutral-400 hover:text-rose-600 font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. VOLVELO10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-[#E4E4E0] rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-3 py-2 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-[#0F5132] transition-colors disabled:opacity-50"
                      >
                        {promoLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1">
                        <AlertCircle size={11} />
                        <span>{promoError}</span>
                      </p>
                    )}
                    {promoSuccess && (
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>{promoSuccess}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-[#E4E4E0]">
                <div className="flex items-center justify-between text-[#666660]">
                  <span>Subtotal</span>
                  <PriceDisplay amount={subtotal} className="font-semibold text-[#111111]" />
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#0F5132]">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-semibold">-<PriceDisplay amount={discountAmount} /></span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#666660]">
                  <span>Shipping estimate</span>
                  <span className="font-semibold text-[#0F5132]">
                    {shippingFee === 0 ? 'FREE' : <PriceDisplay amount={shippingFee} />}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E4E4E0]">
                  <span>Total</span>
                  <PriceDisplay amount={grandTotal} className="font-extrabold" />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    initiateMultiItemInstagramOrder(
                      items.map((i) => ({
                        title: i.title,
                        variantTitle: i.variantTitle,
                        sku: i.sku,
                        quantity: i.quantity,
                      })),
                      'volvelo'
                    );
                  }}
                  className="w-full py-3.5 px-4 bg-[#111111] hover:bg-black text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  <InstagramIcon size={18} className="text-pink-400 shrink-0" />
                  <span>Order Bag via Instagram DM</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl text-[11px] text-[#581C87]">
                  <InstagramIcon size={14} className="text-[#C026D3] shrink-0" />
                  <span>All items in your bag will be copied to send directly to <strong>@volvelo</strong> concierge.</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#666660]">
                <ShieldCheck size={13} className="text-[#0F5132]" />
                <span>Verified Luxury Concierge • Instant Response</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
