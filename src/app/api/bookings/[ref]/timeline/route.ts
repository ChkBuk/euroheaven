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
 *
 * Auth model — the booking reference acts as a shared secret (same as
 * /api/bookings/[ref], which is already public):
 *   - Anyone with a valid ref sees the booking + the status log + any
 *     customer-visible (public) notes. This is needed so a customer can
 *     hit /track from any device without signing in and still see the
 *     full stage history of their repair.
 *   - Staff additionally see internal-only notes.
 *   - Staff email addresses (changed_by_email / created_by_email) are
 *     stripped for non-staff viewers so we don't leak technician
 *     identities to customers.
 *   - In dev without Supabase, returns everything (in-memory data).
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

  const timeline = await db.listTimeline(ref, { publicOnly: !staff });

  if (!staff) {
    // Strip staff identifiers — customers shouldn't see which
    // technician made each change.
    timeline.statusLog = timeline.statusLog.map((l) => ({
      ...l,
      changedByEmail: null,
    }));
    timeline.notes = timeline.notes.map((n) => ({
      ...n,
      createdByEmail: null,
    }));
  }

  return NextResponse.json({ booking, ...timeline });
}
