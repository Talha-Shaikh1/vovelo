'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Check, Flame, Heart } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { initiateInstagramOrder } from '@/lib/instagram-order';
import { Product } from '@/lib/types';
import { useWishlistStore } from '@/lib/wishlist-store';
import { PriceDisplay } from './PriceDisplay';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  // IntersectionObserver for viewport-based lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Pre-load 200px before scrolling into view
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const defaultImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const hoverImage = product.images?.[1]?.url || defaultImage;

  const defaultVariant = product.variants?.[0];
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? Math.round(
          ((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100
        )
      : null;

  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 25;
  const isLowStock = totalStock > 0 && totalStock <= 3;
  const isOutOfStock = totalStock === 0;

  const handleQuickInstagramOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || isOutOfStock) return;

    const variantTitle =
      Object.entries(defaultVariant.optionValues || {})
        .map(([_, val]) => val)
        .join(' / ') || 'Standard';

    await initiateInstagramOrder({
      productTitle: product.title,
      variantTitle,
      sku: defaultVariant.sku,
      quantity: 1,
      productSlug: product.slug,
      instagramHandle: 'vovelo',
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col bg-transparent rounded-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/5] bg-[#F0F0EC] rounded-xl overflow-hidden mb-3.5 border border-[#E4E4E0]/60">
        {/* Shimmer skeleton placeholder while image is loading or before entering viewport */}
        {(!isInView || !imageLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0F0EC] via-[#E4E4E0] to-[#F0F0EC] animate-pulse" />
        )}

        {isInView && (
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={isHovered && hoverImage ? hoverImage : defaultImage}
              alt={product.images?.[0]?.altText || product.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={priority ? 'eager' : 'lazy'}
            />
          </Link>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-[#0F5132] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              <Sparkles size={10} />
              <span>1:1 Master</span>
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
              onClick={handleQuickInstagramOrder}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                addedAnimation
                  ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white'
                  : 'bg-white/95 text-[#111111] hover:bg-[#111111] hover:text-white backdrop-blur-xs'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={14} className="text-white" />
                  <span>Opening Instagram...</span>
                </>
              ) : (
                <>
                  <InstagramIcon size={14} className="text-pink-500 group-hover:text-pink-400" />
                  <span>Order on IG</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        {/* Brand / Designer House */}
        {product.tenant && (
          <span className="text-[11px] font-bold text-[#666660] uppercase tracking-wider mb-0.5">
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
      </div>
    </div>
  );
}
