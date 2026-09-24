import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getOrCreateBootstrapUser } from '@/lib/data-service';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';
  const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Admin User';

  console.log('🛡️ [Admin Access Check] Clerk User:', {
    userId: clerkUser.id,
    email: primaryEmail,
    publicMetadata: clerkUser.publicMetadata,
  });

  const userAccount = await getOrCreateBootstrapUser({
    email: primaryEmail,
    name: fullName,
    clerkId: clerkUser.id,
  });

  // Strict Role-Based Access Control (RBAC)
  const isAuthorized =
    userAccount.role === 'SUPER_ADMIN' ||
    userAccount.role === 'ADMIN' ||
    userAccount.role === 'SUPPORT';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E4E4E0] shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#111111]">
              Restricted Admin Access
            </h1>
            <p className="text-xs text-[#666660] mt-2 leading-relaxed">
              You are signed in as <strong>{primaryEmail}</strong> with role{' '}
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {userAccount.role}
              </span>
              . Only authorized Super Administrators and Staff can access the Enterprise Hub.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/portal"
              className="w-full py-3 px-4 bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Store size={15} />
              <span>Go to Merchant Portal</span>
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

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col md:flex-row text-[#111111]">
      <AdminSidebar userAccount={userAccount} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
