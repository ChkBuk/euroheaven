"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // Surface the first Zod issue (or a generic fallback for
        // 429/500). Keeps the failed form state visible so the user
        // can correct the field and retry instead of seeing a false
        // "Message sent".
        let detail = "";
        try {
          const body = await res.json();
          if (Array.isArray(body?.issues) && body.issues.length > 0) {
            detail = body.issues[0].message ?? "";
          } else if (body?.error === "rate_limited") {
            detail = "Too many attempts. Please wait a minute and try again.";
          }
        } catch {
          /* response wasn't JSON — fall through to generic message */
        }
        setError(
          detail ||
            `We couldn't send your message (HTTP ${res.status}). Please try again or call us.`
        );
        return;
      }
      setSent(true);
    } catch {
      setError(
        "Network error — please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
        <h3 className="text-xl font-semibold mb-1">Message sent</h3>
        <p className="text-sm text-white/60">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field name="name" label="Name" required />
        <Field name="phone" label="Phone" required />
      </div>
      <Field name="email" label="Email" type="email" required />
      <Field name="subject" label="Subject" />
      <div>
        <label className="block text-sm font-medium text-white/85 mb-1">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="field-input"
        />
      </div>
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-lg border border-accent/40 bg-accent/10 text-sm text-white/90"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
          <span>{error}</span>
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/85 mb-1">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="field-input"
      />
    </div>
  );
}
