import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section bg-ink-950">
      <div className="container text-center max-w-xl">
        <div className="eyebrow mb-3 justify-center inline-flex">404</div>
        <h1 className="heading-1 mb-4">Page not found</h1>
        <p className="lead mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
