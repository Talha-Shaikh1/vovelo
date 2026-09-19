import { NextResponse } from 'next/server';
import { getAllPromoCodes, createPromoCode } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  const promos = await getAllPromoCodes();
  return NextResponse.json(promos);
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const newPromo = await createPromoCode(body);
    return NextResponse.json(newPromo, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create promo code';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
