import type { Metadata } from "next";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing use of the ${site.name} website and the services we provide at our Melbourne workshop.`,
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "21 April 2026";

export default function TermsPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full"
          aria-hidden
        />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">Legal</div>
            <h1 className="heading-1 mb-6 max-w-3xl">Terms of Service</h1>
            <p className="lead max-w-2xl">
              The terms governing use of this website and the services we
              provide at our workshop. Last updated: {LAST_UPDATED}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container-narrow space-y-6 text-white/70 leading-relaxed">
          <h2 className="heading-3 mt-0 mb-3 text-white">1. Acceptance</h2>
          <p>
            By using this website or booking a service with {site.name}, you
            agree to these Terms. If you do not agree, please don't use the
            site or our services.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">2. Services</h2>
          <p>
            {site.name} is an independent specialist workshop based in{" "}
            {site.address.suburb}, {site.address.state}. We provide servicing,
            diagnostics, and repairs for European vehicles, with deepest
            expertise in Mercedes-Benz. A description of the services we offer
            is available on the <a href="/services" className="text-accent hover:underline">services page</a>.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">3. Bookings</h2>
          <p>
            A booking is only confirmed when we issue you a booking reference.
            Estimated turnaround times are indicative and may change based on
            parts availability and the nature of the work. We will keep you
            informed of any changes.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">4. Cancellations</h2>
          {/* Cancellation policy — review with legal counsel and operations */}
          <p>
            Please give us at least <strong className="text-white">24 hours' notice</strong>{" "}
            if you need to cancel or reschedule. Cancellations made with less
            notice may incur a fee to cover allocated workshop time.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">5. Quotes and approvals</h2>
          <p>
            Quotes are provided based on the information you supply and an
            initial assessment. Final pricing is confirmed once we have
            inspected the vehicle. We will obtain your written approval before
            commencing any work outside the originally quoted scope. Quotes
            are valid for 14 days unless stated otherwise.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">6. Payment</h2>
          {/* Payment terms — review with legal counsel and accounts */}
          <p>
            Payment is due in full on collection of the vehicle unless other
            arrangements have been agreed in writing. We accept major credit
            cards, EFTPOS, and direct bank transfer.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">7. Warranty</h2>
          {/* Warranty terms — review with legal counsel */}
          <p>
            We warrant labour for{" "}
            <strong className="text-white">12 months or 20,000 km</strong>,
            whichever comes first, against defects in workmanship. Parts carry
            the warranty offered by their manufacturer. The warranty does not
            cover normal wear and tear, damage from misuse or accident, or
            modifications made by third parties after our work. Manufacturer
            warranty on your vehicle is unaffected by independent servicing
            using approved parts and fluids — under Australian Consumer Law,
            new-car warranties cannot be voided for choosing an independent
            specialist.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">8. Liability</h2>
          <p>
            To the extent permitted by law, {site.name} is not liable for
            indirect, incidental, or consequential losses arising from the use
            of our services or this website. Nothing in these Terms excludes,
            restricts, or modifies any non-excludable rights or guarantees you
            have under the Australian Consumer Law.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">9. Governing law</h2>
          <p>
            These Terms are governed by the laws of Victoria, Australia. Any
            dispute arising in connection with them is subject to the
            exclusive jurisdiction of the Victorian courts.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">10. Changes</h2>
          <p>
            We may update these Terms from time to time. The "last updated"
            date at the top reflects the most recent revision. Continued use
            of the site or our services after changes are posted constitutes
            acceptance of the revised Terms.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">11. Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a href={`mailto:${site.email}`} className="text-accent hover:underline">
              {site.email}
            </a>{" "}
            or call us on{" "}
            <a href={`tel:${site.phone}`} className="text-accent hover:underline">
              {site.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
