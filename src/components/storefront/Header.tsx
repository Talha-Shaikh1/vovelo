'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { ShoppingBag, Search, Menu, X, ChevronDown, ArrowRight, Sparkles, Heart, ShieldCheck, Store, User } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { LiveSearchModal } from './LiveSearchModal';
import { Category } from '@/lib/types';
import { mockCategories } from '@/lib/mock-data';
import CurrencySwitcher from './CurrencySwitcher';

interface HeaderProps {
  announcement?: string | null;
  categories?: Category[];
}

export function Header({
  announcement = 'Free European shipping on orders over €50 • Carbon-neutral delivery',
  categories = mockCategories,
}: HeaderProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [authInfo, setAuthInfo] = useState<{
    isAdmin: boolean;
    isMerchant: boolean;
    role: string | null;
    tenant: { name: string; slug: string } | null;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setAuthInfo({
              isAdmin: data.isAdmin,
              isMerchant: data.isMerchant,
              role: data.role,
              tenant: data.tenant,
            });
          }
        })
        .catch(() => {});
    } else if (isLoaded && !isSignedIn) {
      setAuthInfo(null);
    }
  }, [isLoaded, isSignedIn]);

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());

  // Only render top-level departments (Men, Women) in the main navbar
  const navCategories = categories.filter((c) => !c.parentId);

  const handleMouseEnter = (slug: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E4E4E0] transition-all">
        {/* Top Announcement Bar */}
        {announcement && (
          <aside
            aria-label="Store Announcement"
            className="bg-[#0F5132] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
            <span>{announcement}</span>
          </aside>
        )}

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20 gap-4">
            {/* Left Brand & Mobile Menu Button */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#111111] hover:text-[#0F5132] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link
                href="/"
                className="group flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0F5132] rounded-lg"
                title="Volvelo Home"
              >
                <img
                  src="/logo.png"
                  alt="Volvelo"
                  className="h-7 md:h-8 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links with Nested Mega-Menu Dropdowns */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-[#111111]/85 h-full shrink-0"
            >
              <Link
                href="/shop"
                className="hover:text-[#0F5132] transition-colors py-6 relative whitespace-nowrap font-medium"
              >
                All Collections
              </Link>

              {navCategories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isDropdownActive = activeDropdown === cat.slug;

                return (
                  <div
                    key={cat.slug}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => hasChildren && handleMouseEnter(cat.slug)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex items-center gap-1 py-6 transition-colors whitespace-nowrap ${
                        isDropdownActive ? 'text-[#0F5132] font-semibold' : 'hover:text-[#0F5132]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 opacity-60 ${
                            isDropdownActive ? 'rotate-180 text-[#0F5132] opacity-100' : ''
                          }`}
                        />
                      )}
                    </Link>

                    {/* Mega-menu dropdown panel */}
                    {hasChildren && isDropdownActive && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-2xl shadow-2xl border border-[#E4E4E0] p-6 grid grid-cols-12 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-150 z-50"
                        onMouseEnter={() => handleMouseEnter(cat.slug)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Left: Subcategory Links List */}
                        <div className="col-span-7 space-y-4">
                          <div className="border-b border-[#F0F0EC] pb-2 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#666660]">
                              {cat.name} Categories
                            </span>
                            <Link
                              href={`/category/${cat.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="text-[11px] font-semibold text-[#0F5132] hover:underline"
                            >
                              Explore All
                            </Link>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {cat.children?.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/category/${sub.slug}`}
                                onClick={() => setActiveDropdown(null)}
                                className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F0EC] transition-colors"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-[#111111] group-hover/item:text-[#0F5132] transition-colors">
                                    {sub.name}
                                  </p>
                                  {sub.description && (
                                    <p className="text-[10px] text-[#666660] line-clamp-1 mt-0.5">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={12}
                                  className="text-[#666660] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Right: Department Highlight Feature Banner */}
                        <div className="col-span-5 relative rounded-xl overflow-hidden bg-[#F0F0EC] aspect-[4/5] border border-[#E4E4E0] group/img flex flex-col justify-end p-4">
                          <img
                            src={
                              cat.image ||
                              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={cat.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="relative z-10 text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              Curated
                            </span>
                            <h5 className="font-bold text-xs mt-0.5 text-white">
                              {cat.name} Lineup
                            </h5>
                            <Link
                              href={`/category/${cat.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:text-emerald-300 transition-colors"
                            >
                              <span>Shop {cat.name}</span>
                              <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Role-Based Dynamic Admin / Maker Portal Badges (Only shown when logged in) */}
              {isLoaded && isSignedIn && authInfo?.isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0F5132] text-white hover:bg-[#0A3622] transition-colors shadow-xs"
                  title="Open Admin Hub"
                >
                  <ShieldCheck size={13} />
                  <span>Admin Hub</span>
                </Link>
              )}

              {isLoaded && isSignedIn && !authInfo?.isAdmin && authInfo?.isMerchant && (
                <Link
                  href="/portal"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F3EE] text-[#0F5132] hover:bg-[#D4EADE] border border-emerald-200 transition-colors"
                  title="Open Maker Portal"
                >
                  <Store size={13} />
                  <span>Maker Portal</span>
                </Link>
              )}

              {/* Live Search Trigger Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 sm:px-3 sm:py-1.5 text-[#111111] hover:text-[#0F5132] bg-[#F0F0EC] hover:bg-[#E4E4E0] rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Open live search"
              >
                <Search size={15} className="text-[#0F5132]" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden xl:inline text-[10px] bg-white text-[#666660] px-1 py-0.2 rounded border border-[#D5D5D0]">
                  ⌘K
                </kbd>
              </button>

              {/* Currency Selector */}
              <CurrencySwitcher />

              {/* Wishlist Link with dynamic badge */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#111111] hover:text-rose-600 hover:bg-[#F0F0EC] rounded-full transition-colors flex items-center"
                aria-label={`Open Wishlist (${totalWishlistItems} saved)`}
                title="Saved Wishlist"
              >
                <Heart size={19} />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 shadow-xs">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Link with dynamic item count */}
              <Link
                href="/cart"
                className="relative p-2 text-[#111111] hover:text-[#0F5132] hover:bg-[#F0F0EC] rounded-full transition-colors flex items-center"
                aria-label={`Open Shopping Bag (${totalItems} items)`}
                title="View Shopping Bag"
              >
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0F5132] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200 shadow-xs">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Avatar when signed in */}
              {mounted && isLoaded && isSignedIn && (
                <div className="flex items-center pl-0.5">
                  <UserButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAFAF8] border-b border-[#E4E4E0] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left text-xs bg-white border border-[#E4E4E0] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-[#666660]"
            >
              <Search size={16} className="text-[#0F5132]" />
              <span>Search products, merino, backpacks...</span>
            </button>

            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1 pt-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2.5 px-3 rounded-lg text-[#111111] hover:bg-[#F0F0EC] transition-colors"
              >
                All Collections
              </Link>

              {navCategories.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.slug;
                const hasChildren = cat.children && cat.children.length > 0;

                return (
                  <div key={cat.slug} className="border-b border-[#F0F0EC] pb-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-semibold py-2 px-3 text-[#111111]"
                      >
                        {cat.name}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedCat(isExpanded ? null : cat.slug)
                          }
                          className="p-2 text-[#666660]"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobile Subcategories Accordion */}
                    {hasChildren && isExpanded && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-[#F0F0EC]/50 rounded-lg">
                        {cat.children?.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-xs text-[#666660] hover:text-[#0F5132]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 border-t border-[#E4E4E0] flex items-center gap-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-white border border-[#E4E4E0] text-xs font-bold text-[#111111] flex items-center justify-center gap-2"
                >
                  <Heart size={15} className="text-rose-500" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#0F5132] text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>Cart ({totalItems})</span>
                </Link>
              </div>

              {/* Mobile User & Role Actions */}
              <div className="pt-2 border-t border-[#E4E4E0] space-y-2">
                {mounted && isLoaded && isSignedIn ? (
                  <div className="bg-[#F0F0EC]/70 rounded-2xl p-3 space-y-2 border border-[#E4E4E0]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserButton />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#111111] truncate">
                            {user?.fullName || user?.firstName || 'Logged In'}
                          </p>
                          <p className="text-[10px] text-[#666660] truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      {authInfo?.role && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white text-[#0F5132] border border-emerald-200">
                          {authInfo.role}
                        </span>
                      )}
                    </div>

                    {authInfo?.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 px-3 bg-[#0F5132] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                      >
                        <ShieldCheck size={15} />
                        <span>Open Admin Panel</span>
                      </Link>
                    )}

                    {authInfo?.isMerchant && (
                      <Link
                        href="/portal"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 px-3 bg-white text-[#0F5132] border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                      >
                        <Store size={15} />
                        <span>Open Maker Portal</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E4E4E0] text-xs font-bold text-[#111111] hover:bg-[#F0F0EC] transition-colors"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <Link
                      href="/sell-with-us"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F5132] text-white text-xs font-bold text-center hover:bg-[#0A3622] transition-colors"
                    >
                      Sell With Us
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Live Search Modal */}
      <LiveSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
