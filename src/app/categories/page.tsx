import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getCategories, getSiteSettings } from '@/lib/data-service';
import { getBaseUrl } from '@/lib/utils';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Layers, 
  ChevronRight 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/categories`;
  const title = 'All Collections & Luxury Categories | 1:1 Master Archives | Volvelo';
  const description =
    'Explore all 15 master luxury departments — Handcrafted Handbags, Swiss Timepieces, Designer Footwear, Outerwear, Fine Jewelry, and Designer Accessories with 7-Day Guarantee.';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Volvelo',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_`,
          secureUrl: `${baseUrl}/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_`,
          width: 1200,
          height: 630,
          alt: 'Volvelo 1:1 Master Luxury Collections',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_`],
    },
  };
}

// Category Highlights & Designer Brand associations for luxury presentation
const CATEGORY_METADATA: Record<
  string,
  {
    department: 'Bags & Leather' | 'Footwear' | 'Outerwear & Apparel' | 'Watches & Jewelry' | 'Accessories';
    featuredBrands: string[];
    tagline: string;
  }
> = {
  bags: {
    department: 'Bags & Leather',
    featuredBrands: ['Hermès', 'Chanel', 'Louis Vuitton', 'Dior', 'Bottega Veneta', 'Goyard'],
    tagline: 'Handcrafted full-grain calfskin, signature hardware & iconic silhouettes',
  },
  footwear: {
    department: 'Footwear',
    featuredBrands: ['Loro Piana', 'Christian Louboutin', 'Hermès', 'Prada', 'Alexander McQueen'],
    tagline: 'Summer Walk loafers, Italian leather boots & signature high-fashion sneakers',
  },
  coats: {
    department: 'Outerwear & Apparel',
    featuredBrands: ['Burberry', 'Moncler', 'Canada Goose', 'Prada', 'Loewe'],
    tagline: 'Heritage gabardine trench coats, pure down parkas & shearling bombers',
  },
  watches: {
    department: 'Watches & Jewelry',
    featuredBrands: ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Hublot', 'Cartier', 'Omega'],
    tagline: 'Precision automatic chronographs, 904L steel & sapphire crystal glass',
  },
  belts: {
    department: 'Bags & Leather',
    featuredBrands: ['Hermès', 'Gucci', 'Louis Vuitton', 'Ferragamo', 'Celine'],
    tagline: 'Hand-stitched leather belts with 24K gold and palladium plated buckles',
  },
  hats: {
    department: 'Accessories',
    featuredBrands: ['Prada', 'Gucci', 'Dior', 'Celine', 'Fendi'],
    tagline: 'Bespoke wool beanies, felt fedoras, bucket hats & cold-weather archives',
  },
  wallets: {
    department: 'Bags & Leather',
    featuredBrands: ['Chanel', 'Goyard', 'Louis Vuitton', 'Bottega Veneta', 'Prada'],
    tagline: 'Compact cardholders, continental zip wallets & bi-fold calfskin pieces',
  },
  scarfs: {
    department: 'Accessories',
    featuredBrands: ['Hermès', 'Burberry', 'Louis Vuitton', 'Gucci', 'Dior'],
    tagline: '100% pure mulberry silk twill and Mongolian cashmere jacquards',
  },
  backpacks: {
    department: 'Bags & Leather',
    featuredBrands: ['Louis Vuitton', 'Prada', 'Gucci', 'Burberry'],
    tagline: 'Monogram canvas rucksacks, nylon tech backpacks & everyday travel bags',
  },
  'belt-bags': {
    department: 'Bags & Leather',
    featuredBrands: ['Gucci', 'Balenciaga', 'Prada', 'Louis Vuitton'],
    tagline: 'Utility crossbody slings, bum bags & contemporary street-couture silhouettes',
  },
  sunglasses: {
    department: 'Accessories',
    featuredBrands: ['Tom Ford', 'Cartier', 'Celine', 'Gucci', 'Prada'],
    tagline: 'Hand-polished acetate frames with polarized UV400 protective lenses',
  },
  caps: {
    department: 'Accessories',
    featuredBrands: ['Balenciaga', 'Celine', 'Gucci', 'Burberry', 'Dior'],
    tagline: 'Structured cotton canvas baseball caps with high-density brand embroidery',
  },
  jewelry: {
    department: 'Watches & Jewelry',
    featuredBrands: ['Van Cleef & Arpels', 'Cartier', 'Bvlgari', 'Tiffany & Co.'],
    tagline: 'Alhambra motifs, Love bangles & 18K gold micro-set zircon fine pieces',
  },
  't-shirts': {
    department: 'Outerwear & Apparel',
    featuredBrands: ['Balenciaga', 'Loewe', 'Dior', 'Prada', 'Valentino'],
    tagline: 'Heavyweight organic cotton jersey, relaxed streetwear fits & signature graphics',
  },
  'summer-wear': {
    department: 'Outerwear & Apparel',
    featuredBrands: ['Jacquemus', 'Loro Piana', 'Versace', 'Casablanca'],
    tagline: 'Resort silk shirts, linen co-ords, swimwear & Mediterranean leisure pieces',
  },
};

export default async function CategoriesHubPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/categories`;

  // Sort categories by product count or priority
  const sortedCategories = [...categories].sort((a, b) => {
    const countA = a._count?.products || 0;
    const countB = b._count?.products || 0;
    return countB - countA;
  });

  const totalProductsCount = sortedCategories.reduce(
    (acc, cat) => acc + (cat._count?.products || 0),
    0
  );

  // Schema.org CollectionPage & BreadcrumbList for Technical SEO & AEO
  const jsonLdCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Luxury Categories & Collections | Volvelo',
    description:
      'Browse all 15 curated luxury departments with 1:1 master quality verification, express shipping, and 7-day returns guarantee.',
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sortedCategories.length,
      itemListElement: sortedCategories.map((cat, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: cat.name,
        description: cat.description,
        url: `${baseUrl}/category/${cat.slug}`,
        image: cat.image,
      })),
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Collections & Categories',
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-[#666660] mb-6 overflow-x-auto no-scrollbar"
        >
          <Link href="/" className="hover:text-[#111111] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#111111]">All Categories</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-[#111111] text-white p-8 md:p-14 mb-12 overflow-hidden shadow-xl border border-black/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,81,50,0.35),rgba(255,255,255,0))]" />
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#0F5132]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              <Sparkles size={13} />
              <span>1:1 Master Quality Archive</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
              Explore All Luxury Collections
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              Discover {sortedCategories.length} prestigious departments spanning over {totalProductsCount.toLocaleString()}+ master-quality creations. Each piece is rigorously inspected for 1:1 authentic proportions, genuine materials, and couture precision.
            </p>

            {/* Value Props Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>1:1 Master Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-emerald-400" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-emerald-400" />
                <span>7-Day Inspection Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grid Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
              All Departments ({sortedCategories.length})
            </h2>
            <p className="text-xs text-[#666660] mt-0.5">
              Select a category to view all corresponding 1:1 luxury master items
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#666660] bg-white px-3 py-1.5 rounded-xl border border-[#E4E4E0] shadow-2xs">
            <Layers size={14} className="text-[#0F5132]" />
            <span className="font-semibold text-[#111111]">{totalProductsCount.toLocaleString()}</span> Total Products
          </div>
        </div>

        {/* 15 Luxury Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedCategories.map((category) => {
            const meta = CATEGORY_METADATA[category.slug] || {
              department: 'Accessories',
              featuredBrands: ['Luxury Brands'],
              tagline: category.description || 'Verified 1:1 master luxury collection.',
            };
            const itemCount = category._count?.products || 0;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative flex flex-col bg-white rounded-2xl border border-[#E4E4E0] overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-700/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with Luxury Overlay */}
                <div className="relative aspect-[4/3] bg-[#F0F0EC] overflow-hidden">
                  <img
                    src={category.image || '/api/drive-image/1C3DTN16ef_5M4FVPct-cUt_KM72AQdg_'}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 border border-white/10">
                      {meta.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-[#111111] shadow-2xs">
                      {itemCount} items
                    </span>
                  </div>

                  {/* Title & Tagline overlay at bottom of image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-[#666660] leading-relaxed line-clamp-2">
                      {meta.tagline}
                    </p>

                    {/* Featured Designer Brand Chips */}
                    {meta.featuredBrands && meta.featuredBrands.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#999990]">
                          Featured Designers
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {meta.featuredBrands.slice(0, 4).map((brand) => (
                            <span
                              key={brand}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F0F0EC] text-[#111111] border border-[#E4E4E0]"
                            >
                              {brand}
                            </span>
                          ))}
                          {meta.featuredBrands.length > 4 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#E8F3EE] text-[#0F5132]">
                              +{meta.featuredBrands.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Link */}
                  <div className="pt-3 border-t border-[#F0F0EC] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F5132] group-hover:underline flex items-center gap-1">
                      <span>Explore Collection</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#999990] bg-[#F0F0EC] px-2 py-0.5 rounded">
                      1:1 Master
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Concierge Bespoke Section Banner */}
        <div className="mt-16 rounded-2xl bg-[#F0F0EC] border border-[#E4E4E0] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-extrabold text-[#111111]">
              Looking for a specific model or bespoke designer creation?
            </h3>
            <p className="text-xs md:text-sm text-[#666660] max-w-xl">
              Our concierge can source any 1:1 master archive piece directly with VIP express delivery.
            </p>
          </div>
          <Link
            href="/search"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0d462b] transition-all shadow-md flex items-center gap-2"
          >
            <span>Search Entire Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
