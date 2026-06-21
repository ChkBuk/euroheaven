"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Top-level client redirector that catches Supabase password-recovery
 * landings on any page.
 *
 * Background: Supabase's `/auth/v1/verify?type=recovery` endpoint
 * redirects to whatever `redirect_to` is set to (currently the
 * homepage), appending `#access_token=...&refresh_token=...&type=recovery`
 * to the URL. Without intervention, the user just sees the homepage —
 * no UI to set a new password.
 *
 * This component checks the URL fragment on mount, and if it's a
 * recovery payload, hands off to `/auth/reset-password` preserving the
 * fragment so that page can consume the tokens.
 *
 * Mounted once in the root layout so it works no matter which page
 * Supabase redirects back to.
 */
export default function RecoveryRedirector() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Already on the reset page — let it handle the tokens itself.
    if (pathname === "/auth/reset-password") return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    // Hash looks like "#access_token=…&refresh_token=…&type=recovery"
    if (hash.includes("type=recovery")) {
      router.replace(`/auth/reset-password${hash}`);
    }
  }, [pathname, router]);

  return null;
}
