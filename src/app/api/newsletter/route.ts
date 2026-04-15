import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log("[newsletter] subscribe:", email);
  // TODO: integrate with Mailchimp / Resend contacts / Supabase
  return NextResponse.json({ ok: true });
}
