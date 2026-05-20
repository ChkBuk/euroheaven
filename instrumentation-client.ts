// Next.js client-side instrumentation hook. Initialises Sentry in the
// browser only when NEXT_PUBLIC_SENTRY_DSN is set. Empty dsn = no
// network calls.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

// Required export for Next.js 15.3+ to capture router-transition errors.
export const onRouterTransitionStart = (Sentry as unknown as {
  captureRouterTransitionStart?: typeof Sentry.captureRouterTransitionStart;
}).captureRouterTransitionStart;
