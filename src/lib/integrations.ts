// Stubs and live integrations for outbound email / SMS / calendar.
// Each helper falls back to console.log when its API key is unset, so the
// dev experience and serverless cold-start behaviour stays predictable.

import type { Booking } from "./store";
import { statusLabels } from "./store";
import { dropOffOptions } from "./booking";
import { services } from "./services";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendViaResend(opts: {
  subject: string;
  html: string;
  replyTo?: string;
  /**
   * Optional override for the recipient. When omitted, falls back to the
   * RESEND_TO_EMAIL env var (used for staff-inbox notifications like
   * booking leads, contact forms, newsletter signups). Pass an explicit
   * value when the email is for a specific recipient — e.g. a customer
   * confirmation.
   */
  to?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = opts.to ?? process.env.RESEND_TO_EMAIL;
  if (!apiKey || !from || !to) {
    throw new Error(
      "Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or recipient address"
    );
  }
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Resend ${resp.status}: ${body.slice(0, 300)}`);
  }
}

// ---------------------------------------------------------------------------
// Google Calendar (service-account auth, no SDK).
// ---------------------------------------------------------------------------

type GoogleServiceAccountKey = {
  client_email: string;
  private_key: string;
};

function parseServiceAccountKey(): GoogleServiceAccountKey | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GoogleServiceAccountKey;
    if (!parsed.client_email || !parsed.private_key) return null;
    // Vercel UI sometimes escapes newlines in env vars.
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    return parsed;
  } catch (err) {
    console.error("[calendar] could not parse GOOGLE_SERVICE_ACCOUNT_KEY:", err);
    return null;
  }
}

async function getGoogleAccessToken(
  key: GoogleServiceAccountKey,
  scope: string
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createSign } = require("node:crypto") as typeof import("node:crypto");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: key.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const b64url = (s: string | Buffer) =>
    (typeof s === "string" ? Buffer.from(s) : s)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  const unsigned =
    b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(claim));
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = b64url(signer.sign(key.private_key));
  const jwt = `${unsigned}.${signature}`;

  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!tokenResp.ok) {
    const body = await tokenResp.text().catch(() => "");
    throw new Error(`Google token ${tokenResp.status}: ${body.slice(0, 300)}`);
  }
  const data = (await tokenResp.json()) as { access_token: string };
  return data.access_token;
}

export async function createCalendarEvent(b: Booking) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const key = parseServiceAccountKey();
  if (!calendarId || !key) {
    console.log("[calendar stub] Would create event for", b.reference);
    return { id: `cal-${b.reference}` };
  }
  try {
    const accessToken = await getGoogleAccessToken(
      key,
      "https://www.googleapis.com/auth/calendar.events"
    );

    // Build a 1.5h slot. Booking date format is YYYY-MM-DD, timeSlot HH:MM.
    const start = new Date(`${b.date}T${b.timeSlot}:00+10:00`); // AEST/AEDT
    const end = new Date(start.getTime() + 90 * 60 * 1000);

    const adminUrl = `${siteUrlForLinks()}/admin/bookings/${b.reference}`;

    // Note: service accounts can't invite attendees without Domain-Wide
    // Delegation (a paid Workspace feature). We embed customer contact
    // details in the description instead — the owner sees them at a glance
    // and the customer already receives separate SMS / email confirmations.
    const event = {
      summary: `${b.reference} · ${b.year} ${b.model} — ${b.serviceSlug.replace(/-/g, " ")}`,
      description:
        `Customer: ${b.name} · ${b.phone} · ${b.email}\n` +
        `Vehicle: ${b.year} ${b.model} · ${b.rego} · ${b.odometer} km\n` +
        `Drop-off: ${b.dropOff}\n` +
        `Issue: ${b.description}\n\n` +
        `Manage: ${adminUrl}`,
      start: { dateTime: start.toISOString(), timeZone: "Australia/Melbourne" },
      end: { dateTime: end.toISOString(), timeZone: "Australia/Melbourne" },
    };

    const resp = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      throw new Error(`Calendar ${resp.status}: ${body.slice(0, 300)}`);
    }
    const created = (await resp.json()) as { id: string };
    return { id: created.id };
  } catch (err) {
    console.error("[calendar] createCalendarEvent failed:", err);
    return { id: `cal-${b.reference}` };
  }
}

export async function sendBookingEmail(b: Booking) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email stub] Would email", b.email, "ref", b.reference);
    return;
  }
  const service = services.find((s) => s.slug === b.serviceSlug);
  const serviceLabel = service?.title ?? b.serviceSlug;
  const dropOffLabel =
    dropOffOptions.find((d) => d.value === b.dropOff)?.label ?? b.dropOff;

  const subject = `[Booking ${b.reference}] ${escapeHtml(b.year)} ${escapeHtml(b.model)} — ${escapeHtml(serviceLabel)}`;
  const rows: Array<[string, string]> = [
    ["Reference", b.reference],
    ["Customer", `${b.name} · ${b.phone} · ${b.email}`],
    ["Vehicle", `${b.year} ${b.model} · rego ${b.rego} · ${b.odometer} km`],
    ["Service", serviceLabel],
    ["Requested", `${b.date} at ${b.timeSlot}`],
    ["Drop-off", dropOffLabel],
    ["Symptoms", b.symptoms.length ? b.symptoms.join(", ") : "—"],
    ["Description", b.description],
    ...(b.notes ? ([["Notes", b.notes]] as Array<[string, string]>) : []),
  ];
  const html = `
    <h2 style="margin:0 0 12px">New booking · ${escapeHtml(b.reference)}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="margin-top:16px;color:#666;font-size:12px">Reply to this email to contact the customer directly.</p>
  `;

  try {
    await sendViaResend({ subject, html, replyTo: b.email });
  } catch (err) {
    console.error("[email] sendBookingEmail failed:", err);
  }
}

/**
 * Customer-facing booking confirmation. Sends a branded "Your booking
 * is confirmed" email to the customer's address (b.email). The
 * RESEND_FROM_EMAIL domain must be verified at Resend for this to
 * actually deliver — Resend's test sender (onboarding@resend.dev) will
 * 403 on any recipient other than the account signup email.
 */
export async function sendCustomerBookingConfirmation(b: Booking) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      "[email stub] Would email customer",
      b.email,
      "ref",
      b.reference
    );
    return;
  }
  const service = services.find((s) => s.slug === b.serviceSlug);
  const serviceLabel = service?.title ?? b.serviceSlug;
  const dropOffLabel =
    dropOffOptions.find((d) => d.value === b.dropOff)?.label ?? b.dropOff;
  const trackUrl = `${siteUrlForLinks()}/track?ref=${b.reference}`;

  const subject = `Your Euro Heaven booking is confirmed — ${b.reference}`;
  const firstName = b.name.split(" ")[0] || "there";
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1d23;line-height:1.55">
      <div style="background:#0c131c;padding:22px 28px;border-radius:12px 12px 0 0">
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#fff;letter-spacing:0.5px">EURO HEAVEN</div>
        <div style="font-size:11px;color:#9aa3ad;letter-spacing:2px;text-transform:uppercase;margin-top:2px">European Vehicle Specialists · Melbourne</div>
      </div>
      <div style="background:#fff;padding:32px 28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
        <h1 style="margin:0 0 14px 0;font-size:22px;font-weight:700">Hi ${escapeHtml(firstName)}, your booking is confirmed</h1>
        <p style="margin:0 0 20px 0;color:#4b5563;font-size:15px">
          Thanks for booking with Euro Heaven. We've reserved a slot for your Mercedes — we'll be in touch as soon as the vehicle arrives.
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <tr><td style="padding:6px 0;color:#6b7280;width:120px">Reference</td><td style="padding:6px 0;font-weight:600">${escapeHtml(b.reference)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Vehicle</td><td style="padding:6px 0">${escapeHtml(`${b.year} ${b.model}`)} · ${escapeHtml(b.rego)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Service</td><td style="padding:6px 0">${escapeHtml(serviceLabel)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Appointment</td><td style="padding:6px 0">${escapeHtml(b.date)} at ${escapeHtml(b.timeSlot)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Drop-off</td><td style="padding:6px 0">${escapeHtml(dropOffLabel)}</td></tr>
        </table>

        <div style="margin:24px 0">
          <a href="${trackUrl}" style="display:inline-block;background:#2B6DFF;color:#fff;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none">Track your repair →</a>
        </div>

        <p style="margin:24px 0 0 0;font-size:13px;color:#6b7280">
          Need to change anything? Reply to this email or call us on
          <a href="tel:+61400115765" style="color:#2B6DFF;text-decoration:none">400 115 765</a>.
        </p>
      </div>
      <p style="text-align:center;font-size:11px;color:#9aa3ad;margin:14px 0 0 0">
        Euro Heaven · Dandenong, Victoria · euroheaven.com.au
      </p>
    </div>
  `;

  try {
    await sendViaResend({
      to: b.email,
      subject,
      html,
      // Replies from the customer should land in the workshop inbox.
      replyTo: process.env.RESEND_TO_EMAIL,
    });
  } catch (err) {
    console.error("[email] sendCustomerBookingConfirmation failed:", err);
  }
}

export async function sendContactEmail(payload: {
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email stub] Contact form from", payload.email);
    return;
  }
  const subject = `[Contact] ${payload.subject?.trim() || "New enquiry"}`;
  const html = `
    <h2 style="margin:0 0 12px">New contact enquiry</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:6px 12px 6px 0;color:#666">Name</td><td>${escapeHtml(payload.name)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Phone</td><td>${escapeHtml(payload.phone)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Email</td><td>${escapeHtml(payload.email)}</td></tr>
      ${payload.subject ? `<tr><td style="padding:6px 12px 6px 0;color:#666">Subject</td><td>${escapeHtml(payload.subject)}</td></tr>` : ""}
    </table>
    <h3 style="margin-top:16px">Message</h3>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  `;
  try {
    await sendViaResend({ subject, html, replyTo: payload.email });
  } catch (err) {
    console.error("[email] sendContactEmail failed:", err);
  }
}

