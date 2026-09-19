import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-transparent rounded-xl animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/5] bg-[#E4E4E0] rounded-xl mb-3.5" />

      {/* Brand Tag Skeleton */}
      <div className="h-3 w-20 bg-[#E4E4E0] rounded mb-1.5" />

      {/* Title Skeleton */}
      <div className="h-4 w-3/4 bg-[#E4E4E0] rounded mb-2" />

      {/* Price Skeleton */}
      <div className="h-4 w-16 bg-[#E4E4E0] rounded" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;
