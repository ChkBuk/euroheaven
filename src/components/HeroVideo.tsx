"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
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
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
      setPlaying(false);
    }
  }, []);

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

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
        preload="metadata"
        onCanPlay={() => setCanPlay(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
          canPlay ? "opacity-100" : "opacity-0"
        )}
        aria-label="Mercedes-Benz oil change in progress"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays for legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/30"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40"
        aria-hidden
      />

      {/* Controls */}
      <div className="absolute bottom-5 right-5 z-10 flex gap-2">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white grid place-items-center hover:bg-white/20 transition-colors"
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white grid place-items-center hover:bg-white/20 transition-colors"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
