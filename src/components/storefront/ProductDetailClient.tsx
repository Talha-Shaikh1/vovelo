'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductVariant, SiteSettings } from '@/lib/types';
import { ImageGallery } from './ImageGallery';
import { VariantSelector } from './VariantSelector';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { PriceDisplay } from './PriceDisplay';
import { ProductReviews } from './ProductReviews';
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Leaf,
  Sparkles,
  Flame,
  Heart,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  settings?: SiteSettings;
}

export function ProductDetailClient({ product, settings }: ProductDetailClientProps) {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant');

  // Find initial variant from URL param or default to first
  const initialVariant =
    (variantParam && product.variants.find((v) => v.sku === variantParam)) ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  useEffect(() => {
    if (variantParam) {
      const match = product.variants.find((v) => v.sku === variantParam);
      if (match) setSelectedVariant(match);
    }
  }, [variantParam, product.variants]);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      tenantId: product.tenantId,
      title: product.title,
      variantTitle:
        Object.entries(selectedVariant.optionValues || {})
          .map(([_, val]) => val)
          .join(' / ') || 'Standard',
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      image: selectedVariant.image || product.images[0]?.url,
      selectedOptions: (selectedVariant.optionValues as Record<string, string>) || {},
      maxStock: selectedVariant.stock,
      quantity,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const discountPercent =
    selectedVariant.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : null;

  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 5;
  const isOutOfStock = selectedVariant.stock === 0;

  // Dynamic Badges with Merchant Product-Level Overrides
  const shippingTitle = settings?.shippingBadgeTitle || 'EU Shipping';
  const shippingSubtitle =
    product.shippingTimeOverride || settings?.shippingBadgeSubtitle || '2-4 Days';
  const returnsTitle = settings?.returnsBadgeTitle || '7 Days';
  const returnsSubtitle =
    product.returnsPolicyOverride || settings?.returnsBadgeSubtitle || 'Free Returns';
  const guaranteeTitle = settings?.guaranteeBadgeTitle || 'Guaranteed';
  const guaranteeSubtitle = settings?.guaranteeBadgeSubtitle || 'Verified Maker';

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Multi-Image Gallery */}
        <div className="lg:col-span-7 sticky top-24">
          <ImageGallery
            images={product.images}
            activeVariantImage={selectedVariant.image}
            productTitle={product.title}
          />
        </div>

        {/* Right Column: Details & Variant Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Tenant / Maker info & Custom Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {product.tenant && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full">
                  Crafted by {product.tenant.name}
                </span>
              )}
              {product.materialTag && (
                <span className="text-xs font-semibold text-[#111111] bg-[#F0F0EC] px-2.5 py-0.5 rounded-full border border-[#E4E4E0] flex items-center gap-1">
                  <Leaf size={12} className="text-[#0F5132]" />
                  <span>{product.materialTag}</span>
                </span>
              )}
              {product.customBadge && (
                <span className="text-xs font-bold text-white bg-[#111111] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>{product.customBadge}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              {product.title}
            </h1>

            {/* Pricing Row */}
            <div className="flex items-center gap-3 mt-3">
              <PriceDisplay
                amount={selectedVariant.price}
                className="text-2xl font-extrabold text-[#111111]"
              />
              {selectedVariant.compareAtPrice &&
                selectedVariant.compareAtPrice > selectedVariant.price && (
                  <PriceDisplay
                    amount={selectedVariant.compareAtPrice}
                    className="text-base text-[#999990] line-through font-medium"
                  />
                )}
              {discountPercent && (
                <span className="bg-[#111111] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Stock Urgency Indicator */}
            {isLowStock && (
              <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <Flame size={14} className="text-amber-600 animate-pulse" />
                <span>
                  High Demand: Only <strong>{selectedVariant.stock} pieces</strong> left in stock.
                </span>
              </div>
            )}
            {isOutOfStock && (
              <div className="mt-3 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                Selected variant is currently out of stock. Please choose another combination.
              </div>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#666660] leading-relaxed border-t border-[#E4E4E0] pt-4">
            {product.description}
          </p>

          {/* Variant Matrix Selector */}
          <div className="border-t border-[#E4E4E0] pt-6">
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>

          {/* Quantity & Add to Bag */}
          <div className="pt-4 border-t border-[#E4E4E0] space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-[#E4E4E0] rounded-xl bg-white px-3 py-2.5 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#666660] hover:text-[#111111] px-1.5 font-bold"
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                  }
                  className="text-[#666660] hover:text-[#111111] px-1.5 font-bold"
                  disabled={quantity >= selectedVariant.stock || isOutOfStock}
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isOutOfStock
                    ? 'bg-[#E4E4E0] text-[#999990] cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-[#0F5132] text-white'
                    : 'bg-[#0F5132] hover:bg-[#0A3622] text-white hover:shadow-lg'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} className="text-white animate-in zoom-in-50" />
                    <span>Added to Bag!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>
                      Add to Bag • <PriceDisplay amount={selectedVariant.price * quantity} />
                    </span>
                  </>
                )}
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-center shrink-0 shadow-2xs ${
                  isInWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                    : 'border-[#E4E4E0] bg-white text-[#666660] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart
                  size={19}
                  className={`transition-transform duration-200 ${
                    isInWishlist ? 'fill-rose-500 scale-110 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dynamic Store & Merchant Value Prop Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E4E4E0] text-center">
            <div className="p-3 bg-[#F0F0EC] rounded-xl">
              <Truck size={16} className="mx-auto text-[#0F5132] mb-1" />
              <span className="text-[11px] font-semibold text-[#111111] block">{shippingTitle}</span>
              <span className="text-[10px] text-[#666660]">{shippingSubtitle}</span>
            </div>
            <div className="p-3 bg-[#F0F0EC] rounded-xl">
              <RefreshCw size={16} className="mx-auto text-[#0F5132] mb-1" />
              <span className="text-[11px] font-semibold text-[#111111] block">{returnsTitle}</span>
              <span className="text-[10px] text-[#666660]">{returnsSubtitle}</span>
            </div>
            <div className="p-3 bg-[#F0F0EC] rounded-xl">
              <ShieldCheck size={16} className="mx-auto text-[#0F5132] mb-1" />
              <span className="text-[11px] font-semibold text-[#111111] block">{guaranteeTitle}</span>
              <span className="text-[10px] text-[#666660]">{guaranteeSubtitle}</span>
            </div>
          </div>

          {/* Product Details Accordions */}
          <div className="space-y-3 pt-4 border-t border-[#E4E4E0]">
            {/* Materials & Quality Accordion */}
            <div className="border border-[#E4E4E0] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'materials' ? null : 'materials')
                }
                className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-[#111111]"
              >
                <span>Master Craft Quality & Specifications</span>
                {openAccordion === 'materials' ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {openAccordion === 'materials' && (
                <div className="p-4 pt-0 text-xs text-[#666660] leading-relaxed border-t border-[#F0F0EC] space-y-2">
                  <p>
                    Crafted with 1:1 precision using premium imported materials, weighted brass/steel hardware, and reinforced structural stitching. Complete branded packaging and protective dustbag included.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Exact dimensions, logos, date codes, and weight matching original specifications</li>
                    <li>Full boutique presentation: gift box, dustbag, and care documentation</li>
                    <li>Inspected and authenticated prior to express dispatch</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping & 7-Day Guarantee Accordion */}
            <div className="border border-[#E4E4E0] rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')
                }
                className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-[#111111]"
              >
                <span>Express Delivery & 7-Day Return Guarantee</span>
                {openAccordion === 'shipping' ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {openAccordion === 'shipping' && (
                <div className="p-4 pt-0 text-xs text-[#666660] leading-relaxed border-t border-[#F0F0EC] space-y-2">
                  <p>
                    Dispatched in discreet, double-boxed protective shipping with real-time tracking. Enjoy a risk-free 7-day inspection period upon receipt.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Dispatched within 24–48 hours direct from warehouse</li>
                    <li>100% money-back or replacement guarantee within 7 days</li>
                    <li>Discreet packaging with secure tracking updates</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & UGC Section */}
      <ProductReviews
        productId={product.id}
        productTitle={product.title}
      />
    </div>
  );
}

