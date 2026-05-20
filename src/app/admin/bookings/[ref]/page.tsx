import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { db, statusLabels } from "@/lib/store";
import BookingDetail from "@/components/admin/BookingDetail";

export const metadata: Metadata = {
  title: "Booking detail",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type RouteParams = Promise<{ ref: string }>;

export default async function AdminBookingDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { ref } = await params;
  const booking = await db.getBooking(ref);
  if (!booking) notFound();

  const timeline = await db.listTimeline(ref);

  return (
    <>
      <section className="bg-ink-900 border-b border-white/5">
        <div className="container py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> All bookings
          </Link>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="heading-3 text-white">Booking {booking.reference}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
              {statusLabels[booking.status]}
            </span>
          </div>
          <p className="text-white/55 text-sm mt-1">
            {booking.year} {booking.model} · {booking.name}
          </p>
        </div>
      </section>
      <section className="section bg-ink-950">
        <div className="container">
          <BookingDetail
            initialBooking={booking}
            initialStatusLog={timeline.statusLog}
            initialNotes={timeline.notes}
          />
        </div>
      </section>
    </>
  );
}
