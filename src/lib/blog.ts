export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "when-to-service-your-c-class",
    title: "When to Service Your Mercedes C-Class",
    excerpt:
      "Service A, Service B, and everything in between — how to keep your C-Class running like new.",
    date: "2026-03-15",
    readTime: 6,
    body: `Every Mercedes-Benz C-Class follows a Service A / Service B pattern managed by the Active Service System (ASSYST). Understanding this schedule — and sticking to it — is the single biggest factor in preserving warranty coverage and resale value.

**Service A** is performed first (typically at 12 months or 25,000km, whichever comes first) and covers oil and filter changes, a multi-point inspection, brake inspection, and fluid top-ups.

**Service B** follows at 24 months and adds cabin filter replacement, brake fluid exchange, and a more comprehensive inspection.

At ${"Euro Hevans"} we stamp your logbook using genuine Mercedes-Benz oils meeting MB 229.5, 229.51, or 229.71 depending on your engine. This is essential for warranty compliance.`,
  },
  {
    slug: "common-w205-issues",
    title: "Common Issues in the W205 C-Class (and how to prevent them)",
    excerpt:
      "From rear subframe bushings to infotainment gremlins — here's what to watch for in the 2014–2021 C-Class.",
    date: "2026-03-28",
    readTime: 8,
    body: `The W205 generation C-Class (2014–2021) is a fantastic car, but certain model years share known issues. Here's what every owner should monitor:

1. **Rear subframe bushings** — Earlier models can develop a knocking sound from the rear when cornering. Replacement is straightforward on a hoist.

2. **Infotainment freezes** — COMAND and NTG head units can freeze or reboot. Software updates resolve most cases.

3. **Transmission harshness** — 722.9 7G-Tronic transmissions benefit from regular fluid services despite "lifetime" claims.

4. **AC evaporator leaks** — Rare but costly. A regular A/C regas highlights leaks early.

Book a W205 health check if you're approaching 100,000km.`,
  },
  {
    slug: "warranty-independent-service",
    title: "Will Independent Servicing Void My Mercedes Warranty?",
    excerpt:
      "The Australian Consumer Law answer, explained clearly. Plus: what Mercedes Australia actually requires.",
    date: "2026-04-05",
    readTime: 5,
    body: `Short answer: no. Under the Australian Consumer Law (ACCC guidance), servicing your new Mercedes at an independent specialist does **not** void your manufacturer warranty — provided the workshop uses:

- Approved fluids (e.g. MB 229.5 oils)
- Genuine or OEM-equivalent parts
- Manufacturer service schedules

At ${"Euro Hevans"} every service meets or exceeds Mercedes-Benz requirements and is fully logbook-stamped. Thousands of Melbourne owners have come to us from the dealer with full warranty intact.`,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
