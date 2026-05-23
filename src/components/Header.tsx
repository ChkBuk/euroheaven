"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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
        "sticky top-0 z-40 transition-all duration-300",
        // Matches the logo's charcoal background (sampled #1A1A1B / #222224)
        // so the JPG seam disappears against the header surface.
        scrolled
          ? "bg-chrome-900/95 backdrop-blur-lg border-b border-chrome-700"
          : "bg-gradient-to-b from-chrome-900/80 via-chrome-900/30 to-transparent border-b border-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="flex -ml-4 md:-ml-8 lg:ml-0"
          aria-label={`${site.name} — home`}
        >
          <img
            src="/logo.jpg"
            alt={site.name}
            className="h-16 md:h-20 w-auto block"
          />
          {/* Companion badge — uses the chrome palette's slightly lighter
              tone (chrome-800) so it reads as a sibling of the logo, not
              a pasted-on slab. */}
          <span className="hidden md:flex items-center h-16 md:h-20 bg-chrome-800 px-5 text-[10px] uppercase tracking-[0.22em] text-chrome-300/80 leading-tight border-l border-chrome-700">
            <span>
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