export async function sendNewsletterNotification(email: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email stub] Newsletter signup:", email);
    return;
  }
  const subject = "[Newsletter] New subscriber";
  const html = `
    <h2 style="margin:0 0 12px">New newsletter subscriber</h2>
    <p style="font-family:sans-serif;font-size:14px">
      <strong>${escapeHtml(email)}</strong><br/>
      <span style="color:#666;font-size:12px">${new Date().toISOString()}</span>
    </p>
  `;
  try {
    await sendViaResend({ subject, html, replyTo: email });
  } catch (err) {
    console.error("[email] sendNewsletterNotification failed:", err);
  }
}

/**
 * Send an SMS via Twilio's REST API. No SDK install — uses raw fetch with
 * Basic Auth (Account SID + Auth Token). Returns void; throws on hard
 * failure so callers can decide whether to surface the error.
 */
async function sendViaTwilio(opts: {
  to: string;
  body: string;
  /** Identifies the caller in logs — e.g. "customer" or "staff". */
  context?: string;
}): Promise<void> {
  const ctx = opts.context ?? "sms";
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  // Detailed presence check so a missing var is obvious in logs.
  if (!sid || !token || !from) {
    const missing = [
      !sid && "TWILIO_ACCOUNT_SID",
      !token && "TWILIO_AUTH_TOKEN",
      !from && "TWILIO_FROM_NUMBER",
    ]
      .filter(Boolean)
      .join(", ");
    console.error(`[sms:${ctx}] missing env vars: ${missing}`);
    throw new Error(`Missing Twilio env vars: ${missing}`);
  }

  // Sanity-check FROM format — Twilio rejects anything that isn't E.164.
  if (!from.startsWith("+")) {
    console.warn(
      `[sms:${ctx}] TWILIO_FROM_NUMBER ${JSON.stringify(from)} does not start with "+"; Twilio will likely reject. Use E.164 format like "+61480090974".`
    );
  }

  console.log(
    `[sms:${ctx}] sending to=${opts.to} from=${from} sidPrefix=${sid.slice(0, 4)}... bodyLen=${opts.body.length}`
  );

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    To: opts.to,
    From: from,
    Body: opts.body.slice(0, 1500), // Twilio caps at ~1600 chars per segment
  });
  let resp: Response;
  try {
    resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    );
  } catch (netErr) {
    console.error(`[sms:${ctx}] network error reaching Twilio:`, netErr);
    throw netErr;
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.error(
      `[sms:${ctx}] Twilio rejected (${resp.status}):`,
      body.slice(0, 500)
    );
    throw new Error(`Twilio ${resp.status}: ${body.slice(0, 300)}`);
  }

  // Successful submission — log Twilio's SID for the message so it can be
  // looked up in the Twilio Console → Messaging Logs.
  try {
    const data = (await resp.json()) as { sid?: string; status?: string };
    console.log(
      `[sms:${ctx}] Twilio accepted: messageSid=${data.sid} status=${data.status}`
    );
  } catch {
    console.log(`[sms:${ctx}] Twilio accepted (no body to parse)`);
  }
}

