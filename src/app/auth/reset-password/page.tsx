"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Stage = "verifying" | "ready" | "saving" | "done" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("verifying");
  const [error, setError] = useState<string | null>(null);

  // On mount: parse the URL hash for the recovery tokens Supabase
  // injects after `/auth/v1/verify?type=recovery`. Set them as the
  // active session so `updateUser({ password })` works below.
  useEffect(() => {
    const sb = getSupabaseBrowserClient();
    if (!sb) {
      setError("Auth is not configured for this environment.");
      setStage("error");
      return;
    }

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (accessToken && refreshToken && type === "recovery") {
      sb.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ error: err }) => {
          if (err) {
            setError(
              `This reset link couldn't be validated (${err.message}). Request a fresh one from the sign-in page.`
            );
            setStage("error");
            return;
          }
          // Clean the hash so a page refresh doesn't try to reuse the
          // (now-consumed) tokens.
          window.history.replaceState(null, "", window.location.pathname);
          setStage("ready");
        });
      return;
    }

    // No hash tokens — maybe the user already has a session from a
    // previous landing on this page, or they navigated here directly.
    sb.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStage("ready");
      } else {
        setError(
          "This reset link is invalid or has expired. Open the most recent password recovery email and try again."
        );
        setStage("error");
      }
    });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const sb = getSupabaseBrowserClient();
    if (!sb) {
      setError("Auth is not configured for this environment.");
      return;
    }

    setStage("saving");
    const { error: err } = await sb.auth.updateUser({ password });
    if (err) {
      setError(
        err.message ||
          "Could not update password. The reset link may have expired."
      );
      setStage("ready");
      return;
    }
    setStage("done");
    setTimeout(() => router.push("/staff/login?reset=success"), 1400);
  }

  return (
    <section className="section bg-ink-950 min-h-[60vh]">
      <div className="container max-w-md">
        <h1 className="heading-2 mb-2">Set a new password</h1>
        <p className="text-sm text-white/60 mb-6">
          Choose a new password for your workshop admin sign-in.
        </p>

        {stage === "verifying" && (
          <div className="card-dark text-center py-10">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-white/60" />
            <p className="text-sm text-white/60">Verifying reset link…</p>
          </div>
        )}

        {stage === "error" && (
          <div className="card-dark">
            <div className="flex items-start gap-2 text-sm text-white/90">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {stage === "done" && (
          <div className="card-dark border-brand-success/30 text-center py-8">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-brand-success" />
            <h2 className="font-semibold mb-1">Password updated</h2>
            <p className="text-sm text-white/65">
              Redirecting you to the sign-in page…
            </p>
          </div>
        )}

        {(stage === "ready" || stage === "saving") && (
          <form onSubmit={onSubmit} className="card-dark space-y-4">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium mb-2">
                <Lock className="w-4 h-4 text-accent" />
                New password
              </span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoFocus
                autoComplete="new-password"
                className="field-input"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium mb-2">
                <Lock className="w-4 h-4 text-accent" />
                Confirm password
              </span>
              <input
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="field-input"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg border border-accent/40 bg-accent/10 text-sm text-white/90"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={stage === "saving"}
              className="btn-primary w-full disabled:opacity-50"
            >
              {stage === "saving" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : (
                "Update password"
              )}
            </button>

            <p className="text-xs text-white/45 text-center">
              At least 8 characters. Use a mix of letters, numbers, and symbols.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
