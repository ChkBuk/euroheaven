"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Logo source — change this single line when you have a transparent
// version of the artwork to drop into /public.
//
//   Current:   "/logo.jpg" — has a baked-in dark background. The
//              header's bg-[#0a0a0a] is tuned to sit close to that
//              tone, so the JPEG's edge fades acceptably but a faint
//              seam may be visible on close inspection.
//   Better:    "/logo.png" — drop a transparent-background PNG of the
//              same artwork (just the star + EURO HEAVEN wordmark, no
//              background panel) at /public/logo.png and update this
//              constant. Zero seam.
//   Best:      "/logo.svg" — a vector export of the real artwork (the
//              existing /public/logo.svg is a placeholder shape, not
//              the production logo; replace it before switching).
const LOGO_SRC = "/logo.png";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/models", label: "Models" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/track", label: "Track Repair" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        // Single flat dark surface — matches the approach premium auto
        // brands use (mercedes-benz.com, bmw.com, porsche.com all use
        // a solid dark header rather than trying to extend a sampled
        // logo gradient). #1d1d1d is the average of logo.jpg's eight
        // edge sample points (PIL-sampled), so the JPEG's baked-in
        // background blends into the surrounding surface acceptably.
        // For a perfect zero-seam result, swap logo.jpg for a
        // transparent-background PNG/SVG via the LOGO_SRC constant.
        "sticky top-0 z-40 transition-all duration-300 bg-[#1d1d1d]",
        scrolled
          ? "backdrop-blur-lg border-b border-chrome-700"
          : "border-b border-transparent"
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="flex -ml-4 md:-ml-8 lg:ml-0"
            aria-label={`${site.name} — home`}
          >
            <img
              src={LOGO_SRC}
              alt={site.name}
              className="h-16 md:h-20 w-auto block"
            />
            {/* 1px vertical separator between logo image and the
                companion badge. Vertical gradient fades to transparent
                at top and bottom so the divider doesn't read as a hard
                edge against the surrounding background. */}
            <span
              aria-hidden
              className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/35 to-transparent"
            />
            {/* Companion badge — transparent so the header's bg-right.png
                shows through (sampled from the logo's right edge). */}
            <span className="hidden md:flex items-center justify-center h-16 md:h-20 pl-3 pr-5 text-[10px] uppercase tracking-[0.22em] text-chrome-300/80 leading-tight text-center">
              <span className="block">
                European Vehicle
                <br />
                Specialists
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-accent group-hover:w-full transition-all" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${site.phone}`}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <Phone className="w-4 h-4" />
              {site.phoneDisplay}
            </a>
            <Link href="/book" className="btn-primary text-sm px-4 py-2.5 min-h-0">
              Book Now <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height] duration-300 bg-ink-950 border-b border-white/10",
          open ? "max-h-[90vh]" : "max-h-0"
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-white/85 font-medium border-b border-white/5"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <a href={`tel:${site.phone}`} className="btn-outline w-full">
              <Phone className="w-4 h-4" /> {site.phoneDisplay}
            </a>
            <Link
              href="/book"
              className="btn-primary w-full"
              onClick={() => setOpen(false)}
            >
              Book Appointment
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
