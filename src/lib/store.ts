import type { BookingInput } from "./booking";
import { getSupabaseServiceClient } from "./supabase/service";

// Persistence layer. Backed by Supabase when SUPABASE_SERVICE_ROLE_KEY is
// configured; otherwise falls back to an in-memory map for local dev so
// the app remains usable without a database.

export type RepairStatus =
  | "booked"
  | "received"
  | "diagnosis"
  | "quote-sent"
  | "awaiting-approval"
  | "parts-ordered"
  | "repair-in-progress"
  | "quality-check"
  | "ready-for-pickup"
  | "completed";

export const statusLabels: Record<RepairStatus, string> = {
  booked: "Booked",
  received: "Vehicle Received",
  diagnosis: "Diagnosis in Progress",
  "quote-sent": "Quote Sent",
  "awaiting-approval": "Awaiting Approval",
  "parts-ordered": "Parts Ordered",
  "repair-in-progress": "Repair in Progress",
  "quality-check": "Quality Check",
  "ready-for-pickup": "Ready for Pickup",
  completed: "Completed",
};

export const statusOrder: RepairStatus[] = [
  "booked",
  "received",
  "diagnosis",
  "quote-sent",
  "awaiting-approval",
  "parts-ordered",
  "repair-in-progress",
  "quality-check",
  "ready-for-pickup",
  "completed",
];

export type Booking = BookingInput & {
  reference: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  etaDate?: string;
  technicianNotes?: { ts: string; text: string }[];
  rating?: { stars: number; comment: string; submittedAt: string };
};

export type Review = {
  id: string;
  name: string;
  car: string;
  stars: number;
  comment: string;
  createdAt: string;
  reference?: string;
};

export type BookingNote = {
  id: string;
  bookingRef: string;
  statusAt: string | null;
  body: string;
  visibility: "public" | "internal";
  createdAt: string;
  createdByEmail: string | null;
};

export type StatusLogEntry = {
  id: string;
  bookingRef: string;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
  changedByEmail: string | null;
};

// ---------------------------------------------------------------------------
// In-memory fallback (only used when Supabase env vars are absent).
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __bookings: Map<string, Booking> | undefined;
  // eslint-disable-next-line no-var
  var __reviews: Review[] | undefined;
  // eslint-disable-next-line no-var
  var __statusLog: StatusLogEntry[] | undefined;
  // eslint-disable-next-line no-var
  var __notes: BookingNote[] | undefined;
}

const memBookings: Map<string, Booking> =
  global.__bookings ?? (global.__bookings = new Map());

const memStatusLog: StatusLogEntry[] =
  global.__statusLog ?? (global.__statusLog = []);

const memNotes: BookingNote[] = global.__notes ?? (global.__notes = []);

const seedReviews: Review[] = [
  {
    id: "r1",
    name: "James W.",
    car: "C63 AMG",
    stars: 5,
    comment:
      "Finally found a Mercedes specialist that knows what they're doing. Saved me thousands versus the dealer.",
    createdAt: "2026-03-20",
  },
  {
    id: "r2",
    name: "Priya S.",
    car: "GLC 300",
    stars: 5,
    comment:
      "Booked online in 2 minutes, loved the live repair updates. Courtesy car was a lifesaver.",
    createdAt: "2026-03-28",
  },
  {
    id: "r3",
    name: "Michael T.",
    car: "E350",
    stars: 5,
    comment:
      "Honest, thorough, and genuinely care about the cars. They spotted an issue the dealer missed.",
    createdAt: "2026-04-02",
  },
  {
    id: "r4",
    name: "Sarah L.",
    car: "A250",
    stars: 4,
    comment:
      "Great service, a little behind schedule on pickup but communication was excellent throughout.",
    createdAt: "2026-04-05",
  },
  {
    id: "r5",
    name: "David K.",
    car: "Sprinter 316",
    stars: 5,
    comment:
      "Only place in Melbourne I trust with my Sprinter. Back on the road the next day.",
    createdAt: "2026-04-09",
  },
];
const memReviews: Review[] = global.__reviews ?? (global.__reviews = [...seedReviews]);

// ---------------------------------------------------------------------------
// Mappers between Supabase row shape (snake_case) and TS type (camelCase).
// ---------------------------------------------------------------------------

type BookingRow = {
  reference: string;
  user_id: string | null;
  service_slug: string;
  model: string;
  year: string;
  rego: string;
  odometer: string;
  description: string;
  symptoms: string[];
  date: string;
  time_slot: string;
  drop_off: BookingInput["dropOff"];
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: RepairStatus;
  eta_date: string | null;
  created_at: string;
  updated_at: string;
};

