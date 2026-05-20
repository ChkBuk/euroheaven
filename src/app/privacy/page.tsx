import type { Metadata } from "next";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects information about visitors and customers, in line with the Australian Privacy Act 1988.`,
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "21 April 2026";

export default function PrivacyPage() {
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
            <h1 className="heading-1 mb-6 max-w-3xl">Privacy Policy</h1>
            <p className="lead max-w-2xl">
              How {site.name} collects, uses, and protects your information.
              Last updated: {LAST_UPDATED}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container-narrow space-y-6 text-white/70 leading-relaxed">
          <h2 className="heading-3 mt-0 mb-3 text-white">Who we are</h2>
          <p>
            {site.name} ({site.tagline}) operates this website at{" "}
            <span className="text-white">{site.url.replace("https://", "")}</span>.
            Our workshop is at {site.address.street}, {site.address.suburb}{" "}
            {site.address.state} {site.address.postcode}, Australia. You can
            reach us on <a href={`tel:${site.phone}`} className="text-accent hover:underline">{site.phoneDisplay}</a>{" "}
            or <a href={`mailto:${site.email}`} className="text-accent hover:underline">{site.email}</a>.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">What we collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-white">Booking details</strong> — your
              name, phone, email, vehicle details (year, model, rego, odometer),
              symptoms or service description, requested date and drop-off
              method, and any notes you provide.
            </li>
            <li>
              <strong className="text-white">Contact form messages</strong> —
              name, phone, email, subject, and the body of your enquiry.
            </li>
            <li>
              <strong className="text-white">Newsletter subscription</strong> —
              just your email address.
            </li>
            <li>
              <strong className="text-white">Server logs</strong> — IP address,
              browser/device information, and request paths, kept by our
              hosting provider for security and diagnostics.
            </li>
          </ul>

          <h2 className="heading-3 mt-8 mb-3 text-white">How we use it</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To deliver the service you requested (servicing, quotes, repairs).</li>
            <li>
              To communicate about your booking (confirmation, status updates,
              completion notifications) by email and SMS.
            </li>
            <li>
              To improve our service through anonymised usage patterns.
            </li>
            <li>
              To send the optional newsletter you subscribed to. You can
              unsubscribe at any time using the link in any newsletter email.
            </li>
          </ul>

          <h2 className="heading-3 mt-8 mb-3 text-white">Third parties</h2>
          <p>
            We share the minimum information needed with the following service
            providers to operate this site:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong className="text-white">Resend</strong> — handles
              transactional email (booking confirmations, contact form
              forwards). Resend processes data in the US and EU.
            </li>
            <li>
              <strong className="text-white">Vercel</strong> — hosts the
              website and processes server logs.
            </li>
            <li>
              <strong className="text-white">Google Gemini</strong> — powers
              the on-site AI assistant (when you choose to use it). Your
              messages to the assistant are sent to Google for processing.
            </li>
          </ul>
          <p>
            We may add Google Analytics in the future to understand site usage.
            If we do, the cookie banner on this site will ask for your consent
            first and analytics will only run if you accept.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">Data retention</h2>
          {/* Retention period — review with legal counsel */}
          <p>
            Booking and invoicing records are retained for{" "}
            <strong className="text-white">at least 7 years</strong> in line
            with Australian Taxation Office record-keeping requirements.
            Contact form messages are kept for as long as they remain
            relevant to ongoing communication. You can request deletion of
            personal information at any time, subject to legal record-keeping
            obligations.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">Your rights</h2>
          <p>
            Under the{" "}
            <em>Privacy Act 1988 (Cth)</em> and the Australian Privacy
            Principles, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access the personal information we hold about you.</li>
            <li>Ask us to correct or update inaccurate information.</li>
            <li>Make a complaint about how we handled your information.</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href={`mailto:${site.email}`} className="text-accent hover:underline">
              {site.email}
            </a>
            . If you're not satisfied with our response, you can lodge a
            complaint with the Office of the Australian Information
            Commissioner at{" "}
            <a
              href="https://www.oaic.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              oaic.gov.au
            </a>
            .
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">Cookies</h2>
          <p>
            This site uses functional cookies (and similar browser storage)
            to remember whether you've accepted our cookie notice. We do not
            currently use tracking or advertising cookies. Your consent state
            is stored in your browser under the key{" "}
            <code className="text-white">euroheaven.consent.v1</code> — you can
            clear it any time from your browser settings to be re-prompted.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">Changes to this policy</h2>
          <p>
            We may revise this policy from time to time. The "last updated"
            date at the top of this page will reflect any changes. Material
            changes will be communicated through a banner on the site.
          </p>

          <h2 className="heading-3 mt-8 mb-3 text-white">Contact us</h2>
          <p>
            For privacy questions, write to{" "}
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
