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

// Diagnostic helper — logs which integration env vars are present at the
// start of each booking POST. Never logs the actual values, just whether
// each one is set. Makes it trivial to spot "missing env var on Vercel"
// problems from the function logs without guessing.
function logIntegrationPresence() {
  const presence: Record<string, boolean> = {
    TWILIO_ACCOUNT_SID: Boolean(process.env.TWILIO_ACCOUNT_SID),
    TWILIO_AUTH_TOKEN: Boolean(process.env.TWILIO_AUTH_TOKEN),
    TWILIO_FROM_NUMBER: Boolean(process.env.TWILIO_FROM_NUMBER),
    STAFF_NOTIFICATION_PHONE: Boolean(process.env.STAFF_NOTIFICATION_PHONE),
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    RESEND_FROM_EMAIL: Boolean(process.env.RESEND_FROM_EMAIL),
    RESEND_TO_EMAIL: Boolean(process.env.RESEND_TO_EMAIL),
    GOOGLE_CALENDAR_ID: Boolean(process.env.GOOGLE_CALENDAR_ID),
    GOOGLE_SERVICE_ACCOUNT_KEY: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  };
  console.log(
    "[bookings] integrations presence:",
    Object.entries(presence)
      .map(([k, v]) => `${k}=${v ? "✓" : "✗"}`)
      .join(" "),
  );
}

export async function POST(req: Request) {
  logIntegrationPresence();

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
