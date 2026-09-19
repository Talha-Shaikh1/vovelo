import React from 'react';
import { getBlogPosts } from '@/lib/data-service';
import { FileText, Plus, ExternalLink, Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Journal & SEO Buying Guides
          </h1>
          <p className="text-xs text-[#666660] mt-1">
            Informational search funnels and articles with embedded interactive product cards.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 bg-white rounded-2xl border border-[#E4E4E0] shadow-2xs flex flex-col sm:flex-row gap-5 items-start"
          >
            <img
              src={
                post.coverImage ||
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
              }
              alt={post.title}
              className="w-full sm:w-44 h-28 object-cover rounded-xl bg-[#F0F0EC] shrink-0 border border-[#E4E4E0]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#666660] mb-1">
                <span className="font-semibold text-[#0F5132]">{post.author}</span>
                <span>•</span>
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-EU')
                    : 'Recent'}
                </span>
                <span>•</span>
                <span className="bg-[#E8F3EE] text-[#0F5132] text-[10px] font-bold px-2 py-0.5 rounded">
                  {post.embeddedProductIds?.length || 0} Embedded Products
                </span>
              </div>
              <h3 className="font-bold text-base text-[#111111]">{post.title}</h3>
              <p className="text-xs text-[#666660] mt-1 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 pt-3 border-t border-[#F0F0EC] flex items-center justify-between text-xs">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="text-[#0F5132] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View Live Article</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
