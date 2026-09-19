import { clerkClient } from '@clerk/nextjs/server';
import { UserRole } from './types';

export interface ClerkSyncParams {
  clerkId?: string | null;
  email?: string | null;
  role: UserRole;
  tenantId?: string | null;
}

/**
 * Synchronizes user role and tenantId to Clerk user's publicMetadata.
 * Accepts either (clerkId, role, tenantId) or an options object { clerkId, email, role, tenantId }.
 * If clerkId is not directly known, it looks up the user in Clerk via email.
 */
export async function syncUserRoleToClerk(
  target: string | undefined | null | { clerkId?: string | null; email?: string | null },
  roleParam?: UserRole,
  tenantIdParam?: string | null
): Promise<boolean> {
  let clerkId: string | undefined | null;
  let email: string | undefined | null;
  let role: UserRole;
  let tenantId: string | null | undefined;

  if (typeof target === 'object' && target !== null) {
    clerkId = target.clerkId;
    email = target.email;
    role = roleParam as UserRole;
    tenantId = tenantIdParam;
  } else {
    clerkId = target;
    role = roleParam as UserRole;
    tenantId = tenantIdParam;
  }

  if (!role) return false;

  try {
    const client = await clerkClient();
    let targetClerkId = clerkId;

    // If clerkId is missing or mock, try finding the user in Clerk by email
    if ((!targetClerkId || targetClerkId.startsWith('clerk_')) && email) {
      try {
        const userList = await client.users.getUserList({ emailAddress: [email] });
        const matched = userList.data?.[0];
        if (matched) {
          targetClerkId = matched.id;
        }
      } catch {}
    }

    if (!targetClerkId || targetClerkId.startsWith('clerk_')) {
      return false;
    }

    const updated = await client.users.updateUserMetadata(targetClerkId, {
      publicMetadata: {
        role,
        tenantId: tenantId ?? null,
      },
    });

    console.log('✨ [Clerk Sync SUCCESS] Synced publicMetadata to Clerk:', {
      userId: targetClerkId,
      email: email || undefined,
      publicMetadata: updated.publicMetadata,
    });
    return true;
  } catch (error) {
    console.warn(`⚠️ [Clerk Sync Warning] Could not update Clerk publicMetadata:`, error);
    return false;
  }
}
