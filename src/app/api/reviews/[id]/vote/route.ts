import { NextResponse } from 'next/server';
import { voteReviewHelpful } from '@/lib/data-service';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = await voteReviewHelpful(id);
  if (!updated) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
