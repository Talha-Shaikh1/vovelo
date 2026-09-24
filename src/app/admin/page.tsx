import React from 'react';
import {
  getProducts,
  getOrders,
  getAllTenants,
  getCategories,
} from '@/lib/data-service';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Store,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [products, orders, tenants, categories] = await Promise.all([
    getProducts({ includeInactiveTenants: true }),
    getOrders(),
    getAllTenants(),
    getCategories(),
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeTenantsCount = tenants.filter((t) => t.status === 'ACTIVE').length;
  const activeProductsCount = products.filter((p) => p.status === 'ACTIVE').length;

  // Find low stock variants (< 5)
  const lowStockItems = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 5)
      .map((v) => ({
        productTitle: p.title,
        sku: v.sku,
        stock: v.stock,
        variantTitle: Object.values(v.optionValues || {}).join(' / ') || 'Standard',
      }))
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Real-time analytics across all European maker tenants & guest orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F3EE] text-[#0F5132] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0F5132] animate-pulse"></span>
            <span>Neon DB / Multi-Tenant Live</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660] uppercase tracking-wider">
              Total Gross Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#111111] font-mono">
              {formatPrice(totalRevenue)}
            </span>
            <p className="text-[11px] text-[#0F5132] font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight size={13} />
              <span>+18.4% this month</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660] uppercase tracking-wider">
              Total Guest Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#111111] font-mono">
              {orders.length}
            </span>
            <p className="text-[11px] text-[#666660] mt-1">
              100% Guest frictionless checkouts
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660] uppercase tracking-wider">
              Active Makers / Tenants
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] text-[#0F5132] flex items-center justify-center">
              <Store size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#111111] font-mono">
              {activeTenantsCount} / {tenants.length}
            </span>
            <p className="text-[11px] text-[#666660] mt-1">
              {activeProductsCount} active storefront products
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660] uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-amber-700 font-mono">
              {lowStockItems.length}
            </span>
            <p className="text-[11px] text-[#666660] mt-1">
              Variants below threshold (&lt;5 units)
            </p>
          </div>
        </div>
      </div>

      {/* Grid: SEO Score Ranking Table + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: SEO Product Surfacing Board */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E0]">
            <div>
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Sparkles size={16} className="text-[#0F5132]" />
                <span>SEO Scoring & Homepage Placement Board</span>
              </h3>
              <p className="text-xs text-[#666660] mt-0.5">
                Highest ranked items receive automatic top placement on the shared storefront.
              </p>
            </div>
            <a
              href="/admin/products"
              className="text-xs font-semibold text-[#0F5132] hover:underline"
            >
              Manage Catalog
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F0EC] text-[#111111] font-semibold">
                <tr>
                  <th className="p-3 rounded-l-lg w-10">Rank</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Brand / House</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Views</th>
                  <th className="p-3 rounded-r-lg text-right">SEO Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E0]">
                {[...products]
                  .sort((a, b) => b.seoScore - a.seoScore)
                  .slice(0, 8)
                  .map((prod, idx) => (
                    <tr key={prod.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#666660]">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            idx === 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-800'
                              : idx === 2
                              ? 'bg-orange-100 text-orange-900'
                              : 'text-[#666660]'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-[#111111] max-w-xs">
                        <div className="flex items-center gap-2.5">
                          {prod.images?.[0]?.url ? (
                            <img
                              src={prod.images[0].url}
                              alt={prod.title}
                              className="w-8 h-8 rounded-lg object-cover border border-[#E4E4E0] shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-[#E4E4E0] shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="truncate block">{prod.title}</span>
                            {prod.isFeatured && (
                              <span className="inline-block px-1.5 py-0.2 bg-[#E8F3EE] text-[#0F5132] text-[9px] font-bold rounded mt-0.5">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-[#666660] font-medium">{prod.tenant?.name || 'Volvelo'}</td>
                      <td className="p-3 font-mono font-semibold">{formatPrice(prod.basePrice)}</td>
                      <td className="p-3 font-mono text-[#666660]">{prod.viewsCount || 0}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#0F5132]">
                          ★ {prod.seoScore.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#E4E4E0] flex items-center justify-between text-xs text-[#666660]">
            <span>Showing top 8 highest-ranked of {products.length} catalog items</span>
            <a
              href="/admin/products"
              className="font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
            >
              <span>View full catalog & ranking filters</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Right: Low Stock Alerts Feed */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E0]">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span>Stock Watch</span>
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {lowStockItems.length} alerts
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-[#666660] text-center py-6">
                All variants are sufficiently stocked.
              </p>
            ) : (
              lowStockItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-[#111111]">
                    <span className="truncate max-w-[180px]">{item.productTitle}</span>
                    <span className="text-amber-800 font-bold font-mono">
                      {item.stock} left
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#666660]">
                    <span>{item.variantTitle}</span>
                    <span className="font-mono">{item.sku}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E0]">
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#0F5132]" />
            <span>Recent Guest Orders</span>
          </h3>
          <a
            href="/admin/orders"
            className="text-xs font-semibold text-[#0F5132] hover:underline"
          >
            View All Orders
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F0EC] text-[#111111] font-semibold">
              <tr>
                <th className="p-3 rounded-l-lg">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Total</th>
                <th className="p-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAFAF8]">
                  <td className="p-3 font-bold font-mono text-[#111111]">
                    {order.orderNumber}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-[#111111]">{order.customerName}</p>
                    <p className="text-[11px] text-[#666660]">{order.customerEmail}</p>
                  </td>
                  <td className="p-3 text-[#666660]">{order.items?.length || 1} items</td>
                  <td className="p-3 text-[#666660]">
                    {(order.shippingAddress as any)?.city},{' '}
                    {(order.shippingAddress as any)?.country}
                  </td>
                  <td className="p-3 font-bold font-mono text-[#111111]">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="p-3 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
