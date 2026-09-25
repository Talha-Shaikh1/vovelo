'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { InstagramIcon } from './InstagramIcon';
import { initiateInstagramOrder } from '@/lib/instagram-order';
import { PriceDisplay } from './PriceDisplay';

interface EmbeddedProductCardProps {
  product: Product;
}

export function EmbeddedProductCard({ product }: EmbeddedProductCardProps) {
  const defaultVariant = product.variants?.[0];
  const image =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

  const handleOrderInstagram = async () => {
    if (!defaultVariant) return;
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
  };

  return (
    <div className="my-8 p-4 bg-[#F0F0EC] rounded-2xl border border-[#E4E4E0] flex flex-col sm:flex-row items-center gap-5 not-prose">
      <img
        src={image}
        alt={product.title}
        className="w-full sm:w-32 h-32 object-cover object-center rounded-xl bg-white shrink-0"
      />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-[#0F5132] uppercase tracking-wider bg-[#E8F3EE] px-2 py-0.5 rounded-sm inline-block mb-1">
          Featured in Article
        </span>
        <h4 className="text-base font-bold text-[#111111] line-clamp-1">
          {product.title}
        </h4>
        <p className="text-xs text-[#666660] line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <PriceDisplay amount={product.basePrice} className="text-sm font-bold text-[#111111]" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOrderInstagram}
              className="px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <InstagramIcon size={13} className="text-pink-400" />
              <span>Order on IG</span>
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="px-3 py-1.5 bg-white hover:bg-black hover:text-white text-[#111111] text-xs font-medium rounded-lg border border-[#E4E4E0] flex items-center gap-1 transition-colors"
            >
              <span>Details</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
