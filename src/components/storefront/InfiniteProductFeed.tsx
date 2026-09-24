'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Loader2, Sparkles, Filter } from 'lucide-react';

interface InfiniteProductFeedProps {
  initialProducts: Product[];
  categories?: Category[];
}

export function InfiniteProductFeed({
  initialProducts,
  categories = [],
}: InfiniteProductFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(16);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter products by selected category
  const filteredProducts = initialProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category?.slug === selectedCategory || p.categoryId === selectedCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Instagram-style Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
            setIsLoadingMore(false);
          }, 350); // Natural smooth delay
        }
      },
      {
        rootMargin: '300px 0px', // Load 300px before reaching bottom
        threshold: 0.1,
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [hasMore, isLoadingMore, filteredProducts.length]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setVisibleCount(16); // Reset batch for newly selected category
  };

  const topCategoryPills = [
    { name: 'All 1:1 Master Pieces', slug: 'all' },
    { name: 'Handbags & Leather', slug: 'bags' },
    { name: 'Footwear & Shoes', slug: 'footwear' },
    { name: 'Swiss Timepieces', slug: 'watches' },
    { name: 'Coats & Outerwear', slug: 'coats' },
    { name: 'Designer Sunglasses', slug: 'sunglasses' },
    { name: 'Designer Belts', slug: 'belts' },
    { name: 'Hats & Caps', slug: 'hats' },
  ];

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        {topCategoryPills.map((pill) => {
          const isActive = selectedCategory === pill.slug;
          return (
            <button
              key={pill.slug}
              type="button"
              onClick={() => handleCategoryChange(pill.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F0F0EC] text-[#111111] border border-[#E4E4E0]'
              }`}
            >
              {pill.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayedProducts.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={idx < 8} // First 8 prioritize for LCP
          />
        ))}
      </div>

      {/* Sentinel & Instagram-Style Streaming Loader */}
      <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center min-h-[80px]">
        {hasMore && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#666660] bg-white border border-[#E4E4E0] px-4 py-2 rounded-full shadow-2xs">
            <Loader2 size={15} className="animate-spin text-[#0F5132]" />
            <span>Streaming luxury archive ({displayedProducts.length} of {filteredProducts.length})...</span>
          </div>
        )}

        {!hasMore && displayedProducts.length > 0 && (
          <div className="text-center py-4 border-t border-[#E4E4E0] w-full mt-4">
            <p className="text-xs text-[#666660] font-medium">
              ✨ You have reached the end of the curated highlight reel • Explore all 5,300+ items in{' '}
              <a href="/shop" className="text-[#0F5132] font-bold hover:underline">
                Full Collections
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InfiniteProductFeed;
