'use client';

import React, { useState } from 'react';
import { AbandonedCart } from '@/lib/types';
import {
  MailCheck,
  Send,
  ShoppingBag,
  Clock,
  Euro,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AbandonedCartsClientProps {
  initialCarts: AbandonedCart[];
}

export function AbandonedCartsClient({ initialCarts }: AbandonedCartsClientProps) {
  const [carts, setCarts] = useState<AbandonedCart[]>(initialCarts);
  const [activeCartPreview, setActiveCartPreview] = useState<AbandonedCart | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const totalAbandonedValue = carts.reduce((acc, c) => acc + (c.subtotal || 0), 0);
  const totalSentCount = carts.filter((c) => c.recoveryEmailSent).length;
  const recoverablePotential = Math.round(totalAbandonedValue * 0.28); // 28% benchmark recovery rate

  const handleSendRecovery = async (cart: AbandonedCart) => {
    setSendingEmail(true);
    try {
      const res = await fetch(`/api/abandoned-carts/${cart.id}/recover`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setCarts((prev) =>
          prev.map((c) =>
            c.id === cart.id
              ? { ...c, recoveryEmailSent: true, recoverySentAt: new Date().toISOString() }
              : c
          )
        );
        setSendSuccessMessage(data.message);
        setTimeout(() => {
          setSendSuccessMessage(null);
          setActiveCartPreview(null);
        }, 1800);
      }
    } catch {
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Automated Re-engagement
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            Abandoned Carts & Recovery
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Re-engage customers who left items at checkout before completing payment.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Total Abandoned Value</span>
            <Euro size={16} className="text-[#0F5132]" />
          </div>
          <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
            €{totalAbandonedValue.toFixed(0)}
          </p>
          <span className="text-[11px] text-[#666660] mt-1 block">Across {carts.length} active sessions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Est. Recoverable Revenue</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#0F5132] mt-2 font-mono">
            €{recoverablePotential.toFixed(0)}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block">With automated 10% coupon nudge</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Recovery Emails Sent</span>
            <MailCheck size={16} className="text-[#0F5132]" />
          </div>
          <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
            {totalSentCount}
          </p>
          <span className="text-[11px] text-[#666660] mt-1 block">
            {carts.length > 0 ? Math.round((totalSentCount / carts.length) * 100) : 0}% coverage
          </span>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E4E4E0] text-[#666660] uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-5">Customer & Items</th>
                <th className="py-3.5 px-5">Cart Value</th>
                <th className="py-3.5 px-5">Last Activity</th>
                <th className="py-3.5 px-5">Recovery Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {carts.map((cart) => (
                <tr key={cart.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center font-bold text-xs shrink-0">
                        {cart.customerEmail.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#111111]">
                          {cart.customerName || cart.customerEmail.split('@')[0]}
                        </div>
                        <span className="text-[11px] text-[#666660] block font-mono">
                          {cart.customerEmail}
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-[#0F5132]">
                          <ShoppingBag size={11} />
                          <span>
                            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} (
                            {cart.items.map((i) => i.title).join(', ')}
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-mono font-bold text-sm text-[#111111]">
                    €{cart.subtotal.toFixed(2)}
                  </td>

                  <td className="py-4 px-5 text-[#666660]">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{new Date(cart.lastActiveAt).toLocaleString('en-GB')}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    {cart.recoveryEmailSent ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 size={12} />
                        <span>Dispatched</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock size={12} />
                        <span>Pending Follow-up</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveCartPreview(cart)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111111] hover:bg-[#0F5132] text-white transition-colors"
                    >
                      <Send size={12} />
                      <span>{cart.recoveryEmailSent ? 'Resend Email' : 'Send Recovery'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recovery Email Preview Modal */}
      {activeCartPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveCartPreview(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <MailCheck size={18} className="text-[#0F5132]" />
              <h3 className="text-base font-bold text-[#111111]">
                Recovery Email Simulation & Dispatch
              </h3>
            </div>
            <p className="text-xs text-[#666660] mb-4">
              Sending to: <strong className="text-neutral-900">{activeCartPreview.customerEmail}</strong>
            </p>

            {sendSuccessMessage ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 size={42} className="text-[#0F5132] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#111111]">Recovery Dispatched!</h4>
                <p className="text-xs text-[#666660]">{sendSuccessMessage}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Luxury Email Template Preview */}
                <div className="border border-neutral-200 rounded-xl p-6 bg-[#FAFAF8] space-y-4 text-left shadow-inner">
                  {/* Brand Header */}
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <span className="font-extrabold tracking-tight text-sm text-[#111111]">
                      VOLVELO
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#666660]">
                      Direct VIP Dispatch
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#111111]">
                      You left something timeless in your bag.
                    </h4>
                    <p className="text-xs text-[#555550] leading-relaxed mt-1">
                      Hi {activeCartPreview.customerName || 'there'}, your curated selection of sustainably crafted European essentials is reserved for you. Complete your order today and receive an exclusive 10% courtesy discount.
                    </p>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 py-2">
                    {activeCartPreview.items.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-neutral-200 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-12 object-cover rounded bg-neutral-100"
                          />
                          <div>
                            <span className="font-bold text-neutral-900 block">{item.title}</span>
                            <span className="text-[10px] text-neutral-500">
                              {item.variantTitle} × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-neutral-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Callout */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#0F5132] block">
                        VIP Courtesy Code
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        VOLVELO10
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0F5132]">10% Off Instant Savings</span>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-md">
                      <span>Complete My Order Now</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-neutral-400">
                    Volvelo European HQ • Free Carbon-Neutral Shipping over €50 • 7-Day Free Returns
                  </div>
                </div>

                {/* Dispatch Trigger Controls */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveCartPreview(null)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendRecovery(activeCartPreview)}
                    disabled={sendingEmail}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#0F5132] text-white rounded-xl hover:bg-[#0A3622] transition-colors disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{sendingEmail ? 'Dispatching...' : 'Dispatch Recovery Email'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AbandonedCartsClient;
