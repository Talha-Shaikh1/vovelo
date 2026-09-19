'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
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

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    const targetUrl = pathname.includes('/category/') && updates.category && updates.category !== activeCategorySlug
      ? `/category/${updates.category}?${params.toString()}`
      : `${pathname}?${params.toString()}`;

    router.push(targetUrl, { scroll: false });
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0]">
        <div className="flex items-center gap-2 font-semibold text-sm text-[#111111]">
          <SlidersHorizontal size={16} className="text-[#0F5132]" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#666660] hover:text-[#0F5132] flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Section */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider block">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full text-xs bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#0F5132]"
        >
          <option value="seo">SEO & Popularity Rank</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>

      {/* Categories Tree */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateFilters({ category: null })}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-between ${
              currentCategory === 'all'
                ? 'bg-[#E8F3EE] text-[#0F5132] font-semibold'
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
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#E8F3EE] text-[#0F5132] font-semibold'
                    : 'text-[#111111]/80 hover:bg-[#F0F0EC]'
                }`}
              >
                <span>{cat.name}</span>
                {cat._count?.products !== undefined && (
                  <span className="text-[10px] text-[#666660]">
                    {cat._count.products}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider block">
          Price Range (€)
        </label>
        <form onSubmit={handleApplyPrice} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full text-xs bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
            <span className="text-xs text-[#666660]">—</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full text-xs bg-[#F0F0EC] border border-[#E4E4E0] rounded-lg px-2.5 py-1.5 text-[#111111] focus:outline-none focus:border-[#0F5132]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-[#111111] hover:bg-[#0F5132] text-white text-xs font-medium rounded-lg transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-2 border-t border-[#E4E4E0]">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) =>
              updateFilters({ inStock: e.target.checked ? 'true' : null })
            }
            className="w-4 h-4 rounded-sm text-[#0F5132] focus:ring-[#0F5132] border-[#E4E4E0] accent-[#0F5132]"
          />
          <span className="text-xs font-medium text-[#111111]">
            In stock items only
          </span>
        </label>
      </div>

      {/* Brand / Maker Filter */}
      {tenants.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#E4E4E0]">
          <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider block">
            Maker / Brand
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => updateFilters({ tenant: null })}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${
                !currentTenant
                  ? 'bg-[#E8F3EE] text-[#0F5132] font-semibold'
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
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${
                  currentTenant === t.slug
                    ? 'bg-[#E8F3EE] text-[#0F5132] font-semibold'
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
  );
}