/** Normalises whatever the user typed into an E.164 number. AU-biased. */
function toE164(phone: string): string {
  const trimmed = phone.replace(/[^\d+]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("0")) return `+61${trimmed.slice(1)}`;
  if (trimmed.startsWith("61")) return `+${trimmed}`;
  return `+${trimmed}`;
}

/**
 * True when TWILIO_TRIAL_MODE=true. Switches SMS bodies to a minimal
 * transactional form (no URLs, no marketing language, short single
 * segment) to reduce AU-carrier spam filtering on trial-account sends.
 * Trial accounts auto-prepend "Sent from your Twilio trial account - "
 * which combined with URLs/marketing copy triggers error 30007; the
 * minimal body has the best chance of slipping past filters.
 */
function isTrialMode(): boolean {
  return process.env.TWILIO_TRIAL_MODE === "true";
}

export async function sendBookingSMS(b: Booking) {
  console.log(
    `[sms:customer] entry ref=${b.reference} rawPhone=${JSON.stringify(b.phone)} hasAuthToken=${Boolean(process.env.TWILIO_AUTH_TOKEN)} trial=${isTrialMode()}`
  );
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log("[sms stub] Would SMS", b.phone, "ref", b.reference);
    return;
  }
  const normalized = toE164(b.phone);
  console.log(
    `[sms:customer] normalized ${JSON.stringify(b.phone)} -> ${normalized}`
  );
  // Minimal body for trial accounts — no URL, no marketing fluff.
  // Full body for upgraded accounts — includes track link.
  const body = isTrialMode()
    ? `Euro Heaven booking confirmed. Ref ${b.reference}.`
    : `Hi ${b.name.split(" ")[0]}, your Euro Heaven booking is confirmed. Reference: ${b.reference}. We'll text you with updates. Track at ${siteUrlForLinks()}/track?ref=${b.reference}`;
  try {
    await sendViaTwilio({
      context: "customer",
      to: normalized,
      body,
    });
  } catch (err) {
    console.error("[sms] sendBookingSMS failed:", err);
  }
}

