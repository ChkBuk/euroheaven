import { site } from "@/lib/site";

export default function StructuredData() {
  const business = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${site.url}#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    image: `${site.url}/og-image.jpg`,
    logo: `${site.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -37.987,
      longitude: 145.215,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "17:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
    areaServed: {
      "@type": "State",
      name: "Victoria, Australia",
    },
    // AggregateRating — emitted only when the verified Google review
    // count is >= 5. Below that threshold Google penalises thin
    // schema-supplied ratings (manual action risk), and the marketing
    // upside isn't there anyway with only 1–4 reviews. Owner bumps
    // `verifiedGoogleReviewCount` in src/lib/site.ts as GBP grows.
    ...(site.stats.verifiedGoogleReviewCount >= 5
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.stats.verifiedGoogleRating.toString(),
            reviewCount: site.stats.verifiedGoogleReviewCount.toString(),
          },
        }
      : {}),
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Mercedes-Benz Repair and Servicing",
      },
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    sameAs: [site.social.facebook, site.social.instagram, site.social.google],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "customer service",
      areaServed: "AU",
      availableLanguage: ["English"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
