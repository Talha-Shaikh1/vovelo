import { NextResponse } from 'next/server';
import { getProductReviews, getProductRatingSummary, addProductReview } from '@/lib/data-service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const [reviews, summary] = await Promise.all([
    getProductReviews(productId),
    getProductRatingSummary(productId),
  ]);

  return NextResponse.json({ reviews, summary });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, authorName, authorLocation, rating, title, comment } = body;

    if (!productId || !authorName || !rating || !title || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReview = await addProductReview({
      productId,
      authorName,
      authorLocation: authorLocation || 'European Customer',
      rating: Number(rating),
      title,
      comment,
      isVerifiedBuyer: true,
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit review';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
