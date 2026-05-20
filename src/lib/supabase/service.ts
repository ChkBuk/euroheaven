import { createClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the service-role key. Bypasses RLS — use
 * ONLY in server-side code (route handlers, server actions, server-only
 * library code) for trusted operations like persisting a booking from the
 * public booking form.
 *
 * This client deliberately does NOT depend on `next/headers`, so it can be
 * imported from anywhere in the server bundle without polluting client
 * bundles. The cookie-bound server client lives in `./server.ts`.
 *
 * Returns null when env vars are missing — callers should treat that as
 * "Supabase not configured, fall back to legacy in-memory behavior".
 */
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type SupabaseServiceClient = NonNullable<
  ReturnType<typeof getSupabaseServiceClient>
>;
