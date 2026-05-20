"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Choice = "unset" | "accepted" | "rejected";
const STORAGE_KEY = "euroheaven.consent.v1";

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice>("unset");
  const [hydrated, setHydrated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setReduceMotion(
      typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
    );
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { accepted?: boolean };
        if (parsed?.accepted === true) setChoice("accepted");
        else if (parsed?.accepted === false) setChoice("rejected");
      }
    } catch {
      /* private browsing or blocked storage — leave choice as "unset" */
    }
  }, []);

  useEffect(() => {
    if (hydrated && choice === "unset") {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [hydrated, choice]);

  const persist = (accepted: boolean) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accepted, timestamp: new Date().toISOString() })
      );
    } catch {
      /* ignore — banner still dismisses for the session */
    }
    setChoice(accepted ? "accepted" : "rejected");
  };

  if (!hydrated || choice !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-0 bottom-[88px] lg:bottom-4 z-[60] px-4 pb-4 transition-all duration-300",
        reduceMotion
          ? "opacity-100"
          : visible
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
      )}
    >
      <div className="max-w-3xl lg:max-w-2xl mx-auto lg:mr-[88px] bg-ink-900/95 backdrop-blur border border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row gap-3 md:items-center">
        <p className="text-sm text-white/80 leading-relaxed flex-1">
          We use functional cookies to handle bookings and form submissions.
          We don&apos;t track you across sites. See our{" "}
          <Link
            href="/privacy"
            className="text-accent hover:underline whitespace-nowrap"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => persist(false)}
            className="btn-outline px-4 py-2 text-sm whitespace-nowrap"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => persist(true)}
            className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
