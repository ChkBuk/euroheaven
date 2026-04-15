"use client";

import { useState } from "react";
import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export default function RatingForm({ reference }: { reference: string }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (stars < 1 || comment.length < 3) return;
    setSubmitting(true);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, stars, comment }),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-10 h-10 text-brand-success mx-auto mb-3" />
        <p className="text-white font-semibold mb-2">
          Thanks for your feedback!
        </p>
        {stars >= 4 && (
          <a
            href={site.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm inline-flex"
          >
            Share on Google <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}
            className="p-1"
            aria-label={`${n} stars`}
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                (hover || stars) >= n
                  ? "fill-accent text-accent"
                  : "text-white/20"
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Tell us about your experience..."
        className="field-input mb-3"
      />
      <button
        onClick={submit}
        disabled={submitting || stars < 1 || comment.length < 3}
        className="btn-primary w-full disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}
