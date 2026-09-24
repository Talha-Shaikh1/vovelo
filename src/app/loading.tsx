import React from 'react';
import { ProductGridSkeleton } from '@/components/storefront/ProductSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111]">
      {/* Header Placeholder */}
      <div className="h-18 border-b border-[#E4E4E0] bg-[#FAFAF8]/95 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="w-36 h-8 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="hidden md:flex items-center gap-6">
          <div className="w-20 h-4 bg-neutral-200 rounded" />
          <div className="w-20 h-4 bg-neutral-200 rounded" />
          <div className="w-20 h-4 bg-neutral-200 rounded" />
          <div className="w-20 h-4 bg-neutral-200 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-8 bg-neutral-200 rounded-full" />
          <div className="w-8 h-8 bg-neutral-200 rounded-full" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Luxury Hero Showcase Skeleton */}
        <div className="bg-[#F0F0EC]/80 border border-[#E4E4E0] rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="lg:col-span-6 space-y-5">
            <div className="w-28 h-6 bg-neutral-300 rounded-full" />
            <div className="h-12 w-4/5 bg-neutral-300 rounded-xl" />
            <div className="h-8 w-3/5 bg-neutral-300/70 rounded-lg" />
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
            <div className="flex items-center gap-4 pt-2">
              <div className="w-36 h-12 bg-neutral-300 rounded-xl" />
              <div className="w-32 h-12 bg-neutral-200 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/5] sm:aspect-square bg-neutral-300/80 rounded-2xl" />
          </div>
        </div>

        {/* Category Carousel Pills Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-neutral-300 rounded-md" />
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-32 h-10 bg-neutral-200 rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Featured Products Grid Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-64 bg-neutral-300 rounded-lg" />
            <div className="h-4 w-24 bg-neutral-200 rounded" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </main>
    </div>
  );
}
