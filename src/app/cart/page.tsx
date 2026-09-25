'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PriceDisplay } from '@/components/storefront/PriceDisplay';
import { InstagramIcon } from '@/components/storefront/InstagramIcon';
import { initiateMultiItemInstagramOrder } from '@/lib/instagram-order';
import { mockPromoCodes } from '@/lib/mock-data';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const setAppliedPromo = useCartStore((state) => state.setAppliedPromo);
  const removeAppliedPromo = useCartStore((state) => state.removeAppliedPromo);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotal = useCartStore((state) => state.getTotal);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) return;

    const found = mockPromoCodes.find((p) => p.code.toUpperCase() === trimmed && p.isActive);
    if (found) {
      if (found.minSpend && subtotal < found.minSpend) {
        setPromoError(`Minimum order of €${found.minSpend} required for ${found.code}`);
        return;
      }
      setAppliedPromo(found);
      setPromoSuccess(`Applied: ${found.code} (${found.discountType === 'PERCENTAGE' ? `${found.discountValue}% OFF` : `€${found.discountValue} OFF`})`);
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try SUMMER10 or WELCOME20.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Header />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-8 border-b border-[#E4E4E0] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                Shopping Bag
              </h1>
              <p className="text-sm text-[#666660] mt-1">
                {items.length === 0
                  ? 'Your bag is empty.'
                  : `You have ${items.reduce((sum, i) => sum + i.quantity, 0)} items in your shopping bag.`}
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-[#666660] hover:text-rose-600 transition-colors flex items-center gap-1 self-start sm:self-auto"
              >
                <Trash2 size={14} />
                <span>Empty Bag</span>
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty Bag State */
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#F0F0EC] text-[#666660] flex items-center justify-center mx-auto mb-5">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-xl font-bold text-[#111111]">Your bag is empty</h2>
              <p className="text-sm text-[#666660] mt-2 mb-8">
                Discover artisan essentials crafted in Portugal, Italy, and Scandinavia with carbon-neutral EU delivery.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0F5132] hover:bg-[#0A3622] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Explore Collection</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start">
              {/* Left Items Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress bar */}
                <div className="bg-white border border-[#E4E4E0] rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold mb-2 text-[#111111]">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#0F5132]" />
                      <span>
                        {amountToFreeShipping === 0 ? (
                          <span className="text-[#0F5132]">You unlocked Free Express EU Shipping!</span>
                        ) : (
                          <span>
                            Add <PriceDisplay amount={amountToFreeShipping} className="font-extrabold text-[#0F5132]" /> more for Free EU Shipping
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-[#666660]">{Math.round(progressToFreeShipping)}%</span>
                  </div>
                  <div className="w-full bg-[#F0F0EC] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0F5132] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white border border-[#E4E4E0] rounded-2xl divide-y divide-[#F0F0EC] shadow-xs overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Thumbnail */}
                        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#F0F0EC] overflow-hidden shrink-0 border border-[#E4E4E0]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="space-y-1 flex-1">
                          <Link
                            href={`/product/${item.productId}`}
                            className="text-sm font-bold text-[#111111] hover:text-[#0F5132] transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-[#666660]">
                            {item.variantTitle !== 'Standard' ? item.variantTitle : 'Default Style'}
                          </p>
                          <div className="pt-1">
                            <PriceDisplay amount={item.price} className="text-sm font-extrabold text-[#111111]" />
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F0EC]">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E4E4E0] rounded-xl bg-[#FAFAF8] px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 text-[#666660] hover:text-[#111111]"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 text-[#666660] hover:text-[#111111]"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Line Item Total */}
                        <div className="text-right min-w-[70px]">
                          <PriceDisplay
                            amount={item.price * item.quantity}
                            className="text-sm font-extrabold text-[#111111]"
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="p-2 text-[#999990] hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5132] hover:underline"
                  >
                    <span>← Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Right Summary Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-[#E4E4E0] rounded-2xl p-6 shadow-xs space-y-6">
                  <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-[#F0F0EC]">
                    Order Summary
                  </h3>

                  {/* Promo Code Input */}
                  <div>
                    <form onSubmit={handleApplyPromo} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999990]" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="Promo code (e.g. SUMMER10)"
                            className="w-full text-xs bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl pl-9 pr-3 py-2.5 uppercase font-medium focus:outline-none focus:border-[#0F5132]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-[#111111] hover:bg-[#0F5132] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                        >
                          Apply
                        </button>
                      </div>

                      {promoSuccess && (
                        <p className="text-xs text-[#0F5132] font-semibold flex items-center gap-1">
                          <Check size={13} />
                          <span>{promoSuccess}</span>
                        </p>
                      )}
                      {promoError && (
                        <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle size={13} />
                          <span>{promoError}</span>
                        </p>
                      )}
                    </form>

                    {appliedPromo && (
                      <div className="mt-3 flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="text-xs font-bold text-[#0F5132] flex items-center gap-1.5">
                          <Tag size={13} />
                          <span>{appliedPromo.code}</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeAppliedPromo}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Line Item Pricing Breakdown */}
                  <div className="space-y-3 text-xs text-[#666660] border-t border-[#F0F0EC] pt-4">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <PriceDisplay amount={subtotal} className="font-semibold text-[#111111]" />
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-[#0F5132] font-semibold">
                        <span>Discount</span>
                        <span>- <PriceDisplay amount={discount} /></span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>Estimated Shipping (EU)</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-[#0F5132] font-bold">FREE</span>
                        ) : (
                          <PriceDisplay amount={shipping} className="font-semibold text-[#111111]" />
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#F0F0EC] text-base font-extrabold text-[#111111]">
                      <span>Total</span>
                      <PriceDisplay amount={total} className="text-xl font-extrabold text-[#0F5132]" />
                    </div>
                  </div>

                  {/* Checkout CTA */}
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
                        'vovelo'
                      );
                    }}
                    className="w-full py-4 px-6 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.01]"
                  >
                    <InstagramIcon size={18} className="text-pink-400 shrink-0" />
                    <span>Send Order to Instagram DM</span>
                  </button>

                  <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl text-xs text-[#581C87]">
                    <InstagramIcon size={14} className="text-[#C026D3] shrink-0" />
                    <span>Your full item summary will be copied & transferred to <strong>@vovelo</strong> concierge chat.</span>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-2 space-y-2.5 text-[11px] text-[#666660]">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={14} className="text-[#0F5132] shrink-0" />
                      <span>7-Day European Return Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-[#0F5132] shrink-0" />
                      <span>DHL Express Carbon Neutral Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#0F5132] shrink-0" />
                      <span>Encrypted 256-Bit SSL Checkout Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
