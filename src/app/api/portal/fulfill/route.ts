import { NextResponse } from 'next/server';
import { fulfillMerchantOrderItem } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'MERCHANT']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { orderId, itemId, carrier, trackingNumber } = body;

    if (!orderId || !itemId || !carrier || !trackingNumber) {
      return NextResponse.json(
        { error: 'orderId, itemId, carrier, and trackingNumber are required' },
        { status: 400 }
      );
    }

    const result = await fulfillMerchantOrderItem(orderId, itemId, carrier, trackingNumber);
    if (!result.success) {
      return NextResponse.json({ error: 'Order or item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Fulfillment failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
