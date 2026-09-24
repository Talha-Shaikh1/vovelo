import React from 'react';
import { ProductGridSkeleton } from '@/components/storefront/ProductSkeleton';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111]">
      {/* Header Skeleton */}
      <div className="h-18 border-b border-[#E4E4E0] bg-[#FAFAF8]/95 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="w-36 h-8 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-28 h-8 bg-neutral-200 rounded-full" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Banner Skeleton */}
        <div className="mb-8 pb-6 border-b border-[#E4E4E0] space-y-2">
          <div className="h-8 w-64 bg-neutral-300 rounded-lg animate-pulse" />
          <div className="h-3.5 w-40 bg-neutral-200 rounded animate-pulse" />
        </div>

        {/* Layout Grid: Sidebar Skeleton + Product Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-6">
            <div className="h-5 w-24 bg-neutral-300 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-neutral-200 rounded" />
              <div className="h-8 w-full bg-neutral-100 rounded-lg" />
            </div>
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="h-3 w-20 bg-neutral-200 rounded" />
              <div className="space-y-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 w-full bg-neutral-100 rounded" />
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </main>
    </div>
  );
}
