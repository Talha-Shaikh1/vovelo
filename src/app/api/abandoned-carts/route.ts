import { NextResponse } from 'next/server';
import { getAbandonedCarts, recordAbandonedCart } from '@/lib/data-service';

export async function GET() {
  const carts = await getAbandonedCarts();
  return NextResponse.json(carts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerEmail, customerName, items, subtotal } = body;

    if (!customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: 'Email and items are required' }, { status: 400 });
    }

    const recorded = await recordAbandonedCart({
      customerEmail,
      customerName,
      items,
      subtotal: Number(subtotal) || 0,
    });

    return NextResponse.json(recorded, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to record cart';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
