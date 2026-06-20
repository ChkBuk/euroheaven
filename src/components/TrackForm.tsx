"use client";

import { useEffect, useState } from "react";
import { Check, Circle, Clock, Loader2, Mail, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  statusLabels,
  statusOrder,
  type Booking,
  type BookingNote,
  type StatusLogEntry,
} from "@/lib/store";
import RatingForm from "@/components/RatingForm";

export default function TrackForm({ initialRef }: { initialRef?: string }) {
  const [ref, setRef] = useState(initialRef || "");
  const [rego, setRego] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([]);
  const [notes, setNotes] = useState<BookingNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    if (initialRef) lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  // Refetch the timeline every 5 seconds while a booking is displayed
  // (simulates realtime — replace with Supabase Realtime subscription when
  // we wire that up in a later phase).
  useEffect(() => {
    if (!booking) return;
    const fetchTimeline = async () => {
      const res = await fetch(
        `/api/bookings/${booking.reference}/timeline`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.booking) setBooking(data.booking);
        if (data.statusLog) setStatusLog(data.statusLog);
        if (data.notes) setNotes(data.notes);
      }
    };
    const id = setInterval(fetchTimeline, 5000);
    return () => clearInterval(id);
  }, [booking?.reference]);

  async function lookup(refOverride?: string) {
    const r = (refOverride || ref).trim();
    if (!r) return;
    setLoading(true);
    setError(null);
    // Try the timeline endpoint first — it returns booking + status log
    // + public notes in one round-trip.
    const tlRes = await fetch(`/api/bookings/${r}/timeline`, {
      cache: "no-store",
    });
    if (tlRes.ok) {
      const data = await tlRes.json();
      setBooking(data.booking);
      setStatusLog(data.statusLog ?? []);
      setNotes(data.notes ?? []);
      setLoading(false);
      return;
    }
    // Fallback for older deployments / 403 (not signed in): fetch booking only.
    const res = await fetch(`/api/bookings/${r}`);
    setLoading(false);
    if (!res.ok) {
      setError("We couldn't find that booking. Check your reference.");
      setBooking(null);
      setStatusLog([]);
      setNotes([]);
      return;
    }
    const data = await res.json();
    setBooking(data.booking);
    setStatusLog([]);
    setNotes([]);
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

      {booking && (
        <StatusTimeline booking={booking} statusLog={statusLog} notes={notes} />
      )}

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

function StatusTimeline({
  booking,
  statusLog,
  notes,
}: {
  booking: Booking;
  statusLog: StatusLogEntry[];
  notes: BookingNote[];
}) {
  const currentIdx = statusOrder.indexOf(booking.status);
  // Stages staff actually moved the booking through (every toStatus in
  // the audit log, plus the initial Booked state which may or may not
  // be logged depending on how the booking was created). We mark a
  // stage "done" only if it appears in this set — stages between
  // Booked and the current stage that staff skipped (e.g. a quick
  // service where Diagnosis/Quote/Parts didn't apply) render as
  // "skipped" rather than falsely showing a green tick.
  const visitedStages = new Set<string>(statusLog.map((l) => l.toStatus));
  visitedStages.add("booked");
  visitedStages.add(booking.status);
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
          const active = s === booking.status;
          const visited = visitedStages.has(s);
          const done = visited && !active;
          // "Skipped" — passed over by staff between Booked and the
          // current stage. Shown as a dash so customers can see the
          // step was deliberately bypassed, not still pending.
          const skipped = !visited && idx < currentIdx;
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-4 p-3 transition-colors",
                active && "bg-accent/5 border-l-4 border-accent",
                done && "opacity-70",
                skipped && "opacity-40"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full grid place-items-center flex-shrink-0",
                  done && "bg-brand-success text-white",
                  active && "bg-accent text-white animate-pulse",
                  skipped && "bg-ink-800 text-white/30 border border-dashed border-white/15",
                  !done && !active && !skipped && "bg-ink-800 text-white/40"
                )}
              >
                {done ? (
                  <Check className="w-4 h-4" />
                ) : active ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : skipped ? (
                  <Minus className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "font-medium",
                    active ? "text-white" : "text-white/70",
                    skipped && "line-through text-white/40"
                  )}
                >
                  {statusLabels[s]}
                </div>
                {skipped && (
                  <div className="text-xs text-white/40 mt-0.5">Skipped</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {(notes.length > 0 || statusLog.length > 0) && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-semibold text-white mb-3">Activity</h3>
          <ol className="space-y-3 text-sm">
            {(() => {
              type Entry = { ts: string; text: string };
              const entries: Entry[] = [
                ...statusLog.map<Entry>((l) => ({
                  ts: l.changedAt,
                  text: `Stage updated to ${
                    statusLabels[l.toStatus as keyof typeof statusLabels] ||
                    l.toStatus
                  }`,
                })),
                ...notes.map<Entry>((n) => ({
                  ts: n.createdAt,
                  text: n.body,
                })),
              ];
              return entries
                .sort((a, b) => b.ts.localeCompare(a.ts))
                .slice(0, 12)
                .map((entry, i) => (
                  <li key={i} className="text-white/80">
                    <span className="text-white/50 mr-2 text-xs">
                      {new Date(entry.ts).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {entry.text}
                  </li>
                ));
            })()}
          </ol>
        </div>
      )}
    </div>
  );
}
