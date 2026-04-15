export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  priceFrom?: string;
  bullets: string[];
  symptoms?: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "logbook-service",
    title: "Mercedes-Benz Logbook Service",
    short: "Keep your warranty intact with Mercedes factory-spec servicing.",
    description:
      "We perform manufacturer-scheduled Service A and Service B using genuine Mercedes-Benz parts and fluids. Your logbook is stamped to maintain full warranty and resale value.",
    icon: "wrench",
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
    description:
      "From squealing pads to full rotor replacement on AMG models, our technicians use OEM or Mercedes-specified performance brake components matched to your model.",
    icon: "gauge",
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
    description:
      "From 722.9 conductor plate replacement to 9G-Tronic (725.0) fluid services, we diagnose and repair Mercedes transmission issues using the correct MB approved fluid.",
    icon: "cog",
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
    description:
      "Using the same Mercedes factory diagnostic equipment as dealerships, we read every module, perform coding, SCN activations, and live data analysis.",
    icon: "activity",
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
    description:
      "Melbourne summers are no joke. We service both R134a (pre-2017) and R1234yf systems, repair compressors, replace evaporators, and diagnose climate control faults.",
    icon: "snowflake",
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
    description:
      "Our 120-point PPI covers mechanical, electrical, body, interior, and service history analysis. Get a detailed written report before you commit.",
    icon: "shield-check",
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
