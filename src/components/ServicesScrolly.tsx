"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/services";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

const N = services.length;

// Auto-advance interval between cards. Always on — does NOT pause on hover.
const AUTOPLAY_MS = 6000;

// Single scroll-gesture advance cooldown (prevents fast scroll skipping cards).
const ADVANCE_COOLDOWN_MS = 700;
// Pin scroll budget per card unit.
const UNIT_PX = 400;
// Touch swipe threshold.
const TOUCH_THRESHOLD_PX = 40;

const getHeaderOffset = () =>
  typeof window !== "undefined" && window.innerWidth >= 768 ? 80 : 64;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ServicesScrolly() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useIsoLayoutEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setReducedMotion(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: () => `top top+=${getHeaderOffset()}`,
        end: () => `+=${N * UNIT_PX}`,
        pin: pinEl,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }, section);

    // Scroll-gesture → one-card advancement while pinned ------------------
    let lastAdvanceTime = 0;
    let touchStartY = 0;

    const advanceBy = (direction: 1 | -1) => {
      const now = Date.now();
      if (now - lastAdvanceTime < ADVANCE_COOLDOWN_MS) return;
      const current = activeRef.current;
      const nextIdx = current + direction;
      if (nextIdx < 0 || nextIdx >= N) return;
      lastAdvanceTime = now;
      setActive(nextIdx);
    };

    const exitPinDown = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      window.scrollTo({ top: trigger.end + 10, behavior: "smooth" });
    };
    const exitPinUp = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      window.scrollTo({
        top: Math.max(0, trigger.start - 10),
        behavior: "smooth",
      });
    };

    const onWheel = (e: WheelEvent) => {
      const trigger = triggerRef.current;
      if (!trigger || !trigger.isActive) return;
      if (Math.abs(e.deltaY) < 2) return;
      const direction = (e.deltaY > 0 ? 1 : -1) as 1 | -1;
      const current = activeRef.current;

      // At the last card scrolling down → release pin, let page scroll.
      if (direction > 0 && current >= N - 1) {
        e.preventDefault();
        exitPinDown();
        return;
      }
      // At the first card scrolling up → release pin upward.
      if (direction < 0 && current <= 0) {
        e.preventDefault();
        exitPinUp();
        return;
      }

      e.preventDefault();
      advanceBy(direction);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const trigger = triggerRef.current;
      if (!trigger || !trigger.isActive) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < TOUCH_THRESHOLD_PX) return;
      const direction = (dy > 0 ? 1 : -1) as 1 | -1;
      const current = activeRef.current;

      if (direction > 0 && current >= N - 1) {
        e.preventDefault();
        exitPinDown();
        return;
      }
      if (direction < 0 && current <= 0) {
        e.preventDefault();
        exitPinUp();
        return;
      }

      e.preventDefault();
      advanceBy(direction);
      touchStartY = e.touches[0].clientY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      ctx.revert();
      triggerRef.current = null;
    };
  }, []);

  // Auto-loop — continuous, never pauses. Timer resets whenever `active`
  // changes (manual or auto) so the next tick is a full AUTOPLAY_MS away.
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % N);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, active]);

  const goTo = (i: number) => setActive(((i % N) + N) % N);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // Reduced-motion fallback
  if (reducedMotion) {
    return (
      <section className="section bg-ink-950">
        <div className="container">
          <SectionHeader />
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 mt-12">
            {services.map((s) => (
              <article key={s.slug} className="relative h-[520px]">
                <CardBody service={s} />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink-950"
      aria-label="Our auto repair services"
    >
      <div
        ref={pinRef}
        className="relative bg-ink-950 overflow-hidden lg:h-screen lg:flex lg:flex-col"
      >
        {/* Section header */}
        <header className="relative z-30 bg-ink-950 lg:shrink-0">
          <div className="container py-8 md:py-10">
            <SectionHeader />
          </div>
        </header>

        {/* Horizontal carousel track — takes the remaining vertical space on
            lg+ so the section fills the entire viewport; fixed card height
            on smaller screens keeps all card content readable within the
            device width. */}
        <div className="relative overflow-hidden lg:flex-1 lg:min-h-0">
          <div
            className="flex will-change-transform h-full"
            style={{
              transform: `translateX(-${active * 100}%)`,
              transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {services.map((s, i) => (
              <article
                key={s.slug}
                aria-hidden={i !== active}
                className="flex-none w-full h-full"
              >
                <div className="relative h-[640px] md:h-[720px] lg:h-full">
                  <CardBody service={s} />
                </div>
              </article>
            ))}
          </div>

          {/* Prev / next arrows */}
          <button
            onClick={prev}
            aria-label="Previous service"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 grid place-items-center bg-ink-900/70 backdrop-blur border border-white/15 text-white hover:bg-ink-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next service"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 grid place-items-center bg-ink-900/70 backdrop-blur border border-white/15 text-white hover:bg-ink-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <nav
          aria-label="Service progress"
          // `lg:shrink-0` keeps the dots visible at the bottom of the
          // viewport-sized section instead of being pushed off-screen.
          className="relative z-30 flex justify-center gap-2 py-6 lg:shrink-0"
        >
          {services.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => goTo(i)}
              aria-label={`Go to ${s.title}`}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "h-1.5 transition-all",
                i === active
                  ? "w-10 bg-accent"
                  : "w-5 bg-white/25 hover:bg-white/45"
              )}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}

function SectionHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="eyebrow-muted mb-2">What we do</div>
      <h2
        className={cn(
          compact
            ? "text-2xl md:text-3xl font-bold tracking-tight"
            : "heading-2"
        )}
      >
        Our <span className="text-accent">auto repair</span> service
      </h2>
    </div>
  );
}

function CardBody({
  service: s,
}: {
  service: (typeof services)[number];
}) {
  return (
    <div className="relative w-full h-full min-h-[520px] overflow-hidden">
      <Image
        src={img[s.image]}
        alt={s.title}
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative container h-full flex flex-col justify-center py-8 md:py-12">
        <div className="max-w-xl">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            {s.title.replace("Mercedes-Benz ", "")}
          </h3>

          <p className="text-sm md:text-base text-white/85 leading-relaxed mb-5">
            {s.description}
          </p>

          <ul className="space-y-2 mb-6">
            {s.bullets.slice(0, 4).map((b) => (
              <li key={b} className="flex gap-2 text-sm text-white/90">
                <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href={`/services/${s.slug}`} className="btn-primary">
              Find out more <ArrowUpRight className="w-4 h-4" />
            </Link>
            {s.priceFrom && (
              <div className="text-sm text-white/75">
                From <strong className="text-white">{s.priceFrom}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
