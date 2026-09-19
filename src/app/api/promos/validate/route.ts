import { NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please provide a coupon code.' }, { status: 400 });
    }
    const result = await validatePromoCode(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error validating promo code';
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}
