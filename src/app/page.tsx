import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { NextLevelHero } from '@/components/storefront/NextLevelHero';
import { getProducts, getCategories, getBlogPosts, getSiteSettings, getAllTenants } from '@/lib/data-service';
import {
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  Star,
  ChevronRight,
  Store,
  MapPin,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Volvelo — Luxury Timepieces, Footwear, Atelier Apparel & Fine Jewellery | Europe',
  description:
    'Shop handcrafted Swiss automatic chronographs, Blake-stitched Italian leather shoes, Milanese mulberry silk apparel, and 18K solid gold fine jewellery directly from verified European ateliers.',
  keywords: [
    'luxury watches europe',
    'swiss automatic chronographs',
    'italian leather shoes',
    'tuscan loafers',
    '18k solid gold jewellery',
    'mulberry silk slip dress',
    'cashmere knitwear',
    'european luxury ateliers',
    'volvelo',
  ],
  alternates: {
    canonical: 'https://volvelo.com',
  },
  openGraph: {
    title: 'Volvelo — Luxury European Timepieces, Footwear & Haute Craft',
    description:
      'Direct atelier fulfillment from Geneva, Florence, Milan, and Paris. 30-day trial & carbon-neutral express delivery.',
    url: 'https://volvelo.com',
    siteName: 'Volvelo',
    locale: 'en_EU',
    type: 'website',
  },
};

