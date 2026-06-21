"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";

export default function StaffLoginForm({ nextPath }: { nextPath: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
          next: nextPath,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        // Full navigation (not router.push) so the new auth cookie is
        // picked up by the layout's server-side getSession() check.
        window.location.href = body.redirectTo || nextPath || "/admin";
        return;
      }
      // Map server errors to friendly messages without disclosing
      // whether the email exists.
      let msg = "Sign-in failed. Please try again.";
      try {
        const body = await res.json();
        if (body?.error === "invalid_credentials") {
          msg = "Email or password is incorrect.";
        } else if (body?.error === "not_staff") {
          msg =
            "This account isn't authorised for the workshop admin. Contact the site owner.";
        } else if (body?.error === "rate_limited") {
          msg = "Too many attempts. Please wait a few minutes and try again.";
        } else if (Array.isArray(body?.issues) && body.issues.length > 0) {
          msg = body.issues[0].message ?? msg;
        }
      } catch {
        /* response wasn't JSON — keep the generic message */
      }
      setError(msg);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card bg-ink-800 space-y-4"
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

      <label className="block">
        <span className="flex items-center gap-2 text-sm font-medium text-white mb-2">
          <Lock className="w-4 h-4 text-accent" />
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={1}
          className="field-input"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-lg border border-accent/40 bg-accent/10 text-sm text-white/90"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-xs text-white/45 text-center">
        Passwords are set per-staff in the Supabase dashboard. Forgot yours?
        Ask the site owner to reset it.
      </p>
    </form>
  );
}
