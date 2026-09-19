import React from 'react';
import { ProductGridSkeleton } from '@/components/storefront/ProductSkeleton';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="h-8 w-64 bg-[#E4E4E0] rounded animate-pulse" />
      <div className="h-4 w-96 bg-[#E4E4E0] rounded animate-pulse" />
      <div className="pt-6">
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