export default async function HomePage() {
  const [settings, categories, bestsellers, allProducts, blogPosts, allTenants] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getProducts({ sort: 'seo', limit: 8 }),
      getProducts({ limit: 20 }),
      getBlogPosts(),
      getAllTenants(),
    ]);

  const activeTenants = allTenants.filter((t) => t.status === 'ACTIVE');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';

  // Comprehensive JSON-LD Structured Data for Technical SEO, Semantic Search & AEO
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Volvelo',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'European luxury multi-tenant marketplace connecting discerning clients with certified Swiss watchmakers, Tuscan cordwainers, Milanese tailors, and Parisian high jewellers.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contactPhone || '+49 30 555 3829',
      contactType: 'customer concierge',
      email: settings.contactEmail || 'concierge@volvelo.com',
      areaServed: 'EU',
      availableLanguage: ['English', 'German', 'French', 'Italian'],
    },
    sameAs: [
      'https://instagram.com/volvelo',
      'https://twitter.com/volvelo',
    ],
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Volvelo',
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
        name: 'Where are Volvelo products crafted and are they authentic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every product on Volvelo is handcrafted by verified independent European ateliers: Swiss automatic chronographs in Geneva, Blake-stitched footwear in Florence (Tuscany), mulberry silk apparel in Milan, and 18k solid gold jewellery in Paris. All items ship directly from the artisan workshop with authenticity certificates.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the materials, gold, and gemstones ethically certified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All jewellery pieces are forged in RJC-certified 18K recycled solid gold with conflict-free diamonds. Apparel is woven from OEKO-TEX 100% mulberry silk and Grade-A Cariaggi cashmere, while footwear uses vegetable-tanned Italian box-calf leather.',
        },
      },
      {
        '@type': 'Question',
        name: 'How fast is express delivery across Europe and internationally?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Orders are dispatched within 24-48 hours directly from the European maker atelier. Delivery takes 2–4 business days via DHL Express with full tracking and complimentary climate-neutral shipping on orders over €50.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the return and exchange policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 30-day risk-free return and size exchange guarantee. If your timepiece, shoes, or apparel do not fit perfectly, returns are complimentary with prepaid DHL return shipping.',
        },
      },
    ],
  };

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Most Loved Essentials',
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

        {/* 2. Shop by Department Grid */}
        <section
          aria-label="Product Categories"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                Shop by Department
              </h2>
              <p className="text-xs sm:text-sm text-[#666660] mt-1">
                Consciously designed essentials across apparel, footwear, and carry.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
            >
              <span>Explore full catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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

        {/* 3. Most Loved / Bestselling Essentials */}
        <section
          aria-label="Bestselling Products"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] uppercase tracking-wider mb-1">
                <Star size={14} className="fill-[#0F5132]" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111]">
                Most Loved Essentials
              </h2>
              <p className="text-xs sm:text-sm text-[#666660] mt-1 max-w-lg">
                The core rotation of garments, shoes, and bags trusted by thousands across Europe for daily life and travel.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all products</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        </section>

        {/* 4. Customer Brand Pillars & Sustainability */}
        <section
          aria-label="Brand Philosophy"
          className="bg-[#111111] text-[#FAFAF8] py-16 md:py-20 my-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Ethical European Craftsmanship
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Crafted for Daily Movement. <br />
                  <span className="text-emerald-400">Engineered to Endure.</span>
                </h2>
                <p className="text-sm text-[#999990] leading-relaxed">
                  We partner directly with verified independent European ateliers to craft timeless goods without traditional retail markups. Every thread, zipper, and seam is tested to outlast seasonal trends.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="px-6 py-3 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Discover the Collection
                  </Link>
                  <Link
                    href="/blog"
                    className="px-6 py-3 bg-[#222220] hover:bg-[#333330] text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Read Our Fabric Stories
                  </Link>
                </div>
              </div>

              {/* 4 Value Props Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <Leaf size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Natural Fibers</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    100% GOTS organic cotton and renewable ZQ-certified merino wool.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Carbon-Neutral Shipping</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    100% offset logistics and FSC-certified plastic-free packaging.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <RotateCcw size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">30-Day Wear Trial</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Wear them, wash them, test them. Free returns if not completely satisfied.
                  </p>
                </div>

                <div className="bg-[#1C1C1A] p-6 rounded-2xl border border-[#2B2B28] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5132]/30 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Direct Workshop Pricing</h3>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Transparent pricing directly from makers with zero unnecessary middlemen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4.5. Featured European Independent Ateliers Showcase */}
        {activeTenants.length > 0 && (
          <section
            aria-label="Independent European Makers"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] uppercase tracking-wider mb-1">
                  <Store size={14} />
                  <span>Verified European Workshops</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111]">
                  Meet the Independent Ateliers
                </h2>
                <p className="text-xs sm:text-sm text-[#666660] mt-1 max-w-xl">
                  Each garment and piece of gear is crafted by verified independent craftspeople across Europe. Explore their ateliers and stories.
                </p>
              </div>
              <Link
                href="/sell-with-us"
                className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Are you a maker? Join our collective →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeTenants.slice(0, 3).map((tenant) => {
                const tenantProducts = allProducts.filter((p) => p.tenantId === tenant.id);

                return (
                  <div
                    key={tenant.id}
                    className="bg-white rounded-3xl border border-[#E4E4E0] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-black text-sm shadow-xs">
                          {tenant.name.slice(0, 1)}
                        </div>
                        {tenant.country && (
                          <span className="text-xs font-bold text-[#666660] flex items-center gap-1 bg-[#F0F0EC] px-2.5 py-1 rounded-full">
                            <MapPin size={12} className="text-[#0F5132]" />
                            <span>
                              {tenant.city ? `${tenant.city}, ` : ''}{tenant.country}
                            </span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#111111]">{tenant.name}</h3>
                        <p className="text-xs text-[#666660] mt-1 line-clamp-2 leading-relaxed">
                          {tenant.story || 'Independent European maker dedicated to sustainable, high-precision craft.'}
                        </p>
                      </div>

                      {tenant.ecoBadges && tenant.ecoBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tenant.ecoBadges.slice(0, 2).map((badge, bIdx) => (
                            <span
                              key={bIdx}
                              className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#F0F0EC] flex items-center justify-between">
                      <span className="text-xs text-[#666660] font-medium">
                        {tenantProducts.length} {tenantProducts.length === 1 ? 'artisan piece' : 'artisan pieces'}
                      </span>
                      <Link
                        href={`/brand/${tenant.slug}`}
                        className="text-xs font-bold text-[#0F5132] hover:text-[#0A3622] flex items-center gap-1"
                      >
                        <span>Visit Atelier</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Customer Testimonials / Social Proof */}
        <section
          aria-label="Customer Reviews"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
              Verified Customer Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
              Loved Across Europe
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-500" />
              ))}
              <span className="text-xs font-bold text-[#111111] ml-2">4.9 / 5.0 (2,400+ reviews)</span>
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
                "The Merino Wool Runners are without doubt the most comfortable shoes I've ever worn. Walked 18,000 steps in Berlin on day one with zero break-in needed."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Janine K.</span>
                <span className="text-[#666660] text-[11px]">Berlin, Germany • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#111111] leading-relaxed italic">
                "The 240 GSM organic crewneck fits like luxury designer pieces. The collar stays rigid wash after wash. Ordering two more in the forest pine shade."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Mathieu D.</span>
                <span className="text-[#666660] text-[11px]">Lyon, France • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#111111] leading-relaxed italic">
                "Waterproof Commuter Backpack survived Amsterdam rainy season perfectly. The laptop sleeve and roll-top structure are pure engineering perfection."
              </p>
              <div className="pt-2 border-t border-[#F0F0EC] text-xs">
                <span className="font-bold text-[#111111] block">Sven V.</span>
                <span className="text-[#666660] text-[11px]">Amsterdam, Netherlands • Verified Buyer</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Journal / Buying Guides Section */}
        {blogPosts.length > 0 && (
          <section
            aria-label="Editorial Journal"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">
                  The Volvelo Journal
                </span>
                <h2 className="text-2xl font-bold text-[#111111] mt-1">
                  Buying Guides & Fabric Stories
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-[#0F5132] hover:underline flex items-center gap-1"
              >
                <span>Read all articles</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.slice(0, 2).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-[#E4E4E0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[16/9] w-full bg-[#F0F0EC] overflow-hidden">
                    <img
                      src={
                        post.coverImage ||
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#666660] mb-2">
                      <span className="font-semibold text-[#0F5132]">{post.author}</span>
                      <span>•</span>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-EU', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111111] group-hover:text-[#0F5132] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#666660] mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#F0F0EC] flex items-center text-xs font-semibold text-[#0F5132] gap-1">
                      <span>Read full guide</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. Frequently Asked Questions (FAQ) Section for Semantic AEO */}
        <section
          aria-label="Frequently Asked Questions"
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E4E4E0]"
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5132]">
              Customer Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#666660] mt-1">
              Everything you need to know about our materials, shipping, and ordering.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>What materials are used in Volvelo products?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                Volvelo utilizes sustainably sourced natural and recycled materials including certified ZQ Merino wool, GOTS-certified organic combed cotton (240 GSM), and 100% recycled 900D ballistic nylon.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>Do I need to create an account to order?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                No! We offer 100% frictionless Express Guest Checkout. You can place an order directly with your delivery address without creating a password or logging in.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>How fast is European shipping and what are the rates?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                Shipping is FREE on all orders over €50 across Germany, France, Netherlands, Austria, and all EU member states. Orders are dispatched in 24 hours and delivered in 2–4 business days via DHL/DPD with carbon-neutral logistics.
              </p>
            </details>

            <details className="group bg-white p-5 rounded-2xl border border-[#E4E4E0] [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111]">
                <span>What is the 30-Day Risk-Free Trial?</span>
                <ChevronRight
                  size={16}
                  className="text-[#666660] group-open:rotate-90 transition-transform"
                />
              </summary>
              <p className="text-xs text-[#666660] mt-3 leading-relaxed">
                You can try our runners, apparel, and bags in real life for up to 30 days. If the size or feel isn't ideal, we provide free prepaid return labels for an instant refund or size swap.
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
