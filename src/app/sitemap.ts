import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { posts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    "",
    "/services",
    "/models",
    "/about",
    "/contact",
    "/book",
    "/track",
    "/reviews",
    "/blog",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const legalUrls: MetadataRoute.Sitemap = ["/privacy", "/terms"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    })
  );

  const serviceUrls: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const suburbUrls: MetadataRoute.Sitemap = site.suburbs.map((s) => ({
    url: `${base}/mercedes-service/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Service × Suburb matrix — 6 services × 30 suburbs = 180 pages.
  // Each renders at /services/{service-slug}/{suburb-slug} with
  // suburb-unique local content + AutoRepair JSON-LD bound to that
  // suburb. The cartesian product is generated server-side here so
  // Google discovers every combination on the next sitemap fetch.
  const matrixUrls: MetadataRoute.Sitemap = services.flatMap((sv) =>
    site.suburbs.map((sb) => ({
      url: `${base}/services/${sv.slug}/${sb.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    }))
  );

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...statics,
    ...legalUrls,
    ...serviceUrls,
    ...suburbUrls,
    ...matrixUrls,
    ...postUrls,
  ];
}
