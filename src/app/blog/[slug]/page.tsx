import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ChevronLeft, ArrowUpRight } from "lucide-react";
import { posts, getPost, postReadTime, DEFAULT_AUTHOR } from "@/lib/blog";
import Reveal from "@/components/Reveal";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { site } from "@/lib/site";

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
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url: `${site.url}/blog/${p.slug}`,
      type: "article",
      publishedTime: p.date,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPost({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const author = p.author ?? DEFAULT_AUTHOR;
  const readMinutes = postReadTime(p);

  // BlogPosting JSON-LD — unlocks Google's article rich results and
  // makes the post eligible for Top Stories / Discover surfaces.
  // Author is now bound to the post-level field (or DEFAULT_AUTHOR
  // fallback) — a stronger E-E-A-T / GEO signal than a generic
  // organisation byline.
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@type": "Person", name: author },
    publisher: { "@id": `${site.url}#organization` },
    mainEntityOfPage: `${site.url}/blog/${p.slug}`,
    image: `${site.url}/og-image.jpg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
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
            {/* Author + datetime byline. <address> is the semantic
                element for author contact info; the rel="author"
                link reinforces that to crawlers. <time datetime="…">
                gives machines a clean ISO date for freshness
                detection — Google + AI engines extract this for
                E-E-A-T scoring and recency signals. */}
            <address className="not-italic flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55 mb-10">
              <span>
                By{" "}
                <a
                  href="/about"
                  rel="author"
                  className="text-white/80 hover:text-white"
                >
                  {author}
                </a>
              </span>
              <span className="text-white/30">·</span>
              <time dateTime={p.date}>
                {new Date(p.date).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {readMinutes} min read
              </span>
            </address>
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
