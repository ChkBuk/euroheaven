# Launch SEO checklist — Euro Heaven

Step-by-step setup for Google Search Console + Google Business Profile, plus a few common pitfalls. Run through this once after the production deploy goes live.

---

## Prerequisites (don't skip)

Before submitting anything to Google, confirm:

1. **Production deploy is live** at `https://euroheaven.com.au` with valid SSL
2. **`/privacy` and `/terms` resolve 200** (not 404 — Google treats sustained 404s as a quality signal)
3. **`site.ts` has the real address** — postcode, suburb spelling, ABN. Address consistency between site, JSON-LD schema (`<StructuredData />`), and Google Business Profile is a known local-SEO ranking factor (NAP — Name/Address/Phone)
4. **`/sitemap.xml` returns 200** with the full URL list (~80 entries)
5. **`/robots.txt` returns 200** and points at the sitemap

Quick check from your terminal:
```sh
curl -I https://euroheaven.com.au/sitemap.xml
curl -I https://euroheaven.com.au/privacy
curl -I https://euroheaven.com.au/terms
```
All three should return `HTTP/2 200`.

---

## Part 1 — Google Search Console

### 1.1 Add the property

1. Open https://search.google.com/search-console
2. Click **Add property** in the dropdown (top-left)
3. Choose **Domain** (preferred — covers `www`, `https`, all subpaths)
4. Enter `euroheaven.com.au` and click Continue
5. Google shows a TXT record. Copy the value (looks like `google-site-verification=ABCDE...`)

### 1.2 Add the TXT record at your registrar

In your DNS provider (Cloudflare, Route 53, Namecheap, GoDaddy, etc.):

- **Type**: TXT
- **Name / Host**: `@` (root). If your provider doesn't allow `@`, leave blank
- **Value**: `google-site-verification=...` (paste exactly what Google gave you)
- **TTL**: default

Save. Wait 5–15 minutes (occasionally up to 24h on slow registrars). Check propagation:
```sh
dig TXT euroheaven.com.au +short
```
The `google-site-verification=...` line should appear. Then click **Verify** in Search Console.

### Fallback — if you can't add DNS records

Use **URL prefix** verification instead of Domain:
1. Re-add the property as URL prefix: `https://euroheaven.com.au`
2. Choose the **HTML file** verification method
3. Download the file Google provides (e.g. `google1234abcd.html`)
4. Place it in `public/` so Next.js serves it at the site root: `https://euroheaven.com.au/google1234abcd.html`
5. Commit, push, redeploy
6. Confirm the URL serves the file, then click Verify

### 1.3 Submit the sitemap

1. In Search Console → left nav → **Sitemaps**
2. Enter `sitemap.xml` (just the path — Google prepends the domain)
3. Click **Submit**
4. Wait 24–48 hours. Status should flip from `Couldn't fetch` → `Success`

### 1.4 Request indexing for top pages

Use **URL Inspection** at the top of the dashboard (one URL at a time, daily quota ~10):

- `https://euroheaven.com.au/`
- `https://euroheaven.com.au/services`
- `https://euroheaven.com.au/about`
- `https://euroheaven.com.au/book`
- `https://euroheaven.com.au/contact`

For each: paste the URL → wait for the inspection → click **Request indexing**.

### 1.5 Common pitfalls

- **"Already verified" by another owner** — somebody else (a prior agency, a former employee) verified the domain. Get them to add you as a delegated owner via Settings → Users and Permissions, instead of trying to re-verify.
- **DNS propagation delay** — TXT records can take up to 24h on slow registrars. Don't keep clicking Verify; check `dig` output first.
- **robots.txt blocks** — if pages aren't indexing, run them through the robots.txt Tester in Search Console (Settings → robots.txt). Confirm `/admin` and `/api/` are blocked but everything else passes.
- **Preview deployments indexed by mistake** — Vercel preview URLs (`*-vercel.app`) shouldn't be indexed. The `metadataBase` in `layout.tsx` uses `NEXT_PUBLIC_SITE_URL`, so canonical tags should always point at the production domain.

---

## Part 2 — Google Business Profile

This drives "Mercedes mechanic near me" results in Australia and is more impactful for local search than anything in the code.

