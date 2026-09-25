'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Store,
  Tag,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { LiveSearchModal } from './LiveSearchModal';
import { BrandLogo } from './BrandLogo';
import { Category } from '@/lib/types';
import { mockCategories } from '@/lib/mock-data';

interface HeaderProps {
  announcement?: string | null;
  categories?: Category[];
}

interface DepartmentGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  bannerTag: string;
  bannerTitle: string;
  categories: {
    name: string;
    slug: string;
    count?: string;
    description?: string;
  }[];
}

const LUXURY_DEPARTMENTS: DepartmentGroup[] = [
  {
    id: 'leather-goods',
    name: 'Bags & Leather',
    slug: 'bags',
    description: 'Iconic designer handbags, leather backpacks, belts, and wallets',
    bannerImage: '/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_',
    bannerTag: '1:1 Master Craft',
    bannerTitle: 'Handbags & Small Leather Goods',
    categories: [
      { name: 'Handbags & Shoulder Bags', slug: 'bags', count: '1,454 items', description: 'Classic flap bags, totes & clutches' },
      { name: 'Leather Backpacks', slug: 'backpacks', count: '70 items', description: 'Designer city & travel backpacks' },
      { name: 'Belt Bags & Crossbody', slug: 'belt-bags', count: '58 items', description: 'Structured waist & sling packs' },
      { name: 'Designer Belts', slug: 'belts', count: '432 items', description: 'Signature buckle & reversible leather belts' },
      { name: 'Luxury Wallets & Cardholders', slug: 'wallets', count: '134 items', description: 'Compact wallets, zipped folios' },
    ],
  },
  {
    id: 'footwear-dept',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Italian leather sneakers, artisanal heels, boots, and slides',
    bannerImage: '/api/drive-image/1_iUF_NBLijQ9Yk3PG3ncnYnd_CzgY_9Z',
    bannerTag: 'Footwear Archive',
    bannerTitle: 'Handmade Italian & Parisian Footwear',
    categories: [
      { name: 'All Footwear Collection', slug: 'footwear', count: '1,773 items', description: 'Complete luxury shoes catalog' },
      { name: 'Designer Sneakers', slug: 'footwear?sub=Sneakers', count: 'Sneakers', description: 'Court, runner & low-top sneakers' },
      { name: 'Artisanal Boots', slug: 'footwear?sub=Boots', count: 'Boots', description: 'Chelsea, ankle & combat boots' },
      { name: 'Luxury Heels & Pumps', slug: 'footwear?sub=Heels', count: 'Heels', description: 'Stiletto, kitten & block heels' },
      { name: 'Sandals & Slides', slug: 'footwear?sub=Slides', count: 'Slides', description: 'Leather slides & pool mules' },
    ],
  },
  {
    id: 'apparel-dept',
    name: 'Outerwear & Apparel',
    slug: 'coats',
    description: 'Tailored wool coats, puffer jackets, summer silks, and premium tees',
    bannerImage: '/api/drive-image/1O8FDN7m8_biyYC1bbBwiJwDAlLPpf2Z5',
    bannerTag: 'Ready-To-Wear',
    bannerTitle: 'European Tailoring & Outerwear',
    categories: [
      { name: 'Coats & Jackets', slug: 'coats', count: '374 items', description: 'Trench coats, wool coats & down parkas' },
      { name: 'Designer T-Shirts', slug: 't-shirts', count: '207 items', description: 'Heavyweight organic cotton & graphics' },
      { name: 'Summer Wear & Silks', slug: 'summer-wear', count: '45 items', description: 'Lightweight linen & resort silks' },
    ],
  },
  {
    id: 'timepieces-jewelry',
    name: 'Watches & Jewelry',
    slug: 'watches',
    description: 'Swiss automatic chronographs and 18K fine jewelry collections',
    bannerImage: '/api/drive-image/1Gl64suRGtippDzPm4uOVsT2Et9LzGoaa',
    bannerTag: 'Horology & Fine Art',
    bannerTitle: 'Swiss Timepieces & Fine Jewelry',
    categories: [
      { name: 'Luxury Watches', slug: 'watches', count: '113 items', description: 'Swiss automatic chronographs & sports models' },
      { name: 'Fine Jewelry', slug: 'jewelry', count: '50 items', description: '18K gold necklaces, bracelets & rings' },
    ],
  },
  {
    id: 'accessories-dept',
    name: 'Accessories',
    slug: 'sunglasses',
    description: 'UV400 designer sunglasses, wool caps, fedoras, and mulberry silk scarfs',
    bannerImage: '/api/drive-image/1ohr0F3LW4932noXQ0vIB0er9OTRrwJhY',
    bannerTag: 'Luxury Accents',
    bannerTitle: 'Designer Sunglasses & Accessories',
    categories: [
      { name: 'Designer Sunglasses', slug: 'sunglasses', count: '133 items', description: 'Acetate frames, aviators & polarized lenses' },
      { name: 'Hats & Beanies', slug: 'hats', count: '258 items', description: 'Fedora hats, bucket hats & wool beanies' },
      { name: 'Baseball Caps', slug: 'caps', count: '50 items', description: 'Embroidered cotton & canvas caps' },
      { name: 'Silk & Cashmere Scarfs', slug: 'scarfs', count: '185 items', description: 'Printed silk twill & warm cashmere' },
    ],
  },
];

