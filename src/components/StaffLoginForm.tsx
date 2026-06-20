"use client";

import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";

export default function StaffLoginForm({ nextPath }: { nextPath: string }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          next: nextPath,
        }),
      });
    } catch {
      /* ignore — UI still shows "sent" so we don't leak whether the
         email exists. */
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div
        className="card bg-ink-800 border-brand-success/30"
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-success/15 grid place-items-center text-brand-success flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-base">
              Check your inbox
            </h2>
            <p className="text-sm text-white/65 mt-1">
              We&apos;ve sent a sign-in link to the email you entered. Open
              the email on this device and tap the link — you&apos;ll land
              at <code className="text-white">{nextPath}</code> straight
              away.
            </p>
          </div>
        </div>
        <ul className="text-xs text-white/50 space-y-1 ml-13 list-disc list-inside">
          <li>The link works once and expires in 1 hour.</li>
          <li>
            Can&apos;t see the email? Check your spam folder — first emails
            from a new sender sometimes land there.
          </li>
          <li>Wrong email? Refresh this page to try again.</li>
        </ul>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card bg-ink-800"
      style={{ touchAction: "manipulation" }}
    >
      <label className="block">
        <span className="flex items-center gap-2 text-sm font-medium text-white mb-2">
          <Mail className="w-4 h-4 text-accent" />
          Staff email
        </span>
        <input
          name="email"
          type="email"
          required
          autoFocus
          inputMode="email"
          autoComplete="email"
          placeholder="you@euroheaven.com.au"
          className="field-input"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full mt-5 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending link…
          </>
        ) : (
          "Send Sign-In Link"
        )}
      </button>
    </form>
  );
}
