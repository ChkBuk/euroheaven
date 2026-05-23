import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.43 0-4.1 1.48-4.1 4.2v2.23H7.5V13h2.65v8h3.35z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.35 11.1h-9.17v2.96h5.27c-.5 2.42-2.48 3.96-5.27 3.96-3.15 0-5.73-2.58-5.73-5.73s2.58-5.73 5.73-5.73c1.42 0 2.72.5 3.74 1.33l2.12-2.12C16.46 4.18 14.36 3.27 12.18 3.27 7.37 3.27 3.5 7.14 3.5 11.95s3.87 8.68 8.68 8.68c5.01 0 8.32-3.52 8.32-8.47 0-.57-.05-.99-.15-1.06z" />
    </svg>
  );
}

export default function Footer() {
  return (
    // Chrome palette matches the logo's charcoal background so the JPG
    // blends seamlessly into the footer surface. A subtle gradient at
    // the top edge fades from the chrome-900 floor up toward a slightly
    // lighter chrome-800 ceiling, giving the section a soft metallic
    // sheen rather than a flat slab.
    <footer className="bg-gradient-to-b from-chrome-800 via-chrome-900 to-chrome-950 text-white border-t border-chrome-700">
      <div className="container py-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center mb-4">
            <img
              src="/logo.jpg"
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
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Facebook`}
              className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/70 hover:border-accent hover:text-accent transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Instagram`}
              className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/70 hover:border-accent hover:text-accent transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={site.social.google}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Google`}
              className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/70 hover:border-accent hover:text-accent transition-colors"
            >
              <GoogleGIcon className="w-4 h-4" />
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
