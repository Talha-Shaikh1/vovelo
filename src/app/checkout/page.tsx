'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { PriceDisplay } from '@/components/storefront/PriceDisplay';
import {
  ShieldCheck,
  Lock,
  Truck,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  CreditCard,
  Banknote,
  Building2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const setAppliedPromo = useCartStore((state) => state.setAppliedPromo);
  const removeAppliedPromo = useCartStore((state) => state.removeAppliedPromo);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotal = useCartStore((state) => state.getTotal);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = getShippingFee();
  const totalAmount = getTotal();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'bank'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  // Promo Form in Checkout
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Guest Checkout Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Track abandoned cart silently when email is entered
  const handleEmailBlur = async () => {
    if (formData.email && formData.email.includes('@') && items.length > 0) {
      try {
        await fetch('/api/abandoned-carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: formData.email,
            customerName: formData.fullName || undefined,
            items,
            subtotal,
          }),
        });
      } catch {}
    }
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoLoading(true);
    setPromoError(null);

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items,
          subtotal,
          discountAmount,
          promoCode: appliedPromo?.code,
          shippingFee,
          totalAmount,
          notes: formData.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to place order');
      }

      // Clear the local cart and navigate to confirmation
      clearCart();
      router.push(`/order-confirmation/${result.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F0F0EC] flex items-center justify-center text-[#666660] mb-4">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-xl font-bold text-[#111111]">Your bag is empty</h1>
        <p className="text-xs text-[#666660] mt-1 max-w-sm mb-6">
          Add some consciously crafted essentials to your bag before checking out.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#0F5132] text-white text-xs font-semibold rounded-xl hover:bg-[#0A3622] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111]">
      {/* Top Simple Checkout Header */}
      <header className="border-b border-[#E4E4E0] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="Volvelo" className="h-7 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F5132]">
            <Lock size={14} />
            <span>100% Secure Guest Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#666660] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Store</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Guest Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
                Guest Checkout
              </h1>
              <p className="text-xs text-[#666660] mt-1">
                No password required. Your order will be fulfilled directly by certified European makers.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* 1. Contact Information */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#111111] flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
                  <span>1. Contact Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Email Address (for order tracking & PDF invoice) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      placeholder="alex.schmidt@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Alex Schmidt"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+49 170 1234567"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#111111] flex items-center gap-2 pb-2 border-b border-[#E4E4E0]">
                  <span>2. Delivery Address</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Friedrichstraße 45"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Apartment, suite, unit (optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Apt 4B"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Berlin"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="10117"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. Pakistan, Germany, United Kingdom, United States, UAE..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs focus:ring-2 focus:ring-[#0F5132] focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#111111] flex items-center justify-between pb-2 border-b border-[#E4E4E0]">
                  <span>3. Payment Method</span>
                  <span className="text-[10px] text-[#0F5132] font-semibold flex items-center gap-1">
                    <Lock size={11} /> 256-Bit Encrypted
                  </span>
                </h2>

                {/* Payment Selection Options */}
                <div className="space-y-3">
                  {/* Option 1: Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 bg-white rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#0F5132] ring-2 ring-[#0F5132]/15 shadow-sm'
                        : 'border-[#E4E4E0] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="pay-card"
                          name="paymentOption"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-[#0F5132] accent-[#0F5132]"
                        />
                        <div>
                          <label htmlFor="pay-card" className="text-xs font-bold text-[#111111] cursor-pointer block">
                            Credit or Debit Card
                          </label>
                          <span className="text-[11px] text-[#666660]">Visa, Mastercard, Amex, Apple Pay</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <CreditCard size={18} className="text-[#0F5132]" />
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t border-[#F0F0EC] space-y-3 animate-in fade-in duration-150">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="4242 •••• •••• 4242"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              value={cardData.cardExpiry}
                              onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                              className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#111111] mb-1">
                              CVC / CVV
                            </label>
                            <input
                              type="text"
                              placeholder="CVC"
                              maxLength={4}
                              value={cardData.cardCvc}
                              onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                              className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 bg-white rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#0F5132] ring-2 ring-[#0F5132]/15 shadow-sm'
                        : 'border-[#E4E4E0] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="pay-cod"
                          name="paymentOption"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="text-[#0F5132] accent-[#0F5132]"
                        />
                        <div>
                          <label htmlFor="pay-cod" className="text-xs font-bold text-[#111111] cursor-pointer block">
                            Cash on Delivery (COD)
                          </label>
                          <span className="text-[11px] text-[#666660]">Pay cash upon courier delivery at your doorstep</span>
                        </div>
                      </div>
                      <Banknote size={18} className="text-emerald-700" />
                    </div>
                  </div>

                  {/* Option 3: Direct Bank Wire */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 bg-white rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#0F5132] ring-2 ring-[#0F5132]/15 shadow-sm'
                        : 'border-[#E4E4E0] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="pay-bank"
                          name="paymentOption"
                          checked={paymentMethod === 'bank'}
                          onChange={() => setPaymentMethod('bank')}
                          className="text-[#0F5132] accent-[#0F5132]"
                        />
                        <div>
                          <label htmlFor="pay-bank" className="text-xs font-bold text-[#111111] cursor-pointer block">
                            Direct Bank Transfer / IBAN Invoice
                          </label>
                          <span className="text-[11px] text-[#666660]">Receive official PDF invoice with IBAN details</span>
                        </div>
                      </div>
                      <Building2 size={18} className="text-[#0F5132]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#0F5132] hover:bg-[#0A3622] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Complete Order • <PriceDisplay amount={totalAmount} /></span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-6 sticky top-24">
            <h3 className="text-base font-bold text-[#111111] pb-3 border-b border-[#E4E4E0]">
              Order Summary ({items.length} items)
            </h3>

            {/* Item List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-16 object-cover rounded-lg bg-[#F0F0EC] shrink-0 border border-[#E4E4E0]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#111111] line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#666660] mt-0.5">
                      {item.variantTitle} × {item.quantity}
                    </p>
                    <p className="text-xs font-bold text-[#111111] mt-1 font-mono">
                      <PriceDisplay amount={item.price * item.quantity} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input in Checkout */}
            <div className="pt-3 border-t border-[#E4E4E0]">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#0F5132]" />
                    <div>
                      <span className="font-bold text-[#0F5132] font-mono">
                        {appliedPromo.code}
                      </span>
                      <span className="text-[10px] text-neutral-600 block">
                        {appliedPromo.discountType === 'PERCENTAGE' && `${appliedPromo.discountValue}% off`}
                        {appliedPromo.discountType === 'FIXED' && `€${appliedPromo.discountValue} off`}
                        {appliedPromo.discountType === 'FREE_SHIPPING' && 'Free Shipping'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAppliedPromo}
                    className="text-xs text-neutral-400 hover:text-rose-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#E4E4E0] rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none uppercase font-mono"
                    />
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
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#E4E4E0] space-y-2 text-xs">
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
                <span>Carbon-Neutral Shipping</span>
                <span className="font-semibold text-[#0F5132]">
                  {shippingFee === 0 ? 'FREE' : <PriceDisplay amount={shippingFee} />}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-extrabold text-[#111111] pt-3 border-t border-[#E4E4E0]">
                <span>Total Due</span>
                <PriceDisplay amount={totalAmount} className="text-[#0F5132] font-mono" />
              </div>
            </div>

            {/* Reassurance */}
            <div className="pt-4 border-t border-[#E4E4E0] space-y-2.5 text-[11px] text-[#666660]">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#0F5132]" />
                <span>Dispatched within 24 hours from EU atelier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#0F5132]" />
                <span>7-day inspection returns & direct maker warranty</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
