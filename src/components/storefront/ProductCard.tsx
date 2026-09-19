'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Check, Flame, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { PriceDisplay } from './PriceDisplay';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const defaultImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const hoverImage = product.images?.[1]?.url || defaultImage;

  // Selected default variant
  const defaultVariant = product.variants?.[0];
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? Math.round(
          ((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100
        )
      : null;

  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 10;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock === 0;

  // Extract unique colors for swatch preview
  const colorOptions = Array.from(
    new Set(
      product.variants
        ?.map((v) => (v.optionValues as Record<string, string>)?.Color)
        .filter(Boolean)
    )
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      tenantId: product.tenantId,
      title: product.title,
      variantTitle:
        Object.entries(defaultVariant.optionValues || {})
          .map(([_, val]) => val)
          .join(' / ') || 'Standard',
      sku: defaultVariant.sku,
      price: defaultVariant.price,
      image: defaultVariant.image || defaultImage,
      selectedOptions: (defaultVariant.optionValues as Record<string, string>) || {},
      maxStock: defaultVariant.stock,
      quantity: 1,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent rounded-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/5] bg-[#F0F0EC] rounded-xl overflow-hidden mb-3.5 border border-[#E4E4E0]/60">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && hoverImage ? hoverImage : defaultImage}
            alt={product.images?.[0]?.altText || product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-[#0F5132] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              <Sparkles size={10} />
              <span>Featured</span>
            </span>
          )}
          {discountPercent && (
            <span className="inline-flex items-center bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              -{discountPercent}%
            </span>
          )}
          {isLowStock && (
            <span className="inline-flex items-center gap-1 bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              <Flame size={10} />
              <span>Only {totalStock} Left</span>
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isInWishlist
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/80 text-[#666660] hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={16}
            className={`transition-transform duration-200 ${
              isInWishlist ? 'fill-rose-500 scale-110 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick Add Floating Button on Hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                addedAnimation
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-white/95 text-[#111111] hover:bg-[#0F5132] hover:text-white backdrop-blur-xs'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={14} className="text-white" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        {/* Tenant / Maker Name */}
        {product.tenant && (
          <span className="text-[11px] font-medium text-[#666660] uppercase tracking-wider mb-0.5">
            {product.tenant.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-semibold text-[#111111] hover:text-[#0F5132] line-clamp-1 transition-colors"
        >
          {product.title}
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1">
          <PriceDisplay amount={product.basePrice} className="text-sm font-bold text-[#111111]" />
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <PriceDisplay
              amount={product.compareAtPrice}
              className="text-xs text-[#999990] line-through"
            />
          )}
        </div>

        {/* Available Color Swatches Preview */}
        {colorOptions.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-[11px] text-[#666660]">
              {colorOptions.length} {colorOptions.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

