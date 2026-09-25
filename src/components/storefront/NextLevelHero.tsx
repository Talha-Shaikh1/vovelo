'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, Star, ShieldCheck, ChevronRight, Play, Pause } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { initiateInstagramOrder } from '@/lib/instagram-order';
import { Product } from '@/lib/types';
import { PriceDisplay } from './PriceDisplay';

interface NextLevelHeroProps {
  products: Product[];
}

const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'prod-bags-balenciaga-1',
    tag: 'Haute Leather Goods',
    headline: 'Artisanal Elegance.',
    subheadline: 'Designer Luxury Handbags.',
    description:
      'Masterfully constructed with structured silhouettes, secure signature hardware, and 7-day return guarantee.',
    image: '/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_',
    secondaryImage: '/api/drive-image/1BvunNwc-Ja1tuxisy7iDpmal2-qj4yHn',
    badge: '100% Full-Grain Quilted Leather',
    price: 0,
    comparePrice: 0,
    slug: 'balenciaga-bags-1-1',
    maker: 'Designer Handbag Collection',
    colorways: [
      { name: 'Noir Black', hex: '#111111' },
      { name: 'Classic Camel', hex: '#C19A6B' },
      { name: 'Burgundy Red', hex: '#58111A' },
    ],
  },
  {
    id: 'slide-2',
    productId: 'prod-watches-audemars-piguet-1',
    tag: 'Swiss Haute Horology',
    headline: 'Timeless Precision.',
    subheadline: 'Automatic Mechanical Chronometer.',
    description:
      'Engineered with scratch-proof sapphire crystal, water-resistant casing, and precision automatic movement.',
    image: '/api/drive-image/1m3mgDABbcqCMaH9wME7WyY5Fa2tYWcfy',
    secondaryImage: '/api/drive-image/1nE5K2Tl34VuTXZeJWc8tve3b9rBGm0FI',
    badge: 'Stainless Steel & Sapphire Glass',
    price: 0,
    comparePrice: 0,
    slug: 'audemars-piguet-watches-1-1',
    maker: 'Luxury Horology Collection',
    colorways: [
      { name: 'Polished Steel', hex: '#C0C0C0' },
      { name: 'Gold Tone', hex: '#D4AF37' },
      { name: 'Midnight Blue', hex: '#1B263B' },
    ],
  },
  {
    id: 'slide-3',
    productId: 'prod-hats-burberry-1',
    tag: 'Heritage Designer Collection',
    headline: 'Iconic Tartan.',
    subheadline: 'Pure Wool & Gabardine Twill.',
    description:
      'Structured designer headwear crafted from weather-resistant twill and wool felt with breathable interior lining.',
    image: '/api/drive-image/1OikG7T9QYHf_ORinbBwKcWqahB3hG6FU',
    secondaryImage: '/api/drive-image/1J_woCWz-l9Ue9O5NwVCzRz8FFIV8id5s',
    badge: 'Iconic Tartan & Wool Gabardine',
    price: 0,
    comparePrice: 0,
    slug: 'burberry-hats-1-1',
    maker: 'Burberry London',
    colorways: [
      { name: 'Vintage Camel', hex: '#C19A6B' },
      { name: 'Noir Black', hex: '#111111' },
    ],
  },
];

export function NextLevelHero({ products }: NextLevelHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  // Auto-advance hero slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleHeroOrderInstagram = async () => {
    const product = products.find((p) => p.slug === currentSlide.slug);
    const variant = product?.variants[0];

    await initiateInstagramOrder({
      productTitle: product?.title || currentSlide.headline + ' ' + currentSlide.subheadline,
      variantTitle: variant ? Object.values(variant.optionValues || {}).join(' / ') || 'Standard' : 'Standard',
      sku: variant?.sku,
      quantity: 1,
      productSlug: currentSlide.slug,
      instagramHandle: 'volvelo',
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <section className="relative bg-[#FAFAF8] overflow-hidden border-b border-[#E4E4E0]">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Tag */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F5132] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles size={13} className="text-emerald-300" />
                <span>{currentSlide.tag}</span>
              </span>
              <span className="text-xs text-[#666660] font-medium hidden sm:inline">
                Curated by {currentSlide.maker}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.05]">
                {currentSlide.headline} <br />
                <span className="text-[#0F5132] font-serif italic font-normal tracking-normal">
                  {currentSlide.subheadline}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#666660] max-w-lg leading-relaxed">
              {currentSlide.description}
            </p>

            {/* Colorways Preview */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                Available Shades:
              </span>
              <div className="flex items-center gap-2">
                {currentSlide.colorways.map((c) => (
                  <span
                    key={c.name}
                    className="w-5 h-5 rounded-full border border-black/20 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/product/${currentSlide.slug}`}
                className="px-7 py-4 bg-[#0F5132] hover:bg-[#0A3622] text-white font-bold text-sm rounded-xl flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop This Release • </span>
                <PriceDisplay amount={currentSlide.price} />
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={handleHeroOrderInstagram}
                className={`px-5 py-4 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  addedAnimation
                    ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white border-transparent'
                    : 'bg-white text-[#111111] border-[#E4E4E0] hover:bg-[#111111] hover:text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} className="text-white animate-in zoom-in-50" />
                    <span>Opening Instagram...</span>
                  </>
                ) : (
                  <>
                    <InstagramIcon size={16} className="text-pink-500" />
                    <span>Order on IG</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Trust Bar */}
            <div className="pt-6 border-t border-[#E4E4E0] flex flex-wrap items-center gap-6 text-xs text-[#666660]">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-500" />
                  ))}
                </div>
                <span className="font-semibold text-[#111111]">4.9/5.0</span>
                <span>(2,400+ reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#0F5132]" />
                <span>7-Day Return Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#F0F0EC] aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] shadow-2xl border border-[#E4E4E0] group">
              <img
                src={currentSlide.image}
                alt={currentSlide.headline}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4E4E0] text-xs font-bold text-[#111111] shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Floating Bottom Card Over Image */}
              <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#E4E4E0] shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-300">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] block">
                    Direct European Fulfillment
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#111111] truncate">
                    {currentSlide.headline} {currentSlide.subheadline}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PriceDisplay
                      amount={currentSlide.price}
                      className="text-sm font-extrabold font-mono text-[#111111]"
                    />
                    <PriceDisplay
                      amount={currentSlide.comparePrice}
                      className="text-xs text-[#999990] line-through font-mono"
                    />
                  </div>
                  <span className="text-[10px] font-bold bg-[#E8F3EE] text-[#0F5132] px-2 py-0.5 rounded">
                    In Stock • EU 24h Dispatch
                  </span>
                </div>

                <Link
                  href={`/product/${currentSlide.slug}`}
                  className="px-4 py-2.5 bg-[#111111] hover:bg-[#0F5132] text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Slide Switcher Tabs */}
        <div className="mt-12 pt-6 border-t border-[#E4E4E0] grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlideIndex === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setIsAutoPlaying(false);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all border flex items-center gap-3.5 ${
                  isActive
                    ? 'bg-white border-[#0F5132] shadow-md ring-1 ring-[#0F5132]'
                    : 'bg-[#F0F0EC]/60 hover:bg-white border-transparent text-[#666660]'
                }`}
              >
                {/* Mini Preview Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#E4E4E0] shrink-0 border border-[#E4E4E0]">
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-mono font-bold text-[#0F5132]">
                      0{idx + 1} /
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#666660]">
                      {slide.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] truncate">
                    {slide.headline}
                  </h4>
                  <p className="text-[10px] text-[#666660] truncate">
                    {slide.subheadline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
