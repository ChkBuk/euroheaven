import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, AlertTriangle, ArrowUpRight } from "lucide-react";
import { services, getService } from "@/lib/services";
import { img } from "@/lib/images";
import ServiceIcon from "@/components/ServiceIcon";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.title} Melbourne`,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

const heroImages = [img.engineBay, img.diagnostic, img.brakes, img.wheel, img.workshop2, img.techAtWork];

export default function ServiceDetail({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();
  const serviceIdx = services.findIndex((s) => s.slug === service.slug);
  const heroSrc = heroImages[serviceIdx % heroImages.length];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: { "@type": "AutoRepair", name: site.name, url: site.url },
    areaServed: "Melbourne, Victoria, Australia",
    description: service.description,
    offers: service.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: "AUD",
          price: service.priceFrom.replace(/[^0-9]/g, ""),
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative bg-ink-950 pt-16 pb-12 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <nav className="text-sm text-white/50 mb-5">
            <Link href="/services" className="hover:text-white">
              Services
            </Link>{" "}
            / <span className="text-white">{service.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent grid place-items-center">
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <div className="eyebrow">{service.title.replace("Mercedes-Benz ", "")}</div>
                </div>
                <h1 className="heading-1 mb-5">
                  {service.title}
                  <br />
                  <span className="text-accent">Melbourne</span>
                </h1>
                <p className="lead mb-8 max-w-xl">{service.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/book" className="btn-primary">
                    Book This Service <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  {service.priceFrom && (
                    <div className="btn bg-white/5 border border-white/10 text-white">
                      From{" "}
                      <strong className="ml-1 text-accent">
                        {service.priceFrom}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-[5/4] rounded-2xl overflow-hidden">
                <Image
                  src={heroSrc}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <Reveal>
              <div>
                <h2 className="heading-3 mb-5">What&apos;s included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {service.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 p-4 rounded-xl bg-ink-800 border border-white/5"
                    >
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {service.symptoms && (
              <Reveal>
                <div>
                  <h2 className="heading-3 mb-5">Signs you need this service</h2>
                  <ul className="space-y-2">
                    {service.symptoms.map((s) => (
                      <li
                        key={s}
                        className="flex gap-3 p-3 rounded-lg border border-white/5"
                      >
                        <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal>
              <div>
                <h2 className="heading-3 mb-5">Frequently asked questions</h2>
                <FAQ items={service.faqs} />
              </div>
            </Reveal>
          </div>

          <aside>
            <div className="card-dark sticky top-28">
              <div className="eyebrow mb-2">Ready to book?</div>
              <h3 className="text-2xl font-bold mb-3">
                Book your {service.title.replace("Mercedes-Benz ", "")}
              </h3>
              <p className="text-sm text-white/60 mb-5">
                Fast online booking. Confirmation by email & SMS.
              </p>
              <Link href="/book" className="btn-primary w-full mb-3">
                Book Now <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a href={`tel:${site.phone}`} className="btn-outline w-full">
                Call {site.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container">
          <h2 className="heading-3 mb-8">Other services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="card-dark hover:border-accent/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent grid place-items-center mb-3">
                    <ServiceIcon name={s.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {s.title.replace("Mercedes-Benz ", "")}
                  </h3>
                  <p className="text-sm text-white/60">{s.short}</p>
                  <div className="mt-3 text-sm text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
