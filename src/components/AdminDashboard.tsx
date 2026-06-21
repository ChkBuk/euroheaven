"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, ArrowUpRight, Search, X } from "lucide-react";
import { statusLabels, statusOrder, type Booking, type RepairStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

type DateFilter = "all" | "today" | "week" | "month" | "custom";
type SortBy =
  | "created_desc"
  | "created_asc"
  | "appointment_asc"
  | "appointment_desc"
  | "status";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter / sort state. All client-side — the bookings list is small
  // enough (typical workshop: dozens, not thousands) that there's no
  // benefit to pushing this into a server query.
  const [searchQ, setSearchQ] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_desc");

  // Stage-change confirmation. Same gating pattern as BookingDetail —
  // clicking a stage pill stores the intended change here; the PATCH
  // only fires after the staff member confirms via the dialog. Prevents
  // accidental mass-stage-changes when scrolling through the list view
  // and tapping a pill by mistake.
  const [pendingChange, setPendingChange] = useState<{
    ref: string;
    currentStatus: RepairStatus;
    nextStatus: RepairStatus;
  } | null>(null);
  const [saving, setSaving] = useState(false);

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

  // Dismiss the confirmation dialog with the Escape key.
  useEffect(() => {
    if (!pendingChange) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) setPendingChange(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingChange, saving]);

  async function updateStatus(ref: string, status: RepairStatus) {
    setSaving(true);
    try {
      await fetch(`/api/bookings/${ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Search by booking reference or vehicle rego (case-insensitive
    // substring). Both fields are short so contains is fine.
    const q = searchQ.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.reference.toLowerCase().includes(q) ||
          b.rego.toLowerCase().includes(q)
      );
    }

    // Date filtering against the booking creation time (b.createdAt).
    // Filtering by appointment date was misleading — admins ask "what
    // bookings came in today" more often than "whose car is scheduled
    // today", and this matches the dropdown labels' implied meaning.
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let from: Date | null = null;
      let to: Date | null = null;

      if (dateFilter === "today") {
        from = today;
        to = new Date(today);
        to.setHours(23, 59, 59, 999);
      } else if (dateFilter === "week") {
        // Mon..Sun window containing today.
        const dow = today.getDay(); // 0=Sun … 6=Sat
        const mondayOffset = dow === 0 ? -6 : 1 - dow;
        from = new Date(today);
        from.setDate(today.getDate() + mondayOffset);
        to = new Date(from);
        to.setDate(from.getDate() + 6);
        to.setHours(23, 59, 59, 999);
      } else if (dateFilter === "month") {
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
      } else if (dateFilter === "custom") {
        from = customFrom ? new Date(customFrom) : null;
        to = customTo ? new Date(customTo) : null;
        if (to) to.setHours(23, 59, 59, 999);
      }

      if (from || to) {
        result = result.filter((b) => {
          const d = new Date(b.createdAt);
          if (from && d < from) return false;
          if (to && d > to) return false;
          return true;
        });
      }
    }

    // Sort — copy first so we don't mutate the source array.
    // "Newest first" now means newest booking *submission* (createdAt),
    // which matches the admin's mental model. Appointment-date sorts
    // are kept as explicit "Soonest / Furthest appointment" options for
    // anyone scheduling their day around upcoming jobs.
    result = [...result];
    switch (sortBy) {
      case "created_desc":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "created_asc":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "appointment_asc":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "appointment_desc":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "status":
        result.sort(
          (a, b) =>
            statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );
        break;
    }

    return result;
  }, [bookings, searchQ, dateFilter, customFrom, customTo, sortBy]);

  const filtersActive =
    searchQ.trim().length > 0 ||
    dateFilter !== "all" ||
    sortBy !== "created_desc";

  function clearFilters() {
    setSearchQ("");
    setDateFilter("all");
    setCustomFrom("");
    setCustomTo("");
    setSortBy("created_desc");
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
      {/* Filter + sort toolbar */}
      <div className="card-dark p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="search"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search booking # or rego…"
              className="field-input pl-9 w-full"
              aria-label="Search bookings"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="field-input md:col-span-3"
            aria-label="Filter by date"
          >
            <option value="all">All bookings</option>
            <option value="today">Booked today</option>
            <option value="week">Booked this week</option>
            <option value="month">Booked this month</option>
            <option value="custom">Custom range…</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="field-input md:col-span-4"
            aria-label="Sort bookings"
          >
            <option value="created_desc">Sort: Newest booking first</option>
            <option value="created_asc">Sort: Oldest booking first</option>
            <option value="appointment_asc">
              Sort: Soonest appointment first
            </option>
            <option value="appointment_desc">
              Sort: Furthest appointment first
            </option>
            <option value="status">Sort: Stage</option>
          </select>
        </div>
        {dateFilter === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-white/55 flex flex-col gap-1">
              From
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="field-input"
              />
            </label>
            <label className="text-xs text-white/55 flex flex-col gap-1">
              To
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="field-input"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-white/60">
          {filteredBookings.length === bookings.length
            ? `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`
            : `${filteredBookings.length} of ${bookings.length} booking${bookings.length === 1 ? "" : "s"}`}
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-3 inline-flex items-center gap-1 text-xs text-white/55 hover:text-accent"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
        <button onClick={load} className="btn-ghost text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-white/60 mb-4">
            No bookings match the current filters.
          </p>
          <button onClick={clearFilters} className="btn-outline">
            <X className="w-4 h-4" /> Clear filters
          </button>
        </div>
      ) : (
      <div className="space-y-3">
        {filteredBookings.map((b) => (
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
                  disabled={saving || b.status === s}
                  onClick={() =>
                    setPendingChange({
                      ref: b.reference,
                      currentStatus: b.status,
                      nextStatus: s,
                    })
                  }
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-colors disabled:opacity-50",
                    b.status === s
                      ? "bg-accent text-white border-accent cursor-default"
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
      )}

      {/* Confirmation dialog — gates every stage change initiated from
          the list view. Same UX as BookingDetail's dialog so the two
          places staff can update a stage behave identically. */}
      {pendingChange && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-stage-confirm-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 backdrop-blur-sm p-4"
          onClick={() => !saving && setPendingChange(null)}
        >
          <div
            className="card-dark max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="admin-stage-confirm-title"
              className="font-semibold text-lg mb-3"
            >
              Update repair stage?
            </h3>
            <p className="text-sm text-white/75 mb-2">
              Change <strong>{pendingChange.ref}</strong> from{" "}
              <strong>{statusLabels[pendingChange.currentStatus]}</strong> to{" "}
              <strong>{statusLabels[pendingChange.nextStatus]}</strong>?
            </p>
            <p className="text-xs text-white/40 mb-5">
              The customer&apos;s tracking page updates within a few seconds,
              and a customer SMS will be sent if Twilio is configured.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPendingChange(null)}
                disabled={saving}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  const change = pendingChange;
                  setPendingChange(null);
                  await updateStatus(change.ref, change.nextStatus);
                }}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {saving ? "Updating…" : "Update stage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
