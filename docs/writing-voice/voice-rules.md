# Euro Heaven — Writing Voice (Hard Rules)

Companion to `voice-tone.md`. These are the **non-negotiable rules**
for any blog post, service-page copy, or email written for Euro Heaven.
If the draft breaks one of these, rewrite the draft.

## Structural rules

1. **Answer-first opening.** The first sentence (or first paragraph)
   must directly answer the page's primary question. No throat-clearing,
   no introductions. If the page title is "How much does a Mercedes
   logbook service cost?" the first sentence must contain a price
   range.

2. **Word count: blog posts ≥ 800 words.** Anything shorter doesn't
   rank for competitive queries and signals low effort. If the topic
   doesn't justify 800 words, broaden the topic — don't pad with
   filler.

3. **Use H2s every 150–250 words.** Long unbroken text walls hurt
   scannability and rich-result extraction. Each H2 is a chance for
   an AI engine to extract a self-contained answer.

4. **Include at least one table or bulleted list per post.** AI
   crawlers preferentially extract structured data. Service intervals,
   pricing bands, symptom → cause matrices — anything that's a list
   should be a list.

5. **Internal links: 2–4 per post**, always contextual. Each link
   must be to a relevant service page or another blog post. Never
   link to home or contact from inline copy — those have nav links
   already.

6. **End with a soft CTA + booking link.** One sentence. Not pushy.

## Voice rules

7. **No AI-slop phrases.** See `voice-tone.md` § "Things to never
   do" for the blocklist.

8. **One specific number per 300 words.** A price, a kilometre
   figure, a year, a model code. Specificity beats generality
   everywhere.

9. **No claims without evidence.** Don't write "we're the best
   Mercedes specialist in Melbourne" — that's both unfalsifiable
   and tacky. Write "we've serviced over 12,000 cars" — that's a
   verifiable claim.

10. **First person plural** for the workshop ("we", "us", "our").
    **Second person** for the reader ("you", "your"). Never third
    person ("customers should…", "the vehicle owner needs to…").

## Voice rules (humour)

11. **One observational joke per 800 words, max.** Humour works
    sparingly. Two jokes in 800 words is one too many.

12. **Self-deprecating > targeting customers.** The owner can poke
    fun at himself, at AI, at car-brand marketing — never at the
    reader's intelligence or financial choices.

13. **Dry > pun.** "Mercedes service intervals are like dentist
    visits" ✓. "Time to get your Benz buffed up" ✗.

## Technical rules

14. **Use real Mercedes model codes** (W205, W212, R107, C63) only
    when they add information. Don't write "your W205 C-Class" if
    "your C-Class" is clearer.

15. **Spell "Mercedes" correctly every time.** Never "Merc",
    "Merce", "Mercades". "Benz" is fine as informal — "your Benz" is
    OK in body copy, never in headings.

16. **"Logbook service" not "log book service"** (one word).

17. **Capitalisation** — "C-Class", "E-Class", "S-Class" with the
    hyphen + capital C. "AMG", "EQ" all caps. "Xentry" capitalised.

18. **Australian English.** Spelled "tyre" not "tire". "Kerb" not
    "curb". "Centre" not "center". "Colour" not "color".
    "Kilometre" not "kilometer". "Specialise" not "specialize".

## SEO rules (the keyword cluster)

19. **Primary keyword in: H1, first paragraph, one H2, and meta
    description.** Don't force it elsewhere.

20. **Secondary keywords (4 per post) distributed across H2s.**
    Each should appear in at least one H2 or its body paragraph.

21. **No keyword stuffing.** If the keyword "mercedes service
    Dandenong" appears more than 4 times in an 800-word post,
    you've overdone it.

22. **No "near me" anywhere.** Google flags it as spammy
    placeholder.

## Verification checklist (run before commit)

- [ ] First sentence answers the page's primary question
- [ ] Word count ≥ 800 (check with `wc -w`)
- [ ] At least one H2 every 150–250 words
- [ ] At least one table or bulleted list
- [ ] 2–4 internal links to service / other blog pages
- [ ] One soft CTA sentence at the end
- [ ] No AI-slop phrases (grep the blocklist in `voice-tone.md`)
- [ ] At least one specific dollar figure
- [ ] Australian English spellings throughout
- [ ] Primary keyword in H1, first paragraph, one H2, meta description
- [ ] No "near me" anywhere
