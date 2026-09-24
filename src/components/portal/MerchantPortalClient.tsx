'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { Tenant, Product, Order, Category } from '@/lib/types';
import { PriceDisplay } from '@/components/storefront/PriceDisplay';
import { BrandLogo } from '@/components/storefront/BrandLogo';
import {
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Euro,
  Truck,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderPlus,
  Send,
  X,
  MapPin,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface MerchantPortalClientProps {
  initialTenant: Tenant;
  allTenants: Tenant[];
  initialData: {
    tenant: Tenant | null;
    products: Product[];
    orders: Order[];
    metrics: {
      grossSales: number;
      netEarnings: number;
      platformCommission: number;
      totalUnitsSold: number;
      pendingFulfillments: number;
      lowStockCount: number;
    };
  };
  categories: Category[];
  isSuperAdmin?: boolean;
  userRole?: string;
}

export function MerchantPortalClient({
  initialTenant,
  allTenants,
  initialData,
  categories,
  isSuperAdmin = false,
  userRole = 'MERCHANT',
}: MerchantPortalClientProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(initialTenant.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories'>('overview');
  const [portalData, setPortalData] = useState(initialData);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fulfill Modal State
  const [fulfillModalOrder, setFulfillModalOrder] = useState<{ order: Order; itemId: string } | null>(null);
  const [carrier, setCarrier] = useState('DHL Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [fulfilling, setFulfilling] = useState(false);

  // Category Request Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catParent, setCatParent] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catSuccess, setCatSuccess] = useState(false);

  const currentTenant = allTenants.find((t) => t.id === selectedTenantId) || initialTenant;

  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillModalOrder || !trackingNumber.trim()) return;

    setFulfilling(true);
    try {
      const res = await fetch('/api/portal/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: fulfillModalOrder.order.id,
          itemId: fulfillModalOrder.itemId,
          carrier,
          trackingNumber: trackingNumber.trim(),
        }),
      });

      if (res.ok) {
        setPortalData((prev) => ({
          ...prev,
          orders: prev.orders.map((ord) => {
            if (ord.id === fulfillModalOrder.order.id) {
              return {
                ...ord,
                items: ord.items.map((it) =>
                  it.id === fulfillModalOrder.itemId
                    ? { ...it, fulfillmentStatus: 'SHIPPED', carrier, trackingNumber }
                    : it
                ),
              };
            }
            return ord;
          }),
          metrics: {
            ...prev.metrics,
            pendingFulfillments: Math.max(0, prev.metrics.pendingFulfillments - 1),
          },
        }));
        setFulfillModalOrder(null);
        setTrackingNumber('');
      }
    } catch {
    } finally {
      setFulfilling(false);
    }
  };

  const handleCategoryRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catDesc.trim()) return;

    setCatSubmitting(true);
    try {
      const res = await fetch('/api/categories/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName.trim(),
          description: catDesc.trim(),
          suggestedParentId: catParent || null,
          tenantId: currentTenant.id,
          tenantName: currentTenant.name,
        }),
      });

      if (res.ok) {
        setCatSuccess(true);
        setTimeout(() => {
          setCatSuccess(false);
          setIsCatModalOpen(false);
          setCatName('');
          setCatDesc('');
          setCatParent('');
        }, 1500);
      }
    } catch {
    } finally {
      setCatSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111]">
      {/* Top Portal Navbar */}
      <header className="bg-white border-b border-[#E4E4E0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo size="sm" />
            </Link>

            <span className="text-neutral-300">/</span>

            <div className="flex items-center gap-2">
              {isSuperAdmin && allTenants.length > 1 ? (
                <>
                  <Store size={15} className="text-[#0F5132]" />
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="text-xs font-bold bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  >
                    {allTenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.country || 'Europe'})
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg text-xs font-bold text-[#111111]">
                  <Store size={13} className="text-[#0F5132]" />
                  <span>{currentTenant.name}</span>
                  <span className="text-[10px] text-[#666660] font-normal">
                    ({currentTenant.country || 'Europe'})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/brand/${currentTenant.slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAFAF8] hover:bg-[#F0F0EC] border border-[#E4E4E0] text-[#111111] transition-colors"
            >
              <span>View Brand</span>
              <ExternalLink size={12} />
            </Link>

            {isSuperAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#0F5132] hover:underline"
              >
                Super Admin
              </Link>
            )}

            {mounted && isLoaded && isSignedIn ? (
              <UserButton />
            ) : mounted && isLoaded && !isSignedIn ? (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-lg hover:bg-[#0A3622] transition-colors"
                >
                  Maker Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#0F5132]/10 animate-pulse" />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        {/* Merchant Welcome Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4E4E0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                European Maker Dashboard
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                15% Platform Split Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              {currentTenant.name}
            </h1>
            <p className="text-xs text-[#666660] flex items-center gap-1.5">
              <MapPin size={13} className="text-[#0F5132]" />
              <span>
                {currentTenant.city}, {currentTenant.country} • Contact: {currentTenant.contactPerson || currentTenant.email}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(true)}
              className="px-4 py-2 bg-[#F0F0EC] hover:bg-[#E4E4E0] text-[#111111] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus size={14} className="text-[#0F5132]" />
              <span>Request New Category</span>
            </button>
          </div>
        </div>

        {/* Financial & Operational KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666660]">Gross Product Sales</span>
              <Euro size={16} className="text-[#0F5132]" />
            </div>
            <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
              <PriceDisplay amount={portalData.metrics.grossSales} />
            </p>
            <span className="text-[11px] text-[#666660] mt-1 block">
              {portalData.metrics.totalUnitsSold} units sold
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666660]">Net Brand Payout (85%)</span>
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-[#0F5132] mt-2 font-mono">
              <PriceDisplay amount={portalData.metrics.netEarnings} />
            </p>
            <span className="text-[11px] text-emerald-700 mt-1 block">
              Dispatched directly to IBAN
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666660]">Pending Fulfillments</span>
              <Truck size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
              {portalData.metrics.pendingFulfillments}
            </p>
            <span className="text-[11px] text-amber-700 mt-1 block">Awaiting DHL tracking dispatch</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#666660]">Low Stock Alerts</span>
              <AlertTriangle size={16} className="text-rose-500" />
            </div>
            <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
              {portalData.metrics.lowStockCount}
            </p>
            <span className="text-[11px] text-rose-700 mt-1 block">Variants with &le; 4 pieces</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E4E0] gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#0F5132] text-[#0F5132]'
                : 'border-transparent text-[#666660] hover:text-[#111111]'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Orders to Fulfill ({portalData.orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#0F5132] text-[#0F5132]'
                : 'border-transparent text-[#666660] hover:text-[#111111]'
            }`}
          >
            <Package size={15} />
            <span>My Brand Catalog ({portalData.products.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders & Fulfillment */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#E4E4E0]">
              <h3 className="text-sm font-bold text-[#111111]">Split Order Dispatch Queue</h3>
              <p className="text-xs text-[#666660] mt-0.5">
                Only items belonging to {currentTenant.name} are routed to this dashboard.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#E4E4E0] text-[#666660] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Order Ref</th>
                    <th className="py-3.5 px-5">Item & Variant</th>
                    <th className="py-3.5 px-5">Customer & Destination</th>
                    <th className="py-3.5 px-5">Brand Net</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E0]">
                  {portalData.orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-neutral-500">
                        No orders pending fulfillment.
                      </td>
                    </tr>
                  ) : (
                    portalData.orders.map((order) => {
                      const makerItems = order.items.filter((i) => i.tenantId === currentTenant.id);
                      return makerItems.map((item) => (
                        <tr key={`${order.id}-${item.id}`} className="hover:bg-[#FAFAF8]">
                          <td className="py-4 px-5">
                            <span className="font-mono font-bold text-[#111111]">{order.orderNumber}</span>
                            <span className="text-[10px] text-[#666660] block">
                              {new Date(order.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </td>

                          <td className="py-4 px-5">
                            <span className="font-bold text-[#111111] block">{item.title}</span>
                            <span className="text-[11px] text-[#666660]">
                              {item.variantTitle} × {item.quantity} ({item.sku})
                            </span>
                          </td>

                          <td className="py-4 px-5">
                            <span className="font-medium text-[#111111] block">{order.customerName}</span>
                            <span className="text-[11px] text-[#666660]">
                              {order.shippingAddress.city}, {order.shippingAddress.country}
                            </span>
                          </td>

                          <td className="py-4 px-5 font-mono font-bold text-emerald-800">
                            <PriceDisplay amount={item.price * item.quantity * 0.85} />
                          </td>

                          <td className="py-4 px-5">
                            {item.fulfillmentStatus === 'SHIPPED' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 size={11} />
                                <span>Shipped ({item.carrier})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Clock size={11} />
                                <span>Awaiting Dispatch</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-5 text-right">
                            {item.fulfillmentStatus !== 'SHIPPED' && (
                              <button
                                type="button"
                                onClick={() => setFulfillModalOrder({ order, itemId: item.id })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                              >
                                <Truck size={12} />
                                <span>Add Tracking</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ));
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#E4E4E0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111111]">My Products & Inventory Matrix</h3>
                <p className="text-xs text-[#666660] mt-0.5">
                  Manage inventory counts, variant sizing, and pricing.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#E4E4E0] text-[#666660] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Product</th>
                    <th className="py-3.5 px-5">Variants & Sizes</th>
                    <th className="py-3.5 px-5">Base Price</th>
                    <th className="py-3.5 px-5">Live Stock</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E0]">
                  {portalData.products.map((p) => {
                    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                    return (
                      <tr key={p.id} className="hover:bg-[#FAFAF8]">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80'}
                              alt={p.title}
                              className="w-10 h-12 object-cover rounded-lg bg-[#F0F0EC] shrink-0"
                            />
                            <div>
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                className="font-bold text-[#111111] hover:text-[#0F5132] flex items-center gap-1"
                              >
                                <span>{p.title}</span>
                                <ExternalLink size={10} />
                              </Link>
                              <span className="text-[10px] text-[#666660]">SEO Score: {p.seoScore}/100</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-medium text-[#111111]">
                            {p.variants.length} {p.variants.length === 1 ? 'variant' : 'variants'}
                          </span>
                          <span className="text-[10px] text-[#666660] block truncate max-w-xs">
                            {p.variants.map((v) => Object.values(v.optionValues).join('-')).join(', ')}
                          </span>
                        </td>

                        <td className="py-4 px-5 font-mono font-bold text-[#111111]">
                          <PriceDisplay amount={p.basePrice} />
                        </td>

                        <td className="py-4 px-5">
                          <span
                            className={`font-mono font-bold text-xs ${
                              totalStock <= 4 ? 'text-rose-600' : 'text-[#111111]'
                            }`}
                          >
                            {totalStock} units
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 size={10} />
                            <span>Active on Volvelo</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Fulfill Item with DHL Modal */}
      {fulfillModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-[#111111]">Dispatched Order Item</h3>
              <button
                type="button"
                onClick={() => setFulfillModalOrder(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFulfillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Shipping Courier *
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none font-medium"
                >
                  <option value="DHL Express">DHL Express (Germany / EU)</option>
                  <option value="DPD Europe">DPD Europe</option>
                  <option value="PostNord">PostNord (Nordics)</option>
                  <option value="Colissimo">Colissimo (France)</option>
                  <option value="Poste Italiane">Poste Italiane (Italy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tracking / Consignment Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHL-984729104EU"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none uppercase font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setFulfillModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fulfilling}
                  className="px-5 py-2 text-xs font-bold bg-[#0F5132] text-white rounded-xl hover:bg-[#0A3622] transition-colors disabled:opacity-50"
                >
                  {fulfilling ? 'Updating...' : 'Confirm Fulfillment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggest Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-[#111111]">Suggest New Master Category</h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {catSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={36} className="text-[#0F5132] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#111111]">Category Request Sent!</h4>
                <p className="text-xs text-[#666660]">
                  Super Admin will review and provision this category in the master taxonomy.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCategoryRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Proposed Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recycled Canvas Travel Bags"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Parent Department
                  </label>
                  <select
                    value={catParent}
                    onChange={(e) => setCatParent(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  >
                    <option value="">None (Top-Level Department)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Rationale / Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain why this category will help shoppers find your crafted items..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={catSubmitting}
                    className="px-5 py-2 text-xs font-bold bg-[#0F5132] text-white rounded-xl hover:bg-[#0A3622] transition-colors disabled:opacity-50"
                  >
                    {catSubmitting ? 'Submitting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MerchantPortalClient;
