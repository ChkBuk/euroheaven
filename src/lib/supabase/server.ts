import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Re-export the service client for convenience — it lives in its own file
// to avoid pulling `next/headers` into modules that just need privileged
// access without a request context.
export { getSupabaseServiceClient } from "./service";
export type { SupabaseServiceClient } from "./service";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Use this in Server Components, Route Handlers, and Server Actions when
 * the operation must run as the *signed-in user* (RLS applies).
 *
 * Pulls in `next/headers` — only safe to import from request-scoped
 * server code.
 *
 * Returns null when env vars are missing — callers should treat that as
 * "auth disabled, fall back to legacy behavior".
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll may throw in Server Components; safe to ignore — the
          // middleware handles cookie refresh in those cases.
        }
      },
    },
  });
}

export type SupabaseServerClient = NonNullable<
  Awaited<ReturnType<typeof getSupabaseServerClient>>
>;
