import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/booking";
import { db } from "@/lib/store";
import { generateBookingReference } from "@/lib/utils";
import { getStaffSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createCalendarEvent,
  sendBookingEmail,
  sendCustomerBookingConfirmation,
  sendBookingSMS,
  notifyStaffOfNewBooking,
} from "@/lib/integrations";

export async function POST(req: Request) {
  const limited = await checkRateLimit({
    request: req,
    key: "booking",
    limit: 5,
    windowSec: 60,
  });
  if (limited) return limited;

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const now = new Date().toISOString();
  let booking;
  try {
    booking = await db.createBooking({
      ...parsed.data,
      reference: generateBookingReference(),
      status: "booked",
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    console.error("[bookings] persist failed:", err);
    return NextResponse.json(
      { error: "Could not save booking" },
      { status: 500 }
    );
  }

  await Promise.all([
    createCalendarEvent(booking),
    sendBookingEmail(booking),
    sendCustomerBookingConfirmation(booking),
    sendBookingSMS(booking),
    notifyStaffOfNewBooking(booking),
  ]);

  return NextResponse.json({
    reference: booking.reference,
    status: booking.status,
  });
}

export async function GET() {
  // Only gate when Supabase is wired — local dev without auth still works.
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (supabaseConfigured) {
    const staff = await getStaffSession();
    if (!staff) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }
  return NextResponse.json({ bookings: await db.listBookings() });
}
