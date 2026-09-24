'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, TrendingUp, Loader2, Tag, Compass } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  image: string;
  categoryName: string;
  categorySlug: string;
}

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LUXURY_BRAND_SEARCHES = [
  'Rolex',
  'Louis Vuitton',
  'Chanel',
  'Gucci',
  'Burberry',
  'Prada',
  'Dior',
  'Hermès',
  'Bottega Veneta',
  'Moncler',
  'Canada Goose',
  'Audemars Piguet',
];

const FEATURED_DEPARTMENTS = [
  { name: 'Bags & Handbags', slug: 'bags', count: '1,450+' },
  { name: 'Footwear & Shoes', slug: 'footwear', count: '1,770+' },
  { name: 'Coats & Jackets', slug: 'coats', count: '370+' },
  { name: 'Timepieces / Watches', slug: 'watches', count: '110+' },
  { name: 'Designer Belts', slug: 'belts', count: '430+' },
  { name: 'Sunglasses', slug: 'sunglasses', count: '130+' },
  { name: 'Fine Jewelry', slug: 'jewelry', count: '50+' },
  { name: 'Hats & Caps', slug: 'hats', count: '250+' },
];

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSelectedIndex(-1);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFullSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        onClose();
        router.push(`/product/${results[selectedIndex].slug}`);
      } else {
        handleFullSearch(query);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Modal Container */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:pt-16">
        <div className="relative w-full max-w-2xl bg-[#FAFAF8] rounded-2xl shadow-2xl border border-[#E4E4E0] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E4E4E0] flex items-center gap-3 bg-white">
            <Search size={20} className="text-[#0F5132] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search 5,300+ luxury items, brands (e.g. Rolex, Chanel, Burberry, Sneakers)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-sm sm:text-base text-[#111111] bg-transparent focus:outline-none placeholder:text-[#999990] font-medium"
            />
            {isLoading && <Loader2 size={18} className="animate-spin text-[#0F5132] shrink-0" />}
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#666660] hover:text-[#111111] p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold text-[#666660] hover:text-[#111111] bg-[#F0F0EC] hover:bg-[#E4E4E0] rounded-lg transition-colors shrink-0"
            >
              Esc
            </button>
          </div>

          {/* Results / Suggestions Body */}
          <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Live Search Results */}
            {query.trim() && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#666660] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#0F5132]" />
                    Matching Products ({results.length})
                  </span>
                  {results.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleFullSearch(query)}
                      className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all matching items</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>

                {results.length === 0 && !isLoading ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-[#E4E4E0] space-y-2">
                    <p className="text-sm font-bold text-[#111111]">
                      No items found matching "{query}"
                    </p>
                    <p className="text-xs text-[#666660]">
                      Try searching for brand names like "Burberry", "Gucci", "Rolex", or categories like "Bags", "Footwear", "Coats".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((product, idx) => {
                      const isHighlighted = idx === selectedIndex;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className={`group flex items-center gap-3.5 p-3 rounded-xl border transition-all shadow-2xs ${
                            isHighlighted
                              ? 'bg-[#E8F3EE] border-[#0F5132] ring-1 ring-[#0F5132]'
                              : 'bg-white hover:bg-[#E8F3EE] border-[#E4E4E0] hover:border-[#0F5132]/40'
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-14 h-16 object-cover rounded-lg bg-[#F0F0EC] shrink-0 border border-[#E4E4E0]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] block">
                              {product.categoryName}
                            </span>
                            <h4 className="text-xs font-bold text-[#111111] group-hover:text-[#0F5132] truncate transition-colors">
                              {product.title}
                            </h4>
                            <span className="text-xs font-bold font-mono text-[#111111] mt-0.5 block">
                              {product.basePrice > 0 ? formatPrice(product.basePrice) : 'Inquire for Price'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Popular Brand Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                <TrendingUp size={14} className="text-[#0F5132]" />
                <span>Trending Designers & Brands</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LUXURY_BRAND_SEARCHES.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setQuery(brand);
                      handleFullSearch(brand);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-[#E8F3EE] hover:text-[#0F5132] hover:border-[#0F5132]/50 border border-[#E4E4E0] text-xs font-semibold text-[#111111] transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Tag size={11} className="text-[#0F5132]" />
                    <span>{brand}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Departments */}
            <div className="pt-4 border-t border-[#E4E4E0]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666660] mb-3">
                <Compass size={14} className="text-[#0F5132]" />
                <span>Explore Departments</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {FEATURED_DEPARTMENTS.map((dept) => (
                  <Link
                    key={dept.slug}
                    href={`/category/${dept.slug}`}
                    onClick={onClose}
                    className="p-3 bg-white rounded-xl border border-[#E4E4E0] hover:border-[#0F5132] hover:bg-[#F9FAF9] transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <span className="font-bold text-[#111111] group-hover:text-[#0F5132] transition-colors">
                      {dept.name}
                    </span>
                    <span className="text-[10px] text-[#666660] mt-1 font-medium">
                      {dept.count} items
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
