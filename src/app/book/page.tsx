import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your Mercedes-Benz service online in under 60 seconds. Choose service, time, and we'll confirm by email and SMS.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-16 pb-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-2">Online Booking</div>
            <h1 className="heading-2 max-w-3xl">
              Book your Mercedes-Benz <span className="text-accent">appointment</span>
            </h1>
            <p className="lead mt-3 max-w-xl">
              Takes about 60 seconds. Confirmation by email & SMS.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section bg-ink-950">
        <div className="container max-w-3xl">
          <BookingWizard />
        </div>
      </section>
    </>
  );
}
