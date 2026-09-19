'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Category, CategoryRequest } from '@/lib/types';
import {
  FolderTree,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Check,
  X,
  Store,
  ExternalLink,
} from 'lucide-react';

interface CategoriesManagerClientProps {
  initialCategories: Category[];
  initialRequests: CategoryRequest[];
}

export function CategoriesManagerClient({
  initialCategories,
  initialRequests,
}: CategoriesManagerClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [requests, setRequests] = useState<CategoryRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'requests'>('taxonomy');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');

  const handleApprove = async (requestId: string) => {
    setApprovingId(requestId);
    try {
      const res = await fetch(`/api/categories/request/${requestId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.category) {
        setCategories((prev) => [...prev, data.category]);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
        );
      }
    } catch {
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Taxonomy & Navigation Governance
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            Categories & Maker Proposals
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Standardized categories powering the Header Mega-Menu, search autocomplete, and Google SEO.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4E4E0] gap-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'taxonomy'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#666660] hover:text-[#111111]'
          }`}
        >
          <FolderTree size={15} />
          <span>Master Taxonomy ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#666660] hover:text-[#111111]'
          }`}
        >
          <Clock size={15} />
          <span>Maker Category Requests ({pendingRequests.length} Pending)</span>
        </button>
      </div>

      {/* Tab 1: Master Taxonomy */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs flex gap-4 items-start"
            >
              <img
                src={
                  cat.image ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
                }
                alt={cat.name}
                className="w-20 h-20 object-cover rounded-xl bg-[#F0F0EC] shrink-0 border border-[#E4E4E0]"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#111111]">{cat.name}</h3>
                  <span className="text-[11px] font-mono text-[#0F5132] bg-[#E8F3EE] px-2 py-0.5 rounded">
                    {cat._count?.products || 0} products
                  </span>
                </div>
                <p className="text-xs font-mono text-[#666660]">slug: /{cat.slug}</p>
                <p className="text-xs text-[#666660] line-clamp-2">{cat.description}</p>

                {cat.children && cat.children.length > 0 && (
                  <div className="pt-2 border-t border-[#F0F0EC]">
                    <span className="text-[10px] font-bold text-[#111111] block mb-1 uppercase tracking-wider">
                      Sub-Categories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.children.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[10px] bg-[#F0F0EC] px-2 py-0.5 rounded-md text-[#555550]"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Link
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="text-[#0F5132] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View in Storefront</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Maker Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#E4E4E0]">
            <h3 className="text-sm font-bold text-[#111111]">Maker Category Proposals</h3>
            <p className="text-xs text-[#666660] mt-0.5">
              Approve maker-suggested categories to automatically add them into master navigation and storefront filters.
            </p>
          </div>

          <div className="divide-y divide-[#E4E4E0]">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No category requests submitted yet.
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAF8]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111111]">{req.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#666660] max-w-xl">{req.description}</p>

                    <div className="flex items-center gap-2 text-[11px] text-[#0F5132] pt-1">
                      <Store size={12} />
                      <span>Requested by <strong>{req.requestedByTenantName}</strong> on {req.createdAt}</span>
                    </div>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id)}
                        disabled={approvingId === req.id}
                        className="px-4 py-2 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                      >
                        <Check size={14} />
                        <span>{approvingId === req.id ? 'Adding...' : 'Approve & Add to Global Menu'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManagerClient;
