import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getOrCreateBootstrapUser } from './data-service';
import { UserAccount, UserRole } from './types';

export interface AuthContext {
  clerkUser: NonNullable<Awaited<ReturnType<typeof currentUser>>>;
  userAccount: UserAccount;
  primaryEmail: string;
}

/**
 * Robust resource-based authorization guard for Next.js Route Handlers and Server Functions.
 * Verifies session and validates user role against allowed list.
 */
export async function requireAuth(
  allowedRoles?: UserRole[]
): Promise<{ errorResponse?: NextResponse; context?: AuthContext }> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return {
        errorResponse: NextResponse.json(
          { success: false, error: 'Unauthorized: Authentication session required.' },
          { status: 401 }
        ),
      };
    }

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';

    const userAccount = await getOrCreateBootstrapUser({
      email: primaryEmail,
      name: fullName,
      clerkId: clerkUser.id,
    });

    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = allowedRoles.includes(userAccount.role);
      if (!hasRole) {
        return {
          errorResponse: NextResponse.json(
            {
              success: false,
              error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] permissions.`,
            },
            { status: 403 }
          ),
        };
      }
    }

    return {
      context: {
        clerkUser,
        userAccount,
        primaryEmail,
      },
    };
  } catch (error) {
    console.error('[Security Guard Error]:', error);
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Internal security authentication check failed.' },
        { status: 500 }
      ),
    };
  }
}
