import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'SUPPORT']);
    if (auth.errorResponse) return auth.errorResponse;

    const { orderId, status, trackingNumber } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status required' },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(orderId, status, trackingNumber);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
