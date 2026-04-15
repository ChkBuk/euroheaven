"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, ClipboardList, Car, CheckCircle2 } from "lucide-react";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

const steps = [
  {
    icon: Calendar,
    title: "Appointment",
    desc: "Book online in under 60 seconds. Confirmation by email & SMS.",
  },
  {
    icon: ClipboardList,
    title: "Diagnose",
    desc: "Factory Xentry scan + physical inspection to pinpoint the issue.",
  },
  {
    icon: Car,
    title: "Bring your vehicle",
    desc: "Drop off at our Melbourne workshop — courtesy cars available.",
  },
  {
    icon: CheckCircle2,
    title: "It&apos;s repaired",
    desc: "Live repair tracking, then a quality-checked handover.",
  },
];

export default function WorkingProcess() {
  const [active, setActive] = useState(0);

  return (
    <section className="section bg-ink-950">
      <div className="container">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden bg-ink-800 border border-white/5">
            <div className="grid lg:grid-cols-2">
              {/* Left: image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={img.techAtWork}
                  alt="Mercedes technician at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/50 via-transparent to-ink-800" />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/70 border border-white/10 text-xs text-white/80 backdrop-blur">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Live from the workshop
                  </div>
                </div>
              </div>

              {/* Right: steps */}
              <div className="p-8 md:p-12 lg:p-14">
                <div className="eyebrow-muted mb-3">How it works</div>
                <h2 className="heading-2 mb-8">
                  Our <span className="text-accent">working process</span>
                </h2>

                <ol className="space-y-2">
                  {steps.map((s, i) => {
                    const isActive = active === i;
                    return (
                      <li key={s.title}>
                        <button
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onClick={() => setActive(i)}
                          className={cn(
                            "w-full text-left rounded-xl p-4 border transition-all",
                            isActive
                              ? "bg-accent text-white border-accent shadow-cta"
                              : "bg-transparent text-white/85 border-white/10 hover:border-white/25"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full grid place-items-center flex-shrink-0 text-sm font-semibold",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-white/5 text-white/70"
                              )}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold flex items-center gap-2">
                                <s.icon className="w-4 h-4 opacity-80" />
                                {s.title.replace("&apos;", "'")}
                              </div>
                              <div
                                className={cn(
                                  "text-sm mt-1 transition-all",
                                  isActive
                                    ? "text-white/85"
                                    : "text-white/50"
                                )}
                              >
                                {s.desc}
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
