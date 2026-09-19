import { NextResponse } from 'next/server';
import { togglePromoCodeStatus, deletePromoCode } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const updated = await togglePromoCodeStatus(id);
    if (!updated) {
      return NextResponse.json({ error: 'Promo not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to toggle promo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    await deletePromoCode(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete promo' },
      { status: 500 }
    );
  }
}
