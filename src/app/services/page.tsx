import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/services";
import { img } from "@/lib/images";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mercedes-Benz Services Melbourne",
  description:
    "Full Mercedes-Benz servicing and repairs in Melbourne — logbook service, brakes, transmission, diagnostics, AC, pre-purchase inspections.",
  alternates: { canonical: "/services" },
};

const images = [img.engineBay, img.diagnostic, img.brakes, img.wheel, img.workshop2, img.techAtWork];

export default function ServicesPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">Our Services</div>
            <h1 className="heading-1 mb-5 max-w-3xl">
              Every Mercedes-Benz service <span className="text-accent">under one roof</span>
            </h1>
            <p className="lead max-w-2xl">
              From scheduled logbook servicing to complex AMG repairs and full
              factory diagnostics — warranty-safe parts, fluids, and workmanship.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 bg-ink-950">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 120}>
              <Link
                href={`/services/${s.slug}`}
                className="group block rounded-2xl overflow-hidden bg-ink-800 border border-white/5 hover:border-accent/40 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={images[i % images.length]}
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
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {s.short}
                  </p>
                  {s.priceFrom && (
                    <div className="text-xs text-white/50">
                      From <strong className="text-white">{s.priceFrom}</strong>
                    </div>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
