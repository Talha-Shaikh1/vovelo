import { NextResponse } from 'next/server';
import { updateSiteSettings } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
