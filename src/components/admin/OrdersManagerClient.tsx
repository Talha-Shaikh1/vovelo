'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  Search,
  Filter,
  Send,
  Loader2,
} from 'lucide-react';

interface OrdersManagerClientProps {
  initialOrders: Order[];
}

export function OrdersManagerClient({ initialOrders }: OrdersManagerClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    setNotification(null);

    const trackingNum =
      nextStatus === 'SHIPPED'
        ? `DHL-EU-${Math.floor(1000000000 + Math.random() * 9000000000)}`
        : undefined;

    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: nextStatus,
          trackingNumber: trackingNum,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        setNotification(
          `Order ${data.order.orderNumber} updated to ${nextStatus}. Customer automated notification triggered.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-[#E8F3EE] rounded-xl border border-[#d2e8dd] text-xs font-medium text-[#0F5132] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[#0F5132] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order #, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 pl-9 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666660]"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING_PAYMENT">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F0EC] text-[#111111] font-semibold border-b border-[#E4E4E0]">
              <tr>
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Guest Customer</th>
                <th className="p-3.5">Items / SKU</th>
                <th className="p-3.5">Destination</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status & Tracking</th>
                <th className="p-3.5 text-right">Quick Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-[#FAFAF8]">
                    <td className="p-3.5 font-bold font-mono text-[#111111]">
                      <div>{order.orderNumber}</div>
                      <div className="text-[10px] text-[#666660] font-normal">
                        {new Date(order.createdAt).toLocaleDateString('en-EU', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#111111]">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-[#666660]">
                        {order.customerEmail}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#666660]">
                      <div className="font-medium text-[#111111]">
                        {order.items.length} line items
                      </div>
                      <div className="text-[10px] truncate max-w-[160px]">
                        {order.items.map((i) => i.title).join(', ')}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#666660]">
                      <div>{(order.shippingAddress as any)?.city}</div>
                      <div className="text-[10px] font-mono">
                        {(order.shippingAddress as any)?.country}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-[#111111]">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.status === 'SHIPPED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.status === 'PROCESSING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : order.status === 'DELIVERED'
                            ? 'bg-[#E8F3EE] text-[#0F5132] border border-[#d2e8dd]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <p className="text-[10px] font-mono text-[#666660] mt-1">
                          {order.trackingNumber}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'PENDING_PAYMENT' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateStatus(order.id, 'PROCESSING')
                            }
                            className="px-2.5 py-1 bg-[#111111] hover:bg-[#0F5132] text-white rounded-lg text-xs font-semibold"
                          >
                            Mark Processing
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="px-2.5 py-1 bg-[#0F5132] hover:bg-[#0A3622] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Truck size={12} />
                            <span>Ship (DHL)</span>
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateStatus(order.id, 'DELIVERED')
                            }
                            className="px-2.5 py-1 bg-[#E8F3EE] hover:bg-[#d2e8dd] text-[#0F5132] rounded-lg text-xs font-semibold"
                          >
                            Mark Delivered
                          </button>
                        )}
                        <a
                          href={`/order-confirmation/${order.orderNumber}`}
                          target="_blank"
                          className="p-1.5 text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] rounded-lg"
                          title="View Invoice"
                        >
                          <Printer size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
