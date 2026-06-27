---
name: seo-rewrite
description: Rewrite the title and meta description of a low-CTR page
  using the CTR formula. Use when the owner says "rewrite the title
  for page X", "this page isn't getting clicks", or "give me a better
  meta description for /Y". Reads the GSC export if present for
  current CTR baseline; edits the page's metadata export in place.
---

# /seo-rewrite — Rewrite a page's title + meta description

## What this does

Takes one URL (or a list) and rewrites its `title` and `description`
in `metadata` / `generateMetadata` using the CTR formula:

```
[Service / Topic] [Suburb / Region] | [USP] | [CTA or Trust Signal]
```

Edits the page's metadata export in place. Reports the before/after.

## When to invoke

- Owner says "this page isn't getting clicks" or "rewrite the title
  for /X".
- After running `/seo-audit` and getting a fix-list — owner picks
  pages to rewrite.
- After a GSC Performance review shows pages with low CTR for their
  position (position 1–5 with CTR < 20 % = title problem).

## Required input

- One URL path (e.g. `/services/brake-repair`) or a list of paths.
- (Optional) the page's current GSC CTR + impression count, so the
  rewrite is positioned as a measurable change.

## How to run

1. **Read the CTR formula reference** in
   `/Users/charith/.claude/plans/can-you-ready-the-smooth-twilight.md`
   under "Phase A — Immediate hand-coded wins" so you stay aligned
   with already-applied rewrites.

2. **Locate the page** — map URL path to `src/app/{path}/page.tsx` or
   the parameterised route handler. For dynamic routes
   (`services/[slug]`, `mercedes-service/[suburb]`,
   `blog/[slug]`), the title is generated in `generateMetadata` and
   may be templated from `src/lib/{services,blog}.ts` — edit there
   instead.

3. **Read the current metadata** — capture the current title +
   description + openGraph block so you can produce a before/after
   diff for the report.

4. **Apply the CTR formula** to the new title:

   - **[Service / Topic]** — what the page is about, in customer
     language (not jargon). "Brake Repair" not "Caliper Service".
   - **[Suburb / Region]** — "Dandenong" preferred, "Melbourne" when
     broader. Never "Near Me" (Google flags as spam).
   - **[USP]** — one of: "Factory-Trained", "Genuine Parts",
     "Warranty-Safe", "Same-Day", "Xentry Diagnostics".
   - **[CTA or Trust Signal]** — "Euro Heaven", a price ("from $480"),
     or a guarantee ("Warranty Compliant").

   Max length: 60 characters (Google truncates beyond ~60). If the
   formula overflows, drop the last segment.

5. **Apply the description formula**:

   - Restate the answer-first promise of the page
   - Include the USP
   - End with a soft CTA — "book online", "Xentry scan in 60
     minutes", "free quote in an hour"
   - Max length: 155 characters (Google truncates beyond ~155).

6. **Edit the page**:
   - For static pages: edit the `export const metadata` object.
   - For dynamic pages: edit the `generateMetadata` function.
   - For data-driven titles: edit the data file (e.g.
     `src/lib/services.ts`) — the data field flows through.
   - Update both `title`/`description` and `openGraph.title`/
     `openGraph.description` so social previews match.

7. **Typecheck** — run `npx tsc --noEmit -p tsconfig.json` from the
   project root; the rewrite shouldn't introduce type errors.

8. **Report**:

   ```
   ## {URL path}
   Before:
     title: "{current title}" ({current length} chars)
     description: "{current description}" ({len} chars)
   After:
     title: "{new title}" ({new length} chars)
     description: "{new description}" ({len} chars)
   Estimated CTR lift: +{x}% (based on +N chars in USP / +CTA hook)
   ```

## Files this skill reads

- `src/app/{path}/page.tsx`
- `src/lib/services.ts`, `src/lib/site.ts`, `src/lib/blog.ts`
  (if title flows from data)
- `docs/gsc-export.csv` (optional — for CTR baseline)
- `/Users/charith/.claude/plans/can-you-ready-the-smooth-twilight.md`
  (formula reference)

## Files this skill writes

- One or more `src/app/**/page.tsx` and / or `src/lib/*.ts` files —
  whichever holds the source of the rewritten title/description.

## What this skill does NOT do

- Does not commit. Owner reviews the diff then commits.
- Does not change the page's `<h1>` or body copy — only metadata.
  (For body rewrites, invoke `/seo-blog` or hand-edit.)
- Does not bulk-rewrite without input. Owner supplies the URL list.
