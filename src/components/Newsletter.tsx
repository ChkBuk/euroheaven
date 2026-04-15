"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function Newsletter() {
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email") }),
    }).catch(() => {});
    setSent(true);
  }

  return (
    <section className="py-12 md:py-20 bg-ink-950">
      <div className="container">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[28px] bg-accent text-white p-8 md:p-12">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
              aria-hidden
            />
            <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" aria-hidden />

            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs uppercase tracking-widest mb-3">
                  <Mail className="w-3.5 h-3.5" /> Newsletter
                </div>
                <h2 className="heading-2 text-white">
                  Get weekly newsletter
                  <br />
                  from us
                </h2>
                <p className="text-white/80 mt-2 max-w-lg">
                  Maintenance tips, model-specific guides, and seasonal offers
                  for Melbourne&apos;s Mercedes owners.
                </p>
              </div>

              {sent ? (
                <div className="flex items-center gap-2 text-white bg-white/15 px-4 py-3 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" /> Subscribed!
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
                >
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/60 px-4 py-3 outline-none focus:bg-white/20 min-w-[260px]"
                  />
                  <button
                    type="submit"
                    className="btn bg-white text-accent hover:bg-bone whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
