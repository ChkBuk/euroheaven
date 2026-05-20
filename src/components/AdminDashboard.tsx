"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, ArrowUpRight } from "lucide-react";
import { statusLabels, statusOrder, type Booking, type RepairStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/bookings", { cache: "no-store" });
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(ref: string, status: RepairStatus) {
    await fetch(`/api/bookings/${ref}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  if (loading)
    return (
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
      </div>
    );

  if (bookings.length === 0) {
    return (
      <div className="card text-center py-16">
        <p className="text-white/60 mb-4">
          No bookings yet. Create a test booking from{" "}
          <a href="/book" className="text-accent underline">
            /book
          </a>
          .
        </p>
        <button onClick={load} className="btn-outline">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-white/60">
          {bookings.length} booking{bookings.length === 1 ? "" : "s"}
        </div>
        <button onClick={load} className="btn-ghost text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.reference} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="font-display text-xl font-bold text-white">
                  {b.reference}
                </div>
                <div className="text-sm text-white/60">
                  {b.name} · {b.phone} · {b.email}
                </div>
                <div className="text-sm mt-1">
                  <strong>{b.year} {b.model}</strong> · {b.rego} · {b.odometer}km
                </div>
                <div className="text-sm text-white/60 mt-1">
                  Service: {b.serviceSlug.replace(/-/g, " ")}
                </div>
                <div className="text-sm text-white/60">
                  Appointment:{" "}
                  {new Date(b.date).toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  at {b.timeSlot}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    b.status === "completed"
                      ? "bg-brand-success/15 text-brand-success"
                      : "bg-accent/15 text-accent"
                  )}
                >
                  {statusLabels[b.status]}
                </span>
                <Link
                  href={`/admin/bookings/${b.reference}`}
                  className="inline-flex items-center gap-1 text-xs text-white/65 hover:text-accent"
                >
                  Manage <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="text-sm text-white/70 mb-3">
              <strong>Issue:</strong> {b.description}
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOrder.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(b.reference, s)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-colors",
                    b.status === s
                      ? "bg-accent text-white border-accent"
                      : "bg-ink-900 border-white/10 text-white/70 hover:border-white/25"
                  )}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>

            {b.rating && (
              <div className="mt-4 pt-4 border-t border-white/10 text-sm">
                <strong>Rating:</strong> {b.rating.stars}★ —{" "}
                <em>{b.rating.comment}</em>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
