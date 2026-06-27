import { img, type ImgKey } from "./images";

export type Service = {
  slug: string;
  title: string;
  short: string;
  /**
   * Answer-first TL;DR rendered at the top of the service detail
   * page. One or two sentences that directly answer the page's
   * primary question, ideally including a concrete price + time
   * window so AI engines (Google AI Overview, ChatGPT, Claude,
   * Gemini) can extract a citable fact. Required for GEO ranking.
   */
  answer: string;
  description: string;
  icon: string;
  image: ImgKey;
  priceFrom?: string;
  bullets: string[];
  symptoms?: string[];
  faqs: { q: string; a: string }[];
};

export const serviceImageUrl = (s: Service) => img[s.image];

export const services: Service[] = [
  {
    slug: "logbook-service",
    title: "Mercedes-Benz Logbook Service",
    short: "Keep your warranty intact with Mercedes factory-spec servicing.",
    answer:
      "A Mercedes-Benz logbook service at Euro Heaven Dandenong starts from $395, takes 2–5 hours depending on Service A or Service B intervals, and uses genuine Mercedes parts plus MB-approved fluids (229.5 / 229.51 / 229.71) — keeping your factory warranty and resale value intact.",
    description:
      "We perform manufacturer-scheduled Service A and Service B intervals using genuine Mercedes-Benz parts and MB-approved fluids meeting 229.5, 229.51 or 229.71 specs. Every service is stamped in your logbook so your new-car warranty and resale value stay fully intact. We also run a complete STAR / Xentry diagnostic scan on every visit to catch developing issues before they become expensive repairs, and hand you back the car as clean as it arrived.",
    icon: "wrench",
    image: "oilChange",
    priceFrom: "$395",
    bullets: [
      "Service A and Service B intervals",
      "Genuine or OEM-equivalent parts",
      "MB approved oils (229.5 / 229.51 / 229.71)",
      "Full diagnostic scan with STAR/Xentry",
      "Logbook stamp — warranty protected",
    ],
    faqs: [
      {
        q: "Will servicing here void my Mercedes warranty?",
        a: "No. Under Australian Consumer Law, independent specialists using genuine or OEM-equivalent parts and manufacturer-approved fluids can service your car without voiding the warranty.",
      },
      {
        q: "How long does a logbook service take?",
        a: "Service A typically takes 2–3 hours. Service B takes 3–5 hours. We offer courtesy vehicles on request.",
      },
    ],
  },
  {
    slug: "brake-repair",
    title: "Mercedes-Benz Brake Repair",
    short: "Pads, rotors, sensors and fluid — done right the first time.",
    answer:
      "Mercedes brake replacement at Euro Heaven Dandenong starts from $480 per axle and takes 2–4 hours. We use Mercedes-spec pads and rotors, include a full DOT4 fluid flush and wear-sensor replacement, and service AMG carbon-ceramic brake systems too.",
    description:
      "From squealing pads on your daily C-Class to full carbon-ceramic rotor replacement on AMG performance models, our technicians use OEM or Mercedes-specified brake components matched exactly to your vehicle. Every brake job includes a full DOT4 fluid flush, wear-sensor replacement, caliper inspection and road test — so you feel the difference from the first press of the pedal. We also identify uneven wear patterns that hint at deeper issues like caliper seizure or worn bushings.",
    icon: "gauge",
    image: "brakes",
    priceFrom: "$480",
    bullets: [
      "Genuine / OEM pads & rotors",
      "Brake fluid flush (DOT4)",
      "Wear sensor replacement",
      "AMG ceramic brake specialists",
      "Free brake check on every service",
    ],
    symptoms: [
      "Squealing or grinding noise when braking",
      "Brake warning light on dash",
      "Vibration through pedal",
      "Soft or spongy pedal feel",
      "Pulling to one side",
    ],
    faqs: [
      {
        q: "Can you do AMG ceramic brakes?",
        a: "Yes. We service carbon-ceramic brake systems on AMG GT, S63, and performance variants.",
      },
    ],
  },
  {
    slug: "transmission-repair",
    title: "Mercedes-Benz Transmission Repair",
    short: "7G-Tronic & 9G-Tronic specialists — rebuilds, services, valve bodies.",
    answer:
      "Mercedes 7G-Tronic and 9G-Tronic transmission service at Euro Heaven Dandenong starts from $650, with conductor plate, valve body, and torque converter work handled in-house using MB-approved 236.14 / 236.15 fluid — typically saving 30–50% versus dealer pricing.",
    description:
      "Mercedes transmissions are some of the most intricate gearboxes on the road — and we know them intimately, from the 722.9 7G-Tronic to the 9G-Tronic 725.0 and the dual-clutch 724.0. Whether it's a conductor-plate replacement, valve-body rebuild, torque converter service or routine fluid change with MB 236.14 / 236.15 fluid, we diagnose the root cause rather than guess. You save thousands over dealer pricing without compromising on precision — and every job is road-tested before handover.",
    icon: "cog",
    image: "gearShifter",
    priceFrom: "$650",
    bullets: [
      "7G-Tronic & 9G-Tronic service",
      "Conductor plate replacement (722.9)",
      "Valve body rebuilds",
      "Torque converter service",
      "MB 236.14 / 236.15 fluid",
    ],
    symptoms: [
      "Harsh or delayed shifts",
      "Transmission slipping",
      "Limp mode / gearbox fault",
      "Fluid leaks under car",
    ],
    faqs: [
      {
        q: "How often should transmission fluid be changed?",
        a: "Mercedes recommends every 60,000–80,000km despite some dealer claims of lifetime fill. We strongly advise regular servicing for longevity.",
      },
    ],
  },
  {
    slug: "diagnostics",
    title: "Mercedes-Benz Diagnostics",
    short: "STAR / Xentry diagnostics — we find what generic scanners can't.",
    answer:
      "A Mercedes Xentry / STAR factory diagnostic scan at Euro Heaven Dandenong starts from $165 and takes 30–60 minutes. We read every control module — engine, transmission, ABS, SRS, airmatic, infotainment — and hand you a written report explaining exactly what's wrong and what the fix will cost.",
    description:
      "Using the same Mercedes-Benz Xentry / STAR factory diagnostic equipment that dealerships run, our technicians can read every control module in your vehicle — engine, transmission, ABS, SRS, airmatic, infotainment and more. We perform SCN coding, variant coding, module programming and live data analysis, and we're trained to track down the intermittent faults that generic OBD scanners silently miss. You walk away with a written report explaining exactly what's happening and what it'll take to fix.",
    icon: "activity",
    image: "diagnostic",
    priceFrom: "$165",
    bullets: [
      "Xentry / DAS factory diagnostics",
      "SCN coding & variant coding",
      "Module programming",
      "ECU live data analysis",
      "Intermittent fault tracing",
    ],
    faqs: [
      {
        q: "My dash has a warning light — can you help?",
        a: "Yes. Book a diagnostic scan and we'll tell you exactly what the issue is before quoting any repair.",
      },
    ],
  },
  {
    slug: "air-conditioning",
    title: "Mercedes-Benz Air Conditioning",
    short: "R134a & R1234yf regassing, compressor & evaporator repairs.",
    answer:
      "Mercedes air-conditioning service at Euro Heaven Dandenong starts from $180 for a regas (R134a or R1234yf), with leak detection, compressor and evaporator repair, and climate-control module coding — including the well-known dual-zone blend-door actuator fault on W204 and W212 models.",
    description:
      "Melbourne summers are no joke, and a failing Mercedes climate control system is a miserable way to spend them. We service both R134a (pre-2017 models) and R1234yf systems, repair or replace compressors, evaporators, condensers, and chase down climate-control module faults — including the notoriously common dual-zone blend-door actuator failure on W204 and W212 models. Every major AC repair includes nitrogen leak testing and full recharge, so the cold air lasts past the next summer.",
    icon: "snowflake",
    image: "acDashboard",
    priceFrom: "$180",
    bullets: [
      "R134a & R1234yf regas",
      "Leak detection with UV dye",
      "Compressor replacement",
      "Evaporator & condenser repair",
      "Climate control coding",
    ],
    faqs: [
      {
        q: "My AC blows warm on one side — common issue?",
        a: "Yes — dual-zone blend door actuators are a known Mercedes fault. We replace and code them.",
      },
    ],
  },
  {
    slug: "pre-purchase-inspection",
    title: "Mercedes-Benz Pre-Purchase Inspection",
    short: "Thinking of buying a used Benz? Get an expert's opinion first.",
    answer:
      "A Mercedes pre-purchase inspection at Euro Heaven Dandenong starts from $295 and includes a 120-point check, full Xentry diagnostic scan, body and chassis assessment, service-history review, and a detailed written report with photos — so you know exactly what you're buying before you sign.",
    description:
      "Thinking of buying a used Benz? Our 120-point Pre-Purchase Inspection covers the mechanical condition, full Xentry diagnostic scan of every electronic module, body and chassis integrity check, interior condition assessment, and a deep analysis of the service history. You walk away with a detailed written report (including photos) so you can negotiate the price — or walk away from a bad buy — with total confidence. Mobile inspections available across Melbourne metro for an additional call-out fee.",
    icon: "shield-check",
    image: "inspection",
    priceFrom: "$295",
    bullets: [
      "120-point inspection",
      "Full Xentry diagnostic scan",
      "Chassis & body check",
      "Service history analysis",
      "Written report with photos",
    ],
    faqs: [
      {
        q: "Can you come to the seller's location?",
        a: "Yes — mobile PPIs available across Melbourne metro for an additional call-out fee.",
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
