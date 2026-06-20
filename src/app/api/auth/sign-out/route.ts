import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Signs the user out of Supabase and redirects to the home page.
 * Reached via the "Sign out" form/button in the admin layout.
 */
export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", req.url));
}
