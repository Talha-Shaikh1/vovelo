'use client';

import React, { useState } from 'react';
import { PromoCode } from '@/lib/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Percent,
  Euro,
  Truck,
  Copy,
  Check,
} from 'lucide-react';

interface PromosManagerClientProps {
  initialPromos: PromoCode[];
}

export function PromosManagerClient({ initialPromos }: PromosManagerClientProps) {
  const [promos, setPromos] = useState<PromoCode[]>(initialPromos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    promoId: string | null;
    code: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    promoId: null,
    code: '',
    isDeleting: false,
  });

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<PromoCode['discountType']>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = async (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    try {
      await fetch(`/api/promos/${id}`, { method: 'PATCH' });
    } catch {}
  };

  const handleDeleteClick = (promo: PromoCode) => {
    setDeleteModal({
      isOpen: true,
      promoId: promo.id,
      code: promo.code,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.promoId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await fetch(`/api/promos/${deleteModal.promoId}`, { method: 'DELETE' });
      setPromos((prev) => prev.filter((p) => p.id !== deleteModal.promoId));
    } catch {
    } finally {
      setDeleteModal({
        isOpen: false,
        promoId: null,
        code: '',
        isDeleting: false,
      });
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description,
          discountType,
          discountValue: Number(discountValue),
          minSpend: Number(minSpend) || 0,
          isActive: true,
          expiresAt: expiresAt || null,
        }),
      });

      if (res.ok) {
        const newPromo = await res.json();
        setPromos((prev) => [newPromo, ...prev]);
        setIsModalOpen(false);
        setCode('');
        setDescription('');
        setDiscountValue(10);
        setMinSpend(0);
        setExpiresAt('');
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Conversion & Campaigns
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            Promo Codes & Discounts
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Create storewide vouchers, flash discount codes, and free shipping triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F5132] text-white rounded-xl text-xs font-bold hover:bg-[#0A3622] transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Active Codes</span>
            <Tag size={16} className="text-[#0F5132]" />
          </div>
          <p className="text-2xl font-black text-[#111111] mt-2">
            {promos.filter((p) => p.isActive).length}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block">Live across all storefronts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Total Redemptions</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#111111] mt-2 font-mono">
            {promos.reduce((acc, p) => acc + (p.usageCount || 0), 0)}
          </p>
          <span className="text-[11px] text-[#666660] mt-1 block">Guest & express checkouts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#666660]">Top Performing</span>
            <Percent size={16} className="text-[#0F5132]" />
          </div>
          <p className="text-xl font-extrabold text-[#0F5132] mt-2 font-mono truncate">
            {promos[0]?.code || 'N/A'}
          </p>
          <span className="text-[11px] text-[#666660] mt-1 block">
            {promos[0]?.usageCount || 0} times applied
          </span>
        </div>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E4E4E0] text-[#666660] uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-5">Coupon Code</th>
                <th className="py-3.5 px-5">Discount Type & Value</th>
                <th className="py-3.5 px-5">Min. Spend</th>
                <th className="py-3.5 px-5">Usage Count</th>
                <th className="py-3.5 px-5">Expiry</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#111111] bg-[#F0F0EC] px-2.5 py-1 rounded-lg border border-[#E4E4E0]">
                        {promo.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(promo.code)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === promo.code ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <span className="text-[11px] text-[#666660] mt-1 block max-w-xs truncate">
                      {promo.description}
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                      {promo.discountType === 'PERCENTAGE' && (
                        <>
                          <Percent size={14} className="text-[#0F5132]" />
                          <span>{promo.discountValue}% Off</span>
                        </>
                      )}
                      {promo.discountType === 'FIXED' && (
                        <>
                          <Euro size={14} className="text-[#0F5132]" />
                          <span>€{promo.discountValue} Off</span>
                        </>
                      )}
                      {promo.discountType === 'FREE_SHIPPING' && (
                        <>
                          <Truck size={14} className="text-[#0F5132]" />
                          <span>Free EU Shipping</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-5 font-mono text-neutral-700">
                    {promo.minSpend ? `€${promo.minSpend}` : 'No minimum'}
                  </td>

                  <td className="py-4 px-5 font-mono font-bold text-[#111111]">
                    {promo.usageCount}
                  </td>

                  <td className="py-4 px-5 text-[#666660]">
                    {promo.expiresAt ? (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{promo.expiresAt}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Never expires</span>
                    )}
                  </td>

                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => handleToggle(promo.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        promo.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                      }`}
                    >
                      {promo.isActive ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-neutral-400" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(promo)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete code"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Create New Promo Code</h3>
              <p className="text-xs text-[#666660] mt-0.5">
                Set up a new discount code for marketing campaigns.
              </p>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description / Campaign Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% off all merino apparel for European summer"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none font-medium"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (€)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Value {discountType === 'PERCENTAGE' ? '(%)' : '(€)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={discountType === 'FREE_SHIPPING'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Min. Spend (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Expiry Date (optional)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-[#0F5132] text-white rounded-xl hover:bg-[#0A3622] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, promoId: null, code: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Promo Code"
        message={`Are you sure you want to permanently delete the promo code "${deleteModal.code}"? Customers will no longer be able to apply this code during checkout.`}
        confirmText="Delete Code"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
}

export default PromosManagerClient;
