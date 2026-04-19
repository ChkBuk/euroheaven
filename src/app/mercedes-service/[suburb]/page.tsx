import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Car, Phone, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { img } from "@/lib/images";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const suburbSlugs = site.suburbs.map((s) => ({
  slug: s.toLowerCase().replace(/\s+/g, "-"),
  name: s,
}));

export function generateStaticParams() {
  return suburbSlugs.map((s) => ({ suburb: s.slug }));
}

function getSuburb(slug: string) {
  return suburbSlugs.find((s) => s.slug === slug);
}

type RouteParams = Promise<{ suburb: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { suburb } = await params;
  const s = getSuburb(suburb);
  if (!s) return { title: "Not found" };
  return {
    title: `Mercedes-Benz Service ${s.name}`,
    description: `Mercedes-Benz specialist servicing and repairs for ${s.name} owners. Genuine parts, factory diagnostics, fully warranty compliant.`,
    alternates: { canonical: `/mercedes-service/${s.slug}` },
  };
}

export default async function SuburbPage({
  params,
}: {
  params: RouteParams;
}) {
  const { suburb } = await params;
  const s = getSuburb(suburb);
  if (!s) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {
            name: `Mercedes-Benz Service ${s.name}`,
            path: `/mercedes-service/${s.slug}`,
          },
        ]}
      />
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3 inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Servicing {s.name}
            </div>
            <h1 className="heading-1 mb-6 max-w-3xl">
              Mercedes-Benz Service <span className="text-accent">{s.name}</span>
            </h1>
            <p className="lead max-w-3xl mb-8">
              {site.name} is the trusted Mercedes-Benz specialist for{" "}
              {s.name} residents. Factory-level servicing, repair, and diagnostics
              — just minutes from {s.name}, with courtesy vehicles on request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book" className="btn-primary">
                Book Appointment <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a href={`tel:${site.phone}`} className="btn-outline">
                <Phone className="w-4 h-4" /> {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container">
          <Reveal>
            <div className="max-w-2xl mb-10">
              <h2 className="heading-2 mb-4">
                Mercedes specialists near <span className="text-accent">{s.name}</span>
              </h2>
              <p className="lead">
                Whether you drive a C-Class, GLC, E63 AMG or a classic SL, our
                team has the factory tools to keep your Mercedes running at its
                best.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((sv, i) => (
              <Reveal key={sv.slug} delay={(i % 3) * 120}>
                <Link
                  href={`/services/${sv.slug}`}
                  className="group block overflow-hidden bg-ink-800 border border-white/5 hover:border-accent/40 transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={img[sv.image]}
                      alt={sv.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 text-ink-900 grid place-items-center">
                      <ServiceIcon name={sv.icon} className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold mb-1">
                      {sv.title.replace("Mercedes-Benz ", "")} in {s.name}
                    </h3>
                    <p className="text-sm text-white/60">{sv.short}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <div className="eyebrow-muted mb-3">Why {s.name} owners choose us</div>
              <h2 className="heading-2 mb-5">
                Local expertise. <span className="text-accent">Factory standards.</span>
              </h2>
              <ul className="space-y-3 text-white/80">
                <li className="flex gap-3">
                  <Car className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span>
                    Convenient drop-off just minutes from {s.name}. Courtesy
                    vehicles available on request.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Car className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span>
                    Factory Xentry diagnostics, genuine Mercedes parts, and MB
                    approved fluids — warranty protected.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Car className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span>
                    Real-time online repair tracking and SMS status updates.
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal variant="right" delay={150}>
            <div className="card-dark">
              <h3 className="text-xl font-semibold mb-4">Also serving nearby</h3>
              <div className="flex flex-wrap gap-2">
                {site.suburbs
                  .filter((x) => x !== s.name)
                  .slice(0, 8)
                  .map((other) => (
                    <Link
                      key={other}
                      href={`/mercedes-service/${other
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:border-accent hover:text-accent transition-colors"
                    >
                      {other}
                    </Link>
                  ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
