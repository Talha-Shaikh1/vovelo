import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const products = await getProducts({
    search: query.trim(),
    limit: 10,
  });

  const results = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    basePrice: p.basePrice,
    image: p.images[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
    categoryName: p.category?.name || 'Luxury Collection',
    categorySlug: p.category?.slug || 'shop',
  }));

  return NextResponse.json({ results });
}
