import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ArrowUpRight,
  Phone,
  CheckCircle2,
  Shield,
  Sparkles,
  Wrench,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Receipt,
  Car,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { site } from "@/lib/site";

// Home page owns its own metadata rather than inheriting the root
// fallback. The title uses the CTR formula
// `[Topic] [Region] | [USP] | [Trust Signal]` so the SERP entry leads
// with the most click-worthy info (location + trust signals) instead
// of a generic brand+tagline.
export const metadata: Metadata = {
  title:
    "Mercedes-Benz Specialist Dandenong — Factory-Trained, Warranty-Safe Service",
  description:
    "Mercedes-Benz workshop in Dandenong, Melbourne. Factory-trained technicians, genuine parts, dealership-grade Xentry diagnostics. Logbook service, brakes, AMG — book online in 60 seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Mercedes-Benz Specialist Dandenong — Factory-Trained, Warranty-Safe Service",
    description:
      "Mercedes-Benz workshop in Dandenong, Melbourne. Factory-trained technicians, genuine parts, Xentry diagnostics — warranty-safe.",
    url: site.url,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
import { img } from "@/lib/images";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import WorkingProcess from "@/components/WorkingProcess";
import Newsletter from "@/components/Newsletter";
import LogoMarquee from "@/components/LogoMarquee";
import HeroVideo from "@/components/HeroVideo";
import ServicesScrolly from "@/components/ServicesScrolly";
import InitialScrollSnap from "@/components/InitialScrollSnap";

const testimonials = [
  {
    name: "James W.",
    car: "C63 AMG",
    rating: 5,
    text:
      "Finally found a Mercedes specialist that knows what they're doing. Saved me thousands versus the dealer and service was brilliant.",
  },
  {
    name: "Priya S.",
    car: "GLC 300",
    rating: 5,
    text:
      "Booked online in 2 minutes, loved the live repair updates. Courtesy car was a lifesaver. Highly recommended.",
  },
  {
    name: "Michael T.",
    car: "E350",
    rating: 5,
    text:
      "Honest, thorough, and genuinely care about the cars. They even spotted an issue the dealer missed on the last service.",
  },
];

const faqs = [
  {
    q: "Are you an authorised Mercedes-Benz service centre?",
    a: "We are an independent Mercedes-Benz specialist workshop. Our technicians are factory-trained with decades of combined experience, and we use genuine or OEM-equivalent parts.",
  },
  {
    q: "Will servicing here affect my new car warranty?",
    a: "No. Under Australian Consumer Law, using an independent specialist with approved parts and fluids does not void your Mercedes warranty.",
  },
  {
    q: "What's the difference between Service A and Service B?",
    a: "Service A is the basic interval (usually ~15,000 km): oil and filter change, brake inspection, and a diagnostic scan. Service B adds cabin filters, fluid top-ups, and a full multi-point check (usually ~30,000 km). We follow the MB factory schedule so your log-book stays compliant.",
  },
  {
    q: "Do you work on AMG and performance models?",
    a: "Yes — from C63 AMG to GT R and S-Class AMG line. We service carbon-ceramic brakes, Bilstein and air suspension, AMG-spec fluids, and handle dyno-verified performance tuning within factory tolerances.",
  },
  {
    q: "Do you offer courtesy vehicles?",
    a: "Yes — on request, subject to availability. Please indicate this when you book.",
  },
  {
    q: "What areas of Melbourne do you service?",
    a: `We service customers across Melbourne and Victoria including ${site.suburbs.slice(0, 6).join(", ")} and surrounding suburbs.`,
  },
];

export default function Home() {
  return (
    <>
      <InitialScrollSnap targetId="services-scrolly" />

      {/* ============ HERO + MARQUEE (together fill one viewport) ============ */}
      {/* The -mt-16/-20 pulls the wrapper up by the header's flow height so
          wrapper_top = document y 0. Then min-h-screen/dvh = 100vh makes the
          wrapper end exactly at the viewport bottom. Hero video bleeds behind
          the transparent header at the top; LogoMarquee sits at the bottom
          of the viewport. overflow-hidden guards against content bleed on
          ultra-short viewports. */}
      <div className="-mt-16 md:-mt-20 relative min-h-screen min-h-dvh flex flex-col bg-ink-950 overflow-hidden">
      <section className="group relative isolate flex-1 min-h-0 overflow-hidden">
        <HeroVideo />

        {/* Content overlay — top-anchored with a proper safe zone so the
            badge/headline never collide with the transparent sticky header
            regardless of viewport height. pt ≫ header height (h-16/h-20). */}
        {/* pb-28 md:pb-32 reserves a clear lane at the bottom of the hero
            for the absolute-positioned Scroll indicator (≈86px tall incl.
            bottom-6 offset). Without it, the Google reviews row collides
            with the mouse/Scroll badge on shorter viewports. */}
        <div className="relative h-full container pt-36 md:pt-44 lg:pt-52 pb-8 md:pb-32">
          <div className="max-w-2xl mx-auto text-center">
            {/* Soft dark veil directly behind the text stack — keeps
                copy readable over bright video frames without fully
                obscuring the footage. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-24 md:top-28 lg:top-32 mx-auto max-w-3xl h-[70%] bg-ink-950/35 blur-3xl -z-10"
              aria-hidden
            />
            <Reveal variant="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-950/55 border border-white/20 text-xs text-white mb-6 backdrop-blur-md shadow-lg">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Melbourne · Victoria · Since {2026 - site.stats.yearsInBusiness}
              </div>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <h1 className="heading-1 text-balance text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.7),0_0_32px_rgba(0,0,0,0.4)]">
                Precision care for every
                <br />
                <span className="text-accent [text-shadow:0_2px_14px_rgba(0,0,0,0.9),0_0_24px_rgba(0,0,0,0.6)]">
                  European vehicle.
                </span>
              </h1>
            </Reveal>

            <Reveal variant="up" delay={260}>
              <p className="lead mt-6 max-w-xl mx-auto text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                Factory-trained Mercedes-Benz specialists delivering the
                highest quality auto repair — without losing the personal
                relationships our customers value most.
              </p>
            </Reveal>

            <Reveal variant="up" delay={400}>
              {/* Hidden on mobile — the MobileCTA fixed bar at the
                  bottom of the screen already provides Call + Book
                  Now on small viewports, so duplicating the CTAs in
                  the hero just creates click-target ambiguity and the
                  Hero buttons can end up obscured behind the bottom
                  bar. Visible from sm (640px) up where MobileCTA is
                  hidden. */}
              <div className="hidden sm:flex flex-row gap-3 mt-8 justify-center">
                <Link href="/book" className="btn-primary group">
                  Book Now
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href={`tel:${site.phone}`}
                  className="btn bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/15"
                >
                  <Phone className="w-4 h-4" /> {site.phoneDisplay}
                </a>
              </div>
            </Reveal>

            <Reveal variant="up" delay={550}>
              <div className="mt-10 flex items-center justify-center gap-3 text-sm text-white/85">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <span>
                  <strong>{site.stats.googleRating}</strong> from{" "}
                  {site.stats.googleReviewCount} Google reviews
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#services-scrolly"
          aria-label="Scroll to next section"
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-white/30 grid place-items-start p-1">
            <span className="block w-1 h-2 rounded-full bg-white/70 animate-bounce" />
          </div>
        </a>
      </section>

      {/* Brand marquee — sits ~1 inch above the viewport bottom */}
      <div id="services" className="shrink-0 mb-24">
        <LogoMarquee />
      </div>
      </div>

      {/* ============ SERVICES (scroll-pinned) ============ */}
      <div id="services-scrolly">
        <ServicesScrolly />
      </div>

      {/* ============ ABOUT ============ */}
      <section className="bg-paper text-ink-900 overflow-hidden py-12 md:py-16 lg:py-20">
        <Reveal className="w-full">
          <div className="container relative">
            <div className="grid lg:grid-cols-2 items-start relative">
              <div className="lg:pr-12">
                {/* Heading sits at the top of the left column so its
                    baseline aligns with the image's top edge on lg+. */}
                <div className="mb-8 md:mb-12">
                  <div className="eyebrow mb-3">About us</div>
                  <h2 className="heading-2">
                    Precision care for every
                    <br />
                    Mercedes that rolls in.
                  </h2>
                </div>
                <p className="lead-dark mb-8">
                  For nearly two decades, {site.name} has been the workshop
                  Melbourne&apos;s Mercedes owners come to when dealer
                  service feels too cold, and the corner garage too casual.
                  Factory-level tools. Independent prices. Honest advice.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { num: 200, suffix: "+", label: "Technicians trained" },
                    { num: site.stats.googleReviewCount, suffix: "", label: "5-star reviews" },
                    { num: 250, suffix: "+", label: "Parts in stock" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-3xl font-bold">
                        <CountUp end={s.num} suffix={s.suffix} />
                      </div>
                      <div className="text-xs text-ink-900/55 uppercase tracking-wider mt-1">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/about" className="btn-primary">
                  Learn more <ArrowUpRight className="w-4 h-4" />
                </Link>

                {/* Trust badges — closes the About block with 4 credibility
                    anchors so there's no empty space on tall viewports. */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-ink-900/10">
                  {[
                    { icon: Wrench, title: "Xentry / STAR", desc: "Factory diagnostic tools" },
                    { icon: ShieldCheck, title: "Genuine OEM parts", desc: "Mercedes-approved only" },
                    { icon: BookOpen, title: "Log-book compliant", desc: "Warranty stays intact" },
                    { icon: GraduationCap, title: "Factory-trained", desc: "Mercedes-certified techs" },
                  ].map((b) => (
                    <div key={b.title} className="flex flex-col gap-3">
                      <div className="w-10 h-10 bg-accent/10 text-accent grid place-items-center border border-accent/20">
                        <b.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink-900">{b.title}</div>
                        <div className="text-xs text-ink-900/55 mt-0.5">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Reveal variant="right" delay={100}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img.aboutShowcase}
                    alt="Black Mercedes-Benz G63 in the Euro Heaven workshop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ HOW IT WORKS + WHY US (one page unit) ============ */}
      <div>
        <WorkingProcess />

        <section className="section bg-ink-950">
          <div className="container">
          <div className="max-w-xl mb-14">
            <Reveal>
              <div className="eyebrow-muted mb-3">Why us</div>
              <h2 className="heading-2">
                Why <span className="text-accent">choose us</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Sparkles,
                title: "Knowledge & Experience",
                desc: "Factory-trained technicians with decades of combined Benz expertise.",
              },
              {
                icon: CheckCircle2,
                title: "Convenience & Satisfaction",
                desc: "Online booking, SMS updates, courtesy vehicles, live repair tracking.",
              },
              {
                icon: Shield,
                title: "Quality Service Guaranteed",
                desc: "Genuine or OEM parts, MB-approved fluids, warranty-safe stamping.",
              },
              {
                icon: Receipt,
                title: "Transparent Pricing",
                desc: "Itemised quotes upfront. No surprise fees at pickup — ever.",
              },
              {
                icon: Car,
                title: "Courtesy Vehicles",
                desc: "Free loan cars on request so your day isn't derailed.",
              },
              {
                icon: MessageSquare,
                title: "Live Repair Updates",
                desc: "SMS and email tracking throughout the repair and diagnostic.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 120}>
                <div className="card-dark h-full hover:border-accent/40 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 text-accent grid place-items-center mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Stats strip — closes the "Why choose us" block with hard numbers */}
          <Reveal delay={200}>
            <div className="mt-14 md:mt-20 grid grid-cols-3 gap-6 border-t border-white/5 pt-10 text-center">
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-white">
                  <CountUp end={site.stats.yearsInBusiness} />
                </div>
                <div className="text-xs md:text-sm text-white/55 uppercase tracking-wider mt-1">
                  Years in Melbourne
                </div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-white">
                  <CountUp end={12000} suffix="+" />
                </div>
                <div className="text-xs md:text-sm text-white/55 uppercase tracking-wider mt-1">
                  Cars serviced
                </div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-white">
                  {site.stats.googleRating}
                  <span className="text-accent">★</span>
                </div>
                <div className="text-xs md:text-sm text-white/55 uppercase tracking-wider mt-1">
                  Google rating
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>

      {/* ============ TESTIMONIALS + FAQ (one page unit) ============ */}
      <div>
        <section className="section bg-paper text-ink-900">
          <div className="container">
            <Reveal>
              <div className="mb-12">
                <div className="eyebrow mb-3">Reviews</div>
                <h2 className="heading-2">
                  What clients
                <br />
                <span className="text-accent">say us?</span>
              </h2>
            </div>
          </Reveal>

          {/* Aggregate Google rating banner */}
          <Reveal delay={100}>
            <div className="mb-10 flex flex-col sm:flex-row sm:inline-flex items-center gap-4 bg-white border border-ink-900/10 px-5 py-3 shadow-light">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <div className="text-sm">
                <strong className="text-ink-900 text-base">
                  {site.stats.googleRating}
                </strong>{" "}
                <span className="text-ink-900/65">
                  from {site.stats.googleReviewCount} verified Google reviews
                </span>
              </div>
              <a
                href={site.social.google}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent hover:text-accent-600 inline-flex items-center gap-1"
              >
                See all <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="bg-white shadow-light p-6 h-full border border-ink-900/5">
                  <div className="flex mb-3">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="italic text-ink-900/80 mb-5 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-ink-900/10">
                    <div className="w-10 h-10 rounded-full bg-accent/15 text-accent grid place-items-center font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-ink-900/55">{t.car}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/reviews" className="btn-outline-dark">
              Read all reviews <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

        {/* ============ FAQ (dark) ============ */}
        <section className="section bg-ink-950">
          <div className="container-narrow">
          <Reveal>
            <div className="eyebrow-muted mb-3 text-center">FAQ</div>
            <h2 className="heading-2 text-center mb-10">
              Questions we hear often
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <FAQ items={faqs} />
          </Reveal>

          {/* Still-have-questions contact CTA — closes out the FAQ section */}
          <Reveal delay={200}>
            <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-ink-900 p-6 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 border border-accent/30 text-accent grid place-items-center shrink-0 mt-1">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-white text-base">Still have questions?</strong>
                  <p className="text-sm text-white/60 mt-0.5">
                    Our team is happy to help — no obligation, no sales pitch.
                  </p>
                </div>
              </div>
              <a href={`tel:${site.phone}`} className="btn-primary shrink-0">
                <Phone className="w-4 h-4" /> {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      </div>

      {/* ============ NEWSLETTER CTA ============ */}
      <Newsletter />
    </>
  );
}
