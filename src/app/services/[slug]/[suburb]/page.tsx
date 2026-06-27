import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { services, getService } from "@/lib/services";
import { img } from "@/lib/images";
import ServiceIcon from "@/components/ServiceIcon";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { site } from "@/lib/site";

/**
 * Service × Suburb matrix page.
 *
 * Generates one page per (service, suburb) combination — 6 services
 * × 30 suburbs = 180 static pages. Each renders:
 *   - A suburb-unique hero introducing the service in that suburb's
 *     local context (distance, drivetime, popular MB models in that
 *     suburb, the local note from site.ts)
 *   - The generic service body (what's included, FAQ from the
 *     service entry)
 *   - A suburb-specific FAQ entry about the drive / collection
 *   - AutoRepair JSON-LD with areaServed bound to this suburb — the
 *     highest-leverage local-SEO signal we have
 *   - Internal links to the 5 closest other suburbs for this same
 *     service, and to the parent /services/{slug} page
 *
 * URL pattern: /services/{service-slug}/{suburb-slug}
 *   e.g. /services/brake-repair/toorak
 *
 * Phase C of the SEO plan — kills the "near me" gap and creates a
 * single-page landing for high-intent searches like
 * "mercedes brake repair toorak".
 */

type RouteParams = Promise<{ slug: string; suburb: string }>;

export function generateStaticParams() {
  return services.flatMap((sv) =>
    site.suburbs.map((sb) => ({ slug: sv.slug, suburb: sb.slug }))
  );
}

