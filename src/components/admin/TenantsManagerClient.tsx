'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tenant } from '@/lib/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Store,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
  ExternalLink,
  MapPin,
  Check,
  X,
  UserCheck,
} from 'lucide-react';

interface TenantsManagerClientProps {
  initialTenants: Tenant[];
}

export function TenantsManagerClient({ initialTenants }: TenantsManagerClientProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_REVIEW' | 'INACTIVE'>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'reject' | 'deactivate';
    tenantId: string | null;
    tenantName: string;
    isProcessing: boolean;
  }>({
    isOpen: false,
    type: 'reject',
    tenantId: null,
    tenantName: '',
    isProcessing: false,
  });

  const pendingCount = tenants.filter((t) => t.status === 'PENDING_REVIEW').length;

  const handleApprove = async (tenantId: string) => {
    setLoadingId(tenantId);
    try {
      const res = await fetch(`/api/admin/tenants/${tenantId}/approve`, { method: 'POST' });
      if (res.ok) {
        setTenants((prev) =>
          prev.map((t) => (t.id === tenantId ? { ...t, status: 'ACTIVE' } : t))
        );
        setNotification('Maker approved and provisioned with instant Merchant Portal access.');
      }
    } catch {
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectClick = (tenant: Tenant) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      tenantId: tenant.id,
      tenantName: tenant.name,
      isProcessing: false,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.tenantId) return;
    setConfirmModal((prev) => ({ ...prev, isProcessing: true }));

    try {
      if (confirmModal.type === 'reject') {
        const res = await fetch(`/api/admin/tenants/${confirmModal.tenantId}/reject`, { method: 'POST' });
        if (res.ok) {
          setTenants((prev) =>
            prev.map((t) => (t.id === confirmModal.tenantId ? { ...t, status: 'REJECTED' } : t))
          );
          setNotification(`Application for "${confirmModal.tenantName}" has been rejected.`);
        }
      } else if (confirmModal.type === 'deactivate') {
        const res = await fetch('/api/admin/tenants/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: confirmModal.tenantId }),
        });
        const data = await res.json();
        if (data.success && data.tenant) {
          setTenants((prev) =>
            prev.map((t) => (t.id === confirmModal.tenantId ? data.tenant : t))
          );
          setNotification(`Brand "${confirmModal.tenantName}" has been deactivated.`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmModal({
        isOpen: false,
        type: 'reject',
        tenantId: null,
        tenantName: '',
        isProcessing: false,
      });
    }
  };

  const handleToggleStatus = async (tenantId: string) => {
    setLoadingId(tenantId);
    setNotification(null);

    try {
      const res = await fetch('/api/admin/tenants/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tenantId }),
      });

      const data = await res.json();
      if (data.success && data.tenant) {
        setTenants((prev) =>
          prev.map((t) => (t.id === tenantId ? data.tenant : t))
        );
        const stateText = data.tenant.status === 'ACTIVE' ? 'ACTIVATED' : 'DEACTIVATED';
        setNotification(
          `Tenant "${data.tenant.name}" is now ${stateText}. Storefront visibility has updated instantly.`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredTenants = activeFilter === 'ALL'
    ? tenants
    : tenants.filter((t) => t.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Multi-Tenant Governance
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            Makers & Supplier Tenants
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Manage verified luxury brands, review pending partner applications, and toggle live catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            target="_blank"
            className="px-4 py-2.5 bg-white border border-[#E4E4E0] hover:bg-[#F0F0EC] text-[#111111] text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Open Merchant Portal</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Action Notification */}
      {notification && (
        <div className="p-4 bg-[#E8F3EE] rounded-xl border border-[#d2e8dd] text-xs font-medium text-[#0F5132] flex items-center justify-between animate-in fade-in duration-200">
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

      {/* Pending Applications Alert Banner */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {pendingCount} Pending European Maker {pendingCount === 1 ? 'Application' : 'Applications'}
              </h4>
              <p className="text-[11px] text-amber-800">
                Review workshop credentials and approve to provision instant portal access.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter('PENDING_REVIEW')}
            className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg shadow-2xs"
          >
            Review Applications
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-[#E4E4E0] gap-4 text-xs font-bold">
        {[
          { key: 'ALL', label: `All Tenants (${tenants.length})` },
          { key: 'ACTIVE', label: `Active Makers (${tenants.filter((t) => t.status === 'ACTIVE').length})` },
          { key: 'PENDING_REVIEW', label: `Pending Review (${pendingCount})` },
          { key: 'INACTIVE', label: `Inactive (${tenants.filter((t) => t.status === 'INACTIVE').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key as any)}
            className={`pb-3 border-b-2 transition-colors ${
              activeFilter === tab.key
                ? 'border-[#0F5132] text-[#0F5132]'
                : 'border-transparent text-[#666660] hover:text-[#111111]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => {
          const isActive = tenant.status === 'ACTIVE';
          const isPending = tenant.status === 'PENDING_REVIEW';
          const isLoading = loadingId === tenant.id;

          return (
            <div
              key={tenant.id}
              className={`p-6 bg-white rounded-2xl border transition-all shadow-2xs flex flex-col justify-between space-y-5 ${
                isPending
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : isActive
                  ? 'border-[#E4E4E0]'
                  : 'border-rose-200 bg-rose-50/20 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isPending
                        ? 'bg-amber-100 text-amber-800'
                        : isActive
                        ? 'bg-[#E8F3EE] text-[#0F5132]'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tenant.status.replace('_', ' ')}
                  </span>

                  <span className="text-[11px] font-mono text-[#666660]">
                    {tenant.commissionRate ?? 15}% Fee
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#111111]">
                    {tenant.name}
                  </h4>
                  {tenant.city && tenant.country && (
                    <p className="text-xs text-[#666660] flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#0F5132]" />
                      <span>{tenant.city}, {tenant.country}</span>
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#555550] line-clamp-2 leading-relaxed">
                  {tenant.story || 'Independent European maker on Volvelo.'}
                </p>

                <div className="pt-2 text-[11px] text-[#666660] space-y-1">
                  <div>Contact: <strong>{tenant.contactPerson || tenant.email}</strong></div>
                  <div className="font-mono truncate">Email: {tenant.email}</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[#E4E4E0] flex items-center justify-between gap-2">
                {isPending ? (
                  <>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleRejectClick(tenant)}
                      className="px-3 py-1.5 border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Decline
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleApprove(tenant.id)}
                      className="px-4 py-1.5 bg-[#0F5132] hover:bg-[#0A3622] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Check size={14} />
                      <span>Approve & Activate</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/brand/${tenant.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
                    >
                      <span>Showcase</span>
                      <ExternalLink size={11} />
                    </Link>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleToggleStatus(tenant.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                        isActive
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-[#0F5132] hover:bg-[#0A3622] text-white'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : isActive ? (
                        <span>Deactivate</span>
                      ) : (
                        <span>Activate</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === 'reject' ? 'Decline Application' : 'Deactivate Brand'}
        message={
          confirmModal.type === 'reject'
            ? `Are you sure you want to decline the European Maker application from "${confirmModal.tenantName}"? This decision will be logged and the maker will not receive an onboarding invite.`
            : `Are you sure you want to deactivate "${confirmModal.tenantName}"? All their listed products will be hidden from the storefront immediately.`
        }
        confirmText={confirmModal.type === 'reject' ? 'Decline Application' : 'Deactivate'}
        cancelText="Cancel"
        variant="danger"
        isLoading={confirmModal.isProcessing}
      />
    </div>
  );
}

export default TenantsManagerClient;
