"use client";

// Next.js renders this file when an uncaught error escapes the root
// layout. Sentry captures the error if a DSN is set; otherwise the
// component still renders so users see a friendly fallback instead of
// the default error screen.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry init is a no-op if the DSN env var is not set, so this
    // call is safe in unconfigured environments — it just logs to the
    // browser console.
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en-AU">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#0c131c",
          color: "#e8ecf2",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "560px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(232, 236, 242, 0.7)",
              marginBottom: "24px",
            }}
          >
            We&apos;ve been notified and will look into it. In the meantime
            you can try again, or call us on{" "}
            <a
              href="tel:+61400115765"
              style={{ color: "#2B6DFF", textDecoration: "none" }}
            >
              400 115 765
            </a>
            .
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "11px",
                color: "rgba(232, 236, 242, 0.4)",
                marginBottom: "24px",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#2B6DFF",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
