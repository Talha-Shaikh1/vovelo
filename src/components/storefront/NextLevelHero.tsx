'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag, Check, Star, ShieldCheck, ChevronRight, Play, Pause } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Product } from '@/lib/types';
import { PriceDisplay } from './PriceDisplay';

interface NextLevelHeroProps {
  products: Product[];
}

const HERO_SLIDES = [
  {
    id: 'slide-1',
    productId: 'prod-merino-runner',
    tag: 'Signature Footwear',
    headline: 'Barefoot Comfort.',
    subheadline: 'Engineered for 20,000+ City Steps.',
    description:
      'Crafted from temperature-regulating superfine ZQ merino wool and sugarcane SweetFoam® outsoles. Machine washable, remarkably light, and odor-resistant.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    badge: '100% Superfine Merino Wool',
    price: 110,
    comparePrice: 135,
    slug: 'merino-wool-all-day-runner',
    maker: 'Nordic Atelier (Denmark)',
    colorways: [
      { name: 'Emerald Forest', hex: '#0F5132' },
      { name: 'Charcoal Grey', hex: '#4A4A45' },
      { name: 'Off-White Oatmeal', hex: '#EAE6DF' },
    ],
  },
  {
    id: 'slide-2',
    productId: 'prod-commuter-backpack',
    tag: 'Technical Everyday Carry',
    headline: 'Defy European Rains.',
    subheadline: 'Recycled 900D Ballistic Roll-Top.',
    description:
      'Engineered from 100% recycled waterproof nylon. Features magnetic quick-access 16" laptop protection, ergonomic airflow back panel, and expandable 22L volume.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    badge: 'Waterproof Recycled Nylon',
    price: 89,
    comparePrice: 115,
    slug: 'waterproof-roll-top-commuter-22l',
    maker: 'Aura Studio (Germany)',
    colorways: [
      { name: 'Olive Emerald', hex: '#2A4736' },
      { name: 'Stealth Black', hex: '#1C1C1C' },
    ],
  },
  {
    id: 'slide-3',
    productId: 'prod-heavyweight-tee',
    tag: 'Conscious Apparel',
    headline: 'Structured Drape.',
    subheadline: '240 GSM Combed Organic Cotton.',
    description:
      'Substantial, heavyweight weave that holds its boxy collar and drape wash after wash. Ring-spun combed cotton crafted with zero toxic chemicals.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    badge: 'GOTS Certified Organic 240 GSM',
    price: 38,
    comparePrice: 48,
    slug: 'heavyweight-organic-boxy-tee-240-gsm',
    maker: 'Nordic Atelier (Denmark)',
    colorways: [
      { name: 'Off-White Chalk', hex: '#F0EFEA' },
      { name: 'Forest Pine', hex: '#1D3B2C' },
    ],
  },
];

export function NextLevelHero({ products }: NextLevelHeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  // Auto-advance hero slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleHeroQuickAdd = () => {
    const product = products.find((p) => p.slug === currentSlide.slug);
    const variant = product?.variants[0];

    if (product && variant) {
      addItem({
        productId: product.id,
        variantId: variant.id,
        tenantId: product.tenantId,
        title: product.title,
        variantTitle: 'Standard',
        sku: variant.sku,
        price: variant.price,
        image: currentSlide.image,
        selectedOptions: (variant.optionValues as Record<string, string>) || {},
        maxStock: variant.stock,
        quantity: 1,
      });

      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1800);
    }
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
                onClick={handleHeroQuickAdd}
                className={`px-5 py-4 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  addedAnimation
                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                    : 'bg-white text-[#111111] border-[#E4E4E0] hover:bg-[#F0F0EC]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} className="text-white animate-in zoom-in-50" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} className="text-[#0F5132]" />
                    <span>Instant Bag Add</span>
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
                <span>30-Day Wear & Wash Trial</span>
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
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isActive
                    ? 'bg-white border-[#0F5132] shadow-md ring-1 ring-[#0F5132]'
                    : 'bg-[#F0F0EC]/60 hover:bg-white border-transparent text-[#666660]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-[#0F5132]">
                    0{idx + 1} /
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666660]">
                    {slide.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#111111] line-clamp-1">
                  {slide.headline}
                </h4>
                <p className="text-[11px] text-[#666660] mt-0.5 line-clamp-1">
                  {slide.subheadline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
