"use client";

import { useEffect, useState } from "react";
import { Check, Circle, Clock, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusLabels, statusOrder, type Booking } from "@/lib/store";
import RatingForm from "@/components/RatingForm";

export default function TrackForm({ initialRef }: { initialRef?: string }) {
  const [ref, setRef] = useState(initialRef || "");
  const [rego, setRego] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    if (initialRef) lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  // Poll every 5 seconds while a booking is displayed (simulates realtime)
  useEffect(() => {
    if (!booking) return;
    const id = setInterval(async () => {
      const res = await fetch(`/api/bookings/${booking.reference}`);
      if (res.ok) {
        const data = await res.json();
        if (data.booking) setBooking(data.booking);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [booking?.reference]);

  async function lookup(refOverride?: string) {
    const r = (refOverride || ref).trim();
    if (!r) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/bookings/${r}`);
    setLoading(false);
    if (!res.ok) {
      setError("We couldn't find that booking. Check your reference.");
      setBooking(null);
      return;
    }
    const data = await res.json();
    setBooking(data.booking);
  }

  async function sendMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email") }),
    });
    setMagicSent(true);
  }

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="heading-3 mb-2">Look up by reference</h2>
        <p className="text-sm text-white/60 mb-5">
          Find your booking reference in the confirmation email (e.g.
          MBR-2026-1234).
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="MBR-2026-1234"
            className="field-input font-mono uppercase"
          />
          <input
            value={rego}
            onChange={(e) => setRego(e.target.value.toUpperCase())}
            placeholder="Rego or email"
            className="field-input uppercase"
          />
        </div>
        <button
          onClick={() => lookup()}
          disabled={loading}
          className="btn-primary w-full sm:w-auto mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Looking up...
            </>
          ) : (
            "Track My Repair"
          )}
        </button>
        {error && <p className="text-accent text-sm mt-3">{error}</p>}
      </div>

      {booking && <StatusTimeline booking={booking} />}

      {booking?.status === "completed" && !booking.rating && (
        <div className="card">
          <h2 className="heading-3 mb-2">How was your experience?</h2>
          <p className="text-sm text-white/60 mb-5">
            Your feedback helps us keep standards high.
          </p>
          <RatingForm reference={booking.reference} />
        </div>
      )}

      <div className="card bg-ink-800">
        <div className="flex items-start gap-3 mb-4">
          <Mail className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white">
              Returning customer? Magic-link login
            </h3>
            <p className="text-sm text-white/70">
              Get a one-time link to see your full booking history.
            </p>
          </div>
        </div>
        {magicSent ? (
          <div className="text-sm text-brand-success flex items-center gap-2">
            <Check className="w-4 h-4" /> Check your inbox for the login link.
          </div>
        ) : (
          <form onSubmit={sendMagicLink} className="flex flex-col sm:flex-row gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="field-input flex-1"
            />
            <button type="submit" className="btn-outline">
              Send Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function StatusTimeline({ booking }: { booking: Booking }) {
  const currentIdx = statusOrder.indexOf(booking.status);
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/60">
            Booking
          </div>
          <div className="font-display text-xl font-bold text-white">
            {booking.reference}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {booking.year} {booking.model} · {booking.rego}
          </div>
        </div>
        {booking.etaDate && (
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-white/60">
              Estimated ready
            </div>
            <div className="flex items-center gap-1 font-semibold text-white">
              <Clock className="w-4 h-4" />{" "}
              {new Date(booking.etaDate).toLocaleDateString("en-AU", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        )}
      </div>

      <ol className="space-y-3">
        {statusOrder.map((s, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-4 p-3 transition-colors",
                active && "bg-accent/5 border-l-4 border-accent",
                done && "opacity-70"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full grid place-items-center flex-shrink-0",
                  done && "bg-brand-success text-white",
                  active && "bg-accent text-white animate-pulse",
                  !done && !active && "bg-ink-800 text-white/40"
                )}
              >
                {done ? (
                  <Check className="w-4 h-4" />
                ) : active ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "font-medium",
                    active ? "text-white" : "text-white/70"
                  )}
                >
                  {statusLabels[s]}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {booking.technicianNotes && booking.technicianNotes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-semibold text-white mb-3">
            Technician notes
          </h3>
          <ul className="space-y-2 text-sm">
            {booking.technicianNotes.map((n, i) => (
              <li key={i} className="text-white/80">
                <span className="text-white/50 mr-2">
                  {new Date(n.ts).toLocaleString("en-AU")}
                </span>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
