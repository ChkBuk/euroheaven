import Link from "next/link";
import { Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

export default function MobileCTA() {
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
