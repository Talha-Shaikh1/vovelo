'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  RotateCcw,
  X,
  Check,
  ChevronDown,
  Sparkles,
  DollarSign,
  Tag,
  PackageCheck,
  ArrowUpDown,
} from 'lucide-react';
import { Category, Tenant } from '@/lib/types';

interface CategoryFiltersProps {
  categories: Category[];
  tenants?: Tenant[];
  activeCategorySlug?: string;
}

export function CategoryFilters({
  categories,
  tenants = [],
  activeCategorySlug,
}: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile Drawer State
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // URL state
  const currentCategory = activeCategorySlug || searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'seo';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentTenant = searchParams.get('tenant') || '';

  // Local inputs for price
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Calculate active filter count (excluding default sort & current category if on dedicated category page)
  let activeFilterCount = 0;
  if (currentCategory !== 'all' && !activeCategorySlug) activeFilterCount++;
  if (currentSort !== 'seo') activeFilterCount++;
  if (currentMinPrice || currentMaxPrice) activeFilterCount++;
  if (currentInStock) activeFilterCount++;
  if (currentTenant) activeFilterCount++;

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset pagination to page 1 on filter changes
    params.delete('page');

    const targetUrl =
      pathname.includes('/category/') &&
      updates.category &&
      updates.category !== activeCategorySlug
        ? `/category/${updates.category}?${params.toString()}`
        : `${pathname}?${params.toString()}`;

    router.push(targetUrl, { scroll: false });
  };

  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFilters({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  const handleSetPricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateFilters({
      minPrice: min || null,
      maxPrice: max || null,
    });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname, { scroll: false });
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE QUICK FILTER & SORT BAR (Visible on screens < lg)             */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full mb-6 space-y-3">
        {/* Horizontal Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => updateFilters({ category: null })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              currentCategory === 'all'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#111111] border border-[#E4E4E0] hover:bg-[#F0F0EC]'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateFilters({ category: cat.slug })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-white text-[#111111] border border-[#E4E4E0] hover:bg-[#F0F0EC]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Action Controls Row: Filter Button + Sort Select */}
        <div className="flex items-center gap-2">
          {/* Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs font-bold text-[#111111] shadow-2xs hover:bg-[#F0F0EC] transition-colors"
          >
            <SlidersHorizontal size={14} className="text-[#0F5132]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0F5132] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative flex-1">
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full text-xs font-semibold bg-white border border-[#E4E4E0] rounded-xl px-3 py-2.5 pr-8 text-[#111111] shadow-2xs appearance-none focus:outline-none focus:border-[#0F5132]"
            >
              <option value="seo">Featured & Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666660] pointer-events-none"
            />
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 bg-white border border-[#E4E4E0] rounded-xl text-xs text-[#666660] hover:text-rose-600 hover:border-rose-300 shadow-2xs transition-colors"
              title="Reset All Filters"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {/* Active Filter Badges on Mobile */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {currentSort !== 'seo' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#E8F3EE] text-[#0F5132] px-2.5 py-0.5 rounded-full border border-[#c4e4d4]">
                Sort: {currentSort === 'price_asc' ? 'Price Low-High' : currentSort === 'price_desc' ? 'Price High-Low' : 'Newest'}
                <button
                  type="button"
                  onClick={() => updateFilters({ sort: null })}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#E8F3EE] text-[#0F5132] px-2.5 py-0.5 rounded-full border border-[#c4e4d4]">
                Price: ${currentMinPrice || '0'}–${currentMaxPrice || '∞'}
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    updateFilters({ minPrice: null, maxPrice: null });
                  }}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {currentInStock && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#E8F3EE] text-[#0F5132] px-2.5 py-0.5 rounded-full border border-[#c4e4d4]">
                In Stock Only
                <button
                  type="button"
                  onClick={() => updateFilters({ inStock: null })}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {currentTenant && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#E8F3EE] text-[#0F5132] px-2.5 py-0.5 rounded-full border border-[#c4e4d4]">
                Maker: {tenants.find((t) => t.slug === currentTenant)?.name || currentTenant}
                <button
                  type="button"
                  onClick={() => updateFilters({ tenant: null })}
                  className="hover:text-rose-600 ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER FILTER DRAWER                                       */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#E4E4E0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#0F5132]" />
                <h3 className="font-bold text-sm text-[#111111]">
                  Filter & Refine Catalog
                </h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#E8F3EE] text-[#0F5132] text-xs font-bold rounded-full">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#666660] hover:text-[#0F5132] font-semibold"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Sort By */}
              <div className="space-y-2.5">
                <label className="font-bold text-[#111111] uppercase tracking-wider block text-[11px]">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'seo', label: 'Recommended' },
                    { val: 'price_asc', label: 'Price: Low-High' },
                    { val: 'price_desc', label: 'Price: High-Low' },
                    { val: 'newest', label: 'Newest' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => updateFilters({ sort: s.val })}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                        currentSort === s.val
                          ? 'border-[#0F5132] bg-[#E8F3EE] text-[#0F5132] font-bold'
                          : 'border-[#E4E4E0] bg-[#FAFAF8] text-[#111111]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-4 border-t border-[#E4E4E0]">
                <label className="font-bold text-[#111111] uppercase tracking-wider block text-[11px]">
                  Price Range ($)
                </label>
                {/* Price Presets */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Under $150', min: '0', max: '150' },
                    { label: '$150 – $300', min: '150', max: '300' },
                    { label: '$300 – $600', min: '300', max: '600' },
                    { label: '$600+', min: '600', max: '' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSetPricePreset(preset.min, preset.max)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        minPrice === preset.min && maxPrice === preset.max
                          ? 'bg-[#0F5132] text-white border-[#0F5132]'
                          : 'bg-[#FAFAF8] text-[#111111] border-[#E4E4E0]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Inputs */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    placeholder="Min $"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#0F5132]"
                  />
                  <span className="text-[#666660] font-bold">—</span>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#0F5132]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPrice()}
                    className="px-4 py-2 bg-[#111111] text-white rounded-xl font-bold shrink-0"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-4 border-t border-[#E4E4E0]">
                <label className="flex items-center justify-between cursor-pointer py-1 select-none">
                  <div>
                    <span className="font-bold text-xs text-[#111111] block">
                      In-Stock Items Only
                    </span>
                    <span className="text-[11px] text-[#666660]">
                      Hide sold-out or made-to-order products
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentInStock}
                    onChange={(e) =>
                      updateFilters({ inStock: e.target.checked ? 'true' : null })
                    }
                    className="w-5 h-5 rounded accent-[#0F5132] cursor-pointer"
                  />
                </label>
              </div>

              {/* Categories */}
              <div className="space-y-2.5 pt-4 border-t border-[#E4E4E0]">
                <label className="font-bold text-[#111111] uppercase tracking-wider block text-[11px]">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => updateFilters({ category: null })}
                    className={`p-2 rounded-lg text-left text-xs font-medium transition-colors ${
                      currentCategory === 'all'
                        ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                        : 'bg-[#FAFAF8] text-[#111111] hover:bg-[#F0F0EC]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFilters({ category: cat.slug })}
                      className={`p-2 rounded-lg text-left text-xs font-medium transition-colors truncate ${
                        currentCategory === cat.slug
                          ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                          : 'bg-[#FAFAF8] text-[#111111] hover:bg-[#F0F0EC]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands / Makers */}
              {tenants.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-[#E4E4E0]">
                  <label className="font-bold text-[#111111] uppercase tracking-wider block text-[11px]">
                    Brand / Maker
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => updateFilters({ tenant: null })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        !currentTenant
                          ? 'bg-[#0F5132] text-white'
                          : 'bg-[#FAFAF8] text-[#111111] border border-[#E4E4E0]'
                      }`}
                    >
                      All Brands
                    </button>
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateFilters({ tenant: t.slug })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          currentTenant === t.slug
                            ? 'bg-[#0F5132] text-white'
                            : 'bg-[#FAFAF8] text-[#111111] border border-[#E4E4E0]'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Action Bar */}
            <div className="p-4 border-t border-[#E4E4E0] bg-[#FAFAF8] flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 bg-white border border-[#E4E4E0] text-[#111111] font-bold text-xs rounded-xl hover:bg-[#F0F0EC] transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="flex-2 py-3 bg-[#0F5132] hover:bg-[#0A3622] text-white font-bold text-xs rounded-xl shadow-md transition-colors text-center"
              >
                Apply & View Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DESKTOP SIDEBAR FILTER PANEL (Visible on screens >= lg)                */}
      {/* ========================================================================= */}
      <div className="hidden lg:block w-full space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E0]">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#111111]">
            <SlidersHorizontal size={15} className="text-[#0F5132]" />
            <span>Refine Collection</span>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#666660] hover:text-[#0F5132] flex items-center gap-1 transition-colors font-semibold"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sort By Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
            Sort By
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="w-full text-xs font-semibold bg-[#FAFAF8] border border-[#E4E4E0] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
          >
            <option value="seo">Featured & Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Categories Tree */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
            Category
          </label>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => updateFilters({ category: null })}
              className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                currentCategory === 'all'
                  ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                  : 'text-[#111111]/80 hover:bg-[#F0F0EC]'
              }`}
            >
              <span>All Categories</span>
            </button>
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                      : 'text-[#111111]/80 hover:bg-[#F0F0EC]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {cat._count?.products !== undefined && (
                    <span className="text-[10px] text-[#666660] font-mono shrink-0">
                      {cat._count.products}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3 pt-4 border-t border-[#E4E4E0]">
          <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
            Price Range ($)
          </label>
          {/* Presets */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '< $150', min: '0', max: '150' },
              { label: '$150–$300', min: '150', max: '300' },
              { label: '$300–$600', min: '300', max: '600' },
              { label: '$600+', min: '600', max: '' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSetPricePreset(p.min, p.max)}
                className={`py-1 px-2 rounded-md border text-[11px] font-semibold text-center ${
                  minPrice === p.min && maxPrice === p.max
                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                    : 'bg-[#FAFAF8] text-[#111111] border-[#E4E4E0] hover:bg-[#F0F0EC]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleApplyPrice} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs bg-[#FAFAF8] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 text-[#111111] focus:outline-none focus:border-[#0F5132]"
              />
              <span className="text-xs text-[#666660]">—</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs bg-[#FAFAF8] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 text-[#111111] focus:outline-none focus:border-[#0F5132]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-[#111111] hover:bg-[#0F5132] text-white text-xs font-bold rounded-lg transition-colors"
            >
              Apply Filter
            </button>
          </form>
        </div>

        {/* In Stock Only Toggle */}
        <div className="pt-4 border-t border-[#E4E4E0]">
          <label className="flex items-center justify-between cursor-pointer select-none">
            <span className="text-xs font-semibold text-[#111111]">
              In stock items only
            </span>
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) =>
                updateFilters({ inStock: e.target.checked ? 'true' : null })
              }
              className="w-4 h-4 rounded-sm text-[#0F5132] focus:ring-[#0F5132] border-[#E4E4E0] accent-[#0F5132] cursor-pointer"
            />
          </label>
        </div>

        {/* Brand / Maker Filter */}
        {tenants.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-[#E4E4E0]">
            <label className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
              Maker / Brand
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateFilters({ tenant: null })}
                className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors ${
                  !currentTenant
                    ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                    : 'text-[#111111]/80 hover:bg-[#F0F0EC]'
                }`}
              >
                All Makers
              </button>
              {tenants.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateFilters({ tenant: t.slug })}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors truncate ${
                    currentTenant === t.slug
                      ? 'bg-[#E8F3EE] text-[#0F5132] font-bold'
                      : 'text-[#111111]/80 hover:bg-[#F0F0EC]'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
