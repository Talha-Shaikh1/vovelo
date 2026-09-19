import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-[#E4E4E0]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>Curated For You</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#111111]">
            You May Also Like
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