/**
 * Alert the workshop owner via SMS when a new booking arrives. Reads the
 * owner's mobile from `STAFF_NOTIFICATION_PHONE`; falls back to console
 * log when unset (so dev / Twilio-disabled deploys keep working).
 *
 * Distinct from `sendBookingSMS` which texts the *customer* their
 * confirmation. This one buzzes the owner's phone so they know to
 * expect a car without checking /admin.
 */
export async function notifyStaffOfNewBooking(b: Booking) {
  const staffPhone = process.env.STAFF_NOTIFICATION_PHONE;
  console.log(
    `[sms:staff] entry ref=${b.reference} hasStaffPhone=${Boolean(staffPhone)} hasAuthToken=${Boolean(process.env.TWILIO_AUTH_TOKEN)}`
  );
  if (!staffPhone) {
    console.log(
      "[sms stub] Would alert staff:",
      b.reference,
      `${b.year} ${b.model}`,
      b.name
    );
    return;
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log("[sms stub] Twilio unset; skip staff alert for", b.reference);
    return;
  }
  const normalized = toE164(staffPhone);
  console.log(
    `[sms:staff] normalized ${JSON.stringify(staffPhone)} -> ${normalized}`
  );
  try {
    // Staff URL always points at the booking detail page. The /admin
    // layout transparently handles auth: if the owner already has an
    // active session, they go straight to the booking; if not, they're
    // redirected through the magic-link login at /track and then bounced
    // back here. Either way, one tap from SMS lands in the right place.
    const adminUrl = `${siteUrlForLinks()}/admin/bookings/${b.reference}`;
    // Trial mode: keep body short but include customer name + phone
    // so the owner has actionable info without opening the URL.
    // Production: full detail with vehicle, date/time, and admin link.
    const body = isTrialMode()
      ? `Euro Heaven booking ${b.reference} from ${b.name} (${b.phone}). ${adminUrl}`.slice(
          0,
          320
        )
      : `New booking ${b.reference}: ${b.year} ${b.model} from ${b.name} (${b.phone}). ${b.date} ${b.timeSlot}. ${adminUrl}`.slice(
          0,
          320
        );
    await sendViaTwilio({
      context: "staff",
      to: normalized,
      body,
    });
  } catch (err) {
    console.error("[sms] notifyStaffOfNewBooking failed:", err);
  }
}

export async function sendStatusUpdate(b: Booking) {
  const label = statusLabels[b.status];
  console.log(`[status update] ${b.reference} → ${label}`);

  // Customer-facing SMS notifications are intentionally disabled — the
  // workshop only contacts customers via email and the /track page they
  // log into. The owner gets a separate SMS via notifyStaffOfNewBooking
  // when the booking is first created; subsequent stage changes are
  // visible at /admin without needing a push notification.
  //
  // If you ever want to re-enable customer "Your car is ready for
  // pickup" SMS, restore the sendViaTwilio call below and gate on a new
  // env var like NOTIFY_CUSTOMER_BY_SMS=true.
}

function siteUrlForLinks(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://euroheaven.com.au"
  );
}

export async function sendRatingRequest(b: Booking) {
  console.log(`[rating request] Would ask ${b.email} for a review of ${b.reference}`);
  // TODO: send email with deep link to /review?ref=...
}
