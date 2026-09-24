import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  getAllTenants,
  getMerchantScopedData,
  getCategories,
  getOrCreateBootstrapUser,
} from '@/lib/data-service';
import { Tenant } from '@/lib/types';
import { MerchantPortalClient } from '@/components/portal/MerchantPortalClient';
import Link from 'next/link';
import { Store, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PortalPageProps {
  searchParams: Promise<{ tenant?: string }>;
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';
  const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Merchant User';

  console.log('🏛️ [Portal Access Check] Clerk User:', {
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
  const params = await searchParams;

  const isSuperAdmin =
    userAccount.role === 'SUPER_ADMIN' || userAccount.role === 'ADMIN';

  let currentTenant: Tenant | null = null;
  let accessibleTenants: Tenant[] = [];

  if (isSuperAdmin) {
    // Super Admins can manage any atelier
    accessibleTenants = allTenants.filter((t) => t.status === 'ACTIVE');
    currentTenant =
      accessibleTenants.find((t) => t.id === params.tenant) ||
      accessibleTenants[0] ||
      allTenants[0];
  } else {
    // STRICT TENANT ISOLATION:
    // Merchants can ONLY see their assigned atelier!
    const matchedTenant = allTenants.find(
      (t) =>
        t.id === userAccount.tenantId ||
        t.email?.toLowerCase() === primaryEmail.toLowerCase()
    );

    if (matchedTenant) {
      currentTenant = matchedTenant;
      accessibleTenants = [matchedTenant];
    }
  }

  // If no tenant is assigned or pending approval
  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E4E4E0] shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Clock size={28} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#111111]">
              No Active Brand Linked
            </h1>
            <p className="text-xs text-[#666660] mt-2 leading-relaxed">
              Your account <strong>{primaryEmail}</strong> does not have an active verified brand profile attached yet.
            </p>
          </div>

          <div className="p-3 bg-[#F0F0EC] rounded-xl text-[11px] text-[#666660] text-left space-y-1">
            <p className="font-semibold text-[#111111]">Next Steps:</p>
            <p>1. If you just applied on /sell-with-us, your application is pending review by platform administrators.</p>
            <p>2. Once approved, your products, orders, and 85% payouts dashboard will activate automatically here.</p>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/sell-with-us"
              className="w-full py-3 px-4 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Store size={15} />
              <span>Submit European Maker Application</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-[#FAFAF8] hover:bg-[#F0F0EC] text-[#111111] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#E4E4E0]"
            >
              <span>Return to Storefront</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [initialData, categories] = await Promise.all([
    getMerchantScopedData(currentTenant.id),
    getCategories(),
  ]);

  return (
    <MerchantPortalClient
      initialTenant={currentTenant}
      allTenants={accessibleTenants}
      initialData={initialData}
      categories={categories}
      isSuperAdmin={isSuperAdmin}
      userRole={userAccount.role}
    />
  );
}
