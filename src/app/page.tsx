import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { NextLevelHero } from '@/components/storefront/NextLevelHero';
import { InfiniteProductFeed } from '@/components/storefront/InfiniteProductFeed';
import { getProducts, getCategories, getSiteSettings, getAllTenants, getCuratedFeaturedProducts } from '@/lib/data-service';
import { getBaseUrl } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Star,
  ChevronRight,
  Store,
  Tag,
  PackageCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vovelo — Haute Couture Luxury Archive, Handbags, Watches & Designer Goods',
  description:
    'Discover curated 1:1 master quality designer handbags, Swiss automatic timepieces, handcrafted leather footwear, and luxury accessories. 7-day inspection guarantee and express direct delivery.',
  keywords: [
    '1:1 master quality luxury goods',
    'designer handbags archive',
    'swiss automatic watches',
    'luxury leather sneakers boots',
    'designer sunglasses polarized',
    'italian leather belts wallets',
    'designer outerwear coats',
    'vovelo luxury archive',
    'express worldwide shipping 7-day returns',
  ],
  alternates: {
    canonical: 'https://vovelo.vercel.app',
  },
  openGraph: {
    title: 'Vovelo — Haute Couture Luxury Archive & Designer Collections',
    description:
      'Curated master quality designer goods, Swiss automatic timepieces, leather footwear & accessories with 7-day returns.',
    url: 'https://vovelo.vercel.app',
    siteName: 'Vovelo',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Vovelo — Haute Couture Luxury Archive & Designer Collections',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vovelo — Haute Couture Luxury Archive & Designer Collections',
    description: 'Curated 1:1 master quality designer goods with express worldwide delivery.',
    images: ['/twitter-image'],
  },
};

