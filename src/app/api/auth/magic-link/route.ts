import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

const schema = z.object({
  email: z.string().email("Enter a valid email").max(200),
  // Optional post-login destination (e.g. /admin/bookings/MBR-XXX).
  // Sanitised below to local paths only.
  next: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const limited = await checkRateLimit({
    request: req,
    key: "magic-link",
    limit: 3,
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

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    // Auth not configured yet — keep the previous stub behaviour so the
    // /track form keeps "working" in dev without Supabase.
    console.log(
      "[magic-link stub] Would send magic link to",
      parsed.data.email
    );
    return NextResponse.json({ ok: true });
  }

  const origin = new URL(req.url).origin || site.url;
  // Sanitise the next path: only allow local absolute paths beginning
  // with "/" so attackers can't inject an open-redirect destination
  // via the magic-link form.
  const requestedNext = parsed.data.next;
  const safeNext =
    requestedNext && requestedNext.startsWith("/") ? requestedNext : "/track";
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[magic-link] Supabase error:", error.message);
    // Don't leak whether the email exists. Always return ok for the
    // happy-path UI; log details server-side for ops.
  }

  return NextResponse.json({ ok: true });
}
