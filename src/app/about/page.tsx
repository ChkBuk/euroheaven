import Link from "next/link";
import Image from "next/image";
import { Award, Shield, Users, Clock, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { img } from "@/lib/images";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Mercedes-Benz Specialists Melbourne",
  description: `${site.stats.yearsInBusiness}+ years of Mercedes-Benz expertise in Melbourne. VACC-accredited, factory-trained technicians serving all of Victoria.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">About {site.name}</div>
            <h1 className="heading-1 mb-6 max-w-3xl">
              Built on expertise, trust, and a love for
              <br />
              the <span className="text-accent">three-pointed star.</span>
            </h1>
            <p className="lead max-w-2xl">
              For {site.stats.yearsInBusiness} years we&apos;ve looked after
              Mercedes-Benz owners across Melbourne and Victoria — dealer-level
              care without the dealer price tag.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="eyebrow-muted mb-3">Our Story</div>
              <h2 className="heading-2 mb-5">
                Specialist. <span className="text-accent">Independent.</span> Obsessive.
              </h2>
              <div className="space-y-4 text-white/70">
                <p>
                  {site.name} was founded by former Mercedes-Benz dealer
                  technicians who wanted to offer Melbourne owners a more
                  personal, honest alternative to franchise servicing.
                </p>
                <p>
                  Today we service everything from classic W124s to the latest
                  EQS electric saloons — using the same Xentry factory
                  diagnostic system, genuine or OEM parts, and approved fluids
                  as the dealerships.
                </p>
                <p>
                  VACC-accredited, LMCT-licensed, and a proud sponsor of
                  Melbourne&apos;s Mercedes-Benz Owners Club.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, value: site.stats.yearsInBusiness, suffix: "+", label: "Years specialising in Benz" },
              { icon: Users, value: 12000, suffix: "+", label: "Mercedes serviced" },
              { icon: Award, value: site.stats.googleReviewCount, suffix: "", label: "Five-star reviews" },
              { icon: Shield, value: 100, suffix: "%", label: "Warranty-safe work" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="card-dark text-center h-full">
                  <s.icon className="w-7 h-7 text-accent mx-auto mb-3" />
                  <div className="font-display text-3xl font-bold">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container">
          <Reveal>
            <div className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[16/7]">
              <Image
                src={img.workshop}
                alt="Euro Hevans workshop"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="eyebrow mb-2">Our workshop</div>
                <h3 className="heading-3 max-w-xl">
                  Factory diagnostic tools. Cleaner than your kitchen.
                </h3>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper text-ink-900">
        <div className="container-narrow text-center">
          <Reveal>
            <div className="eyebrow mb-3">Certifications</div>
            <h2 className="heading-2 mb-6">
              Accredited, licensed, continuously trained
            </h2>
            <p className="lead-dark mb-8">
              Our workshop is VACC accredited, LMCT licensed, and every
              technician completes regular Mercedes-Benz system updates.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["VACC Accredited", "LMCT Licensed", "RACV Partner", "Mercedes-Benz Trained", "Bosch Certified"].map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium shadow-light"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container text-center max-w-2xl">
          <h2 className="heading-2 mb-4">Come visit the workshop</h2>
          <p className="lead mb-8">
            {site.address.street}, {site.address.suburb} {site.address.state}{" "}
            {site.address.postcode}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="btn-primary">
              Book Appointment <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
