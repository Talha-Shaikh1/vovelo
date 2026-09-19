import React from 'react';
import { ProductGridSkeleton } from '@/components/storefront/ProductSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Skeleton */}
      <div className="w-full h-[480px] bg-[#E4E4E0] rounded-3xl animate-pulse" />

      {/* Grid Skeleton */}
      <div className="space-y-6">
        <div className="h-6 w-48 bg-[#E4E4E0] rounded animate-pulse" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
