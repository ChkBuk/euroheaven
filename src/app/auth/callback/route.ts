import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * OAuth / magic-link callback — exchanges the `code` query param Supabase
 * appends to the redirect URL for a session cookie, then sends the user
 * on to the final destination. Mirrors the pattern from
 * https://supabase.com/docs/guides/auth/server-side/nextjs.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/track";

  if (!code) {
    return NextResponse.redirect(new URL("/track?auth=missing-code", req.url));
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/track?auth=not-configured", req.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth callback] exchange failed:", error.message);
    return NextResponse.redirect(new URL("/track?auth=failed", req.url));
  }

  // Sanitise `next` to local paths only.
  const safeNext = next.startsWith("/") ? next : "/track";
  return NextResponse.redirect(new URL(safeNext, req.url));
}