function getSuburb(slug: string) {
  return site.suburbs.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug, suburb } = await params;
  const service = getService(slug);
  const sb = getSuburb(suburb);
  if (!service || !sb) return { title: "Not found" };
  // CTR formula applied per (service, suburb) cell
  const title = `${service.title} ${sb.name} — Local Specialist, Factory Trained | Euro Heaven`;
  const description = `${service.title} for ${sb.name} Mercedes owners. ${sb.distanceKm} km / ${sb.drivetimeMin} minutes from our Dandenong workshop. Factory-trained technicians, genuine parts, Xentry diagnostics — warranty-safe.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}/${sb.slug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/services/${service.slug}/${sb.slug}`,
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function ServiceSuburbPage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug, suburb } = await params;
  const service = getService(slug);
  const sb = getSuburb(suburb);
  if (!service || !sb) notFound();

  // AutoRepair JSON-LD bound to THIS suburb — the strongest local
  // SEO signal we have for matrix pages. Per-page entity means
  // Google's Knowledge Graph can associate Euro Heaven with each
  // suburb independently.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${site.url}/services/${service.slug}/${sb.slug}#business`,
    name: `${site.name} — ${service.title} ${sb.name}`,
    description: `${service.title} for ${sb.name} Mercedes-Benz owners. ${sb.localNote}`,
    url: `${site.url}/services/${service.slug}/${sb.slug}`,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/logo.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: "AU",
    },
    areaServed: {
      "@type": "City",
      name: `${sb.name}, Victoria, Australia`,
    },
    parentOrganization: { "@id": `${site.url}#organization` },
  };

  // Per-suburb FAQ. The drive / collection question is the most
  // common one and varies by suburb — embedding it as FAQPage schema
  // gives us the exact-question rich result on SERPs.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How far is Euro Heaven from ${sb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Euro Heaven's workshop is at 27 Podmore Street, Dandenong VIC 3175 — about ${sb.distanceKm} km from ${sb.name}, a ${sb.drivetimeMin}-minute drive off-peak. We offer courtesy collection and drop-off across south-east Melbourne on request.`,
        },
      },
      {
        "@type": "Question",
        name: `What Mercedes models do you see from ${sb.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The most common Mercedes models we service from ${sb.name} are the ${sb.popularModels.join(", ")}. We service every MB model — A-Class through S-Class, AMG, EQ Electric, Sprinter / Vito vans, and classic models too.`,
        },
      },
      ...service.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ],
  };

  const heroSrc = img[service.image];

  // Nearby suburbs (by distance) for the same service — internal-link
  // matrix.
  const nearbySuburbs = site.suburbs
    .filter((x) => x.slug !== sb.slug)
    .slice()
    .sort(
      (a, b) =>
        Math.abs(a.distanceKm - sb.distanceKm) -
        Math.abs(b.distanceKm - sb.distanceKm)
    )
    .slice(0, 6);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
          {
            name: sb.name,
            path: `/services/${service.slug}/${sb.slug}`,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative bg-ink-950 pt-16 pb-12 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <nav className="text-sm text-white/50 mb-5">
            <Link href="/services" className="hover:text-white">
              Services
            </Link>{" "}
            /{" "}
            <Link
              href={`/services/${service.slug}`}
              className="hover:text-white"
            >
              {service.title}
            </Link>{" "}
            / <span className="text-white">{sb.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/30 text-accent grid place-items-center">
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <div className="eyebrow inline-flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> {sb.name},
                    Victoria
                  </div>
                </div>
                <h1 className="heading-1 mb-5">
                  {service.title}
                  <br />
                  <span className="text-accent">{sb.name}</span>
                </h1>
                {/* Answer-first TL;DR — surfaces the page's primary
                    answer for AI extraction. */}
                <p
                  className="mb-6 max-w-xl text-base md:text-lg text-white border-l-4 border-accent pl-4 py-1 bg-accent/5 rounded-r"
                  data-testid="matrix-tldr"
                >
                  <strong className="text-accent">TL;DR — </strong>
                  {service.answer} For {sb.name} owners we're{" "}
                  {sb.distanceKm} km / {sb.drivetimeMin} minutes away, with
                  collection runs on request.
                </p>
                {/* Suburb-unique local paragraph */}
                <p className="text-white/80 max-w-xl mb-4">
                  {sb.localNote} The Mercedes models we see most often
                  from {sb.name} are the{" "}
                  <strong className="text-white">
                    {sb.popularModels.join(", ")}
                  </strong>{" "}
                  — and {service.title.toLowerCase()} is one of the
                  most common reasons {sb.name} owners book us.
                </p>
                <p className="lead mb-8 max-w-xl">{service.description}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/book" className="btn-primary">
                    Book This Service <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <a href={`tel:${site.phone}`} className="btn-outline">
                    <Phone className="w-4 h-4" /> {site.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal variant="scale" delay={150}>
              <div className="relative aspect-[4/3] bg-ink-800 overflow-hidden">
                <Image
                  src={heroSrc}
                  alt={`${service.title} for Mercedes owners in ${sb.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid lg:grid-cols-[2fr_1fr] gap-12">
          <div>
            <Reveal>
              <h2 className="heading-2 mb-6">
                What's included in {service.title.replace("Mercedes-Benz ", "")} for{" "}
                <span className="text-accent">{sb.name}</span> owners
              </h2>
              <ul className="space-y-3 mb-10">
                {service.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-white/85"
                  >
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="heading-3 mb-4">
                Frequently asked questions
              </h2>
              {/* Mirror the FAQ in DOM that FAQPage schema declares */}
              <div className="space-y-4 mb-8">
                <details className="card-dark group">
                  <summary className="cursor-pointer font-semibold flex items-center justify-between">
                    How far is Euro Heaven from {sb.name}?
                    <span className="text-accent group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-white/75">
                    Our workshop at 27 Podmore Street, Dandenong is about{" "}
                    {sb.distanceKm} km from {sb.name} — a{" "}
                    {sb.drivetimeMin}-minute drive off-peak. We offer
                    courtesy collection and drop-off across south-east
                    Melbourne on request.
                  </p>
                </details>
                <details className="card-dark group">
                  <summary className="cursor-pointer font-semibold flex items-center justify-between">
                    What Mercedes models do you see from {sb.name}?
                    <span className="text-accent group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-white/75">
                    The most common Mercedes models we service from{" "}
                    {sb.name} are the {sb.popularModels.join(", ")}. We
                    service every Mercedes model though — A-Class
                    through S-Class, AMG, EQ Electric, Sprinter / Vito
                    vans, and classic models.
                  </p>
                </details>
              </div>
              <FAQ items={service.faqs} />
            </Reveal>
          </div>

          {/* Sidebar — also serving nearby + parent service link */}
          <aside className="space-y-6">
            <Reveal variant="right">
              <div className="card-dark">
                <h3 className="font-semibold mb-3">
                  {service.title.replace("Mercedes-Benz ", "")} nearby
                </h3>
                <p className="text-sm text-white/65 mb-4">
                  We also serve these {sb.name}-adjacent suburbs for{" "}
                  {service.title.toLowerCase()}.
                </p>
                <div className="flex flex-wrap gap-2">
                  {nearbySuburbs.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/services/${service.slug}/${other.slug}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:border-accent hover:text-accent transition-colors"
                    >
                      {other.name}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={120}>
              <div className="card-dark">
                <h3 className="font-semibold mb-3">
                  Full {service.title} details
                </h3>
                <p className="text-sm text-white/65 mb-4">
                  See the complete service description, what's included,
                  and pricing on the parent service page.
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="btn-outline btn-sm inline-flex"
                >
                  {service.title} overview{" "}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container text-center max-w-xl">
          <h2 className="heading-3 mb-3">
            Ready to book your {service.title.toLowerCase().replace("mercedes-benz ", "")}?
          </h2>
          <p className="text-white/65 mb-6">
            Online booking takes about 60 seconds. Confirmation by SMS +
            email, with a courtesy vehicle on request for {sb.name}
            customers.
          </p>
          <Link href="/book" className="btn-primary">
            Book Appointment <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
