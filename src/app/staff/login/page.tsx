import type { Metadata } from "next";
import StaffLoginForm from "@/components/StaffLoginForm";

export const metadata: Metadata = {
  title: "Staff Sign In",
  description: "Sign in to the Euro Heaven workshop admin dashboard.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/admin";

  return (
    <section className="bg-ink-950 min-h-[80vh] flex items-center py-16">
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 blur-3xl rounded-full pointer-events-none"
        aria-hidden
      />
      <div className="container max-w-md relative">
        <div className="text-center mb-10">
          <div className="eyebrow mb-3 inline-flex">Workshop Admin</div>
          <h1 className="heading-2 mb-4">
            Staff <span className="text-accent">Sign In</span>
          </h1>
          <p className="text-white/65 text-sm leading-relaxed">
            Enter your staff email below. We&apos;ll send a one-time sign-in
            link to your inbox — tap it from your phone and you&apos;ll be
            taken straight to the workshop admin.
          </p>
        </div>

        <StaffLoginForm nextPath={safeNext} />

        <p className="text-center mt-8 text-[11px] text-white/40 leading-relaxed">
          Only emails added to the workshop staff allowlist can sign in. If
          you&apos;re a customer trying to track a repair,{" "}
          <a href="/track" className="text-accent hover:underline">
            head to the tracking page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
