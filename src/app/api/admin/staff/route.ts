import { NextResponse } from 'next/server';
import { getAllUsers, inviteStaffUser, updateStaffRole } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
  if (auth.errorResponse) return auth.errorResponse;

  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { name, email, role, tenantId } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const newUser = await inviteStaffUser({ name, email, role, tenantId });
    return NextResponse.json(newUser, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to invite staff';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { userId, role, tenantId } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    const updated = await updateStaffRole(userId, role, tenantId);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
