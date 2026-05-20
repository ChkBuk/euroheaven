import { NextResponse } from "next/server";

/**
 * Sliding-window rate limit backed by Upstash Redis REST API. No SDK
 * install — uses raw fetch with the REST token. Free tier handles 10K
 * commands/day, plenty for marketing-site form submissions.
 *
 * If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are not set,
 * the limiter is a no-op (returns null) so dev / unconfigured deploys
 * keep working.
 */
export async function checkRateLimit(opts: {
  request: Request;
  /** Bucket key prefix — e.g. "contact", "booking". Combined with the IP. */
  key: string;
  /** Max requests permitted per window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}): Promise<NextResponse | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const ip =
    opts.request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    opts.request.headers.get("x-real-ip") ||
    "unknown";
  const bucket = `rl:${opts.key}:${ip}`;

  try {
    // Use Upstash's pipeline endpoint to atomically INCR + EXPIRE.
    // INCR returns the new count; EXPIRE only sets the TTL on first hit.
    const resp = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", bucket],
        ["EXPIRE", bucket, String(opts.windowSec), "NX"],
      ]),
    });
    if (!resp.ok) {
      console.error(
        "[rate-limit] Upstash error:",
        resp.status,
        await resp.text().catch(() => "")
      );
      return null; // Fail open — don't block users on a Redis outage.
    }
    const results = (await resp.json()) as Array<{ result: number }>;
    const count = results?.[0]?.result ?? 0;
    if (count > opts.limit) {
      return NextResponse.json(
        { error: "rate_limited", retryAfterSec: opts.windowSec },
        { status: 429, headers: { "Retry-After": String(opts.windowSec) } }
      );
    }
  } catch (err) {
    console.error("[rate-limit] failed:", err);
    return null;
  }
  return null;
}
