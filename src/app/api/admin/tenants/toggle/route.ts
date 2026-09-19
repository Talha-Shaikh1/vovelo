import { NextResponse } from 'next/server';
import { toggleTenantStatus } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Tenant ID required' }, { status: 400 });
    }

    const tenant = await toggleTenantStatus(id);
    return NextResponse.json({ success: true, tenant });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle tenant' },
      { status: 500 }
    );
  }
}
