'use client';

import React, { useState } from 'react';
import { UserAccount, UserRole, Tenant } from '@/lib/types';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Crown,
  Key,
  Store,
  CheckCircle2,
  X,
} from 'lucide-react';

interface StaffManagerClientProps {
  initialUsers: UserAccount[];
  tenants: Tenant[];
}

export function StaffManagerClient({ initialUsers, tenants }: StaffManagerClientProps) {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [tenantId, setTenantId] = useState<string>('');

  const handleRoleChange = async (userId: string, newRole: UserRole, newTenantId?: string | null) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, tenantId: newTenantId ?? u.tenantId } : u))
    );

    try {
      await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole, tenantId: newTenantId }),
      });
    } catch {}
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          tenantId: role === 'MERCHANT' ? tenantId : null,
        }),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers((prev) => [...prev, newUser]);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        setRole('ADMIN');
        setTenantId('');
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
            Access Control & RBAC
          </span>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-0.5">
            Staff & Merchant Team Roles
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Manage Super Admins, Operations Staff, and Merchant Portal access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F5132] text-white rounded-xl text-xs font-bold hover:bg-[#0A3622] transition-colors shadow-xs"
        >
          <UserPlus size={16} />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Roles Explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
            <Crown size={15} />
            <span>SUPER ADMIN (Bootstrap Role)</span>
          </div>
          <p className="text-xs text-[#666660] leading-relaxed">
            First login user becomes Super Admin automatically. Unrestricted access to master settings, commissions, and maker approvals.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#0F5132] font-bold text-xs">
            <ShieldCheck size={15} />
            <span>OPERATIONS / STAFF</span>
          </div>
          <p className="text-xs text-[#666660] leading-relaxed">
            Can fulfill orders, update site settings, manage promo coupons, and handle customer reviews.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <Store size={15} />
            <span>MERCHANT / BRAND</span>
          </div>
          <p className="text-xs text-[#666660] leading-relaxed">
            Restricted to their specific brand. Access to /portal to manage products, stock, and DHL fulfillment.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-[#E4E4E0] text-[#666660] uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Assigned Brand</th>
                <th className="py-3.5 px-5">Created</th>
                <th className="py-3.5 px-5 text-right">Update Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0]">
              {users.map((user) => {
                const tenant = tenants.find((t) => t.id === user.tenantId);
                return (
                  <tr key={user.id} className="hover:bg-[#FAFAF8]">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E8F3EE] text-[#0F5132] font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-[#111111] block">{user.name}</span>
                          <span className="text-[11px] text-[#666660] font-mono">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-amber-100 text-amber-900'
                            : user.role === 'ADMIN'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-[#666660]">
                      {tenant ? (
                        <span className="font-medium text-[#111111] flex items-center gap-1">
                          <Store size={12} className="text-[#0F5132]" />
                          <span>{tenant.name}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">Global / In-House</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-[#666660] font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="text-xs bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg px-2.5 py-1 font-semibold focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPPORT">SUPPORT</option>
                        <option value="MERCHANT">MERCHANT</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-[#111111]">Invite Staff or Merchant</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Weber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@vovelo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Role Permission
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                >
                  <option value="ADMIN">ADMIN (Full Catalog & Orders)</option>
                  <option value="SUPPORT">SUPPORT (Orders & Disputes)</option>
                  <option value="MERCHANT">MERCHANT (Scoped Brand Portal)</option>
                </select>
              </div>

              {role === 'MERCHANT' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Assign to Brand
                  </label>
                  <select
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:outline-none"
                  >
                    <option value="">Select Brand...</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.country})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
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
                  className="px-5 py-2 text-xs font-bold bg-[#0F5132] text-white rounded-xl hover:bg-[#0A3622] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagerClient;
