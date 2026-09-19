'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { PriceDisplay } from '@/components/storefront/PriceDisplay';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const [movedId, setMovedId] = React.useState<string | null>(null);

  const handleMoveToCart = (item: WishlistItem) => {
    addItem({
      productId: item.id,
      variantId: `${item.id}-default`,
      tenantId: 'platform',
      title: item.name,
      variantTitle: 'Standard',
      sku: `VOL-${item.slug.toUpperCase().slice(0, 4)}`,
      price: item.price,
      image: item.image,
      selectedOptions: {},
      maxStock: 25,
      quantity: 1,
    });

    setMovedId(item.id);
    setTimeout(() => {
      setMovedId(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#E4E4E0] gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
                <Heart size={13} className="fill-rose-500 text-rose-500" />
                <span>Personal Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                My Saved Wishlist
              </h1>
              <p className="text-sm text-[#666660] mt-1">
                {items.length === 0
                  ? 'Your curated wishlist is currently empty.'
                  : `${items.length} European artisan ${items.length === 1 ? 'piece' : 'pieces'} saved for later.`}
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-[#666660] hover:text-rose-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Trash2 size={14} />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-xs">
                <Heart size={28} />
              </div>
              <h2 className="text-xl font-bold text-[#111111]">No saved items yet</h2>
              <p className="text-sm text-[#666660] mt-2 mb-8 leading-relaxed">
                Explore our curated European ateliers and click the heart icon on any piece to save it here for later.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0F5132] hover:bg-[#0A3622] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Explore Essentials</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-[#E4E4E0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-[#F0F0EC] overflow-hidden">
                    <Link href={`/product/${item.slug}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-[#666660] hover:text-rose-600 rounded-full backdrop-blur-md transition-colors shadow-xs"
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {item.brand && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#666660]">
                          {item.brand}
                        </span>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-sm font-bold text-[#111111] hover:text-[#0F5132] transition-colors mt-0.5 line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-2">
                        <PriceDisplay amount={item.price} className="text-sm font-extrabold text-[#111111]" />
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <PriceDisplay
                            amount={item.compareAtPrice}
                            className="text-xs text-[#999990] line-through"
                          />
                        )}
                      </div>
                    </div>

                    {/* Move to Bag Action */}
                    <div className="pt-4 mt-4 border-t border-[#F0F0EC]">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(item)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                          movedId === item.id
                            ? 'bg-[#0F5132] text-white'
                            : 'bg-[#111111] hover:bg-[#0F5132] text-white'
                        }`}
                      >
                        {movedId === item.id ? (
                          <>
                            <Check size={14} />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Move to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
