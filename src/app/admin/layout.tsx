import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getSession, isStaff } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // When Supabase isn't configured (local dev with no env keys), don't lock
  // the admin page out — the in-memory store still serves a usable demo.
  // Once the project has real auth, this gate enforces staff-only access.
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let signedInEmail: string | null = null;

  if (supabaseConfigured) {
    const session = await getSession();
    if (!session) {
      // Capture the exact path the user was trying to reach so they
      // land back here after sign-in. `x-pathname` is set by the
      // middleware in src/middleware.ts.
      const hdrs = await headers();
      const currentPath = hdrs.get("x-pathname") || "/admin";
      redirect(`/staff/login?next=${encodeURIComponent(currentPath)}`);
    }
    if (!(await isStaff(session.email))) {
      // Authenticated but not staff — render the not-allowed message rather
      // than redirect so the user understands what happened.
      return (
        <section className="section bg-ink-950">
          <div className="container-narrow text-center py-16">
            <h1 className="heading-2 mb-4">Access denied</h1>
            <p className="text-white/65 mb-8">
              Your account ({session.email}) isn&apos;t authorised to access
              the workshop admin. If you think this is an error, contact the
              site owner.
            </p>
            <Link href="/" className="btn-primary">
              Back to home
            </Link>
          </div>
        </section>
      );
    }
    signedInEmail = session.email;
  }

  return (
    <>
      {/* Sticky staff bar — shows who's signed in, links back to the
          dashboard, and provides a one-tap sign-out. Always visible
          across every /admin/* page so the user can never lose track of
          where they are or how to log out. */}
      <div className="sticky top-0 z-30 bg-ink-950 border-b border-white/10 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm font-semibold text-white hover:text-accent transition-colors"
            >
              Workshop Admin
            </Link>
            <span className="text-white/30">·</span>
            <Link
              href="/admin"
              className="text-xs text-white/55 hover:text-white"
            >
              Bookings
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {signedInEmail && (
              <span className="text-white/55 hidden sm:inline">
                Signed in as{" "}
                <strong className="text-white">{signedInEmail}</strong>
              </span>
            )}
            <form action="/api/auth/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-white/65 hover:text-accent transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
