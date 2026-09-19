import { NextResponse } from 'next/server';
import { approveTenant } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const approved = await approveTenant(id);
    if (!approved) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, tenant: approved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve tenant' },
      { status: 500 }
    );
  }
}
