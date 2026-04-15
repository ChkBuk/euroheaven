import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/store";

const schema = z.object({
  reference: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  comment: z.string().min(3),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const result = db.addRating(
    parsed.data.reference,
    parsed.data.stars,
    parsed.data.comment
  );
  if (!result) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ reviews: db.listReviews() });
}
