"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

export default function FAQ({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <Reveal key={i} variant="up" delay={i * 90}>
            <div
              className={cn(
                "border transition-colors overflow-hidden",
                open
                  ? "bg-ink-800 border-accent/40"
                  : "bg-ink-900 border-white/10"
              )}
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open}
              >
                <span className="font-semibold text-white">{item.q}</span>
                <Plus
                  className={cn(
                    "w-5 h-5 text-white/60 transition-transform flex-shrink-0",
                    open && "rotate-45 text-accent"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-white/70 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
