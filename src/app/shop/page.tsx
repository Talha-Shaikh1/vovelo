import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { CategoryFilters } from '@/components/storefront/CategoryFilters';
import { getProducts, getCategories, getAllTenants, getSiteSettings } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Luxury Collections & European Goods | Volvelo',
  description:
    'Explore the full luxury catalog of Swiss automatic chronographs, handcrafted Italian footwear, mulberry silk clothing, and 18K fine jewellery.',
  alternates: {
    canonical: 'https://volvelo.com/shop',
  },
  openGraph: {
    title: 'All Luxury Collections & European Goods | Volvelo',
    description: 'Explore the full luxury catalog from verified European ateliers.',
    url: 'https://volvelo.com/shop',
  },
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: 'seo' | 'price_asc' | 'price_desc' | 'newest';
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    search?: string;
    tenant?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const {
    category,
    sort = 'seo',
    minPrice,
    maxPrice,
    inStock,
    search,
    tenant,
  } = resolvedParams;

  const [settings, categories, tenants, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getAllTenants(),
    getProducts({
      categorySlug: category,
      sort,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStockOnly: inStock === 'true',
      search,
      tenantSlug: tenant,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header Banner */}
        <div className="mb-8 pb-6 border-b border-[#E4E4E0]">
          <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
            {search ? `Search Results for "${search}"` : 'All Products & Essentials'}
          </h1>
          <p className="text-xs text-[#666660] mt-1.5">
            Showing {products.length} products • Curated European luxury collection
          </p>
        </div>

        {/* Layout Grid: Left Sidebar (Filters) + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter Panel */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-[#E4E4E0] shadow-2xs sticky top-24">
            <CategoryFilters
              categories={categories}
              tenants={tenants.filter((t) => t.status === 'ACTIVE')}
              activeCategorySlug={category}
            />
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E4E4E0] p-12 text-center space-y-3">
                <h3 className="text-base font-bold text-[#111111]">
                  No products matched your filters
                </h3>
                <p className="text-xs text-[#666660] max-w-sm mx-auto">
                  Try adjusting the price range, clearing filters, or searching with different keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
