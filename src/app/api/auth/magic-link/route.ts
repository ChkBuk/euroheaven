import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  // TODO: integrate Supabase Auth signInWithOtp
  // const supabase = createClient(...);
  // await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/account` } });
  console.log("[magic-link stub] Would send magic link to", email);
  return NextResponse.json({ ok: true });
}
