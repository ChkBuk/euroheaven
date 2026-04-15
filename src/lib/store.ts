import type { BookingInput } from "./booking";

// In-memory store for local dev. Swap for Supabase in production.
// See README for schema and integration steps.

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
  notes?: string;
  technicianNotes?: { ts: string; text: string }[];
  rating?: { stars: number; comment: string; submittedAt: string };
};

declare global {
  // eslint-disable-next-line no-var
  var __bookings: Map<string, Booking> | undefined;
  // eslint-disable-next-line no-var
  var __reviews: Review[] | undefined;
}

const bookings: Map<string, Booking> =
  global.__bookings ?? (global.__bookings = new Map());

export type Review = {
  id: string;
  name: string;
  car: string;
  stars: number;
  comment: string;
  createdAt: string;
  reference?: string;
};

const reviews: Review[] =
  global.__reviews ??
  (global.__reviews = [
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
      comment: "Great service, a little behind schedule on pickup but communication was excellent throughout.",
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
  ]);

export const db = {
  createBooking(b: Booking) {
    bookings.set(b.reference, b);
    return b;
  },
  getBooking(ref: string) {
    return bookings.get(ref);
  },
  updateStatus(ref: string, status: RepairStatus) {
    const b = bookings.get(ref);
    if (!b) return null;
    b.status = status;
    b.updatedAt = new Date().toISOString();
    return b;
  },
  listBookings() {
    return Array.from(bookings.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  },
  addRating(ref: string, stars: number, comment: string) {
    const b = bookings.get(ref);
    if (!b) return null;
    b.rating = {
      stars,
      comment,
      submittedAt: new Date().toISOString(),
    };
    reviews.unshift({
      id: `r-${Date.now()}`,
      name: b.name.split(" ")[0] + " " + (b.name.split(" ")[1]?.[0] || "") + ".",
      car: `${b.year} ${b.model}`,
      stars,
      comment,
      createdAt: new Date().toISOString().split("T")[0],
      reference: ref,
    });
    return b;
  },
  listReviews() {
    return reviews;
  },
};
