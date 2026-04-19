// Workshop / automotive imagery. Mix of Unsplash + Pexels; remotePatterns
// in next.config.mjs must allow both hostnames. Swap for real client
// photography once available.

const PEXELS = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;

export const img = {
  // Hero / banner
  hero: PEXELS(20872015),      // Auto repair workshop interior — spare
  mechanic: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=80",

  // Per-service imagery (one per Service in services.ts).
  // All sourced from modern-luxury-car Pexels photography (2019+).
  oilChange: PEXELS(5158155),  // Shiny stainless engine detail of a new car
  brakes: PEXELS(17940957),    // Close-up of BMW wheel — modern European, 343 KB
  gearShifter: PEXELS(9538552),// Genesis (modern luxury) automatic gear selector
  diagnostic: PEXELS(13065692),// Close-up of mechanic working on a car engine (HQ)
  acDashboard: PEXELS(13850014), // Close-up of modern car AC vent (HQ)
  inspection: PEXELS(6720525), // Auto mechanic + customer in conversation (Gustavo Fring) — similar to reference

  // About section — Mercedes imagery, unique to that section
  aboutShowcase: PEXELS(14445440), // Black Mercedes-Benz G63 — home About section
  aboutWorkshop: PEXELS(8310738),  // Mercedes-Benz in a garage — About page banner

  // Generic workshop imagery
  engineBay: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80",
  wheel: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1000&q=80",
  workshop: PEXELS(8986130),    // White car elevated on a lift in modern shop
  workshop2: PEXELS(3894030),   // Vehicle on a car lift in modern garage
  techAtWork: "/images/mechanic-workshop.jpg",  // Local — used by Working Process
  benzGrille: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
};

export type ImgKey = keyof typeof img;
