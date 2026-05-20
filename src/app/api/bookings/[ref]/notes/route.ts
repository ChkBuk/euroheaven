import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/store";
import { getStaffSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ ref: string }>;

const noteSchema = z.object({
  body: z.string().min(2).max(2000),
  visibility: z.enum(["public", "internal"]).default("public"),
  statusAt: z.string().optional(),
});

const supabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

export async function POST(req: Request, { params }: { params: RouteParams }) {
  let actorEmail: string | undefined;
  if (supabaseConfigured()) {
    const staff = await getStaffSession();
    if (!staff) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    actorEmail = staff.email;
  }

  const { ref } = await params;
  const booking = await db.getBooking(ref);
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const note = await db.addNote({
      bookingRef: ref,
      body: parsed.data.body,
      visibility: parsed.data.visibility,
      statusAt: parsed.data.statusAt ?? booking.status,
      createdByEmail: actorEmail,
    });
    return NextResponse.json({ note });
  } catch (err) {
    console.error("[notes] addNote failed:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
