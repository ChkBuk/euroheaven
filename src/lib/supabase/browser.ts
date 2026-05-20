"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client used for auth flows (magic-link sign-in,
 * fetching the current session client-side, etc.). Returns null when env
 * vars are missing so callers can degrade gracefully.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
