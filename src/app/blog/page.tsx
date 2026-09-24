import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { getBlogPosts, getSiteSettings } from '@/lib/data-service';
import { getBaseUrl } from '@/lib/utils';
import { ArrowRight, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  const baseUrl = getBaseUrl();
  return {
    title: 'Volvelo Journal — Horology, Italian Cordwaining & European Haute Craft | Volvelo',
    description:
      'In-depth stories and technical craftsmanship guides from master Swiss watchmakers, Tuscan cobblers, and Parisian high jewellery artisans.',
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    openGraph: {
      title: 'Volvelo Journal — European Craftsmanship & Horology',
      description: 'Inside the workshops of Europe’s finest independent makers.',
      url: `${baseUrl}/blog`,
      siteName: 'Volvelo',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Volvelo Journal',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Volvelo Journal — European Craftsmanship & Horology',
      description: 'Inside the workshops of Europe’s finest independent makers.',
      images: [`${baseUrl}/twitter-image`],
    },
  };
}

export default async function BlogListPage() {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPosts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111111]">
      <Header announcement={settings.announcementText} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F5132] mb-2">
            <BookOpen size={14} />
            <span>Volvelo Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Stories, Guides & Conscious Living
          </h1>
          <p className="text-sm text-[#666660] mt-2 leading-relaxed">
            Exploring materials, ergonomics, and intentional design for the modern European lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-[#E4E4E0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[16/9] w-full bg-[#F0F0EC] overflow-hidden">
                <img
                  src={post.coverImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-[#666660] mb-3">
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
                <h2 className="text-xl font-bold text-[#111111] group-hover:text-[#0F5132] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#666660] mt-2.5 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-6 pt-4 border-t border-[#F0F0EC] flex items-center text-xs font-semibold text-[#0F5132] gap-1">
                  <span>Read full guide</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
