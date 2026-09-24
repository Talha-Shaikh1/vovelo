import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="group relative flex flex-col bg-transparent rounded-xl transition-all">
      {/* Product Image Skeleton with Shimmer & Floating Badges */}
      <div className="relative w-full aspect-[4/5] bg-neutral-200/70 rounded-xl overflow-hidden mb-3.5 border border-neutral-200/80">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        {/* Top-Left Badge Skeleton */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <div className="w-16 h-4 bg-neutral-300/80 rounded-md" />
        </div>

        {/* Top-Right Heart Skeleton */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/80 rounded-full shadow-xs" />
      </div>

      {/* Product Information Skeleton */}
      <div className="flex flex-col flex-1 space-y-1.5 px-0.5">
        {/* Brand / Maker Tag */}
        <div className="h-2.5 w-24 bg-neutral-300/70 rounded-sm" />

        {/* Title Lines */}
        <div className="h-3.5 w-11/12 bg-neutral-300/90 rounded" />
        <div className="h-3 w-2/3 bg-neutral-300/60 rounded" />

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 w-16 bg-neutral-300/90 rounded" />
          <div className="h-3 w-12 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;
