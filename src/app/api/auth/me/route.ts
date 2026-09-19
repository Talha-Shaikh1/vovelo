import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getOrCreateBootstrapUser, getAllTenants } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ authenticated: false });
    }

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

    console.log('👤 [/api/auth/me] Clerk User Session:', {
      userId: clerkUser.id,
      email: primaryEmail,
      publicMetadata: clerkUser.publicMetadata,
    });

    const userAccount = await getOrCreateBootstrapUser({
      email: primaryEmail,
      name: fullName,
      clerkId: clerkUser.id,
    });

    const allTenants = await getAllTenants();
    const isAdmin =
      userAccount.role === 'SUPER_ADMIN' ||
      userAccount.role === 'ADMIN' ||
      userAccount.role === 'SUPPORT';

    const matchedTenant = allTenants.find(
      (t) =>
        t.id === userAccount.tenantId ||
        t.email?.toLowerCase() === primaryEmail.toLowerCase()
    );

    return NextResponse.json({
      authenticated: true,
      email: primaryEmail,
      name: fullName,
      role: userAccount.role,
      clerkPublicMetadata: clerkUser.publicMetadata || {},
      isAdmin,
      isMerchant: Boolean(matchedTenant) || userAccount.role === 'MERCHANT',
      tenant: matchedTenant
        ? {
            id: matchedTenant.id,
            name: matchedTenant.name,
            slug: matchedTenant.slug,
            country: matchedTenant.country,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ authenticated: false, error: 'Auth failed' }, { status: 500 });
  }
}
