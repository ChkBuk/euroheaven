"use client";

import { useEffect, useState } from "react";
import {
  statusLabels,
  statusOrder,
  type Booking,
  type BookingNote,
  type RepairStatus,
  type StatusLogEntry,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export default function BookingDetail({
  initialBooking,
  initialStatusLog,
  initialNotes,
}: {
  initialBooking: Booking;
  initialStatusLog: StatusLogEntry[];
  initialNotes: BookingNote[];
}) {
  const [booking, setBooking] = useState(initialBooking);
  const [statusLog, setStatusLog] = useState(initialStatusLog);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [noteVisibility, setNoteVisibility] = useState<"public" | "internal">(
    "public"
  );
  // Holds the stage the user clicked while a confirmation dialog is
  // shown. `null` = no dialog open. Clicking a stage no longer fires
  // the PATCH immediately; the dialog gates it.
  const [pendingStage, setPendingStage] = useState<RepairStatus | null>(null);

  // Dismiss the confirmation dialog with the Escape key.
  useEffect(() => {
    if (!pendingStage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPendingStage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingStage]);

  async function refresh() {
    const r = await fetch(`/api/bookings/${booking.reference}/timeline`, {
      cache: "no-store",
    });
    if (r.ok) {
      const data = await r.json();
      if (data.booking) setBooking(data.booking);
      if (data.statusLog) setStatusLog(data.statusLog);
      if (data.notes) setNotes(data.notes);
    }
  }

  async function updateStage(next: RepairStatus, attachedNote?: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("status update failed");
      const trimmed = (attachedNote || "").trim();
      if (trimmed) {
        await fetch(`/api/bookings/${booking.reference}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: trimmed,
            visibility: noteVisibility,
            statusAt: next,
          }),
        });
      }
      await refresh();
      setNoteBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to update stage. Check console for details.");
    } finally {
      setSaving(false);
    }
  }

  async function addNoteOnly() {
    const trimmed = noteBody.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.reference}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          visibility: noteVisibility,
          statusAt: booking.status,
        }),
      });
      if (!res.ok) throw new Error("note failed");
      await refresh();
      setNoteBody("");
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* Left: details + stage controls */}
      <div className="space-y-8">
        {/* Customer + vehicle */}
        <div className="card-dark">
          <h2 className="font-semibold mb-4">Customer & vehicle</h2>
          <dl className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <Field label="Name" value={booking.name} />
            <Field label="Phone" value={booking.phone} link={`tel:${booking.phone}`} />
            <Field label="Email" value={booking.email} link={`mailto:${booking.email}`} />
            <Field label="Service" value={booking.serviceSlug.replace(/-/g, " ")} />
            <Field label="Vehicle" value={`${booking.year} ${booking.model}`} />
            <Field label="Rego" value={booking.rego} />
            <Field label="Odometer" value={`${booking.odometer} km`} />
            <Field label="Drop-off" value={booking.dropOff} />
            <Field
              label="Appointment"
              value={`${booking.date} at ${booking.timeSlot}`}
            />
            {booking.symptoms?.length > 0 && (
              <Field
                label="Symptoms"
                value={booking.symptoms.join(", ")}
                wide
              />
            )}
            <Field label="Issue" value={booking.description} wide />
            {booking.notes && <Field label="Notes" value={booking.notes} wide />}
          </dl>
        </div>

        {/* Stage update */}
        <div className="card-dark">
          <h2 className="font-semibold mb-2">Update repair stage</h2>
          <p className="text-sm text-white/55 mb-4">
            Click a stage to mark it as the current status. Writing a note
            below first will attach the note to the stage change and (when
            visibility = public) show it on the customer&apos;s tracking page.
          </p>

          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-2">
              Note (optional)
            </label>
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="e.g. Diagnosis complete — needs new front rotors and pads. Quote $1,250 sent."
              rows={3}
              className="w-full bg-ink-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/50 outline-none"
            />
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <label className="text-xs flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  checked={noteVisibility === "public"}
                  onChange={() => setNoteVisibility("public")}
                />
                <span>Visible to customer</span>
              </label>
              <label className="text-xs flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  checked={noteVisibility === "internal"}
                  onChange={() => setNoteVisibility("internal")}
                />
                <span>Internal only</span>
              </label>
              <button
                type="button"
                disabled={!noteBody.trim() || saving}
                onClick={addNoteOnly}
                className="ml-auto btn-outline text-xs px-3 py-1.5 disabled:opacity-50"
              >
                Add note without changing stage
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOrder.map((s) => (
              <button
                key={s}
                disabled={saving || booking.status === s}
                onClick={() => setPendingStage(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs border transition-colors disabled:opacity-50",
                  booking.status === s
                    ? "bg-accent text-white border-accent cursor-default"
                    : "bg-ink-900 border-white/10 text-white/70 hover:border-white/25"
                )}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation dialog for stage updates. Renders only when a
          stage button has been clicked and the change hasn't yet been
          confirmed. Click-outside or Escape dismisses; Confirm fires
          the PATCH (with the optional note attached). */}
      {pendingStage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="stage-confirm-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 backdrop-blur-sm p-4"
          onClick={() => !saving && setPendingStage(null)}
        >
          <div
            className="card-dark max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="stage-confirm-title"
              className="font-semibold text-lg mb-3"
            >
              Update repair stage?
            </h3>
            <p className="text-sm text-white/75 mb-2">
              Change <strong>{booking.reference}</strong> from{" "}
              <strong>{statusLabels[booking.status]}</strong> to{" "}
              <strong>{statusLabels[pendingStage]}</strong>?
            </p>
            {noteBody.trim() && (
              <p className="text-xs text-white/55 mb-2">
                A note will be attached (
                {noteVisibility === "public"
                  ? "visible to customer"
                  : "internal only"}
                ).
              </p>
            )}
            <p className="text-xs text-white/40 mb-5">
              The customer&apos;s tracking page updates within a few seconds.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPendingStage(null)}
                disabled={saving}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  const next = pendingStage;
                  setPendingStage(null);
                  await updateStage(next, noteBody);
                }}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {saving ? "Updating…" : "Update stage"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right: timeline */}
      <aside className="space-y-3">
        <h2 className="font-semibold">Activity</h2>
        <ol className="relative border-l border-white/10 pl-5 space-y-5">
          {mergeTimeline(statusLog, notes).map((item, i) => (
            <li key={item.id ?? i} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-ink-950",
                  item.kind === "status" ? "bg-accent" : "bg-white/55"
                )}
              />
              <div className="text-[11px] uppercase tracking-wider text-white/40">
                {new Date(item.at).toLocaleString("en-AU", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {item.kind === "status" ? (
                <div className="text-sm text-white">
                  Stage →{" "}
                  <strong>
                    {statusLabels[item.toStatus as RepairStatus] ||
                      item.toStatus}
                  </strong>
                  {item.actor && (
                    <span className="text-white/50 text-xs"> · {item.actor}</span>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-sm text-white/85 whitespace-pre-wrap">
                    {item.body}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">
                    {item.visibility === "public" ? "Customer-visible" : "Internal"}
                    {item.actor ? ` · ${item.actor}` : ""}
                  </div>
                </div>
              )}
            </li>
          ))}
          {statusLog.length === 0 && notes.length === 0 && (
            <li className="text-sm text-white/45 -ml-5">No activity yet.</li>
          )}
        </ol>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  link,
  wide,
}: {
  label: string;
  value: string;
  link?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </dt>
      <dd className="text-sm text-white/85 break-words">
        {link ? (
          <a href={link} className="hover:text-accent">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

type TimelineItem =
  | {
      kind: "status";
      id: string;
      at: string;
      toStatus: string;
      actor?: string | null;
    }
  | {
      kind: "note";
      id: string;
      at: string;
      body: string;
      visibility: "public" | "internal";
      actor?: string | null;
    };

function mergeTimeline(
  log: StatusLogEntry[],
  notes: BookingNote[]
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...log.map<TimelineItem>((l) => ({
      kind: "status",
      id: l.id,
      at: l.changedAt,
      toStatus: l.toStatus,
      actor: l.changedByEmail,
    })),
    ...notes.map<TimelineItem>((n) => ({
      kind: "note",
      id: n.id,
      at: n.createdAt,
      body: n.body,
      visibility: n.visibility,
      actor: n.createdByEmail,
    })),
  ];
  // Newest first.
  items.sort((a, b) => b.at.localeCompare(a.at));
  return items;
}
