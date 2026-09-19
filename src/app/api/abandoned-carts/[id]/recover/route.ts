import { NextResponse } from 'next/server';
import { sendAbandonedCartRecovery } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'SUPPORT']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const updated = await sendAbandonedCartRecovery(id);
    if (!updated) {
      return NextResponse.json({ error: 'Abandoned cart not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      cart: updated,
      message: `Recovery email dispatched successfully to ${updated.customerEmail} with 10% discount promo code.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send recovery email' },
      { status: 500 }
    );
  }
}
