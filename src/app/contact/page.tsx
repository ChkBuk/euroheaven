import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name}, Mercedes-Benz specialists in Melbourne. Call ${site.phoneDisplay} or book online.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${site.name}`,
    description: `Mercedes-Benz specialists in Melbourne. Call ${site.phoneDisplay} or book online.`,
    url: `${site.url}/contact`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  const mapQ = encodeURIComponent(
    `${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`
  );

  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">Get in touch</div>
            <h1 className="heading-1 max-w-3xl">
              Talk to a <span className="text-accent">Mercedes specialist</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left column: h-full so it fills the grid row height (which
              is determined by the taller "Send us a message" card on the
              right). md:justify-between then distributes the 4 contact
              cards evenly down that full height, with gap-4 acting as a
              floor on mobile where there's no equal-height constraint. */}
          <div className="flex flex-col gap-4 h-full md:justify-between">
            {[
              { icon: MapPin, title: "Workshop", value: `${site.address.street}\n${site.address.suburb} ${site.address.state} ${site.address.postcode}`, href: null },
              { icon: Phone, title: "Phone", value: site.phoneDisplay, href: `tel:${site.phone}` },
              { icon: Mail, title: "Email", value: site.email, href: `mailto:${site.email}` },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="card-dark flex gap-4">
                  <div className="w-11 h-11 bg-accent/10 border border-accent/30 text-accent grid place-items-center flex-shrink-0">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{c.title}</h3>
                    {c.href ? (
                      <a href={c.href} className="text-white/70 text-sm hover:text-white">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-white/70 text-sm whitespace-pre-line">
                        {c.value}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={300}>
              <div className="card-dark flex gap-4">
                <div className="w-11 h-11 bg-accent/10 border border-accent/30 text-accent grid place-items-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    {site.hours.map((h) => (
                      <li key={h.day}>
                        <strong className="text-white/90">{h.day}:</strong>{" "}
                        {h.time}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={150}>
            <div className="card-dark">
              <h2 className="heading-3 mb-5">Send us a message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="aspect-[16/9] md:aspect-[16/6] bg-ink-900">
        <iframe
          src={`https://www.google.com/maps?q=${mapQ}&output=embed`}
          className="w-full h-full border-0 grayscale contrast-125"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Workshop location"
        />
      </section>
    </>
  );
}
