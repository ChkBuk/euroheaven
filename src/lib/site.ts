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
    street: "123, ABC Avenue",
    suburb: "Dandedong",
    state: "Victoria",
    postcode: "",
    country: "Australia",
  },
  hours: [
    { day: "Mon – Fri", time: "7:30am – 5:30pm" },
    { day: "Saturday", time: "8:00am – 1:00pm" },
    { day: "Sunday", time: "Closed" },
  ],
  abn: "123 456 789 123",
  social: {
    facebook: "https://facebook.com/euroheaven",
    instagram: "https://instagram.com/euroheaven",
    google: "https://g.page/euroheaven",
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
