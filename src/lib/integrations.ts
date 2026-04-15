// Stubs for external integrations. Wire up real credentials in production.

import type { Booking } from "./store";
import { statusLabels } from "./store";

export async function createCalendarEvent(b: Booking) {
  if (!process.env.GOOGLE_CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log("[calendar stub] Would create event for", b.reference);
    return { id: `cal-${b.reference}` };
  }
  // TODO: implement Google Calendar API call
  // import { google } from "googleapis";
  // const auth = new google.auth.JWT({ email: ..., key: ..., scopes: [...] });
  // const calendar = google.calendar({ version: "v3", auth });
  // await calendar.events.insert({ calendarId: process.env.GOOGLE_CALENDAR_ID, requestBody: { ... } });
  return { id: `cal-${b.reference}` };
}

export async function sendBookingEmail(b: Booking) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email stub] Would email", b.email, "ref", b.reference);
    return;
  }
  // TODO: implement Resend API
  // const { Resend } = await import("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from, to: b.email, subject, html });
}

export async function sendBookingSMS(b: Booking) {
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log("[sms stub] Would SMS", b.phone, "ref", b.reference);
    return;
  }
  // TODO: implement Twilio
}

export async function sendStatusUpdate(b: Booking) {
  const label = statusLabels[b.status];
  console.log(`[status update] ${b.reference} → ${label}`);
  // TODO: send email + SMS
}

export async function sendRatingRequest(b: Booking) {
  console.log(`[rating request] Would ask ${b.email} for a review of ${b.reference}`);
  // TODO: send email with deep link to /review?ref=...
}
