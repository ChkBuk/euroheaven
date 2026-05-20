import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNewsletterNotification } from "@/lib/integrations";
import { checkRateLimit } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email").max(200),
});

export async function POST(req: Request) {
  const limited = await checkRateLimit({
    request: req,
    key: "newsletter",
    limit: 5,
    windowSec: 60,
  });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    await sendNewsletterNotification(parsed.data.email);
  } catch (err) {
    console.error("[newsletter] email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
