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
    <section className="bg-ink-800 border-b border-white/5 overflow-hidden py-12 md:py-20">
      <Reveal className="w-full">
        <div className="container relative">
          {/* Section heading — lives outside the image, mirroring the
              "What we do / Our auto repair service" pattern in
              ServicesScrolly. */}
          <div className="mb-8 md:mb-12">
            <div className="eyebrow-muted mb-3">How it works</div>
            <h2 className="heading-2 text-white">
              Our <span className="text-accent">working process</span>
            </h2>
          </div>

          {/* Layout: on mobile, image stacks above the steps as a banner
              (no overlay — the 4 step cards don't fit inside a 4:3 box).
              On lg+, a 2-column grid puts the image on the left and the
              steps in a solid dark panel on the right. */}
          <div className="relative w-full lg:min-h-[560px] overflow-hidden grid lg:grid-cols-2">
            {/* Image: aspect-ratio banner on mobile, full-height on lg+ */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full">
              <Image
                src={img.techAtWork}
                alt="Mercedes technician at work"
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover scale-x-[-1] object-center"
              />
            </div>

            {/* Steps panel — normal block below image on mobile, right
                column on lg+. */}
            <div className="bg-ink-900 lg:col-start-2">
              <div className="h-full flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                <ol className="space-y-2">
                  {steps.map((s, i) => {
                    const isActive = active === i;
                    return (
                      <Reveal
                        key={s.title}
                        as="li"
                        variant="up"
                        delay={i * 120}
                      >
                        <button
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onClick={() => setActive(i)}
                          className={cn(
                            "w-full text-left p-3 md:p-4 border transition-all",
                            isActive
                              ? "bg-accent text-white border-accent shadow-cta"
                              : "bg-ink-950/50 text-white/85 border-white/10 hover:border-white/25 backdrop-blur-sm"
                          )}
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <div
                              className={cn(
                                "w-9 h-9 md:w-10 md:h-10 grid place-items-center flex-shrink-0 text-xs md:text-sm font-semibold",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-white/10 text-white/70"
                              )}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold flex items-center gap-2 text-sm md:text-base">
                                <s.icon className="w-4 h-4 opacity-80 shrink-0" />
                                {s.title.replace("&apos;", "'")}
                              </div>
                              <div
                                className={cn(
                                  "text-xs md:text-sm mt-1 transition-all",
                                  isActive ? "text-white/85" : "text-white/55"
                                )}
                              >
                                {s.desc}
                              </div>
                            </div>
                          </div>
                        </button>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
