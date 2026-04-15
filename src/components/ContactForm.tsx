"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setSent(true);
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
