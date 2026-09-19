import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { EmbeddedProductCard } from '@/components/storefront/EmbeddedProductCard';
import { getBlogPostBySlug, getProductBySlug, getSiteSettings, getProducts } from '@/lib/data-service';
import { ChevronRight, Calendar, User, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Article Not Found | Volvelo' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const url = `${baseUrl}/blog/${post.slug}`;
  const title = post.seoTitle || `${post.title} | Volvelo Journal`;
  const description = post.seoDescription || post.excerpt;

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
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, settings, allProducts] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteSettings(),
    getProducts({ limit: 10 }),
  ]);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';
  const articleUrl = `${baseUrl}/blog/${post.slug}`;

  // Article / BlogPosting Schema for Google Knowledge Graph & AI Engine Ingestion
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Volvelo',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  // Find any products embedded in this blog post
  const embeddedProducts = allProducts.filter((p) =>
    post.embeddedProductIds?.includes(p.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#666660] mb-8">
          <Link href="/blog" className="hover:text-[#111111] flex items-center gap-1">
            <ArrowLeft size={13} />
            <span>Back to Journal</span>
          </Link>
          <ChevronRight size={12} />
          <span className="truncate max-w-xs font-medium text-[#111111]">
            {post.title}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#666660]">
            <span className="flex items-center gap-1.5 font-semibold text-[#0F5132]">
              <User size={14} />
              <span>{post.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-EU', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent'}
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#666660] leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#F0F0EC] mb-10 border border-[#E4E4E0]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-[#2B2B28] space-y-6">
          <div className="whitespace-pre-line">{post.content}</div>

          {/* Embedded Products Section */}
          {embeddedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#E4E4E0]">
              <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider mb-4">
                Featured Products in This Article
              </h3>
              <div className="space-y-4">
                {embeddedProducts.map((p) => (
                  <EmbeddedProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
