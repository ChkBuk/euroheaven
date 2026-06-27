export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /**
   * Read time in minutes. Optional — when omitted, `postReadTime`
   * computes it from body word count at 250 wpm. The original posts
   * had inflated readTime values (5–8 min on a 100-word body); the
   * auto-computed value keeps it honest, which keeps customer trust.
   */
  readTime?: number;
  /**
   * Author display name. Defaults to DEFAULT_AUTHOR. Surfaces in the
   * blog post's address block and in BlogPosting JSON-LD — an
   * authority + freshness signal for AI engines (Google AI Overview,
   * ChatGPT, Claude, Gemini) and Google E-E-A-T scoring.
   */
  author?: string;
  body: string;
};

export const DEFAULT_AUTHOR = "Euro Heaven Workshop";

/** Compute reading time from body word count at 250 wpm. */
export function computeReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 250));
}

/** Returns the post's read time — explicit value or computed. */
export function postReadTime(p: Post): number {
  return p.readTime ?? computeReadTime(p.body);
}

export const posts: Post[] = [
  {
    slug: "when-to-service-your-c-class",
    title: "When to Service Your Mercedes C-Class",
    excerpt:
      "Service A, Service B, ASSYST and oil specs — when your C-Class is actually due, and what it'll cost.",
    date: "2026-03-15",
    body: `If your C-Class is showing a wrench icon on the dash with a number next to it, that's ASSYST telling you a service is due. The number is days until overdue — once it goes negative, the dash starts to nag harder. Here's what's actually due, what it costs at our workshop, and why missing it ends up more expensive than just doing it.

## Service A vs Service B — the actual difference

A modern Mercedes C-Class is on an alternating Service A / Service B schedule, managed by the Active Service System (ASSYST). The intervals shift slightly by engine and driving style, but in plain numbers:

| Service | Typical interval | What it covers | From |
|---|---|---|---|
| Service A | 12 months or 25,000 km | Oil + filter, multi-point inspection, brake inspection, fluid top-ups, ASSYST reset | $395 |
| Service B | 24 months or 50,000 km | Service A items + cabin filter, brake fluid exchange, deeper multi-point | $595 |

Those are our prices. Dealer pricing for the same work typically runs $200–$400 higher per visit. The work itself is identical — same Mercedes-approved oils, same OEM-spec parts, same diagnostic scan written into your Digital Service Book.

## ASSYST isn't just a kilometre counter

ASSYST tracks oil temperature, oil quality readings from the sensor in the sump, cold starts, idle time, fuel consumption, and ambient temperature. A C-Class driven hard in stop-start city traffic will hit Service A sooner than one cruising the freeway — sometimes by 5,000 km.

That's why "every 15,000 km" or "every 12 months" is a rough guide rather than gospel. Trust the wrench icon.

## What goes in your engine — the oil spec problem

The single biggest factor in warranty compliance is oil specification. Mercedes engines need a specific MB-approved spec, not just "any synthetic 5W-30":

- M274 4-cylinder petrol (C200, C250, C300): **MB 229.5**
- OM651 4-cylinder diesel (C220d, C250d): **MB 229.51**
- M276 V6 petrol (C400, C450 AMG): **MB 229.5**
- M177 V8 AMG (C63, C63 S): **MB 229.71**

Using the wrong oil — even a top-tier synthetic that's not on the MB approval list — can void warranty claims and shorten engine life. We stock the right grade for every C-Class engine in our workshop.

## What happens if you skip a service

Two things, both bad. First, your warranty status with Mercedes-Benz Australia gets flagged the moment they see an unstamped logbook covering the missed period. Second, the oil and filter you're running on are out of spec — the M274 in particular is sensitive to extended oil intervals, and we've seen timing-chain stretch and tensioner failure on cars stretched to 30,000 km on a single fill.

If you've skipped a service, the fix isn't to "catch up at 60,000 km". It's to come in for the missed Service A or B now, even if the next one is only 8,000 km away. The cost of two services close together is far less than the cost of a single engine repair triggered by 18 months on the wrong oil.

## Service intervals at a glance (W205 generation 2014–2021)

| Model year | Service A | Service B | Notes |
|---|---|---|---|
| 2014–2015 | 12 mo / 25,000 km | 24 mo / 50,000 km | First-gen ASSYST, conservative intervals |
| 2016–2018 | 12 mo / 25,000 km | 24 mo / 50,000 km | Same intervals, refined system |
| 2019–2021 | 12 mo / 20,000–25,000 km | 24 mo / 40,000–50,000 km | Slightly shorter under intense use |

For the W206 (2022+), intervals are similar but tracked against the newer MB 229.71 spec for most engines — check the wrench icon, not the calendar.

## What we actually do during a C-Class Service A

Honest list of what comes off the workshop floor each Service A, in the order we do it:

1. Drive on, hoist up, pull underbody covers.
2. Drain the old oil. Inspect what comes out (the M274 throws metal flakes if it's overdue — useful diagnostic).
3. Replace the oil filter. Refill with the correct MB-spec oil (we keep 229.5, 229.51, and 229.71 stocked).
4. Reset the ASSYST counter via Xentry / DAS — you can do this manually through the steering-wheel menu but the proper reset writes to the DSB record.
5. Multi-point inspection — brakes, suspension bushings, hoses, belts, tyre wear, fluid levels, battery health.
6. Stamp the logbook (or update the [Digital Service Book](/services/logbook-service) entry in the Mercedes system) and walk through any flagged items with you.

Most Service A jobs are 2–3 hours start to finish. Service B is 3–5 hours. Both are same-day for almost every customer; we keep a courtesy car for the few who need one.

## When to book

Book at the wrench icon — not before, not 5,000 km after. If you can't remember when your last service was, drop in for a free check; we'll pull the records from your DSB entries in the Mercedes system.

If your C-Class is approaching 100,000 km or 5 years old, it's worth adding a [Xentry diagnostic scan](/services/diagnostics) to your next Service B. That's the window where electronic faults start showing up before the dash flags them — and catching them at Service B is far cheaper than chasing them later.

[Book your C-Class service online](/book) — Service A or B, 60-second booking, SMS confirmation. We'll stamp your logbook with genuine MB-spec oil and the right OEM filter, and your warranty stays intact.`,
  },
  {
    slug: "common-w205-issues",
    title: "Common Issues in the W205 C-Class (and How to Prevent Them)",
    excerpt:
      "Subframe bushings, COMAND freezes, transmission jerks, blend-door rattles — the W205 problems we see most, with symptoms and rough fix costs.",
    date: "2026-03-28",
    body: `The W205 generation C-Class (2014–2021) is one of the best Mercedes built in the last fifteen years. It's also one of the cars we know best, because every workshop in Melbourne has its preferred problem children, and the W205 is high on ours. It's not a lemon — far from it — but certain model years share known faults. Here's what to watch for, what the symptoms feel like, and what fixing each one realistically costs.

## TL;DR — the top five

| Issue | Symptom | Rough fix cost | Common years |
|---|---|---|---|
| Rear subframe bushings | Knocking sound when cornering or braking | $850–$1,400 | 2014–2017 |
| 7G-Tronic transmission harshness | Hard or delayed shifts, especially cold | $480 (fluid + filter) to $2,800 (valve body) | 2014–2018 |
| COMAND infotainment freeze | Screen reboots, Bluetooth drops, navigation hangs | $0–$650 (software update vs. head-unit swap) | 2015–2019 |
| AC blend-door actuator | One side blows warm, intermittent fan noise | $480–$720 | 2014–2019 |
| Engine mount failure (M274) | Vibration through the cabin at idle | $620–$980 | 2016–2020 |

If you've owned a W205 for more than a couple of years, you've probably met at least two of these. Below is what's actually going on, and what we'd do about each one.

## 1. Rear subframe bushings (2014–2017)

The symptom is unmistakable: a soft clunk or knock from the rear of the car when cornering at low speed, or sometimes when you hit a sharp expansion joint at freeway speed. Initially mistaken for a loose exhaust or a worn tyre.

It isn't either. It's the rear subframe bushings — the rubber-and-steel mounts that locate the rear axle to the chassis. On earlier W205s the rubber can split, allowing the subframe to shift under load.

Left alone it ruins your tyre wear pattern and eats into the differential mount over the next 20–30,000 km. Replacement is straightforward on a hoist — bushings press out, new ones press in, takes us a working day. About $850–$1,400 depending on parts source.

## 2. 7G-Tronic (722.9) transmission harshness

The 722.9 7G-Tronic is fitted to almost every petrol W205 sold here. It's a robust gearbox, but it's also one of the most sensitive to fluid condition of any modern Mercedes transmission. Mercedes will tell you it's a "lifetime fill". The 722.9 says otherwise.

Symptoms of fluid-out-of-spec range from a slight shudder on 2-3 upshifts under light throttle, to a clunky cold-morning take-off, to outright slipping or going into limp mode. The fix progression is:

1. **Conductor plate + transmission fluid + filter service** — about $480, fixes 70% of cases under 100,000 km.
2. **Valve body service or rebuild** — $1,600–$2,800 depending on what's worn.
3. **Full transmission rebuild** — last resort, $5,000+.

If you can't remember when your transmission was last serviced — or if you bought a used W205 — the conductor plate + fluid service is the cheapest insurance you can buy for a Mercedes. We do a lot of them. See [our transmission repair page](/services/transmission-repair) for the details.

## 3. COMAND / NTG infotainment freezes (2015–2019)

The COMAND head unit can freeze, reboot mid-drive, lose Bluetooth pairings, or fail to load the navigation map. Sometimes triggered by a phone connection, sometimes by a software-version mismatch after a battery replacement.

90% of cases are fixed by a software update through Mercedes' XENTRY system. Cost: about $165 in our workshop (free if it's part of a bigger service).

The remaining 10% need a head-unit replacement, which is closer to $650 for a refurbished unit + coding. We always try the software path first.

## 4. AC blend-door actuator (2014–2019, dual-zone climate models)

If one side of your cabin blows warm air while the other blows cold — or if you hear a faint clicking from behind the dash when you change the temperature setting — your blend-door actuator has failed. It's a small electric motor that opens and closes a flap inside the dashboard ductwork.

Replacement is fiddly because the actuator sits behind the centre console, but we've done enough of them to be efficient. About $480–$720 depending on which side and whether the dual actuator pack needs coding.

## 5. Engine mount failure (M274 petrol engines, 2016–2020)

You'll feel this one in your seat. A bad engine mount transmits vibration through the entire chassis at idle — particularly noticeable at traffic lights. The mounts in question are hydraulically damped, and the fluid leaks out over time.

Replacement is straightforward — pull the cover, drop the support, swap mounts. $620–$980 for both. We always replace in pairs.

## Less common but worth knowing

- **AC evaporator leaks** — Rare but expensive ($2,500+) because the dashboard has to come out. A regular [AC regas](/services/air-conditioning) catches most leaks early.
- **Diesel particulate filter (DPF) blockage on OM651 models** — Common in short-trip city drivers. A forced regen via Xentry costs $165; DPF replacement is $2,200+.
- **Steering wheel vibration around 100 km/h** — Usually warped front rotors. [Brake refresh](/services/brake-repair) from $480.

## When to book a W205 health check

If your W205 is approaching 100,000 km, hasn't had a transmission service yet, or you've noticed any of the symptoms above, a [diagnostic + multi-point inspection](/services/diagnostics) is the fastest way to find out what's developing before it becomes a workshop bill. Takes us about 60 minutes; you get a written report with photos.

[Book a W205 inspection online](/book) — 60-second booking, SMS confirmation. We'll plug into Xentry, walk the car on the hoist, and tell you exactly what's wrong (and what isn't, which is just as useful when you're worried about a noise).`,
  },
  {
    slug: "warranty-independent-service",
    title: "Will Independent Servicing Void My Mercedes Warranty?",
    excerpt:
      "The Australian Consumer Law answer in plain English. What dealers tell you, what the ACCC actually says, and how to stay covered.",
    date: "2026-04-05",
    body: `Short answer: no. Servicing your Mercedes at an independent specialist does not void your manufacturer warranty in Australia. The dealer who told you otherwise was either misinformed or hoping you'd believe them. Here's what the Australian Consumer Law actually says, what Mercedes-Benz Australia requires, and what you have to do to stay covered.

## The legal answer — ACL § 64

The Australian Consumer Law (Schedule 2 of the *Competition and Consumer Act 2010*) sets out the consumer guarantees that apply to every new vehicle sold here. Section 64 says you can't contract out of those guarantees. That includes the guarantee that your vehicle is of acceptable quality and fit for purpose — and it includes the warranty obligations of the manufacturer.

In 2017 the ACCC published a guidance note specifically about new-car warranties (the *Motor Vehicle Sales and Repair – Industry Guide*), which states explicitly:

> "A car manufacturer or dealer cannot void a warranty or refuse a warranty claim simply because the vehicle has been serviced by an independent mechanic."

That's not a workaround. It's the law. You can take your new Mercedes anywhere you like for servicing, provided the work is done to the manufacturer's specification.

## What you actually have to do

The ACCC's guarantee only holds if the independent workshop services the car to manufacturer specification. For Mercedes-Benz that means three things, no exceptions:

| Requirement | What it means in practice |
|---|---|
| Manufacturer-approved fluids | MB 229.5 / 229.51 / 229.71 oils depending on engine, MB-spec coolant, brake fluid to DOT 4 LV, MB 236.x transmission fluid |
| Genuine or OEM-equivalent parts | Real Mercedes parts, or parts from the same OEM supplier the factory uses (Mahle, Mann, Bosch for filters; ATE, Bremi for brakes; etc.) |
| Manufacturer service schedule | Service A and Service B intervals as set by ASSYST, with all line items completed and logged |

If your workshop ticks all three, your warranty stays intact. If they substitute a cheaper non-MB-spec oil to save $40 on the service, you've handed Mercedes a reason to deny a future claim. There's no in-between — either it's done to spec or it isn't.

At Euro Heaven every service is done to spec. We stock MB-approved oils across the 229.5, 229.51, 229.71 range; we use genuine or OEM-equivalent filters from the original suppliers; and we stamp your logbook (or update the [Digital Service Book](/services/logbook-service) entry in the Mercedes system) with the work performed.

## What the dealer might tell you

Mercedes dealers don't enjoy losing servicing revenue to independents, so a small minority of dealer staff will tell new owners that servicing elsewhere "voids the warranty". A few common things you might hear, and the actual position:

| What they say | What's actually true |
|---|---|
| "Independent service voids your warranty." | False under ACL § 64. The ACCC has explicitly stated this. |
| "You have to service here for the first three years." | False. You can service anywhere from day one. |
| "We won't honour your warranty if you've gone elsewhere." | They have to honour it under the ACL. If they refuse, lodge a complaint with the ACCC or Consumer Affairs Victoria. |
| "Only we have access to the Digital Service Book." | False. Authorised independent specialists also write to the DSB through Mercedes' XENTRY system. We do. |
| "Genuine parts are only available through dealers." | Partly false. Many genuine MB-branded filters and consumables are available to independent specialists at trade pricing. For parts only available through dealers, we order them through the dealer parts counter at trade rates. |

## What "warranty" actually covers

Your factory warranty on a new Mercedes is three years / unlimited km, plus an additional three years of *MB Plus* extended warranty if you opted in. That covers manufacturing defects and component failure under normal use — it doesn't cover wear items like brake pads, tyres, or wiper blades.

Independent service doesn't affect any of that. What it does affect is your ability to demonstrate that the car has been properly maintained, which matters if a major component fails and Mercedes investigates the claim. That's why the logbook stamps + DSB entries matter — they're the paper trail that proves you did everything right.

## Real-world example — the gearbox claim

A customer came to us in late 2024 with a 2021 E300 that had developed a 9G-Tronic transmission fault at 78,000 km. He'd serviced the car at our workshop for the previous 18 months (he switched after the dealer quoted $980 for a Service A). When the gearbox failed, he was nervous — would Mercedes refuse the warranty claim?

They didn't. We provided our service records and the DSB entries, the gearbox was replaced under warranty at the dealer, and the claim ran through without issue. The dealer's service manager called us afterwards to ask which oil we'd used (MB 236.14, same as theirs) — not to challenge the claim, but because they were curious.

That's the right outcome under the ACL. It happens routinely, despite what nervous owners are sometimes told.

## What we do at Euro Heaven

Every service we perform on a Mercedes meets or exceeds the factory specification. We stamp the logbook, update the DSB entry through XENTRY, retain a copy of the work order on file, and provide a written record on request. If you ever need to lodge a warranty claim, we'll provide whatever documentation Mercedes-Benz Australia asks for.

We're not affiliated with Mercedes-Benz dealerships. We're an [independent Mercedes specialist](/about), factory-trained, with the right tools and the right parts to do the job to spec. The price difference comes from running a single workshop rather than a national dealership network — not from cutting corners on the work.

[Book a service online](/book) — Service A, Service B, or a free assessment if you're unsure. 60-second booking, SMS confirmation, full logbook stamp.`,
  },
  {
    slug: "mercedes-service-cost-melbourne",
    title: "How Much Does a Mercedes Service Cost in Melbourne?",
    excerpt:
      "Service A, Service B, AMG, and major work — what an independent Mercedes specialist actually charges in Melbourne, and why dealer pricing isn't a fair comparison.",
    date: "2026-05-12",
    body: `A Mercedes-Benz Service A in Melbourne typically costs $395–$680 at an independent specialist, or $580–$950 at a dealership. Service B sits at $595–$1,100 independent versus $850–$1,500 dealer. AMG work pushes both higher. Here's how the pricing actually breaks down, why the dealer-vs-independent gap exists, and where to look out for hidden charges.

## Service A — what you pay, what you get

| Where | Price range | What's included | Genuine MB oil? |
|---|---|---|---|
| Independent specialist (Euro Heaven) | $395–$680 | Oil + filter, multi-point inspection, brake inspection, fluid top-ups, ASSYST reset, logbook stamp | Yes (MB 229.5 / 229.51 / 229.71) |
| Mercedes-Benz dealership | $580–$950 | Same as above | Yes |
| General mechanic (non-MB specialist) | $260–$420 | Oil + filter, basic inspection | Usually not — common cause of warranty issues later |

Service A on a regular W205 C300 with our workshop is $395 flat — that includes the oil, the filter, the labour, and the stamp. Larger engines (M276 V6, M177 V8 AMG) push it higher because the oil capacity is bigger and the part numbers cost more.

## Service B — the bigger one

Service B is the heavier service that alternates with Service A every two years or 50,000 km. It adds three things to the Service A list: cabin filter replacement, brake fluid exchange, and a more thorough multi-point inspection.

| Where | Price range |
|---|---|
| Independent specialist | $595–$1,100 |
| Mercedes-Benz dealership | $850–$1,500 |

We charge $595 for Service B on a typical four-cylinder W205, ranging up to $980 for an AMG C63 with the V8.

## AMG service costs

AMG models have different oil specs (MB 229.71), bigger sump capacities, and more expensive consumables. Realistic numbers:

| Service | C63 (M177 V8) | E63 (M177 V8) | A45 / CLA45 (M139) |
|---|---|---|---|
| Service A | $580–$780 | $620–$830 | $480–$640 |
| Service B | $780–$1,100 | $830–$1,200 | $680–$880 |

Add about $150–$220 if your AMG needs a 7G-DCT or 9G-Tronic transmission service at the same visit.

## Common extras at service time

Things we routinely flag during a multi-point inspection, with rough costs if you choose to fix them on the same day:

- Brake pad replacement (front): $480–$680
- Brake rotor + pad set (front axle): $720–$980
- DOT 4 brake fluid flush: $145
- Cabin filter (out of Service B cycle): $95
- Spark plugs (M274 four-cylinder, set of four): $280
- Battery replacement (W205): $420–$540 including coding

## Why the dealer vs independent gap exists

It's not because the dealer is using better parts or better oil — they're not. The work itself is identical when done to MB spec. The price gap comes from three things:

1. **Overhead** — dealerships run national networks with showrooms, finance departments, and sales floors. The service department subsidises the rest.
2. **Labour rate** — dealer rates are typically $220–$280 per hour; independents like us run $140–$180.
3. **Mark-up on parts** — dealer parts pricing is set nationally with a healthy margin. Specialists like us pay closer to trade and pass that through.

What you give up by going independent isn't quality — it's the dealer-courtesy-car experience and the showroom waiting area. The work, the warranty status, and the logbook stamp are exactly the same. See [our blog post on warranty compliance](/blog/warranty-independent-service) for the legal position.

## Hidden charges to watch for

Three line items that sometimes show up unexpectedly:

- **"Environmental disposal fee"** — some workshops add $20–$45 for oil disposal. We don't.
- **"Inspection fee on top of quote"** — if a workshop quotes a service and then bills for the multi-point separately, that's a red flag.
- **"Software update fee"** — sometimes legitimate (Xentry updates take time and licensing), sometimes a profit centre. Ask before authorising.

## Service intervals — when to budget

For a typical W205 / W206 C-Class doing 15,000–18,000 km a year:

| Year of ownership | Visit | Approx cost (Euro Heaven) |
|---|---|---|
| Year 1 | Service A | $395–$540 |
| Year 2 | Service B | $595–$880 |
| Year 3 | Service A + Xentry diagnostic | $560–$760 |
| Year 4 | Service B + likely brake refresh | $1,050–$1,560 |
| Year 5 | Service A + transmission service | $880–$1,250 |

Over five years that's $3,480–$4,990 in scheduled work for an independent specialist, or roughly $5,200–$7,400 at a dealership for the same service intervals.

## Quotes, written, in advance

We quote every service in writing before we touch the car. If we find something extra during the multi-point, we call before doing anything — no surprises on the invoice. Phone us on 0400 115 765 or [book online](/book) — booking takes about a minute and includes a price estimate based on your model and last-service date.

For the full list of services we offer — logbook service, brake repair, transmission work, [diagnostics](/services/diagnostics), AC, [pre-purchase inspections](/services/pre-purchase-inspection) — see [our services page](/services).`,
  },
  {
    slug: "how-often-service-amg",
    title: "How Often Should I Service My AMG?",
    excerpt:
      "AMG-specific service intervals, oil spec, transmission work, and the symptoms that mean it's time — for C63, E63, GT, and CLA 45.",
    date: "2026-05-25",
    body: `An AMG-badged Mercedes should be serviced every 12 months or 15,000–20,000 km — whichever comes first — using MB 229.71 oil and an OEM-spec air and oil filter. That's tighter than a regular C-Class on purpose: the engines run harder, the fluids degrade faster, and the cost of getting it wrong is measured in five-figure rebuilds rather than just a slow car. Here's the full picture, by model.

## Service intervals by model

| Model | Engine | Service A interval | Service B interval | Oil spec |
|---|---|---|---|---|
| A45 / CLA45 / GLA45 | M139 2.0L turbo | 12 mo / 15,000 km | 24 mo / 30,000 km | MB 229.5 / 229.71 |
| C43 / E43 / GLC43 | M276 / M256 V6 | 12 mo / 20,000 km | 24 mo / 40,000 km | MB 229.5 |
| C63 / E63 / GT | M177 / M178 V8 | 12 mo / 15,000 km | 24 mo / 30,000 km | MB 229.71 |
| AMG GT / AMG GT-R / GT 63 | M178 / M177 | 12 mo / 15,000 km | 24 mo / 30,000 km | MB 229.71 |
| S63 / SL63 | M177 / M178 | 12 mo / 15,000 km | 24 mo / 30,000 km | MB 229.71 |

For the C63 and E63 V8 cars, we recommend the tighter interval — 12 months or 15,000 km — even if your ASSYST is telling you 18 months. The M177 hot-V engine packaging runs the oil hotter than a regular M276 V6, and the oil chemistry breaks down faster as a result.

## What an AMG service actually includes

Same line items as a regular C-Class Service A, but with model-specific extras:

- **Engine oil + filter** — MB 229.71 for the V8s, double the capacity (9.5L+ on the C63)
- **Transmission fluid check** (top-up if needed) — the AMG SPEEDSHIFT 7G-DCT (dual-clutch) and 9G-Tronic both run model-specific MB 236.14 or 236.15
- **Differential oil check** — the rear LSD and front diff on 4MATIC AMGs need their own fluid intervals (every 60,000 km is conservative)
- **Brake system inspection** — AMG brakes wear faster; carbon-ceramic systems need special handling
- **Throttle body cleaning** on M177 V8s every 40,000–60,000 km
- **Air filter** — high-flow OEM filter, not aftermarket — every Service B
- **Cabin filter, brake fluid, multi-point** — same as Service B on a regular C-Class

## Transmission service — the easy one to skip

Mercedes' published interval for the 7G-DCT dual-clutch on the M139 and the 9G-Tronic on the V8s is "lifetime fill". This is the same advice they give for regular MB transmissions, and it's wrong for the same reason: the fluid degrades, and on a high-torque AMG it degrades faster.

We recommend an AMG transmission service every 60,000–80,000 km. On the 9G-Tronic that's a $850–$1,200 job — fluid + filter + conductor plate inspection. On the M139's 7G-DCT it's $1,100–$1,600 because the dual-clutch fluid is more expensive and the procedure takes longer.

Compared to a $9,000+ rebuild when the clutch packs glaze over, the every-60K interval is cheap insurance.

## Symptoms it's time, regardless of ASSYST

If your AMG is doing any of these, book in even if the wrench icon hasn't lit up:

- **Oil consumption** approaching 0.5L per 1,000 km on the V8 — symptom of valve-stem seal wear, increasingly common past 80,000 km
- **Cold-start rattle** lasting more than 1–2 seconds — VVT actuator or chain tensioner
- **Transmission flare** between gears — fluid out of spec or conductor plate failing
- **Vibration through the steering at 110+ km/h** — usually warped front rotors from a single track day or aggressive freeway use
- **Cabin smell** of unburnt fuel after sustained boost — exhaust manifold or turbo seal

## Track-day owners — the extra interval

If you do any track days at all, even one or two per year, shorten the interval. Half a day at PIM or Phillip Island puts the same heat into the oil as 5,000 km of road driving. We recommend:

- **Oil change before AND after** any track day on a V8 AMG
- **Brake pad inspection** after every track day
- **Transmission fluid check** after every track day
- **Coolant condition check** (low-boil-point degrades with heat cycles)

## What an AMG service costs at Euro Heaven

| Model | Service A | Service B | Service A + transmission |
|---|---|---|---|
| A45 / CLA45 / GLA45 | $480–$640 | $680–$880 | $1,580–$2,240 |
| C43 / E43 | $520–$680 | $750–$960 | $1,350–$1,860 |
| C63 / E63 | $580–$780 | $780–$1,100 | $1,630–$2,300 |
| GT / GT-R | $640–$880 | $880–$1,250 | $1,730–$2,450 |
| S63 / SL63 | $650–$880 | $880–$1,250 | $1,730–$2,450 |

Carbon-ceramic brake systems (C63 S, GT-R, AMG One) are quoted separately depending on what's needed — we have the equipment and the parts contacts.

## Diagnostics matter on AMG

AMG cars run more sensors than the regular Benz they're based on. We always run a full [Xentry diagnostic scan](/services/diagnostics) on every AMG service, no extra charge if it's part of a Service A or B. Catches things like upstream O2 sensor drift, knock sensor irregularity, or boost-control valve creep before they show up as a check-engine light.

## Book an AMG service

We're factory-trained on the M177, M178, M139, and M256 engines, and we have AMG ceramic-brake equipment in-house. Most AMG work is same-day on a typical Service A; bigger jobs we schedule out in advance.

[Book an AMG service online](/book) — 60-second booking, SMS confirmation. We'll pull your DSB record from XENTRY and quote on the right service interval for your model and history.

For the full AMG-capable service list — [logbook](/services/logbook-service), [transmission](/services/transmission-repair), [brakes](/services/brake-repair), [diagnostics](/services/diagnostics) — see [our services overview](/services).`,
  },
  {
    slug: "mercedes-abs-warning-light",
    title: "Mercedes ABS Warning Light — What It Means and What It'll Cost",
    excerpt:
      "ABS light on your Mercedes dash? Here's what's actually wrong, how serious it is, and what a fix typically costs.",
    date: "2026-06-08",
    body: `The ABS warning light on your Mercedes dash means your anti-lock braking system has detected a fault and disabled itself. Your regular brakes still work — but the ABS, traction control, and on most modern Mercedes the stability control (ESP) are offline until the fault is fixed. The most common cause is a wheel-speed sensor failure, which typically costs $280–$480 to repair at our workshop. Here's how to figure out what's actually wrong, what it'll cost, and whether it's safe to keep driving.

## The short diagnostic path

When you see an ABS light, also check for:

- **ESP / stability control light** (yellow car with skid marks) — usually comes on with the ABS light because they share sensors
- **Brake warning light** (red exclamation in a circle) — different issue, more serious, deal with it before driving
- **Check engine light** — unrelated 90% of the time
- **Speedometer behaviour** — does it work? If not, the fault is usually upstream of the ABS module

If you have ABS + ESP lights together and the brakes feel normal, it's almost always a wheel-speed sensor or wiring issue. If the brake pedal also feels different (longer pedal travel, less assistance), you've got a hydraulic problem and shouldn't drive it.

## Most common causes, in order of frequency

| Cause | How often we see it | Typical fix cost | Symptoms |
|---|---|---|---|
| Wheel-speed sensor failure | ~55% of cases | $280–$480 per wheel | Light comes on at startup or after a wheel hits a pothole |
| Sensor wiring damage | ~15% | $180–$420 | Light flickers depending on suspension load |
| ABS module fault | ~10% | $850–$2,200 | Light constant, often with multiple fault codes |
| Brake fluid contamination | ~10% | $145 (flush) | Light comes on after a wet drive or long sit |
| Tone-ring damage | ~7% | $240–$640 | Light comes on at speed, vanishes at standstill |
| Other (corroded plug, battery voltage) | ~3% | $80–$320 | Various |

## Wheel-speed sensors — what they do, why they fail

Each wheel on your Mercedes has a magnetic sensor reading a toothed tone ring on the hub. The sensor sends a pulse train to the ABS module at a rate proportional to wheel speed. When one wheel decelerates faster than the others (because you're skidding it), the module pulses the brakes on that wheel until the rotation matches.

When the sensor fails — usually because road grit destroys the magnet, or the wiring chafes through against the strut — the module loses one of the four pulse trains and disables ABS, ESP, and (on most Mercedes since 2010) traction control as well. The light comes on and stays on until the sensor is replaced and the fault code cleared via [Xentry](/services/diagnostics).

## Is it safe to drive?

Short answer: yes, briefly, in dry conditions, at sensible speeds. Your regular hydraulic brakes still work. What you've lost is:

- ABS (won't pulse the brakes for you if you skid)
- ESP (won't correct understeer or oversteer)
- Traction control (will spin a wheel under acceleration)

If you're commuting home from work in dry weather, it's fine. If you're driving home in heavy rain, or you've got a long highway run ahead, or you're towing — don't. Get it fixed first.

## What the fix costs at Euro Heaven

For a standard wheel-speed sensor replacement on a typical Mercedes (C-Class, E-Class, GLC, GLE, A-Class):

- **Diagnosis** (Xentry scan, fault code reading, sensor testing): $165
- **Wheel-speed sensor replacement** (front or rear, single wheel): $280–$480 including the sensor
- **Front-wheel sensor on AMG ceramic brake equipped car**: $380–$580 (the sensor sits awkwardly behind the ceramic rotor)
- **Both front sensors replaced together** (recommended if one has failed): $480–$760

If it turns out to be the ABS module itself (about 1 in 10 cases), you're in $850–$2,200 territory depending on whether the module can be repaired or needs full replacement and coding. We've sent enough modules to specialists for repair to know which faults are economic and which aren't — we'll tell you straight before authorising anything expensive.

## Why generic OBD scanners often can't see the fault

A $40 OBD-II scanner from Supercheap will read a generic powertrain code like "C0035 — front left wheel speed sensor fault". What it can't do is:

- Read live data from the ABS module to confirm which sensor is failing
- Test the wiring continuity between sensor and module
- Distinguish between a sensor fault and a tone-ring fault (they show the same generic code)
- Clear the code after repair (most consumer scanners can read but not clear ABS codes)

The factory Xentry / DAS system we use can do all four. That's why a proper diagnosis pays for itself — guessing wrong on which sensor is bad costs you a second visit and a second sensor.

## When the ABS light is more serious

A few situations where the ABS light is part of a bigger problem:

- **ABS + brake (red) lights together** — possible hydraulic failure, do not drive
- **ABS light + spongy pedal** — air in the system or master cylinder failure, do not drive
- **ABS light only at first cold start, vanishes after a minute** — battery voltage low, get the battery tested
- **ABS light after a battery replacement** — module needs re-coding via Xentry

## Book a diagnostic

If your ABS light is on, a 30-minute Xentry diagnostic at our workshop tells you exactly which sensor (or which fault) is responsible. From there we can quote the fix in writing before doing any work.

[Book a diagnostic online](/book) — $165 flat, includes Xentry scan, fault code reading, live-data analysis, and a written report. For the broader [diagnostics service](/services/diagnostics) including SCN coding, module programming, and intermittent fault tracing, see the service page.

If you're not sure what your warning light means, take a quick photo of the dash and ring us on 0400 115 765 — we can usually tell you what you're looking at and whether you need to come in same-day.`,
  },
  {
    slug: "buying-used-mercedes-checklist",
    title: "Buying a Used Mercedes — 12-Point Pre-Purchase Checklist",
    excerpt:
      "What to check before you hand over the cash, what to ask the seller, and the deal-breakers that should walk you off the lot.",
    date: "2026-06-15",
    body: `Buying a used Mercedes is a calculated risk. Done right, you save 30–50% versus a new car and end up with a vehicle that's still a Mercedes. Done wrong, you inherit someone else's $12,000 transmission problem. Here's the 12-point checklist we use during a paid pre-purchase inspection, in plain English, so you can do a first-pass walk-around before paying us for the full job.

## Before you turn up — five-minute desk check

Before you even open the door, run two checks online:

1. **REVS / PPSR** — at ppsr.gov.au, $2 search. Tells you if the car is financed, written off, or stolen. If anything shows up, walk away.
2. **VIN decode** — vin-info.com or similar. Confirms the model, build year, factory options. If the seller's listing says "AMG" and the VIN decodes to a base C200, walk away.

If both come back clean, take the car for the test drive.

## The 12-point walk-around

### 1. Service history paperwork — the most important single thing

The Mercedes Digital Service Book (DSB) is the official record of every authorised service. Any independent specialist worth their salt — including us — writes to the DSB through XENTRY when they service a car.

Ask the seller for:

- The physical logbook with stamps for every service
- A printout of the DSB record (the dealer or any independent specialist can pull this)
- Receipts for any major work done outside scheduled servicing

**Red flags**: gaps of more than 18 months between services, missing stamps, "lost the logbook", or only dealer-stamped services with no detail of what was done.

### 2. The cold start

Get to the car before the seller does, and put your hand on the bonnet. If it's warm, they've pre-started it to mask a cold-start rattle. Walk around the back of the car and ask them to start it from cold — listen for:

- **Rattle for more than 2 seconds** at startup — VVT actuator or chain tensioner, ~$2,400 fix on M276 V6
- **Diesel knock** that doesn't smooth out within 30 seconds — injector or glow plug issue, ~$1,200–$2,800
- **Blue smoke** at startup — valve-stem seals, common on high-km M276, ~$2,200 fix
- **Fuel smell** strong enough to notice from outside the car — fuel-rail or injector leak

### 3. The 9G-Tronic (or 7G-Tronic) test

Drive the car slowly through 1st to 4th gear, then accelerate moderately to climb to 6th or 7th. Listen and feel for:

- **Flare or slip** between gears — transmission fluid out of spec or worse
- **Hard 2-3 upshift** under light throttle — common 722.9 7G-Tronic complaint, conductor plate fix ~$1,600
- **Reverse engagement clunk** that takes more than half a second — torque converter wearing

If the transmission has any of these symptoms and the seller hasn't disclosed it, walk.

### 4. Brake test on a quiet straight

Find an empty stretch of road, get to 80 km/h, and brake firmly (not panic-stop). You're listening / feeling for:

- **Vibration through the pedal or steering** — warped rotors, $720–$980 fix
- **Pull to one side** — caliper sticking, $480–$680 per side
- **Spongy pedal** — air in system, $145 flush minimum
- **Squealing** — pads at the wear indicator, $480–$680 fix

Mercedes brake systems are durable but not bulletproof; a car with 80,000+ km that's never had a brake refresh is due for one.

### 5. Body and panel fit

Walk around the car and check the panel gaps. Mercedes ship from the factory with gaps you could lay a 4 mm gauge into and have them all equal. If one panel sits higher than the next, or the gap is wider on one side of the boot than the other, that panel has been re-fitted after a collision.

Also check:

- **Paint mismatch** under different lighting — sun, shade, garage
- **Overspray** in door jambs or wheel wells
- **Fresh undercoating** on a 5+ year old car — usually hides repair work
- **Headlight clarity** — if both headlights are foggy, age. If only one is clear, recent replacement after collision.

### 6. Tyre wear

Tyres are honest. Check all four for:

- **Inner-edge wear** — alignment issue, $185 to fix the alignment
- **Outer-edge wear** — toe out of spec or worn bushings
- **Cupping or scalloping** — worn shock absorbers, $640 per pair
- **Mismatched brands or sizes** — either careless owner or hiding a wheel-specific problem

Aged tyres (date code more than 5 years old) need replacing regardless of tread depth. The DOT code is moulded into the sidewall.

### 7. Interior wear vs odometer

A car that's done 60,000 km should have:

- Steering wheel leather that's still tight (not shiny on the grip)
- Driver's seat bolster intact (not collapsed)
- Pedal rubber present (not worn to the metal)
- Driver's door card unblemished where the door check arm rests

If the interior wear doesn't match the odometer, the odometer's been wound back. Walk.

### 8. Electronics check

Sit in the car and run through:

- **All four windows** — fully up, fully down, one-touch behaviour
- **All four door locks**
- **Climate control** — both zones if dual-zone, hot and cold both directions
- **Infotainment** — full reboot from off, all menus respond
- **Reverse camera** — clear image, no horizontal lines
- **All warning lights extinguish** within 3 seconds of starting

### 9. Underneath — pop the hood

You don't need to know what every component is. You need to look for:

- **Oil on the engine block** — leak, severity depends on where
- **Coolant in the overflow tank** at the correct level
- **Air filter clean** (lift the housing if you can)
- **No aftermarket wiring** spliced into the loom

Walk to the rear of the car and check the exhaust:

- **Soot at the tailpipe** — normal on diesels, concerning amount on petrols
- **Wetness inside the tailpipe** — oil burn

### 10. The OBD-II quick check

If you've got a basic OBD reader, plug it in and pull codes. Anything other than "no codes stored" deserves an explanation from the seller. Even cleared codes leave a "readiness monitor incomplete" status — if all monitors say "not ready" on a car that's just been driven, the codes were cleared in the last 50 km. That's deliberate.

### 11. Tow and bumper inspection

Walk to the rear of the car, kneel down, and look behind the bumper at the tow-eye attachment point and the boot floor. Collision repairs leave evidence here — bent metal, fresh paint, mis-aligned panels — that's invisible from above.

### 12. The deal-breaker question

Ask the seller: "Has this car ever been in an accident?" Watch their face. If they hesitate, it has been. If they immediately say "no, never", check the panel gaps and underside again.

## When to walk

Any single one of these isn't necessarily fatal, but if the car shows three or more of:

- Service gaps over 18 months
- Cold-start rattle for more than 2 seconds
- Transmission flare or hard shifts
- Panel-gap mismatch + paint mismatch
- Interior wear inconsistent with odometer
- Aftermarket wiring under the bonnet

…the price needs to drop substantially or you walk. There's another Mercedes for sale next week.

## When to book a proper PPI

If the car passes your walk-around, the next step is a proper [pre-purchase inspection](/services/pre-purchase-inspection). We do 120-point inspections at the workshop for $295, or mobile inspections at the seller's location for $295 + a call-out fee depending on suburb. You get a written report with photos within 24 hours.

The math is straightforward: $295 + maybe $150 call-out = $445 to find a $9,000 transmission problem before you buy is the best money you'll spend on the deal. We've found enough hidden issues over the years that we'd rather you cancel a sale than buy a problem.

[Book a pre-purchase inspection online](/book) — choose "Pre-Purchase Inspection" in the service dropdown, enter the seller's address if mobile, and we'll confirm by SMS within an hour. See [the full PPI service page](/services/pre-purchase-inspection) for what's covered, and [our diagnostics page](/services/diagnostics) for the Xentry scan that catches what generic scanners miss.`,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
