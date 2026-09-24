import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductCard } from '@/components/storefront/ProductCard';
import { CategoryFilters } from '@/components/storefront/CategoryFilters';
import { Pagination } from '@/components/storefront/Pagination';
import { getPaginatedProducts, getCategories, getCategoryBySlug, getAllTenants, getSiteSettings } from '@/lib/data-service';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: 'seo' | 'price_asc' | 'price_desc' | 'newest';
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    search?: string;
    tenant?: string;
    sub?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found | Volvelo' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const url = `${baseUrl}/category/${category.slug}`;
  const title = category.seoTitle || `${category.name} — Luxury European Essentials | Volvelo`;
  const description =
    category.seoDescription ||
    category.description ||
    `Shop 1:1 master quality ${category.name} with express delivery and 7-day guarantee.`;

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
      type: 'website',
      images: category.image ? [{ url: category.image, alt: category.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const {
    sort = 'seo',
    minPrice,
    maxPrice,
    inStock,
    search,
    tenant,
    sub,
    page = '1',
  } = resolvedParams;

  const currentPage = parseInt(page, 10) || 1;
  const pageSize = 24;

  const [category, settings, categories, tenants, paginationResult] = await Promise.all([
    getCategoryBySlug(slug),
    getSiteSettings(),
    getCategories(),
    getAllTenants(),
    getPaginatedProducts({
      categorySlug: slug,
      sort,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStockOnly: inStock === 'true',
      search: search || sub,
      tenantSlug: tenant,
      page: currentPage,
      pageSize,
    }),
  ]);

  if (!category) {
    notFound();
  }

  const { products, total, totalPages } = paginationResult;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const categoryUrl = `${baseUrl}/category/${category.slug}`;

  // JSON-LD CollectionPage & BreadcrumbList Schema for Google & AEO AI search bots
  const jsonLdCategory = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${baseUrl}/product/${p.slug}`,
        name: p.title,
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
        name: 'All Categories',
        item: `${baseUrl}/categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCategory) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-[#666660] mb-6 overflow-x-auto no-scrollbar"
        >
          <Link href="/" className="hover:text-[#111111] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/categories" className="hover:text-[#111111] transition-colors shrink-0">
            All Categories
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="font-semibold text-[#111111] truncate shrink-0">
            {category.name}
          </span>
        </nav>

        {/* Category Header Hero */}
        <div className="relative rounded-2xl bg-[#F0F0EC] p-8 md:p-12 mb-8 border border-[#E4E4E0] overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">
              Department
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-[#666660] leading-relaxed">
                {category.description}
              </p>
            )}

            {category.children && category.children.length > 0 && (
              <div className="pt-4 flex flex-wrap gap-2">
                {category.children.map((sub) => (
                  <a
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#111111] border border-[#E4E4E0] transition-colors shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <span>{sub.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 bg-transparent p-0 lg:bg-white lg:p-5 lg:rounded-2xl lg:border lg:border-[#E4E4E0] lg:shadow-2xs lg:sticky lg:top-24">
            <CategoryFilters
              categories={categories}
              tenants={tenants.filter((t) => t.status === 'ACTIVE')}
              activeCategorySlug={slug}
            />
          </aside>

          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E4E4E0] p-12 text-center space-y-3">
                <h3 className="text-base font-bold text-[#111111]">
                  No products in this category matching your filters
                </h3>
                <p className="text-xs text-[#666660] max-w-sm mx-auto">
                  Try clearing the price or stock filters to view available items.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={pageSize}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
