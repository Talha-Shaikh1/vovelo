import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { getTenantBySlug, getProducts, getSiteSettings } from '@/lib/data-service';
import { getBaseUrl } from '@/lib/utils';
import { MapPin, Globe, Leaf, ShieldCheck, ArrowLeft, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    return { title: 'Maker Not Found | Vovelo' };
  }

  const title = `${tenant.name} — Luxury Brand House | Vovelo`;
  const description =
    tenant.story || `Discover sustainably crafted minimalist products by ${tenant.name} on Vovelo.`;
  const baseUrl = getBaseUrl();

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/brand/${tenant.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/brand/${tenant.slug}`,
      type: 'profile',
      images: [
        {
          url: `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${tenant.name} on Vovelo`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/twitter-image`],
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const [tenant, settings] = await Promise.all([
    getTenantBySlug(slug),
    getSiteSettings(),
  ]);

  if (!tenant) {
    notFound();
  }

  const products = await getProducts({ tenantSlug: tenant.slug });
  const baseUrl = getBaseUrl();

  // Schema.org Brand / Organization Structured Data
  const jsonLdBrand = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: tenant.name,
    url: `${baseUrl}/brand/${tenant.slug}`,
    description: tenant.story,
    address: {
      '@type': 'PostalAddress',
      addressCountry: tenant.country,
      addressLocality: tenant.city,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBrand) }}
      />

      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666660] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Explore All European Makers</span>
          </Link>
        </div>

        {/* Maker Bio Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4E4E0] shadow-2xs mb-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#E8F3EE] text-[#0F5132] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Store size={12} />
                <span>Verified Luxury Brand</span>
              </span>

              {tenant.city && tenant.country && (
                <span className="inline-flex items-center gap-1 bg-[#F0F0EC] text-[#111111] text-xs font-medium px-3 py-1 rounded-full border border-[#E4E4E0]">
                  <MapPin size={12} className="text-[#0F5132]" />
                  <span>
                    {tenant.city}, {tenant.country}
                  </span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              {tenant.name}
            </h1>

            <p className="text-sm text-[#555550] leading-relaxed">
              {tenant.story ||
                'Curated luxury fashion house committed to 1:1 master craftsmanship, certified premium materials, and direct VIP fulfillment.'}
            </p>

            {/* Eco Badges */}
            {tenant.ecoBadges && tenant.ecoBadges.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tenant.ecoBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F5132] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full"
                  >
                    <Leaf size={10} />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products by this Maker */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0]">
            <div>
              <h2 className="text-xl font-bold text-[#111111] tracking-tight">
                Curated Lineup by {tenant.name}
              </h2>
              <p className="text-xs text-[#666660] mt-0.5">
                Showing {products.length} verified master pieces
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E4E4E0] text-xs text-[#666660]">
              This brand is currently preparing its next seasonal capsule release.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
