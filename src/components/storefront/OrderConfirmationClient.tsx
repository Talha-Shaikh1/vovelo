'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  Package,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderConfirmationClientProps {
  order: Order;
}

export function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#22C55E', '#10B981', '#111111'],
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const address = order.shippingAddress as any;

  return (
    <div className="space-y-8">
      {/* Top Hero Card */}
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E4E4E0] shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0F5132]">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
            Thank you, {order.customerName.split(' ')[0]}!
          </h1>
          <p className="text-xs text-[#666660] mt-1 max-w-md mx-auto">
            Your confirmation and tracking updates have been sent to{' '}
            <span className="font-semibold text-[#111111]">{order.customerEmail}</span>.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-[#F0F0EC] px-4 py-2 rounded-xl text-xs">
            <span className="text-[#666660]">Order Number: </span>
            <span className="font-bold font-mono text-[#111111]">{order.orderNumber}</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-[#F0F0EC] text-[#111111] border border-[#E4E4E0] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
          >
            <Printer size={14} />
            <span>Print Invoice PDF</span>
          </button>
        </div>
      </div>

      {/* Tracking Lifecycle Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
          <Truck size={16} className="text-[#0F5132]" />
          <span>Fulfillment Progress</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-[#E8F3EE] rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <div>
              <p className="font-bold text-[#0F5132]">Order Received</p>
              <p className="text-[10px] text-[#0F5132]/80 mt-0.5">Guest Order verified</p>
            </div>
          </div>
          <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-[#F0F0EC] rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E4E4E0] text-[#111111] flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <p className="font-bold text-[#111111]">Supplier Forwarded</p>
              <p className="text-[10px] text-[#666660] mt-0.5">Dispatched to maker</p>
            </div>
          </div>
          <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-[#F0F0EC] rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E4E4E0] text-[#111111] flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <p className="font-bold text-[#111111]">In Transit (DHL/DPD)</p>
              <p className="text-[10px] text-[#666660] mt-0.5">
                {order.trackingNumber || 'Tracking assigned on dispatch'}
              </p>
            </div>
          </div>
          <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-[#F0F0EC] rounded-xl text-xs">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E4E4E0] text-[#111111] flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <p className="font-bold text-[#111111]">Delivered</p>
              <p className="text-[10px] text-[#666660] mt-0.5">Estimated 2-4 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice & Order Details Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E4E0] gap-4">
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#111111]">
              VOVELO COMMERCE
            </span>
            <p className="text-[11px] text-[#666660]">Official Commercial Invoice</p>
          </div>
          <div className="text-xs sm:text-right space-y-0.5 text-[#666660]">
            <p>
              <span className="font-semibold text-[#111111]">Invoice Date:</span>{' '}
              {new Date(order.createdAt).toLocaleDateString('en-EU')}
            </p>
            <p>
              <span className="font-semibold text-[#111111]">Payment Status:</span>{' '}
              <span className="text-[#0F5132] font-bold">Standard Settlement</span>
            </p>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0]">
            <h4 className="font-bold text-[#111111] mb-2 uppercase tracking-wider text-[11px]">
              Shipping Address
            </h4>
            <p className="font-semibold text-[#111111]">{address.fullName || order.customerName}</p>
            <p className="text-[#666660] mt-0.5">{address.addressLine1}</p>
            {address.addressLine2 && <p className="text-[#666660]">{address.addressLine2}</p>}
            <p className="text-[#666660]">
              {address.postalCode} {address.city}
            </p>
            <p className="text-[#666660]">{address.country}</p>
            <p className="text-[#666660] mt-2">Phone: {order.customerPhone}</p>
          </div>

          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E4E4E0]">
            <h4 className="font-bold text-[#111111] mb-2 uppercase tracking-wider text-[11px]">
              Customer Information
            </h4>
            <p className="font-semibold text-[#111111]">{order.customerName}</p>
            <p className="text-[#666660]">{order.customerEmail}</p>
            <p className="text-[#0F5132] font-medium mt-3 flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>Guest Verification ID Verified</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#E4E4E0] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F0EC] text-[#111111] font-semibold border-b border-[#E4E4E0]">
              <tr>
                <th className="p-3.5">Item</th>
                <th className="p-3.5">SKU / Variant</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Price</th>
                <th className="p-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3.5 font-medium text-[#111111]">
                    {item.title}
                  </td>
                  <td className="p-3.5 text-[#666660] font-mono text-[11px]">
                    {item.variantTitle} ({item.sku})
                  </td>
                  <td className="p-3.5 text-center font-mono">{item.quantity}</td>
                  <td className="p-3.5 text-right font-mono">
                    {formatPrice(item.price)}
                  </td>
                  <td className="p-3.5 text-right font-bold font-mono text-[#111111]">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-[#666660]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#111111]">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[#666660]">
              <span>Carbon-Neutral Shipping</span>
              <span className="font-semibold text-[#0F5132]">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#111111] pt-2 border-t border-[#E4E4E0]">
              <span>Total Paid</span>
              <span className="text-[#0F5132] font-mono">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Return to Home CTA */}
      <div className="flex justify-center print:hidden pt-4">
        <Link
          href="/"
          className="px-6 py-3.5 bg-[#111111] hover:bg-[#0F5132] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <span>Return to Storefront</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