export function Header({
  announcement = 'Complimentary express shipping on all orders • 7-day inspection guarantee',
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
  const [mobileExpandedDept, setMobileExpandedDept] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalWishlistItems = useWishlistStore((state) => state.getTotalItems());

  const handleMouseEnter = (deptId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(deptId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E4E4E0] transition-all shadow-2xs">
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

        {/* Top Brand & Actions Tier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Left: Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#111111] hover:text-[#0F5132] focus:outline-none rounded-lg"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link
                href="/"
                className="group flex items-center focus:outline-none focus:ring-2 focus:ring-[#0F5132] rounded-lg py-1"
                title="Vovelo — Haute Couture & 1:1 Master Archive"
              >
                <BrandLogo size="md" className="group-hover:opacity-90 transition-opacity" />
              </Link>
            </div>

            {/* Center: VIP Live Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-full text-left text-xs bg-white hover:bg-[#F0F0EC] border border-[#E4E4E0] rounded-full px-4 py-2.5 flex items-center justify-between text-[#666660] shadow-2xs hover:border-[#0F5132]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search size={15} className="text-[#0F5132] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Search 5,300+ 1:1 items (Rolex, Chanel, Burberry, Sneakers)...</span>
                </div>
                <kbd className="text-[10px] bg-[#F0F0EC] text-[#666660] px-1.5 py-0.5 rounded border border-[#D5D5D0] font-mono shrink-0 ml-2">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions (Search Mobile, Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-2 text-[#111111] hover:text-[#0F5132] bg-[#F0F0EC] hover:bg-[#E4E4E0] rounded-full transition-colors"
                aria-label="Open search"
              >
                <Search size={18} className="text-[#0F5132]" />
              </button>

              {/* Admin Hub Badge */}
              {isLoaded && isSignedIn && authInfo?.isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0F5132] text-white hover:bg-[#0A3622] transition-colors shadow-xs"
                  title="Open Admin Hub"
                >
                  <ShieldCheck size={13} />
                  <span>Admin</span>
                </Link>
              )}

              {/* Maker Portal Badge */}
              {isLoaded && isSignedIn && !authInfo?.isAdmin && authInfo?.isMerchant && (
                <Link
                  href="/portal"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F3EE] text-[#0F5132] hover:bg-[#D4EADE] border border-emerald-200 transition-colors"
                  title="Open Maker Portal"
                >
                  <Store size={13} />
                  <span>Portal</span>
                </Link>
              )}

              {/* Wishlist Link with dynamic badge */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#111111] hover:text-rose-600 hover:bg-[#F0F0EC] rounded-full transition-colors flex items-center"
                aria-label={`Open Wishlist (${totalWishlistItems} saved)`}
                title="Saved Wishlist"
              >
                <Heart size={20} />
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
                <ShoppingBag size={20} />
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

        {/* Bottom Tier: Desktop Department Navigation Bar */}
        <div className="hidden lg:block border-t border-[#E4E4E0]/80 bg-white/70 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Department Navigation"
              className="flex items-center justify-center gap-6 xl:gap-8 text-xs font-bold text-[#111111]/85 h-11"
            >
              <Link
                href="/categories"
                className="hover:text-[#0F5132] transition-colors py-2.5 relative whitespace-nowrap"
              >
                All Collections
              </Link>

              {LUXURY_DEPARTMENTS.map((dept) => {
                const isDropdownActive = activeDropdown === dept.id;

                return (
                  <div
                    key={dept.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter(dept.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={`/category/${dept.slug}`}
                      className={`flex items-center gap-1 py-2.5 transition-colors whitespace-nowrap ${
                        isDropdownActive ? 'text-[#0F5132] font-extrabold' : 'hover:text-[#0F5132]'
                      }`}
                    >
                      <span>{dept.name}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 opacity-60 ${
                          isDropdownActive ? 'rotate-180 text-[#0F5132] opacity-100' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega-menu dropdown panel */}
                    {isDropdownActive && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white rounded-2xl shadow-2xl border border-[#E4E4E0] p-6 grid grid-cols-12 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-150 z-50"
                        onMouseEnter={() => handleMouseEnter(dept.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Left: Department Categories */}
                        <div className="col-span-7 space-y-3">
                          <div className="border-b border-[#F0F0EC] pb-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666660]">
                              {dept.name}
                            </span>
                            <Link
                              href={`/category/${dept.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="text-[11px] font-bold text-[#0F5132] hover:underline flex items-center gap-0.5"
                            >
                              <span>Explore All</span>
                              <ArrowRight size={11} />
                            </Link>
                          </div>

                          <div className="space-y-1">
                            {dept.categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={cat.slug.startsWith('footwear?') ? `/category/${cat.slug}` : `/category/${cat.slug}`}
                                onClick={() => setActiveDropdown(null)}
                                className="group/item flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F0EC] transition-colors"
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-[#111111] group-hover/item:text-[#0F5132] transition-colors truncate">
                                      {cat.name}
                                    </p>
                                    {cat.count && (
                                      <span className="text-[10px] text-[#666660] font-mono shrink-0">
                                        {cat.count}
                                      </span>
                                    )}
                                  </div>
                                  {cat.description && (
                                    <p className="text-[10px] text-[#666660] line-clamp-1 mt-0.5">
                                      {cat.description}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={12}
                                  className="text-[#666660] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all shrink-0"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Right: Department Highlight Feature Banner */}
                        <div className="col-span-5 relative rounded-xl overflow-hidden bg-[#F0F0EC] aspect-[4/5] border border-[#E4E4E0] group/img flex flex-col justify-end p-4">
                          <img
                            src={dept.bannerImage}
                            alt={dept.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                          <div className="relative z-10 text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              {dept.bannerTag}
                            </span>
                            <h5 className="font-bold text-xs mt-0.5 text-white leading-tight">
                              {dept.bannerTitle}
                            </h5>
                            <Link
                              href={`/category/${dept.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-emerald-300 transition-colors bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-xs"
                            >
                              <span>Shop {dept.name}</span>
                              <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 1:1 Master Quality Pill */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F3EE] text-[#0F5132] border border-emerald-200 hover:bg-[#D4EADE] transition-colors"
              >
                <Sparkles size={11} />
                <span>1:1 Master Archive</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAFAF8] border-b border-[#E4E4E0] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full text-left text-xs bg-white border border-[#E4E4E0] rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-[#666660] shadow-2xs"
            >
              <Search size={16} className="text-[#0F5132]" />
              <span>Search 5,300+ 1:1 items, Rolex, Chanel, Burberry...</span>
            </button>

            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1 pt-2">
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold py-2.5 px-3 rounded-xl text-[#111111] hover:bg-[#F0F0EC] transition-colors flex items-center justify-between"
              >
                <span>All Collections</span>
                <span className="text-[10px] font-bold bg-[#E8F3EE] text-[#0F5132] px-2 py-0.5 rounded-md">
                  15 Departments
                </span>
              </Link>

              {LUXURY_DEPARTMENTS.map((dept) => {
                const isExpanded = mobileExpandedDept === dept.id;

                return (
                  <div key={dept.id} className="border-b border-[#F0F0EC] pb-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/category/${dept.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-bold py-2 px-3 text-[#111111]"
                      >
                        {dept.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedDept(isExpanded ? null : dept.id)
                        }
                        className="p-2 text-[#666660]"
                        aria-label={`Toggle ${dept.name} subcategories`}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#0F5132]' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Mobile Subcategories Accordion */}
                    {isExpanded && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-[#F0F0EC]/60 rounded-xl my-1 border border-[#E4E4E0]/60">
                        {dept.categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={cat.slug.startsWith('footwear?') ? `/category/${cat.slug}` : `/category/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-semibold text-[#111111] hover:text-[#0F5132] hover:bg-white transition-colors"
                          >
                            <span>{cat.name}</span>
                            {cat.count && (
                              <span className="text-[10px] text-[#666660]">
                                {cat.count}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-3 border-t border-[#E4E4E0] flex items-center gap-2">
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E4E4E0] text-xs font-bold text-[#111111] flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Heart size={15} className="text-rose-500" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F5132] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
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
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F5132] text-white text-xs font-bold text-center hover:bg-[#0A3622] transition-colors"
                    >
                      Shop Catalog
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global VIP Live Search Modal */}
      <LiveSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
