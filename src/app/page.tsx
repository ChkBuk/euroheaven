import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ArrowUpRight,
  Phone,
  CheckCircle2,
  Shield,
  Wrench,
  Sparkles,
  Car,
} from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { img } from "@/lib/images";
import ServiceIcon from "@/components/ServiceIcon";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import WorkingProcess from "@/components/WorkingProcess";
import Newsletter from "@/components/Newsletter";
import LogoMarquee from "@/components/LogoMarquee";
import HeroVideo from "@/components/HeroVideo";

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
      {/* ============ HERO (full-bleed video) ============ */}
      <section className="relative -mt-16 md:-mt-20 h-[88vh] min-h-[640px] max-h-[920px] overflow-hidden bg-ink-950">
        <HeroVideo />

        {/* Content overlay */}
        <div className="relative h-full container flex items-center pt-16 md:pt-20">
          <div className="max-w-2xl">
            <Reveal variant="up" delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/85 mb-6 backdrop-blur">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Melbourne · Victoria · Since {2026 - site.stats.yearsInBusiness}
              </div>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <h1 className="heading-1 text-balance text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
                If your Benz hurts,
                <br />
                <span className="text-accent">bring it to {site.name.split(" ")[0]}.</span>
              </h1>
            </Reveal>

            <Reveal variant="up" delay={260}>
              <p className="lead mt-6 max-w-xl text-white/85">
                Factory-trained Mercedes-Benz specialists delivering the
                highest quality auto repair — without losing the personal
                relationships our customers value most.
              </p>
            </Reveal>

            <Reveal variant="up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
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
              <div className="mt-10 flex items-center gap-3 text-sm text-white/85">
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
          href="#services"
          aria-label="Scroll to next section"
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-white/30 grid place-items-start p-1">
            <span className="block w-1 h-2 rounded-full bg-white/70 animate-bounce" />
          </div>
        </a>
      </section>

      {/* Brand marquee */}
      <div id="services" className="pt-20 md:pt-24">
        <LogoMarquee />
      </div>

      {/* 3-column feature strip */}
      <section className="bg-ink-950 pb-6">
        <div className="container relative">
          <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {[
              {
                icon: Car,
                title: "All Benz models",
                desc: "From A-Class through S-Class, AMG, EQ electric, Sprinter & classics.",
              },
              {
                icon: Wrench,
                title: "Variety of services",
                desc: "Logbook servicing, brakes, transmission, diagnostics — all in one workshop.",
              },
              {
                icon: Shield,
                title: "Quality support",
                desc: "Warranty-safe workmanship, genuine parts, technicians who care.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
                <div className="bg-ink-900 p-8 h-full">
                  <div className="w-10 h-10 rounded-full border border-accent/30 bg-accent/10 text-accent grid place-items-center mb-5">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section bg-ink-950">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12">
            <Reveal>
              <div>
                <div className="eyebrow-muted mb-3">What we do</div>
                <h2 className="heading-2 max-w-2xl">
                  Our <span className="text-accent">auto repair</span>
                  <br />
                  service
                </h2>
              </div>
            </Reveal>
            <Reveal variant="right" delay={150}>
              <div className="flex items-center gap-4 rounded-2xl bg-ink-800 border border-white/5 p-4 max-w-md">
                <div className="hidden sm:block text-sm text-white/70">
                  Please call us to
                  <br />
                  obtain our services
                </div>
                <a href={`tel:${site.phone}`} className="btn-primary whitespace-nowrap">
                  <Phone className="w-4 h-4" /> Call us Now
                </a>
              </div>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => {
              const heroSrc =
                i % 3 === 0
                  ? img.engineBay
                  : i % 3 === 1
                  ? img.diagnostic
                  : img.brakes;
              return (
                <Reveal key={s.slug} delay={(i % 3) * 120}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-ink-800 border border-white/5 hover:border-accent/40 transition-colors"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={heroSrc}
                        alt={s.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
                      <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 text-ink-900 grid place-items-center">
                        <ServiceIcon name={s.icon} className="w-4 h-4" />
                      </div>
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-ink-900 grid place-items-center transition-transform group-hover:rotate-45">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-1">
                        {s.title.replace("Mercedes-Benz ", "")}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2">
                        {s.short}
                      </p>
                      {s.priceFrom && (
                        <div className="mt-3 text-xs text-white/50">
                          From{" "}
                          <strong className="text-white">
                            {s.priceFrom}
                          </strong>
                        </div>
                      )}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section bg-ink-950">
        <div className="container">
          <Reveal>
            <div className="relative rounded-[32px] bg-paper text-ink-900 p-8 md:p-14 lg:p-16 overflow-hidden">
              {/* blue dot pattern corner */}
              <div className="absolute -left-14 top-10 w-28 h-28 rounded-full border-8 border-accent/10" aria-hidden />

              <div className="grid lg:grid-cols-2 gap-10 items-center relative">
                <div>
                  <div className="eyebrow mb-3">About us</div>
                  <h2 className="heading-2 mb-6">
                    Precision care for every
                    <br />
                    Mercedes that rolls in.
                  </h2>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Reveal variant="right" delay={100}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                      <Image src={img.workshop2} alt="Workshop" fill sizes="50vw" className="object-cover" />
                    </div>
                  </Reveal>
                  <Reveal variant="right" delay={250}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mt-10">
                      <Image src={img.techAtWork} alt="Technician" fill sizes="50vw" className="object-cover" />
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WORKING PROCESS ============ */}
      <WorkingProcess />

      {/* ============ WHY CHOOSE US ============ */}
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

          <div className="grid md:grid-cols-3 gap-5">
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
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
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
        </div>
      </section>

      {/* ============ TESTIMONIALS (white) ============ */}
      <section className="section bg-paper text-ink-900">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start mb-12">
            <Reveal>
              <div>
                <div className="eyebrow mb-3">Reviews</div>
                <h2 className="heading-2">
                  What clients
                  <br />
                  <span className="text-accent">say us?</span>
                </h2>
              </div>
            </Reveal>
            <Reveal variant="right" delay={150}>
              <p className="lead-dark max-w-xl">
                Real feedback from real Melbourne Benz owners. More reviews live on our
                Google Business Profile.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="rounded-2xl bg-white shadow-light p-6 h-full border border-ink-900/5">
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
        </div>
      </section>

      {/* ============ NEWSLETTER CTA ============ */}
      <Newsletter />
    </>
  );
}
