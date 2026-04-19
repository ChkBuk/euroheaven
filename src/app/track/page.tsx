import type { Metadata } from "next";
import TrackForm from "@/components/TrackForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Track My Repair",
  description:
    "Check the real-time status of your Mercedes-Benz repair. Enter your booking reference or request a magic-link login.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <>
      <section className="relative bg-ink-950 pt-16 pb-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-2">Repair Status</div>
            <h1 className="heading-2 max-w-3xl">
              Track My <span className="text-accent">Repair</span>
            </h1>
            <p className="lead mt-3 max-w-xl">
              Enter your booking reference and rego (or email) to see live
              progress. Returning customer? Request a magic-link login.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section bg-ink-950">
        <div className="container max-w-2xl">
          <TrackForm initialRef={ref} />
        </div>
      </section>
    </>
  );
}
