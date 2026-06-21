import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { isStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(200),
  password: z.string().min(1, "Enter your password").max(200),
  // Optional post-login destination — sanitised to local paths only.
  next: z.string().max(500).optional(),
});

/**
 * Password-based staff login. Replaces the magic-link flow for the
 * `/staff/login` page so technicians can sign in instantly without an
 * email round-trip. Customer magic-link sign-in at `/track` is
 * unchanged.
 *
 * Flow:
 *   1. Rate-limit (5 attempts / 5 minutes / IP).
 *   2. Validate payload.
 *   3. Supabase `signInWithPassword` — sets the session cookies via the
 *      SSR client's cookie writer.
 *   4. Verify the signed-in email is in the `staff_emails` allowlist.
 *      If not, sign the session back out so a customer who happens to
 *      have a Supabase account can't reach `/admin`.
 *   5. Return the post-login destination so the client can navigate.
 *
 * Session lifetime is whatever Supabase Auth is configured for
 * (default: 1h access token + 7-day refresh, auto-rotated). Comfortably
 * covers "at least one day" — no change needed in code.
 */
export async function POST(req: Request) {
  const limited = await checkRateLimit({
    request: req,
    key: "staff-login",
    limit: 5,
    windowSec: 300,
  });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const sb = await getSupabaseServerClient();
  if (!sb) {
    return NextResponse.json(
      { error: "auth_not_configured" },
      { status: 500 }
    );
  }

  const { error } = await sb.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    // Generic message — don't disclose whether the email exists.
    return NextResponse.json(
      { error: "invalid_credentials" },
      { status: 401 }
    );
  }

  if (!(await isStaff(parsed.data.email))) {
    // Authenticated user is not a staff member. Sign them out
    // immediately so they don't keep a session against /admin.
    await sb.auth.signOut();
    return NextResponse.json({ error: "not_staff" }, { status: 403 });
  }

  // Sanitise the next-path to a local URL so a malicious form can't
  // redirect off-site after a successful login.
  const next =
    parsed.data.next && parsed.data.next.startsWith("/")
      ? parsed.data.next
      : "/admin";

  return NextResponse.json({ ok: true, redirectTo: next });
}
