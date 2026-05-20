import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/integrations";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{8,}$/, "Enter a valid phone number")
    .max(40),
  email: z.string().email("Enter a valid email").max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(5, "Message is too short").max(5000),
});

export async function POST(req: Request) {
  const limited = await checkRateLimit({
    request: req,
    key: "contact",
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("[contact] email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
