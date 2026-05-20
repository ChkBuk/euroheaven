"use client";

import { useState } from "react";
import {
  Mail,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

const perks = [
  "Monthly maintenance tips",
  "Seasonal offers and specials",
  "Model-specific guides (C-Class, AMG, EQ)",
];

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
        {/* Section heading — lives outside the accent card, matching the
            "What we do / How it works / About us" pattern. */}
        <Reveal>
          <div className="mb-8 md:mb-12">
            <div className="eyebrow-muted mb-3 inline-flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Newsletter
            </div>
            <h2 className="heading-2 text-white">
              Get weekly newsletter
              <br />
              <span className="text-accent">from us</span>
            </h2>
          </div>
        </Reveal>

        <Reveal variant="scale" delay={100}>
          <div className="relative overflow-hidden bg-accent text-white p-8 md:p-12">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
              aria-hidden
            />
            <div
              className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />

            <div className="relative grid lg:grid-cols-[1.4fr_1fr_1fr] gap-10 items-start">
              {/* Col 1 — Copy + subscribe form */}
              <div>
                <p className="text-white/90 max-w-lg text-base md:text-lg">
                  Maintenance tips, model-specific guides, and seasonal offers
                  for Melbourne&apos;s Mercedes owners.
                </p>

                {sent ? (
                  <div className="mt-6 inline-flex items-center gap-2 text-white bg-white/15 px-4 py-3">
                    <CheckCircle2 className="w-5 h-5" /> Subscribed!
                  </div>
                ) : (
                  <form
                    onSubmit={submit}
                    className="flex flex-col sm:flex-row gap-2 mt-6 max-w-lg"
                  >
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="flex-1 bg-white/15 border border-white/20 text-white placeholder:text-white/60 px-4 py-3 outline-none focus:bg-white/20 min-w-0"
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

              {/* Col 2 — What you'll get */}
              <div className="lg:border-l lg:border-white/20 lg:pl-10">
                <div className="text-xs uppercase tracking-widest text-white/70 mb-4 font-semibold">
                  What you&apos;ll get
                </div>
                <ul className="space-y-3">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-white/90">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 — Workshop contact tile */}
              <div className="lg:border-l lg:border-white/20 lg:pl-10">
                <div className="text-xs uppercase tracking-widest text-white/70 mb-4 font-semibold">
                  Visit or call
                </div>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3 text-white/90">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                    <a
                      href={`tel:${site.phone}`}
                      className="hover:underline font-semibold"
                    >
                      {site.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-white/90">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                    <span>
                      {site.address.street}
                      <br />
                      {site.address.suburb} {site.address.state}{" "}
                      {site.address.postcode}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-white/90">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                    <div>
                      {site.hours.map((h) => (
                        <div key={h.day}>
                          <span className="opacity-80">{h.day}:</span>{" "}
                          {h.time}
                        </div>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
