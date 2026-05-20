import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server";

export type AuthSession = {
  userId: string;
  email: string;
};

/**
 * Returns the currently signed-in user from the request cookies, or null
 * if the user is not authenticated / Supabase is not configured.
 */
export async function getSession(): Promise<AuthSession | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user || !data.user.email) return null;
  return { userId: data.user.id, email: data.user.email };
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
