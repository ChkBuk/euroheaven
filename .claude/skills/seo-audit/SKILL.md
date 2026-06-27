---
name: seo-audit
description: Audit Euro Heaven's SEO surfaces and produce a CTR-ranked
  fix-list. Use when the owner asks "audit my SEO", "what's hurting my
  rankings", or wants a status report on title/description/schema
  quality across the site. Reads GSC export CSV if present at
  docs/gsc-export.csv to overlay real CTR data.
---

# /seo-audit — Euro Heaven SEO surface scan

## What this does

Sweeps the `src/app/` tree, the `src/lib/{services,site,blog}.ts` data
files, and the JSON-LD components, then produces a single report keyed
by **CTR-impact ÷ effort**. If `docs/gsc-export.csv` exists (Google
Search Console → Performance → Export), the report cross-references
actual impressions and CTR so low-performing pages float to the top
of the fix-list.

Output: a markdown summary the owner can scan in 60 seconds.

## When to invoke

- Owner asks "what's hurting my SEO", "any SEO issues", "audit the
  site", or anything similar.
- Once a month as a maintenance pulse.
- After landing a content batch (Phase B/C/D) — to confirm the new
  surfaces are wired into schema, internal links, sitemap.

## How to run

1. **Read the SEO audit baseline** — the structured map from the
   Phase 1 exploration in `/Users/charith/.claude/plans/can-you-ready-the-smooth-twilight.md`
   for what the site looked like at the start of the project. Compare
   against current state.

2. **Scan metadata** — for every `src/app/**/page.tsx` that exports
   `metadata` or `generateMetadata`, capture:
   - Title length (Google truncates at ~60 chars; flag titles ≥ 65)
   - Description length (Google truncates at ~155 chars; flag ≥ 160 or ≤ 80)
   - Presence of `alternates.canonical`
   - Presence of `openGraph` block with `images[]`
   - Presence of `twitter` block

3. **Scan content depth** — for service pages and blog posts:
   - Service description word count (target ≥ 200)
   - Service FAQ count per page (target ≥ 5)
   - Blog post body word count (target ≥ 800)
   - Internal-link count per page (target ≥ 3 contextual, non-nav)

4. **Scan schema** — confirm presence and validity of:
   - Root: AutoRepair + Organization + WebSite
   - Service detail: Service + FAQPage + BreadcrumbList
   - Blog detail: BlogPosting + BreadcrumbList
   - Suburb pages: AutoRepair (per-suburb) + BreadcrumbList
   - Services index + Models: ItemList
   - AggregateRating: emitted only when
     `site.stats.verifiedGoogleReviewCount >= 5`

5. **Cross-reference GSC export** (if present) —
   `docs/gsc-export.csv` schema: `Page,Query,Impressions,CTR,Position`.
   For each page in the export, compute the gap between current CTR
   and the median for its query type (branded vs commercial vs
   informational), then rank pages by `impressions × (median_CTR -
   current_CTR)`.

6. **Produce the report** as markdown with sections:
   - **Critical** (do this week — schema bug, broken redirect, indexing
     blocker)
   - **High impact** (do this month — low-CTR page with rewrite
     potential, missing per-page OG)
   - **Medium** (do this quarter — content depth, additional FAQs)
   - **Already strong** (no action — note for owner reassurance)

## Output format

```markdown
# SEO Audit — {ISO date}

## Critical
- [ ] {issue} — file: `path:line`, fix: `concrete one-liner`

## High impact
- [ ] {issue} — current CTR {x}%, expected after fix {y}%, est. lift
      {impressions × (y-x)} clicks/mo

## Medium
- ...

## Already strong
- ✓ {area}
```

## Files this skill reads (and never writes)

- `src/app/**/page.tsx`
- `src/lib/{services,site,blog}.ts`
- `src/components/StructuredData.tsx`, `src/components/BreadcrumbJsonLd.tsx`
- `src/app/{sitemap,robots}.ts`
- `public/llms.txt`
- `docs/gsc-export.csv` (optional)
- `/Users/charith/.claude/plans/can-you-ready-the-smooth-twilight.md` (baseline)

## What this skill does NOT do

- Does not edit files. The owner reviews the report, then invokes
  `/seo-rewrite` (for title/description) or `/seo-blog` (for content)
  to apply specific fixes.
- Does not call the SEMrush API. The video's WP workflow used SEMrush;
  for Euro Heaven the GSC export is the primary data source.
- Does not fetch live URLs. Trusts the on-disk source as the source of
  truth.
