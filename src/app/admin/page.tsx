import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Workshop Admin",
  description: "Workshop admin — manage bookings and repair statuses.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <section className="bg-ink-900 border-b border-white/5">
        <div className="container py-10">
          <h1 className="heading-3 text-white">Workshop Admin</h1>
          <p className="text-white/55 text-sm mt-1">
            Manage bookings and update repair statuses. In production this is
            protected by Supabase Auth (role: staff).
          </p>
        </div>
      </section>
      <section className="section bg-ink-950">
        <div className="container">
          <AdminDashboard />
        </div>
      </section>
    </>
  );
}
