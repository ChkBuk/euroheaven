import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white border-t border-white/5">
      <div className="container py-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center mb-4">
            <img
              src="/logo.svg"
              alt={site.name}
              className="h-16 md:h-20 w-auto"
            />
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-sm">
            {site.tagline}. Factory-trained technicians serving Melbourne and
            Victoria since {2026 - site.stats.yearsInBusiness}.
          </p>
          <div className="flex gap-2">
            <a
              href={site.social.facebook}
              className="px-3 py-1.5 text-xs rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors"
            >
              Facebook
            </a>
            <a
              href={site.social.instagram}
              className="px-3 py-1.5 text-xs rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors"
            >
              Instagram
            </a>
            <a
              href={site.social.google}
              className="px-3 py-1.5 text-xs rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors"
            >
              Google
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            Company
          </h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/models" className="hover:text-white">Models</Link></li>
            <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/track" className="hover:text-white">Track Repair</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            Services
          </h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="hover:text-white inline-flex items-center gap-1 group"
                >
                  {s.title.replace("Mercedes-Benz ", "")}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            Office
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2.5">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
              <span>
                {site.address.street}, {site.address.suburb}{" "}
                {site.address.state} {site.address.postcode}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
              <div className="space-y-0.5">
                {site.hours.map((h) => (
                  <div key={h.day}>
                    <span className="text-white/90">{h.day}:</span> {h.time}
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/45">
          <div>
            © {new Date().getFullYear()} {site.name}. ABN {site.abn}. All
            rights reserved.
          </div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
