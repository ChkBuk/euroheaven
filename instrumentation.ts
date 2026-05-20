// Next.js server-side instrumentation hook. Loaded once per server runtime.
// Used here to initialise Sentry on the server / edge — Sentry transmits
// nothing when SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN are unset, so the file
// is safe to ship without configured credentials.

export async function register() {
  const dsn =
    process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      enableLogs: false,
    });
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    });
  }
}

export async function onRequestError(...args: unknown[]) {
  const dsn =
    process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  const Sentry = await import("@sentry/nextjs");
  // The signature of captureRequestError is internal to @sentry/nextjs;
  // forward the args verbatim.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Sentry as any).captureRequestError?.(...args);
}
