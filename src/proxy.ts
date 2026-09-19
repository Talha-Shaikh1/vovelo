import { clerkMiddleware } from '@clerk/nextjs/server';

// Resource-based authentication: Route checks are handled directly at the layout, page, and API route layer
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always include Clerk proxy matcher
    '/__clerk/:path*',
  ],
};
