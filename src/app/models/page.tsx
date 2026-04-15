import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { modelGroups } from "@/lib/models";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Mercedes-Benz Models We Service",
  description:
    "A-Class to S-Class, AMG, EQ Electric, Sprinter & Vito vans, and classic models. We service every Mercedes-Benz in Melbourne.",
  alternates: { canonical: "/models" },
};

export default function ModelsPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">Models We Service</div>
            <h1 className="heading-1 mb-5 max-w-3xl">
              Every Benz — <span className="text-accent">classic to electric</span>
            </h1>
            <p className="lead max-w-2xl">
              From daily-driven A-Class to AMG performance and the latest EQ
              range, our team has the tools and knowledge to service it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modelGroups.map((g, i) => (
            <Reveal key={g.group} delay={(i % 3) * 100}>
              <div className="card-dark h-full hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold">{g.group}</h2>
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 text-accent grid place-items-center text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <ul className="space-y-2">
                  {g.models.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2 text-white/75"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-paper text-ink-900">
        <div className="container text-center max-w-2xl">
          <h2 className="heading-3 mb-4">Don&apos;t see your model?</h2>
          <p className="lead-dark mb-6">
            If it has a three-pointed star on the bonnet, we can help.
          </p>
          <Link href="/book" className="btn-primary">
            Book Appointment <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
