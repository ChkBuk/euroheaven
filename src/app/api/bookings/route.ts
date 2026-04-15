import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/booking";
import { db } from "@/lib/store";
import { generateBookingReference } from "@/lib/utils";
import {
  createCalendarEvent,
  sendBookingEmail,
  sendBookingSMS,
} from "@/lib/integrations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const now = new Date().toISOString();
  const booking = db.createBooking({
    ...parsed.data,
    reference: generateBookingReference(),
    status: "booked",
    createdAt: now,
    updatedAt: now,
  });

  await Promise.all([
    createCalendarEvent(booking),
    sendBookingEmail(booking),
    sendBookingSMS(booking),
  ]);

  return NextResponse.json({
    reference: booking.reference,
    status: booking.status,
  });
}

export async function GET() {
  return NextResponse.json({ bookings: db.listBookings() });
}
