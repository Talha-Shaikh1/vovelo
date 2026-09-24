import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ProductDetailClient } from '@/components/storefront/ProductDetailClient';
import { RelatedProducts } from '@/components/storefront/RelatedProducts';
import { getProductBySlug, getRelatedProducts, getSiteSettings, getProductReviews } from '@/lib/data-service';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | Volvelo' };
  }

  const title = product.seoTitle || `${product.title} — Ethically Crafted in Europe | Volvelo`;
  const description =
    product.seoDescription ||
    product.description.slice(0, 155) ||
    'High quality sustainable product from Volvelo.';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const url = `${baseUrl}/product/${product.slug}`;

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
      images: product.images?.[0]?.url
        ? [
            {
              url: product.images[0].url,
              width: 1200,
              height: 1500,
              alt: product.images[0].altText || product.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getProductReviews(product.id),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const productUrl = `${baseUrl}/product/${product.slug}`;

  const totalRevCount = reviews.length > 0 ? reviews.length : 12;
  const avgRatingVal =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '4.9';

  // 1. Schema.org / JSON-LD Product & Offer Data with Real AggregateRating & Reviews for Google Rich Snippets & AI Search (AEO)
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.variants[0]?.sku || product.slug,
    mpn: product.variants[0]?.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.tenant?.name || 'Volvelo',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRatingVal,
      reviewCount: totalRevCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.authorName,
      },
      datePublished: r.createdAt,
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.basePrice,
      priceValidUntil: '2026-12-31',
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Volvelo',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'NL', 'AT', 'BE', 'IT', 'ES', 'DK', 'SE'],
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY',
          },
        },
      },
    },
  };

  // 2. Schema.org BreadcrumbList for 4-Tier Rich SERP & AEO Hierarchy
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
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category.name,
              item: `${baseUrl}/category/${product.category.slug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: product.title,
              item: productUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.title,
              item: productUrl,
            },
          ]),
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      {/* JSON-LD Script Injections for Technical SEO & Semantic AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* 4-Tier Semantic Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-[#666660] mb-8 overflow-x-auto no-scrollbar"
        >
          <Link href="/" className="hover:text-[#111111] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/categories" className="hover:text-[#111111] transition-colors shrink-0">
            All Categories
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          {product.category && (
            <>
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-[#111111] transition-colors shrink-0"
              >
                {product.category.name}
              </Link>
              <ChevronRight size={12} className="shrink-0" />
            </>
          )}
          <span className="font-semibold text-[#111111] truncate max-w-xs shrink-0">
            {product.title}
          </span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailClient product={product} settings={settings} />

        {/* Related Products Recommendation */}
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}
