'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { UserAccount } from '@/lib/types';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  FolderTree,
  FileText,
  Settings,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Tag,
  MailCheck,
  Users,
} from 'lucide-react';

interface AdminSidebarProps {
  userAccount: UserAccount;
}

export function AdminSidebar({ userAccount }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Tenants / Makers', href: '/admin/tenants', icon: Store },
    { name: 'Products & Variants', href: '/admin/products', icon: Package },
    { name: 'Orders Dashboard', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Abandoned Carts', href: '/admin/abandoned-carts', icon: MailCheck },
    { name: 'Promos & Coupons', href: '/admin/promos', icon: Tag },
    { name: 'Categories & Taxonomy', href: '/admin/categories', icon: FolderTree },
    { name: 'Staff & Roles', href: '/admin/staff', icon: Users },
    { name: 'Journal & Blog', href: '/admin/blog', icon: FileText },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#E4E4E0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Volvelo Admin" className="h-6 w-auto object-contain" />
          <span className="text-[10px] bg-[#E8F3EE] text-[#0F5132] px-2 py-0.5 rounded font-bold uppercase">
            {userAccount.role}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-[#666660] hover:text-[#111111]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E4E4E0] flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-[#E4E4E0] flex items-center justify-between">
          <a href="/admin" className="flex flex-col gap-1">
            <img src="/logo.png" alt="Volvelo Admin" className="h-7 w-auto object-contain" />
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-[#0F5132] font-bold tracking-wider uppercase pl-0.5">
                Enterprise Hub
              </span>
              <span className="text-[9px] bg-[#E8F3EE] text-[#0F5132] font-extrabold px-1.5 py-0.2 rounded">
                {userAccount.role}
              </span>
            </div>
          </a>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'text-[#666660] hover:bg-[#F0F0EC] hover:text-[#111111]'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Bottom Sidebar Utility */}
        <div className="p-4 border-t border-[#E4E4E0] space-y-2">
          <a
            href="/portal"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-bold text-[#0F5132] border border-emerald-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store size={14} className="text-[#0F5132]" />
              <span>Merchant Portal</span>
            </span>
            <span className="text-[10px] text-emerald-800">/portal</span>
          </a>

          <a
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-[#FAFAF8] hover:bg-[#F0F0EC] rounded-xl text-xs font-semibold text-[#111111] border border-[#E4E4E0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-[#0F5132]" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] text-[#666660]">View</span>
          </a>

          <div className="px-3 py-2.5 bg-[#E8F3EE] rounded-xl flex items-center justify-between gap-2 border border-emerald-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              {mounted ? (
                <UserButton />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#0F5132]/15 border border-[#0F5132]/20 flex items-center justify-center text-[11px] font-bold text-[#0F5132] shrink-0">
                  {userAccount.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#0F5132] truncate">
                  {userAccount.name || 'Admin User'}
                </p>
                <p className="text-[10px] text-[#0F5132]/80 truncate">
                  {userAccount.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
