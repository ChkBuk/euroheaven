import { redirect } from "next/navigation";
import Link from "next/link";
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

  if (supabaseConfigured) {
    const session = await getSession();
    if (!session) {
      redirect("/track?next=/admin");
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
  }

  return <>{children}</>;
}
