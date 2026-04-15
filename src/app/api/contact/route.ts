import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[contact] message received:", body);
  // TODO: forward to email via Resend
  return NextResponse.json({ ok: true });
}
