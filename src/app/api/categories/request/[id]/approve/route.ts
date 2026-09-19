import { NextResponse } from 'next/server';
import { approveCategoryRequest } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const newCat = await approveCategoryRequest(id);
    if (!newCat) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: newCat });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve category request' },
      { status: 500 }
    );
  }
}
