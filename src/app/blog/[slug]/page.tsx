import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ChevronLeft, ArrowUpRight } from "lucide-react";
import { posts, getPost } from "@/lib/blog";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
  };
}

export default async function BlogPost({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Blog", path: "/blog" },
          { name: p.title, path: `/blog/${p.slug}` },
        ]}
      />
      <article className="section bg-ink-950">
        <div className="container-narrow">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6"
          >
            <ChevronLeft className="w-4 h-4" /> All posts
          </Link>
          <Reveal>
            <h1 className="heading-1 mb-4">{p.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/50 mb-10">
              <time>
                {new Date(p.date).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {p.readTime} min read
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-5 text-white/75 leading-relaxed text-lg">
              {p.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: para.replace(
                      /\*\*(.+?)\*\*/g,
                      '<strong class="text-white">$1</strong>'
                    ),
                  }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      <section className="section bg-ink-900">
        <div className="container text-center max-w-xl">
          <h2 className="heading-3 mb-3">Need Mercedes service?</h2>
          <p className="text-white/60 mb-6">Book online in 60 seconds.</p>
          <Link href="/book" className="btn-primary">
            Book Appointment <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
