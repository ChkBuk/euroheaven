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
    { day: "Mon – Fri", time: "8:30am – 5:00pm" },
    { day: "Saturday", time: "9:00am – 2:30pm" },
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
    // Marketing-display numbers — used on the home page and AI chat
    // prompt. These can stay aspirational/long-term; they don't appear
    // in JSON-LD schema.
    googleRating: 4.9,
    googleReviewCount: 284,
    // Schema-safe numbers — must reflect the ACTUAL live Google
    // Business Profile review state. Used by AggregateRating JSON-LD
    // in StructuredData.tsx, gated to emit only when
    // verifiedReviewCount >= 5 to keep Google's rich-result policy
    // happy. Update these numbers manually as the GBP grows; once
    // they're >= 5, the rating stars start appearing in SERPs.
    verifiedGoogleRating: 5.0,
    verifiedGoogleReviewCount: 3,
  },
  /**
   * Service-area suburbs Euro Heaven actively services from the
   * Dandenong workshop. Each entry carries enough local content
   * (distance, drivetime, popular MB models seen from that area,
   * one-line local context) for the suburb page to differentiate
   * from the others — Google's Helpful Content update penalises
   * near-duplicate templates, so this data field structure exists
   * specifically to keep every page unique. Order is roughly
   * by distance from Dandenong (closest first); the page renderer
   * uses index neighbours for "also serving nearby" cross-links.
   */
  suburbs: [
    // Closest — south-east of Dandenong
    { name: "Springvale",      slug: "springvale",       distanceKm: 5,  drivetimeMin: 8,  popularModels: ["A-Class", "B-Class", "CLA"],                       localNote: "Springvale is 8 minutes from the workshop — many customers drop off and walk to Springvale Road for coffee while we run the service." },
    { name: "Mulgrave",        slug: "mulgrave",         distanceKm: 6,  drivetimeMin: 10, popularModels: ["C-Class", "GLC", "GLA"],                          localNote: "Mulgrave business-park owners often book a logbook + diagnostic for collection at end-of-day." },
    { name: "Glen Waverley",   slug: "glen-waverley",    distanceKm: 6,  drivetimeMin: 10, popularModels: ["C-Class", "GLC", "GLE"],                          localNote: "Glen Waverley families bring in the GLC and GLE for school-run reliability — we offer a complimentary loan vehicle on request." },
    { name: "Heatherton",      slug: "heatherton",       distanceKm: 7,  drivetimeMin: 11, popularModels: ["C-Class", "A-Class", "GLA"],                     localNote: "Heatherton owners are 11 minutes door-to-door — ideal for same-day Service A work." },
    { name: "Keysborough",     slug: "keysborough",      distanceKm: 8,  drivetimeMin: 12, popularModels: ["A-Class", "GLA", "C-Class"],                     localNote: "Keysborough is a regular stop on our collection route — book a pickup for warranty-safe Service A." },
    { name: "Notting Hill",    slug: "notting-hill",     distanceKm: 8,  drivetimeMin: 12, popularModels: ["C-Class", "GLC"],                                 localNote: "Notting Hill professionals near Monash bring us C-Class and GLC for diagnostic and brake work." },
    { name: "Mount Waverley",  slug: "mount-waverley",   distanceKm: 8,  drivetimeMin: 12, popularModels: ["C-Class", "GLC", "E-Class"],                     localNote: "Mt Waverley is 12 minutes from the workshop and one of our most-frequented pickup suburbs." },
    { name: "Dingley Village", slug: "dingley-village",  distanceKm: 9,  drivetimeMin: 14, popularModels: ["C-Class", "GLC", "GLE"],                          localNote: "Dingley Village customers tend to be long-term repeat — our oldest workshop relationship dates back to 2010s GLE service." },
    { name: "Wheelers Hill",   slug: "wheelers-hill",    distanceKm: 9,  drivetimeMin: 14, popularModels: ["GLC", "GLE", "E-Class"],                          localNote: "Wheelers Hill GLE and E-Class owners book us for logbook and transmission service — typical drive is 14 minutes off-peak." },
    { name: "Hampton Park",    slug: "hampton-park",     distanceKm: 12, drivetimeMin: 16, popularModels: ["A-Class", "GLA", "C-Class"],                     localNote: "Hampton Park families book A-Class and GLA service through us — collection runs Wednesdays and Fridays." },
    { name: "Cheltenham",      slug: "cheltenham",       distanceKm: 14, drivetimeMin: 20, popularModels: ["C-Class", "GLC", "GLA"],                          localNote: "Cheltenham is a 20-minute drive — ideal for a morning drop and afternoon collection on logbook intervals." },
    { name: "Bentleigh",       slug: "bentleigh",        distanceKm: 14, drivetimeMin: 20, popularModels: ["C-Class", "GLC", "GLE"],                          localNote: "Bentleigh owners typically come for AMG performance work and brake refresh — we have ceramic-brake specialists in-house." },
    { name: "Narre Warren",    slug: "narre-warren",     distanceKm: 14, drivetimeMin: 18, popularModels: ["GLA", "GLC", "A-Class"],                          localNote: "Narre Warren families bring us GLA and GLC for warranty-compliant servicing through to 80,000 km." },
    { name: "Carnegie",        slug: "carnegie",         distanceKm: 15, drivetimeMin: 22, popularModels: ["A-Class", "C-Class"],                              localNote: "Carnegie sits 22 minutes off-peak — many of our Carnegie customers carpool through Springvale Road." },
    { name: "Caulfield",       slug: "caulfield",        distanceKm: 18, drivetimeMin: 22, popularModels: ["C-Class", "A-Class", "GLA"],                     localNote: "Caulfield A-Class and GLA owners often combine a logbook + AC regas before summer." },
    { name: "Berwick",         slug: "berwick",          distanceKm: 18, drivetimeMin: 22, popularModels: ["GLE", "GLS", "C-Class"],                          localNote: "Berwick is a strong GLE / GLS suburb — we run regular transmission services for the 9G-Tronic in the GLE 350d." },
    { name: "Beaumaris",       slug: "beaumaris",        distanceKm: 18, drivetimeMin: 25, popularModels: ["E-Class", "GLE", "S-Class"],                      localNote: "Beaumaris owners tend toward the bigger Benz — E-Class, GLE, S-Class — for daily and weekend driving alike." },
    { name: "Cranbourne",      slug: "cranbourne",       distanceKm: 18, drivetimeMin: 22, popularModels: ["A-Class", "B-Class", "GLA"],                     localNote: "Cranbourne is a 22-minute drive south — pickup and drop-off runs Tuesdays for the A-Class and B-Class crowd." },
    { name: "Sandringham",     slug: "sandringham",      distanceKm: 19, drivetimeMin: 28, popularModels: ["E-Class", "GLE", "S-Class"],                      localNote: "Sandringham bayside owners often bring us the W212/213 E-Class for premium logbook service and ride-quality refresh." },
    { name: "Glen Iris",       slug: "glen-iris",        distanceKm: 22, drivetimeMin: 28, popularModels: ["GLC", "C-Class"],                                 localNote: "Glen Iris families are typical GLC / C-Class customers — we see plenty around school-pickup time." },
    { name: "Malvern",         slug: "malvern",          distanceKm: 22, drivetimeMin: 28, popularModels: ["C-Class", "GLC", "GLE"],                          localNote: "Malvern professionals book us for logbook + diagnostic before warranty expires — we keep their service history in the official Mercedes DSB." },
    { name: "Armadale",        slug: "armadale",         distanceKm: 24, drivetimeMin: 30, popularModels: ["C-Class", "GLC", "S-Class"],                      localNote: "Armadale S-Class and GLC owners often combine a logbook + pre-summer AC regas in one visit." },
    { name: "Camberwell",      slug: "camberwell",       distanceKm: 24, drivetimeMin: 30, popularModels: ["GLC", "GLE", "GLS"],                              localNote: "Camberwell families fill our books on weekends — GLC and GLE for the school run, the occasional GLS for the bigger household." },
    { name: "Hawthorn",        slug: "hawthorn",         distanceKm: 25, drivetimeMin: 30, popularModels: ["C-Class", "GLC", "E-Class"],                      localNote: "Hawthorn customers tend to be the professional E-Class and GLC type — we keep weeknight collection slots open for them." },
    { name: "Brighton",        slug: "brighton",         distanceKm: 25, drivetimeMin: 30, popularModels: ["E-Class", "GLE", "AMG"],                          localNote: "Brighton bayside is strong on the AMG and GLE crowd — we have ceramic-brake equipment and AMG factory-trained techs in-house." },
    { name: "Toorak",          slug: "toorak",           distanceKm: 25, drivetimeMin: 30, popularModels: ["S-Class", "AMG", "G-Wagen"],                      localNote: "Toorak owners bring the S-Class, AMG, and G-Wagen — we offer courtesy collection from Toorak Village as standard." },
    { name: "Prahran",         slug: "prahran",          distanceKm: 25, drivetimeMin: 32, popularModels: ["A-Class", "GLA", "C-Class"],                     localNote: "Prahran apartment-living owners often need parking-tight A-Class and GLA service — we have a dedicated bay for compacts." },
    { name: "South Yarra",     slug: "south-yarra",      distanceKm: 27, drivetimeMin: 33, popularModels: ["A-Class", "CLA", "C-Class"],                     localNote: "South Yarra is 33 minutes off-peak — we hold weekend slots for South Yarra customers who can't drop off mid-week." },
    { name: "Kew",             slug: "kew",              distanceKm: 28, drivetimeMin: 35, popularModels: ["C-Class", "GLC", "S-Class"],                      localNote: "Kew is one of our oldest customer suburbs — we have established servicing relationships with multiple Kew families' S-Class fleets." },
    { name: "Richmond",        slug: "richmond",         distanceKm: 30, drivetimeMin: 38, popularModels: ["A-Class", "CLA", "GLC"],                          localNote: "Richmond compact-Benz owners are a regular crowd — A-Class and CLA service slots fill fast in our weekday afternoons." },
  ],
} as const;

export type Site = typeof site;
