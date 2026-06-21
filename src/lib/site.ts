export const site = {
  name: "Euro Heaven",
  tagline: "Melbourne's Trusted Mercedes-Benz Specialists",
  description:
    "Factory-trained Mercedes-Benz specialists in Melbourne. Logbook servicing, diagnostics, brake & transmission repair for all Benz models across Victoria.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://euroheaven.com.au",
  phone: "+61 400 115 765",
  phoneDisplay: "400 115 765",
  email: "info@euroheaven.com.au",
  address: {
    street: "27 Podmore Street",
    suburb: "Dandenong",
    state: "VIC",
    postcode: "3175",
    country: "Australia",
  },
  hours: [
    { day: "Mon – Fri", time: "7:30am – 5:30pm" },
    { day: "Saturday", time: "8:00am – 1:00pm" },
    { day: "Sunday", time: "Closed" },
  ],
  abn: "20 657 028 585",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61590991658344",
    instagram: "https://www.instagram.com/euroheavenptyltd/",
    google: "https://share.google/8eu23suw0CSQdjfH6",
  },
  stats: {
    yearsInBusiness: 4,
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
