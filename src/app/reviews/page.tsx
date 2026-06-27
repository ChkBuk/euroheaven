import type { Metadata } from "next";
import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/store";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: `Customer Reviews — ${site.stats.googleRating}★ from ${site.stats.googleReviewCount}+ Mercedes Owners | Euro Heaven`,
  description: `Real reviews from Melbourne Mercedes-Benz owners. ${site.stats.googleRating}★ average rating from ${site.stats.googleReviewCount}+ customers across logbook service, brakes, AMG and transmission work.`,
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: `Customer Reviews — ${site.stats.googleRating}★ from ${site.stats.googleReviewCount}+ Mercedes Owners | Euro Heaven`,
    description: `${site.stats.googleRating}★ average rating from real Mercedes-Benz customers across Melbourne. Read first-hand experiences from logbook, brake, transmission and AMG work.`,
    url: `${site.url}/reviews`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await db.listReviews();
  const avg =
    reviews.reduce((a, r) => a + r.stars, 0) / (reviews.length || 1);

  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative text-center">
          <Reveal>
            <div className="eyebrow mb-3 justify-center inline-flex">Customer Reviews</div>
            <h1 className="heading-1 mb-5 max-w-3xl mx-auto">
              Trusted by Melbourne&apos;s <span className="text-accent">Mercedes owners</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(avg)
                        ? "w-6 h-6 fill-accent text-accent"
                        : "w-6 h-6 text-white/20"
                    }
                  />
                ))}
              </div>
              <span className="text-xl font-semibold">
                {avg.toFixed(1)} from {reviews.length}+ reviews
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper text-ink-900">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 120}>
              <div className="bg-white shadow-light p-6 h-full border border-ink-900/5">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={
                        idx < r.stars
                          ? "w-4 h-4 fill-accent text-accent"
                          : "w-4 h-4 text-ink-900/15"
                      }
                    />
                  ))}
                </div>
                <p className="italic text-ink-900/80 mb-5 leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-ink-900/10">
                  <div className="w-10 h-10 rounded-full bg-accent/15 text-accent grid place-items-center font-semibold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-ink-900/55">{r.car}</div>
                    <div className="text-[11px] text-ink-900/40 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container text-center max-w-2xl">
          <h2 className="heading-3 mb-3">Had your Mercedes serviced with us?</h2>
          <p className="lead mb-6">
            Leave a review from your track-repair page once your service is
            complete.
          </p>
          <Link href="/track" className="btn-primary">
            Track your repair <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