export default async function HomePage() {
  const [settings, categories, bestsellers, allProducts, allTenants] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getCuratedFeaturedProducts(64),
      getProducts({ limit: 20 }),
      getAllTenants(),
    ]);

  const activeTenants = allTenants.filter((t) => t.status === 'ACTIVE');
  const baseUrl = getBaseUrl();

  // Comprehensive JSON-LD Structured Data for Technical SEO, Semantic Search & AEO (Perplexity, ChatGPT, Gemini, Google AI)
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vovelo',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Haute couture luxury archive offering curated 1:1 master quality designer handbags, automatic chronographs, leather footwear, and accessories with express delivery and 7-day returns.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contactPhone || '+49 30 555 3829',
      contactType: 'customer concierge',
      email: settings.contactEmail || 'concierge@vovelo.com',
      availableLanguage: ['English', 'German', 'French', 'Italian', 'Spanish'],
    },
    sameAs: [
      'https://instagram.com/vovelo',
      'https://twitter.com/vovelo',
    ],
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vovelo',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What quality grade are the products on Vovelo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every item on Vovelo is 1:1 Master Quality, crafted with exact imported genuine leather, weighted metal hardware, automatic watch movements, and precise structural stitching matching original luxury specifications.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does my order include branded packaging and dustbag?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All handbags, footwear, watches, and accessories arrive complete with signature branded gift box, protective dustbag, and documentation.',
        },
      },
      {
        '@type': 'Question',
        name: 'How fast is express delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Orders are dispatched within 24-48 hours direct from our fulfillment warehouse. Standard transit time is 2–4 business days with real-time tracking.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the 7-day inspection and return policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide a 100% risk-free 7-day inspection guarantee. If your order does not meet your expectations or sizing needs, returns and exchanges are honored within 7 days.',
        },
      },
    ],
  };

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bestselling Luxury Essentials',
    itemListElement: bestsellers.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${baseUrl}/product/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      {/* Technical SEO & AEO Structured Data Script Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />

      <Header announcement={settings.announcementText} categories={categories} />

      <main className="flex-1">
        {/* 1. Next-Level Interactive Hero Showcase */}
        <NextLevelHero products={allProducts} />

        {/* 2. Shop by Luxury Department */}
        <section
          aria-label="Luxury Departments"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                Shop by Luxury Department
              </h2>
              <p className="text-xs sm:text-sm text-[#666660] mt-1">
                Curated 1:1 master quality collections across bags, footwear, timepieces, and outerwear.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
            >
              <span>Explore full catalog (5,300+ items)</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F0F0EC] border border-[#E4E4E0] flex flex-col justify-end p-5 transition-all hover:-translate-y-1 hover:shadow-md duration-300"
              >
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="font-bold text-base md:text-lg">{cat.name}</h3>
                  <p className="text-[11px] text-gray-200 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Infinite Stream Luxury Archive Feed */}
        <section
          aria-label="Bestselling Products"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] uppercase tracking-wider mb-1">
                <Star size={14} className="fill-[#0F5132]" />
                <span>Curated Luxury Feed</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111]">
                1:1 Master Quality Archive
              </h2>
              <p className="text-xs sm:text-sm text-[#666660] mt-1 max-w-lg">
                Discover 60+ hand-selected pieces across handbags, chronographs, footwear, and apparel with smooth progressive stream.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all 5,300+ items</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <InfiniteProductFeed
            initialProducts={bestsellers}
            categories={categories}
          />
        </section>

        {/* 4. Brand Philosophy & Master Craft Pillars */}
        <section
          aria-label="Quality Standards"
          className="bg-[#111111] text-[#FAFAF8] py-16 md:py-20 my-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Uncompromising Standards
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  1:1 Master Quality. <br />
                  <span className="text-emerald-400">Exact Weight & Detailing.</span>
                </h2>
                <p className="text-sm text-[#999990] leading-relaxed">
                  We specialize in premium mirror-grade luxury goods. Every handbag, chronograph, and pair of shoes is produced using genuine imported leather, durable heavy hardware, and precise logo engravings.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="px-6 py-3 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Explore All Collections
                  </Link>
                </div>
              </div>

              {/* 4 Value Props Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">1:1 Precision Craft</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Accurate dimensions, date stamps, logo engravings, and weighted hardware.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <PackageCheck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Complete Packaging</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Full presentation including branded dustbag, gift box, and authenticity cards.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <RotateCcw size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">7-Day Inspection</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    7 days to inspect your item with a hassle-free money-back guarantee.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Discreet Express Delivery</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Direct warehouse dispatch with discreet packaging and live tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Designers & Brands */}
        {activeTenants.length > 0 && (
          <section
            aria-label="Featured Brands"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] uppercase tracking-wider mb-1">
                  <Tag size={14} />
                  <span>Featured Designer Houses</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111]">
                  Explore by Designer
                </h2>
                <p className="text-xs sm:text-sm text-[#666660] mt-1 max-w-xl">
                  Browse iconic collections from prestigious luxury fashion houses.
                </p>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View all brands →</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {activeTenants.slice(0, 12).map((tenant) => (
                <Link
                  key={tenant.id}
                  href={`/shop?tenant=${tenant.slug}`}
                  className="bg-white rounded-2xl border border-[#E4E4E0] p-4 text-center hover:border-[#0F5132] hover:bg-[#F9FAF9] transition-all group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm mx-auto mb-2 shadow-xs group-hover:scale-105 transition-transform">
                    {tenant.name.slice(0, 1)}
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] group-hover:text-[#0F5132] transition-colors truncate">
                    {tenant.name}
                  </h4>
                  <span className="text-[10px] text-[#666660] block mt-0.5">
                    1:1 Master Archive
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 6. Customer Testimonials / Social Proof */}
        <section
          aria-label="Customer Reviews"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
              Verified Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
              Trusted by Luxury Enthusiasts
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-500" />
              ))}
              <span className="text-xs font-bold text-[#111111] ml-2">4.9 / 5.0 (3,100+ orders)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#111111] leading-relaxed italic">
                "Received my handbag in 3 days. The leather smell, weighted chain, and stitching are 100% indistinguishable. Came with complete box and dustbag."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Sophia M.</span>
                <span className="text-[#666660] text-[11px]">Verified Client</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#111111] leading-relaxed italic">
                "The automatic timepiece is flawless. Ceramic bezel clicks crisply, sweeping second hand is smooth, and the weight on the wrist feels solid."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Marcus T.</span>
                <span className="text-[#666660] text-[11px]">Verified Client</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#111111] leading-relaxed italic">
                "Super fast discreet delivery. Sizing was spot on for the sneakers and the leather quality is premium grade. Definitely ordering again."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Alex R.</span>
                <span className="text-[#666660] text-[11px]">Verified Client</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Frequently Asked Questions (FAQ) Section for Semantic AEO */}
        <section
          aria-label="Frequently Asked Questions"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E4E4E0]"
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
              Customer Assistance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#666660] mt-1">
              Everything you need to know about our quality grade, packaging, and delivery.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>What quality grade are the products on Vovelo?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                Every piece is 1:1 Master Quality, utilizing imported genuine leather, heavy brass/steel hardware, exact date stamps, and automatic movements matching luxury benchmarks.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>Does my order arrive with complete branded box and dustbag?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                Yes! Every product arrives packaged in its signature branded gift box, protective dustbag, and documentation for complete boutique presentation.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>How fast is delivery and is it tracked?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                Orders are dispatched within 24–48 hours in discreet double-boxed packaging. Delivery typically takes 2–4 business days with real-time online tracking.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>What is the 7-Day Return Guarantee?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                We offer a complete 7-day inspection guarantee. If you are not 100% satisfied with the quality or fit, you can easily exchange or return your item within 7 days.
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
