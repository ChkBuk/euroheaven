"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

// Routes where the fixed bottom CTA bar should NOT appear. These pages
// already have their own primary actions (booking wizard, admin, login
// flow) and the bottom bar both visually distracts and physically
// overlaps the page's own buttons — leading to taps being absorbed by
// the wrong control.
const HIDDEN_PATHS = ["/book", "/admin", "/auth"];

export default function MobileCTA() {
  const pathname = usePathname();
  if (pathname && HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-ink-900/95 backdrop-blur border-t border-white/10">
      <div className="grid grid-cols-2 gap-2 p-2">
        <a href={`tel:${site.phone}`} className="btn-outline py-3 text-sm">
          <Phone className="w-4 h-4" /> Call
        </a>
        <Link href="/book" className="btn-primary py-3 text-sm">
          Book Now <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
