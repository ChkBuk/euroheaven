"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

export default function HeroVideo({
  posterAlt = "Mercedes-Benz technician at work",
  className,
}: {
  posterAlt?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const markReady = () => setCanPlay(true);

    // If the video is already buffered enough (e.g. cached), the `canplay`
    // event may have fired before this effect mounted — check readyState so
    // we don't miss it and leave the video stuck invisible.
    if (v.readyState >= 2) markReady();

    v.addEventListener("loadeddata", markReady);
    v.addEventListener("canplay", markReady);

    // Some browsers skip loading when preload="metadata" is combined with
    // autoplay in hydration races. Nudge it manually.
    if (v.readyState === 0) v.load();

    // autoplay can be silently blocked (Safari, low-power mode). If .play()
    // rejects, the poster stays visible — which is the right fallback.
    v.play().catch(() => {});

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) {
      v.pause();
    }

    return () => {
      v.removeEventListener("loadeddata", markReady);
      v.removeEventListener("canplay", markReady);
    };
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Poster image — always visible immediately, stays as fallback if video fails */}
      <Image
        src={img.mechanic}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Video — covers poster once loaded */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          canPlay ? "opacity-100" : "opacity-0"
        )}
        aria-label="Mercedes-Benz workshop activities"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays for legibility */}
      {/* Top strip — keeps the transparent sticky header readable on
          light-heavy video frames (sparks, reflections, sky). */}
      <div
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/55 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/30"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
        aria-hidden
      />
    </div>
  );
}
