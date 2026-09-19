import React from 'react';
import { getOrders } from '@/lib/data-service';
import { OrdersManagerClient } from '@/components/admin/OrdersManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Centralized Order Hub
        </h1>
        <p className="text-xs text-[#666660] mt-1">
          Monitor guest orders, track fulfillment states, and dispatch shipments across makers.
        </p>
      </div>

      <OrdersManagerClient initialOrders={orders} />
    </div>
  );
}