function rowToBooking(r: BookingRow): Booking {
  return {
    reference: r.reference,
    serviceSlug: r.service_slug,
    model: r.model,
    year: r.year,
    rego: r.rego,
    odometer: r.odometer,
    description: r.description,
    symptoms: r.symptoms ?? [],
    date: r.date,
    timeSlot: r.time_slot,
    dropOff: r.drop_off,
    name: r.name,
    phone: r.phone,
    email: r.email,
    notes: r.notes ?? undefined,
    status: r.status,
    etaDate: r.eta_date ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function bookingToRow(b: Booking): Omit<BookingRow, "user_id"> {
  return {
    reference: b.reference,
    service_slug: b.serviceSlug,
    model: b.model,
    year: b.year,
    rego: b.rego,
    odometer: b.odometer,
    description: b.description,
    symptoms: b.symptoms ?? [],
    date: b.date,
    time_slot: b.timeSlot,
    drop_off: b.dropOff,
    name: b.name,
    phone: b.phone,
    email: b.email,
    notes: b.notes ?? null,
    status: b.status,
    eta_date: b.etaDate ?? null,
    created_at: b.createdAt,
    updated_at: b.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// Public API — `db.*`. All async; backends pick themselves at call time.
// ---------------------------------------------------------------------------

export const db = {
  async createBooking(b: Booking): Promise<Booking> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { error } = await sb.from("bookings").insert(bookingToRow(b));
      if (error) {
        console.error("[db] createBooking failed:", error.message);
        throw new Error("Could not save booking");
      }
      await sb.from("booking_status_log").insert({
        booking_ref: b.reference,
        from_status: null,
        to_status: b.status,
      });
      return b;
    }
    memBookings.set(b.reference, b);
    memStatusLog.push({
      id: `s-${Date.now()}`,
      bookingRef: b.reference,
      fromStatus: null,
      toStatus: b.status,
      changedAt: b.createdAt,
      changedByEmail: null,
    });
    return b;
  },

  async getBooking(ref: string): Promise<Booking | undefined> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .eq("reference", ref)
        .maybeSingle();
      if (error) {
        console.error("[db] getBooking failed:", error.message);
        return undefined;
      }
      return data ? rowToBooking(data as BookingRow) : undefined;
    }
    return memBookings.get(ref);
  },

  async updateStatus(
    ref: string,
    status: RepairStatus,
    actorEmail?: string
  ): Promise<Booking | null> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const existing = await db.getBooking(ref);
      if (!existing) return null;
      const { error } = await sb
        .from("bookings")
        .update({ status })
        .eq("reference", ref);
      if (error) {
        console.error("[db] updateStatus failed:", error.message);
        return null;
      }
      await sb.from("booking_status_log").insert({
        booking_ref: ref,
        from_status: existing.status,
        to_status: status,
        changed_by_email: actorEmail ?? null,
      });
      return { ...existing, status, updatedAt: new Date().toISOString() };
    }
    const b = memBookings.get(ref);
    if (!b) return null;
    memStatusLog.push({
      id: `s-${Date.now()}`,
      bookingRef: ref,
      fromStatus: b.status,
      toStatus: status,
      changedAt: new Date().toISOString(),
      changedByEmail: actorEmail ?? null,
    });
    b.status = status;
    b.updatedAt = new Date().toISOString();
    return b;
  },

  async listBookings(): Promise<Booking[]> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[db] listBookings failed:", error.message);
        return [];
      }
      return ((data ?? []) as BookingRow[]).map(rowToBooking);
    }
    return Array.from(memBookings.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  },

  async listBookingsByEmail(email: string): Promise<Booking[]> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { data, error } = await sb
        .from("bookings")
        .select("*")
        .ilike("email", email)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[db] listBookingsByEmail failed:", error.message);
        return [];
      }
      return ((data ?? []) as BookingRow[]).map(rowToBooking);
    }
    return Array.from(memBookings.values())
      .filter((b) => b.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async addRating(
    ref: string,
    stars: number,
    comment: string
  ): Promise<Booking | null> {
    const b = await db.getBooking(ref);
    if (!b) return null;
    const sb = getSupabaseServiceClient();
    const reviewRow = {
      booking_ref: ref,
      name:
        b.name.split(" ")[0] +
        " " +
        (b.name.split(" ")[1]?.[0] ?? "") +
        ".",
      car: `${b.year} ${b.model}`,
      stars,
      comment,
    };
    if (sb) {
      await sb.from("reviews").insert(reviewRow);
    } else {
      memReviews.unshift({
        id: `r-${Date.now()}`,
        ...reviewRow,
        createdAt: new Date().toISOString().split("T")[0],
        reference: ref,
      });
    }
    b.rating = {
      stars,
      comment,
      submittedAt: new Date().toISOString(),
    };
    return b;
  },

  async listReviews(): Promise<Review[]> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { data, error } = await sb
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) {
        console.error("[db] listReviews failed:", error.message);
        return seedReviews;
      }
      const rows = (data ?? []) as Array<{
        id: string;
        booking_ref: string | null;
        name: string;
        car: string | null;
        stars: number;
        comment: string;
        created_at: string;
      }>;
      // Fall back to seed data when the table is empty so the marketing
      // /reviews page never looks bare on a fresh deploy.
      if (rows.length === 0) return seedReviews;
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        car: r.car ?? "",
        stars: r.stars,
        comment: r.comment,
        createdAt: r.created_at.split("T")[0],
        reference: r.booking_ref ?? undefined,
      }));
    }
    return memReviews;
  },

  async addNote(opts: {
    bookingRef: string;
    body: string;
    statusAt?: string;
    visibility?: "public" | "internal";
    createdByEmail?: string;
  }): Promise<BookingNote> {
    const visibility = opts.visibility ?? "public";
    const sb = getSupabaseServiceClient();
    if (sb) {
      const { data, error } = await sb
        .from("booking_notes")
        .insert({
          booking_ref: opts.bookingRef,
          body: opts.body,
          status_at: opts.statusAt ?? null,
          visibility,
          created_by_email: opts.createdByEmail ?? null,
        })
        .select()
        .single();
      if (error || !data) {
        console.error("[db] addNote failed:", error?.message);
        throw new Error("Could not save note");
      }
      return {
        id: data.id,
        bookingRef: data.booking_ref,
        statusAt: data.status_at,
        body: data.body,
        visibility: data.visibility,
        createdAt: data.created_at,
        createdByEmail: data.created_by_email,
      };
    }
    const note: BookingNote = {
      id: `n-${Date.now()}`,
      bookingRef: opts.bookingRef,
      statusAt: opts.statusAt ?? null,
      body: opts.body,
      visibility,
      createdAt: new Date().toISOString(),
      createdByEmail: opts.createdByEmail ?? null,
    };
    memNotes.unshift(note);
    return note;
  },

  async listTimeline(
    ref: string,
    opts: { publicOnly?: boolean } = {}
  ): Promise<{ statusLog: StatusLogEntry[]; notes: BookingNote[] }> {
    const sb = getSupabaseServiceClient();
    if (sb) {
      const [{ data: logs }, notesResp] = await Promise.all([
        sb
          .from("booking_status_log")
          .select("*")
          .eq("booking_ref", ref)
          .order("changed_at", { ascending: true }),
        opts.publicOnly
          ? sb
              .from("booking_notes")
              .select("*")
              .eq("booking_ref", ref)
              .eq("visibility", "public")
              .order("created_at", { ascending: true })
          : sb
              .from("booking_notes")
              .select("*")
              .eq("booking_ref", ref)
              .order("created_at", { ascending: true }),
      ]);
      const notes = notesResp.data ?? [];
      return {
        statusLog: ((logs ?? []) as Array<{
          id: string;
          booking_ref: string;
          from_status: string | null;
          to_status: string;
          changed_at: string;
          changed_by_email: string | null;
        }>).map((l) => ({
          id: l.id,
          bookingRef: l.booking_ref,
          fromStatus: l.from_status,
          toStatus: l.to_status,
          changedAt: l.changed_at,
          changedByEmail: l.changed_by_email,
        })),
        notes: (notes as Array<{
          id: string;
          booking_ref: string;
          status_at: string | null;
          body: string;
          visibility: "public" | "internal";
          created_at: string;
          created_by_email: string | null;
        }>).map((n) => ({
          id: n.id,
          bookingRef: n.booking_ref,
          statusAt: n.status_at,
          body: n.body,
          visibility: n.visibility,
          createdAt: n.created_at,
          createdByEmail: n.created_by_email,
        })),
      };
    }
    return {
      statusLog: memStatusLog
        .filter((l) => l.bookingRef === ref)
        .sort((a, b) => a.changedAt.localeCompare(b.changedAt)),
      notes: memNotes
        .filter(
          (n) =>
            n.bookingRef === ref &&
            (opts.publicOnly ? n.visibility === "public" : true)
        )
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    };
  },
};
