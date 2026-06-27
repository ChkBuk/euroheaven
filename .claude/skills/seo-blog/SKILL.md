---
name: seo-blog
description: Draft a Mercedes-Benz blog post for euroheaven.com.au in
  the workshop owner's voice. Use when the owner says "draft a blog
  post about X", "write me a post on Y", or supplies a keyword cluster
  to target. Reads the writing-voice guide and the rules file before
  drafting. Appends the post to src/lib/blog.ts.
---

# /seo-blog — Draft an 800+ word blog post in Euro Heaven's voice

## What this does

Takes a topic (or a keyword cluster) and produces a complete blog
post that:

- Opens with an answer-first paragraph (AI-overview extractable)
- Hits ≥ 800 words of substantive content
- Uses Euro Heaven's voice (workshop owner, plain English, dry humour)
- Includes ≥ 1 table or bulleted list
- Internal-links to 2–4 service pages
- Ends with a soft CTA
- Appends to `src/lib/blog.ts` ready for commit

## Required input

The user supplies any of:

- A topic ("How often should I service my AMG?")
- A target keyword + cluster (`{primary, secondary[]}`)
- A target word count (default 1000)

If the user only gives a topic, you derive a keyword cluster from
common Mercedes queries (or use the user's `docs/keywords-blog.csv`
if it exists).

## How to run

1. **Read the voice files** — both are required, no skipping:
   - `@docs/writing-voice/voice-tone.md` — tone slider, dos/don'ts,
     examples
   - `@docs/writing-voice/voice-rules.md` — the hard rules + the
     verification checklist

2. **Research the topic** — search the web for top-ranking content on
   the keyword cluster's primary keyword. Identify:
   - Average word count of top-3 results
   - Sub-topics they all cover (those are table-stakes)
   - Sub-topics they don't cover (those are the differentiation
     opportunities)
   - Common headings (H2 / H3 patterns)

3. **Read existing posts** in `src/lib/blog.ts` for voice calibration
   — match register, tense, paragraph length.

4. **Draft the post** with this structure:

   ```
   # {Title — uses primary keyword}

   {Answer-first paragraph — direct answer with a price / time
   window if applicable}

   ## {H2 covering the most common sub-question}

   {Body, ≥ 2 paragraphs, includes a table or list}

   ## {H2 covering the second sub-question}

   {...}

   ## {H2 — practical / pricing / when-to-call section}

   {Bullets or table with specifics}

   ## Frequently asked

   {3–5 FAQ Q&A blocks aligned with SEMrush / GSC "People also
   ask" wording}

   ## {Soft CTA closing paragraph}

   One sentence pointing to the relevant service page + /book.
   ```

5. **Apply the checklist** from `voice-rules.md` § Verification
   checklist. If any item fails, revise before output.

6. **Append to `src/lib/blog.ts`**:

   ```ts
   {
     slug: "kebab-case-slug",
     title: "{Title}",
     excerpt: "{One-sentence summary, ~150 chars}",
     date: "{ISO date}",
     // readTime omitted — auto-computed
     author: DEFAULT_AUTHOR, // or a named author if provided
     body: `{markdown body with \\n\\n paragraph breaks}`,
   },
   ```

7. **Report back to the user**:
   - The slug, title, and final word count
   - Which sub-topics you covered that the top-3 competitors didn't
   - Which internal links you placed and where they appear
   - The checklist results

## Files this skill reads

- `docs/writing-voice/voice-tone.md` (mandatory)
- `docs/writing-voice/voice-rules.md` (mandatory)
- `src/lib/blog.ts` (for voice calibration + slug uniqueness)
- `src/lib/services.ts` (for internal-link targets)
- `docs/keywords-blog.csv` (optional — if user supplied keyword data)

## Files this skill writes

- `src/lib/blog.ts` — appends a new post to the `posts` array

## What this skill does NOT do

- Does not generate AI imagery (Euro Heaven uses real workshop photos).
- Does not commit. Owner reviews then commits manually.
- Does not auto-publish to a third-party blog platform — Euro Heaven's
  blog is Next.js-native (Markdown in TS), no CMS.
