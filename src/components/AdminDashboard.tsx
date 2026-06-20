"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, ArrowUpRight, Search, X } from "lucide-react";
import { statusLabels, statusOrder, type Booking, type RepairStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

type DateFilter = "all" | "today" | "week" | "month" | "custom";
type SortBy = "date_desc" | "date_asc" | "ref_desc" | "status";

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
  const [sortBy, setSortBy] = useState<SortBy>("date_desc");

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

    // Date filtering against the appointment date (b.date).
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
          const d = new Date(b.date);
          if (from && d < from) return false;
          if (to && d > to) return false;
          return true;
        });
      }
    }

    // Sort — copy first so we don't mutate the source array.
    result = [...result];
    switch (sortBy) {
      case "date_desc":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date_asc":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "ref_desc":
        result.sort((a, b) => b.reference.localeCompare(a.reference));
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
    sortBy !== "date_desc";

  function clearFilters() {
    setSearchQ("");
    setDateFilter("all");
    setCustomFrom("");
    setCustomTo("");
    setSortBy("date_desc");
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
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="custom">Custom range…</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="field-input md:col-span-4"
            aria-label="Sort bookings"
          >
            <option value="date_desc">Sort: Newest appointment first</option>
            <option value="date_asc">Sort: Oldest appointment first</option>
            <option value="ref_desc">Sort: Reference (newest #)</option>
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
      )}
    </div>
  );
}
