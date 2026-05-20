import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server";

export type AuthSession = {
  userId: string;
  email: string;
};

/**
 * Returns the currently signed-in user from the request cookies, or null
 * if the user is not authenticated / Supabase is not configured.
 *
 * Side effect: when a session is found and Sentry is configured, binds
 * the user as the Sentry scope identity so any subsequent
 * `Sentry.captureException` calls during this request carry the user
 * info — much more useful for triaging support tickets.
 */
export async function getSession(): Promise<AuthSession | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user || !data.user.email) return null;
  const session: AuthSession = {
    userId: data.user.id,
    email: data.user.email,
  };
  // Best-effort Sentry user binding. Dynamic import to avoid pulling
  // Sentry into routes that don't otherwise import it; no-op when DSN
  // is unset.
  if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.setUser({ id: session.userId, email: session.email });
    } catch {
      /* Sentry import failed — ignore */
    }
  }
  return session;
}

/**
 * True if the signed-in user's email is in the `staff_emails` table.
 * Uses the privileged client so RLS doesn't get in the way of the lookup.
 */
export async function isStaff(email: string): Promise<boolean> {
  // Optional dev shortcut — set DEV_STAFF_EMAILS=foo@bar,baz@qux in .env.local
  // to whitelist staff without populating the staff_emails table.
  const dev = process.env.DEV_STAFF_EMAILS;
  if (dev) {
    const allowed = dev
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.includes(email.toLowerCase())) return true;
  }

  const sb = getSupabaseServiceClient();
  if (!sb) return false;
  const { data } = await sb
    .from("staff_emails")
    .select("email")
    .ilike("email", email)
    .maybeSingle();
  return !!data;
}

/** Convenience: returns the session iff it belongs to a staff member. */
export async function getStaffSession(): Promise<AuthSession | null> {
  const session = await getSession();
  if (!session) return null;
  return (await isStaff(session.email)) ? session : null;
}
