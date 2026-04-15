export const site = {
  name: "Euro Heavens",
  tagline: "Melbourne's Trusted Mercedes-Benz Specialists",
  description:
    "Factory-trained Mercedes-Benz specialists in Melbourne. Logbook servicing, diagnostics, brake & transmission repair for all Benz models across Victoria.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://eurohevans.com.au",
  phone: "+61 3 9000 0000",
  phoneDisplay: "(03) 9000 0000",
  email: "service@eurohevans.com.au",
  address: {
    street: "123 Example Road",
    suburb: "Richmond",
    state: "VIC",
    postcode: "3121",
    country: "Australia",
  },
  hours: [
    { day: "Mon – Fri", time: "7:30am – 5:30pm" },
    { day: "Saturday", time: "8:00am – 1:00pm" },
    { day: "Sunday", time: "Closed" },
  ],
  abn: "00 000 000 000",
  social: {
    facebook: "https://facebook.com/eurohevans",
    instagram: "https://instagram.com/eurohevans",
    google: "https://g.page/eurohevans",
  },
  stats: {
    yearsInBusiness: 18,
    carsServiced: "12,000+",
    googleRating: 4.9,
    googleReviewCount: 284,
  },
  suburbs: [
    "Richmond",
    "South Yarra",
    "Toorak",
    "Hawthorn",
    "Kew",
    "Camberwell",
    "Brighton",
    "Malvern",
    "Glen Iris",
    "Caulfield",
    "Armadale",
    "Prahran",
  ],
} as const;

export type Site = typeof site;