### 2.1 Register the workshop

1. Open https://business.google.com
2. Click **Manage now** → enter business name **Euro Heaven**
3. Choose categories:
   - **Primary**: Auto repair shop
   - Secondary: Brake shop, Auto tune-up service, Mercedes-Benz dealer (only if applicable — using "Mercedes-Benz" in category triggers brand-protection review)
4. Address: real Dandenong workshop address (must match `site.ts` exactly — postcode included)
5. Phone: `+61 400 115 765` (matches `site.phone`)
6. Website: `https://euroheaven.com.au`

### 2.2 Verify

Google will offer one of:
- **Postcard** (most common for new listings, 5–14 business days). Code arrives by mail to the workshop address. Tell front-desk staff to expect a Google envelope — these often get discarded as junk.
- **Phone call / SMS** (sometimes for known listings)
- **Video** (occasionally — record a short walk-through showing the address signage and equipment)

If postcard is lost after 14 days, request a re-send from the GBP dashboard.

### 2.3 Optimise the listing

Once verified, fill in:

- **Hours**: copy from `site.hours` in `src/lib/site.ts`
- **Photos**: upload at least 10 — workshop exterior, interior, technicians at work, customer cars, logo. If you don't have real photos yet, the Pexels images in `src/lib/images.ts` work as placeholders (but real photos rank better)
- **Services**: add each service from `src/lib/services.ts` as a custom service entry with description and price-from
- **Description**: paraphrase `site.description` (max 750 characters)
- **Booking link**: link directly to `https://euroheaven.com.au/book` under Bookings
- **Q&A**: pre-seed 3–5 questions you've seen in the AI assistant analytics ("Do you service AMG?", "Do you offer a courtesy car?", "Do you fix BMW?")

### 2.4 Link from your site

Once GBP is live, update `src/lib/site.ts`:
```ts
social: {
  ...
  google: "https://g.page/euroheaven-something",  // the short link Google generates
}
```
This already feeds the `sameAs` field in `<StructuredData />`, the Footer Google icon, and the AI assistant's "see all reviews" link.

### 2.5 Common pitfalls

- **NAP inconsistency** — name, address, and phone must match exactly across `site.ts`, the JSON-LD in `<StructuredData />`, and the GBP listing. Even a typo in suburb spelling tanks local rankings. Audit before submitting.
- **Service area vs storefront** — workshops are storefront businesses (customers visit). Don't toggle "service area business" or you lose the map pin.
- **Auto-suspension** — Google sometimes flags new listings with aggressive edits. Avoid bulk edits in the first 30 days. Make changes one at a time, days apart.
- **Multiple categories** — primary should be Auto repair shop, not Mercedes-Benz dealer (using a brand name as primary triggers extra verification).
- **Address on the postcard** — verify the address signage at the workshop matches what you submitted, otherwise Google Maps street-view validation can fail.

---

## Part 3 — Post-launch monitoring (first month)

- **Search Console → Performance** — check impressions and clicks weekly. Expect first impressions within 1–2 weeks of indexing.
- **Coverage report** — confirm all pages from sitemap are indexed (allow 2–3 weeks for Google to crawl everything).
- **Page Experience** — keep Core Web Vitals green. If LCP/INP/CLS drop, investigate. Moving the hero video to Cloudinary (Item D in the launch plan) helps mobile TTI.
- **Business Profile insights** — once verified, GBP shows search queries, calls, direction requests, and website clicks. Track weekly.
- **AI assistant logs** (Vercel → Functions → Logs filtered to `/api/chat`) — review what real users ask. Common questions can become Q&A entries on GBP.

---

## Quick verification checklist

- [ ] `dig TXT euroheaven.com.au +short` returns `google-site-verification=...`
- [ ] Search Console → Sitemaps shows `sitemap.xml` status = **Success**
- [ ] Top 5 URLs submitted via URL Inspection
- [ ] GBP listing visible at `https://www.google.com/maps?q=Euro+Heaven+Dandenong`
- [ ] Searching "Mercedes mechanic Dandenong" from a Melbourne-area device returns the listing within 4–6 weeks
- [ ] `site.social.google` updated with the real `g.page/...` link
