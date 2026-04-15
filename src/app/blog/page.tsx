import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { posts } from "@/lib/blog";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog — Mercedes-Benz Tips & Insights",
  description:
    "Maintenance tips, model-specific guides, and Mercedes-Benz ownership advice from Melbourne's specialists.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <section className="relative bg-ink-950 pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full" aria-hidden />
        <div className="container relative">
          <Reveal>
            <div className="eyebrow mb-3">Blog</div>
            <h1 className="heading-1 mb-5 max-w-3xl">
              Mercedes-Benz tips & <span className="text-accent">maintenance guides</span>
            </h1>
            <p className="lead max-w-2xl">
              Straight-talking ownership advice from our workshop floor.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-950">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 120}>
              <Link
                href={`/blog/${p.slug}`}
                className="card-dark hover:border-accent/40 transition-colors flex flex-col h-full group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="eyebrow-muted text-white/40">
                    {new Date(p.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-accent group-hover:rotate-45 transition-all" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {p.title}
                </h2>
                <p className="text-sm text-white/60 mb-4 flex-1">
                  {p.excerpt}
                </p>
                <div className="flex items-center gap-1 text-xs text-white/50">
                  <Clock className="w-3 h-3" /> {p.readTime} min read
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
