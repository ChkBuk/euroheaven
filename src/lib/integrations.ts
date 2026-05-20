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
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !from || !to) {
    throw new Error(
      "Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or RESEND_TO_EMAIL"
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
      attendees: [{ email: b.email, displayName: b.name }],
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
}): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    throw new Error(
      "Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM_NUMBER"
    );
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    To: opts.to,
    From: from,
    Body: opts.body.slice(0, 1500), // Twilio caps at ~1600 chars per segment
  });
  const resp = await fetch(
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
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Twilio ${resp.status}: ${body.slice(0, 300)}`);
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

export async function sendBookingSMS(b: Booking) {
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log("[sms stub] Would SMS", b.phone, "ref", b.reference);
    return;
  }
  try {
    await sendViaTwilio({
      to: toE164(b.phone),
      body: `Hi ${b.name.split(" ")[0]}, your Euro Heaven booking is confirmed. Reference: ${b.reference}. We'll text you with updates. Track at ${siteUrlForLinks()}/track?ref=${b.reference}`,
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
  try {
    const adminUrl = `${siteUrlForLinks()}/admin/bookings/${b.reference}`;
    // Keep under 160 chars so it stays a single segment.
    const body = `New booking ${b.reference}: ${b.year} ${b.model} from ${b.name} (${b.phone}). ${b.date} ${b.timeSlot}. ${adminUrl}`;
    await sendViaTwilio({
      to: toE164(staffPhone),
      body: body.slice(0, 320), // safe upper bound for 2-segment SMS
    });
  } catch (err) {
    console.error("[sms] notifyStaffOfNewBooking failed:", err);
  }
}

export async function sendStatusUpdate(b: Booking) {
  const label = statusLabels[b.status];
  console.log(`[status update] ${b.reference} → ${label}`);

  // Pick the changes worth notifying the customer about — every micro-stage
  // update would be spammy.
  const notifyStatuses: Booking["status"][] = [
    "received",
    "quote-sent",
    "ready-for-pickup",
    "completed",
  ];
  if (!notifyStatuses.includes(b.status)) return;

  if (process.env.TWILIO_AUTH_TOKEN) {
    try {
      await sendViaTwilio({
        to: toE164(b.phone),
        body: `Euro Heaven update — ${b.reference}: ${label}. Track at ${siteUrlForLinks()}/track?ref=${b.reference}`,
      });
    } catch (err) {
      console.error("[sms] sendStatusUpdate failed:", err);
    }
  }
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
