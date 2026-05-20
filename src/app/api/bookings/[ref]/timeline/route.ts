import { NextResponse } from "next/server";
import { db } from "@/lib/store";
import { getSession, isStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ ref: string }>;

const supabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

/**
 * Returns the status log + booking notes for a booking.
 * - Staff see everything (public + internal notes).
 * - The booking's owner (matched by email) sees only public notes.
 * - In dev without Supabase, returns the in-memory data without auth.
 */
export async function GET(
  _req: Request,
  { params }: { params: RouteParams }
) {
  const { ref } = await params;

  const booking = await db.getBooking(ref);
  if (!booking) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Without Supabase, just return everything.
  if (!supabaseConfigured()) {
    const timeline = await db.listTimeline(ref);
    return NextResponse.json({ booking, ...timeline });
  }

  const session = await getSession();
  const staff = session ? await isStaff(session.email) : false;

  // Customer can only view their own booking's timeline.
  const owner =
    !!session &&
    session.email.toLowerCase() === booking.email.toLowerCase();

  if (!staff && !owner) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const timeline = await db.listTimeline(ref, { publicOnly: !staff });
  return NextResponse.json({ booking, ...timeline });
}
