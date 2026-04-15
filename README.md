# Euro Hevans — Mercedes-Benz Specialist Website

A mobile-first, SEO-optimised website for a Mercedes-Benz specialist repair workshop in Melbourne, Victoria. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and designed to integrate with Supabase, Google Calendar, Resend (email), and Twilio (SMS).

## Features

- **Marketing site** — Home, Services (with per-service detail pages), Models, About, Reviews, Blog, Contact
- **Multi-step booking wizard** (`/book`) — 6 steps, Zod validation, API-ready
- **Real-time repair status tracker** (`/track`) — reference lookup + magic-link login stub
- **Customer rating flow** — auto-prompted on completion, nudge to Google Reviews for 4★+
- **Admin panel** (`/admin`) — manage bookings and update repair status
- **Programmatic suburb landing pages** (`/mercedes-service-[suburb]`) for Victoria-wide SEO
- **SEO scaffolding** — schema.org JSON-LD (AutoRepair, LocalBusiness, Service, FAQPage), sitemap, robots, Open Graph, canonical URLs
- **Mobile-first design** — sticky bottom CTA on mobile, 44–48px tap targets, tested breakpoints
- **Accessibility** — semantic HTML, focus rings, ARIA labels, 4.5:1 contrast

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000.

The site runs fully locally with an in-memory booking store — no external services required to try the booking flow, tracker, admin, and rating systems.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                       # Home
│   ├── layout.tsx                     # Root layout (fonts, metadata, schema)
│   ├── services/                      # Service index + [slug] detail pages
│   ├── models/                        # Models we service
│   ├── about/                         # About us
│   ├── contact/                       # Contact + map + form
│   ├── book/                          # Booking wizard
│   ├── track/                         # Real-time repair tracker
│   ├── reviews/                       # Customer reviews
│   ├── blog/                          # Blog index + [slug]
│   ├── mercedes-service-[suburb]/     # Programmatic suburb SEO pages
│   ├── admin/                         # Workshop admin panel
│   ├── api/
│   │   ├── bookings/                  # POST booking, GET list, PATCH status
│   │   ├── ratings/                   # POST rating, GET reviews
│   │   ├── contact/                   # POST contact message
│   │   └── auth/magic-link/           # Magic-link stub
│   ├── sitemap.ts
│   └── robots.ts
├── components/                        # Header, Footer, BookingWizard, TrackForm, etc.
└── lib/
    ├── site.ts                        # Business name, address, hours, suburbs
    ├── services.ts                    # Services catalog
    ├── models.ts                      # Mercedes model groups
    ├── blog.ts                        # Blog posts
    ├── booking.ts                     # Booking Zod schema + options
    ├── store.ts                       # In-memory data store (swap for Supabase)
    └── integrations.ts                # Google Calendar / Resend / Twilio stubs
supabase/
└── schema.sql                         # Production Postgres schema with RLS
.env.example                           # Env var template
```

## Integrations — wiring up for production

The local dev experience uses an **in-memory store** (`src/lib/store.ts`) and **stubbed integrations** (`src/lib/integrations.ts`). Replace these with real services in production:

### 1. Supabase (database + auth + realtime + storage)

1. Create a Supabase project at https://supabase.com.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy URL and keys into `.env.local`.
4. Replace calls in `src/lib/store.ts` with Supabase client calls (use `@supabase/ssr`).
5. For real-time status updates on `/track`, subscribe via `supabase.channel().on('postgres_changes', ...)`.
6. For magic-link auth on `/account`, use `supabase.auth.signInWithOtp({ email })`.

### 2. Google Calendar

1. Create a Google Cloud service account with Calendar API enabled.
2. Share the workshop owner's calendar with the service account email.
3. Set `GOOGLE_CALENDAR_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY` in `.env.local`.
4. Implement `createCalendarEvent()` in `src/lib/integrations.ts` using the `googleapis` package.
5. For slot availability, call `calendar.freebusy.query()` and filter `timeSlots` in the booking wizard.

### 3. Resend (email)

1. Sign up at https://resend.com, verify your domain.
2. Implement `sendBookingEmail()` and `sendStatusUpdate()` in `src/lib/integrations.ts`.
3. Use React Email for templates (optional).

### 4. Twilio (SMS)

1. Get Twilio credentials and an Australian number.
2. Implement `sendBookingSMS()` using the Twilio SDK.

### 5. Admin authentication

The `/admin` route is currently unprotected. Before deploying:

- Create a Supabase user with `raw_user_meta_data = { "role": "staff" }`.
- Add middleware (`src/middleware.ts`) to redirect unauthenticated requests from `/admin` to a login page.
- Or use Vercel Password Protection for the `/admin` path during early staging.

## SEO Checklist

- [x] `metadataBase` + per-page `<title>` and `description`
- [x] Open Graph & Twitter Card tags
- [x] JSON-LD: `AutoRepair`, `Service`, `FAQPage` (on service detail pages)
- [x] `sitemap.xml` + `robots.txt`
- [x] Canonical URLs
- [x] Programmatic suburb landing pages (`/mercedes-service-[suburb]`)
- [ ] Add real OG image at `/public/og-image.jpg` (1200×630)
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Verify Google Business Profile and link from footer
- [ ] Add GA4 via `NEXT_PUBLIC_GA_ID`

## Branding

Colours, fonts, and spacing live in `tailwind.config.ts` and `src/app/globals.css`. Business details (name, phone, address, suburbs, hours) live in `src/lib/site.ts` — update in one place and the whole site follows.

## Deployment

Recommended: [Vercel](https://vercel.com). Connect the repo, set env vars, deploy. Next.js 14 features (App Router SSR, image optimisation, edge caching) work out of the box.

## Scripts

```bash
npm run dev      # local dev at http://localhost:3000
npm run build    # production build
npm start        # production server
npm run lint     # ESLint
```

## Verification checklist

After wiring up integrations, verify end-to-end:

1. Submit a booking from `/book` → booking appears in `/admin`, email + SMS received, Google Calendar event created.
2. Change status in `/admin` → `/track` page updates within seconds.
3. Move status to "Completed" → rating prompt email sent to customer.
4. Submit a review → appears on `/reviews`.
5. Validate all pages with Google Rich Results Test and Lighthouse (aim ≥ 90 performance, 100 SEO mobile).

---

Questions to confirm with the client before launch: exact business name, ABN, phone, address, certifications, exact service list / pricing, preferred booking lead time, and which suburbs to prioritise for the programmatic pages.
