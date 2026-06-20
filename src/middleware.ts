import { NextResponse, type NextRequest } from "next/server";

/**
 * Lightweight middleware that injects the current request pathname
 * into the request headers as `x-pathname`. Server components (e.g.
 * the admin layout) read this so they can capture the exact URL the
 * user was trying to reach and use it as the post-login redirect
 * destination.
 *
 * Without this, server components can only see the URL via
 * `next/navigation`'s `usePathname()` which is client-only.
 */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Run on all routes except static assets, _next internals, and the
// API routes (they don't need pathname injection).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|api/).*)"],
};
