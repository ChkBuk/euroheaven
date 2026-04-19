"use client";

import { useEffect, useRef } from "react";

/**
 * One-shot scroll snap: when the user first scrolls down from the top of the
 * page, smoothly scroll them to the element identified by `targetId`. After
 * snapping once, the handler disarms so normal scroll (and downstream GSAP
 * ScrollTrigger snapping inside the services section) takes over.
 */
export default function InitialScrollSnap({ targetId }: { targetId: string }) {
  const armedRef = useRef(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      if (!armedRef.current) return;
      const y = window.scrollY;
      const direction = y - lastScrollYRef.current;
      lastScrollYRef.current = y;
      // Only trigger on a downward scroll that begins near the top.
      if (direction <= 0) return;

      const target = document.getElementById(targetId);
      // Use the target's actual offset rather than window.innerHeight —
      // on iOS Safari the URL bar's collapse can flip innerHeight mid-scroll
      // and disarm us prematurely.
      const targetY = target
        ? target.getBoundingClientRect().top + window.scrollY
        : Infinity;
      if (y > targetY - 10) {
        // User already reached/passed the target — disarm without snapping.
        armedRef.current = false;
        return;
      }
      if (y < 10) return; // absorb tiny jitter

      armedRef.current = false;
      if (!target) return;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return null;
}
