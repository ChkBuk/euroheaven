"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

type Message = { role: "user" | "bot"; text: string };

type KnowledgeEntry = {
  // Each inner array is an AND-group: ALL terms must be present for it to
  // count. Multiple inner arrays are OR'd (any one group can match). Single
  // terms in an inner array are exact-word matches; multi-word strings are
  // treated as exact phrases with word boundaries.
  mustMatch: string[][];
  // Optional negative terms — if any of these appear, this entry is ruled
  // out entirely. Prevents cross-contamination between similar topics.
  notIf?: string[];
  weight?: number;
  answer: string;
};

const knowledge: KnowledgeEntry[] = [
  {
    mustMatch: [
      ["warranty"],
      ["void"],
      ["dealer warranty"],
      ["new car warranty"],
    ],
    weight: 3,
    answer:
      "Using our independent workshop will not void your Mercedes warranty. Under Australian Consumer Law, independent specialists using MB-approved parts and fluids keep your factory warranty fully intact — and we stamp the logbook.",
  },
  {
    mustMatch: [
      ["service a"],
      ["service b"],
      ["logbook"],
      ["log book"],
      ["service interval"],
      ["service schedule"],
    ],
    weight: 3,
    answer:
      "Service A is the basic interval (~15,000 km): oil & filter change, brake inspection, Xentry diagnostic scan. Service B adds cabin filters, fluid top-ups and a full multi-point check (~30,000 km). We follow the MB factory schedule so your logbook stays compliant.",
  },
  {
    mustMatch: [["amg"], ["c63"], ["gt r"], ["s-class amg"], ["performance"]],
    weight: 2,
    answer:
      "Yes — we work on the full AMG line from C63 to GT R and S-Class AMG. That includes carbon-ceramic brakes, Bilstein/air suspension, AMG-spec fluids, and dyno-verified tuning within factory tolerances.",
  },
  {
    // European brands — yes, we service these. Mercedes-Benz is the deep
    // specialty; the rest are covered as "European Vehicle Specialists".
    mustMatch: [
      ["bmw"],
      ["audi"],
      ["porsche"],
      ["volkswagen"],
      ["vw"],
      ["mini"],
      ["jaguar"],
      ["land rover"],
      ["volvo"],
      ["alfa romeo"],
      ["alfa"],
      ["fiat"],
      ["peugeot"],
      ["renault"],
      ["citroen"],
      ["skoda"],
      ["seat"],
      ["european"],
      ["other brands"],
      ["other makes"],
      ["what brands"],
      ["which brands"],
      ["what makes"],
      ["which makes"],
      ["non-mercedes"],
      ["non mercedes"],
    ],
    weight: 4,
    answer: `Yes — we're European vehicle specialists. Our deepest expertise is in Mercedes-Benz (factory-trained technicians using the genuine Xentry / STAR diagnostic system), and we also service other European marques including BMW, Audi, Porsche, Volkswagen, Mini, Volvo, Jaguar and Land Rover. For your specific model, call ${site.phoneDisplay} or book online and we'll confirm what's covered.`,
  },
  {
    // Non-European brands — politely decline.
    mustMatch: [
      ["toyota"],
      ["honda"],
      ["lexus"],
      ["nissan"],
      ["mazda"],
      ["subaru"],
      ["mitsubishi"],
      ["suzuki"],
      ["ford"],
      ["holden"],
      ["chevrolet"],
      ["chevy"],
      ["dodge"],
      ["jeep"],
      ["tesla"],
      ["hyundai"],
      ["kia"],
      ["genesis"],
      ["japanese"],
      ["american"],
      ["korean"],
    ],
    weight: 5,
    answer:
      "We specialise in European vehicles only, so we don't service Japanese, Korean or American makes. For those brands we'd recommend finding a specialist in that marque.",
  },
  {
    // Mercedes model enquiries — C / E / S / GLC / GLE / GLS / EQS / etc.
    mustMatch: [
      ["c-class"],
      ["c class"],
      ["e-class"],
      ["e class"],
      ["s-class"],
      ["s class"],
      ["a-class"],
      ["a class"],
      ["b-class"],
      ["b class"],
      ["cla"],
      ["cls"],
      ["gla"],
      ["glb"],
      ["glc"],
      ["gle"],
      ["gls"],
      ["g-wagon"],
      ["g class"],
      ["g-class"],
      ["eqs"],
      ["eqe"],
      ["eqc"],
      ["sl"],
      ["slk"],
      ["sprinter"],
      ["vito"],
      ["w124"],
      ["w123"],
      ["w126"],
      ["w204"],
      ["w205"],
      ["w206"],
      ["w212"],
      ["w213"],
      ["w222"],
      ["classic mercedes"],
      ["old mercedes"],
      ["older mercedes"],
    ],
    weight: 3,
    answer:
      "Yes — we service the full Mercedes range, from classic W124s and W123s through every current model (C-Class, E-Class, S-Class, GLC, GLE, GLS, G-Wagon) and the EQ electric line (EQS, EQE, EQC). We also work on Sprinter and Vito vans. Whatever Mercedes you drive, we have the Xentry software and factory training to service it properly.",
  },
  {
    mustMatch: [["courtesy"], ["loaner"], ["loan car"], ["replacement car"]],
    weight: 3,
    answer:
      "Yes — courtesy vehicles are available on request, subject to availability. Please mention it when you book so we can reserve one for you.",
  },
  {
    mustMatch: [
      ["suburb"],
      ["location"],
      ["address"],
      ["based"],
      ["where", "located"],
      ["where", "are", "you"],
      ["which", "areas"],
      ["serve"],
    ],
    weight: 2,
    answer: `We're based in ${site.address.suburb}, ${site.address.state}. We regularly serve ${site.suburbs
      .slice(0, 6)
      .join(", ")} and the wider Melbourne metro area.`,
  },
  {
    mustMatch: [
      ["price"],
      ["pricing"],
      ["cost"],
      ["quote"],
      ["how much"],
      ["how many"],
      ["charge"],
    ],
    weight: 2,
    notIf: ["warranty"],
    answer:
      "Pricing is itemised upfront — no surprises at pickup. For a quote, book online or call us and we'll walk you through the expected cost based on your model, kilometres, and the specific service.",
  },
  {
    mustMatch: [
      ["book"],
      ["booking"],
      ["appointment"],
      ["schedule"],
      ["reserve"],
    ],
    weight: 2,
    notIf: ["service schedule"],
    answer:
      "You can book online in under 60 seconds — visit /book or tap the Book Now button. You'll get confirmation by email and SMS, and we'll send live updates during the repair.",
  },
  {
    mustMatch: [
      ["hours"],
      ["opening"],
      ["when", "open"],
      ["when", "closed"],
      ["what time"],
      ["saturday"],
      ["sunday"],
    ],
    weight: 2,
    answer: site.hours.map((h) => `${h.day}: ${h.time}`).join(" · "),
  },
  {
    mustMatch: [
      ["phone number"],
      ["contact number"],
      ["call you"],
      ["your number"],
      ["reach you"],
      ["email"],
    ],
    weight: 2,
    answer: `You can call us on ${site.phoneDisplay} or email ${site.email}. We'll get back to you the same business day.`,
  },
  {
    mustMatch: [["brake"], ["brakes"], ["rotor"], ["pads"], ["caliper"]],
    weight: 2,
    answer:
      "We do everything from squealing pads on a daily C-Class up to full carbon-ceramic rotor replacement on AMG performance models. Every brake job includes a DOT4 fluid flush, wear-sensor replacement, caliper inspection and road test.",
  },
  {
    mustMatch: [
      ["diagnostic"],
      ["xentry"],
      ["fault code"],
      ["warning light"],
      ["check engine"],
    ],
    weight: 3,
    answer:
      "We use the factory Xentry / STAR diagnostic system — the same software Mercedes dealers run. It reads every electronic module, pulls fault codes across the whole vehicle, and lets us pinpoint the root cause rather than guessing.",
  },
  {
    mustMatch: [
      ["transmission"],
      ["gearbox"],
      ["7g"],
      ["9g"],
      ["mechatronic"],
    ],
    weight: 3,
    answer:
      "Full 7G/9G-Tronic service including MB-approved oil and filter, adaptive reset, and a road-test verification. We also handle mechatronic repairs and valve body replacement if needed.",
  },
  {
    mustMatch: [
      ["hello"],
      ["hi"],
      ["hey"],
      ["good morning"],
      ["good afternoon"],
      ["good evening"],
    ],
    weight: 1,
    answer: `Hi there! 👋 I can help with questions about servicing, warranty, pricing, AMG work, and booking. What would you like to know?`,
  },
  {
    mustMatch: [["thanks"], ["thank you"], ["cheers"], ["appreciate"]],
    weight: 1,
    answer:
      "You're welcome! If you'd like to book, tap Book Now — or call us on " +
      site.phoneDisplay +
      ".",
  },
];

const suggestions = [
  "Will servicing here void my warranty?",
  "What's the difference between Service A and B?",
  "Do you work on AMG?",
  "How do I book?",
];

function matchAnswer(input: string): string {
  const normalized = " " + input.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim() + " ";

  const hasTerm = (term: string): boolean => {
    const safe = term.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // For multi-word terms: exact phrase with word boundaries on each end.
    // For single words: exact word match (no prefix/suffix matches).
    return new RegExp(`(^|\\s)${safe}(\\s|$)`).test(normalized);
  };

  let best: { entry: KnowledgeEntry; score: number } | null = null;

  for (const entry of knowledge) {
    if (entry.notIf?.some(hasTerm)) continue;

    let bestGroupScore = 0;
    for (const group of entry.mustMatch) {
      if (group.every(hasTerm)) {
        // Longer/more specific groups score higher.
        const groupScore = group.reduce(
          (sum, term) => sum + term.split(" ").length,
          0
        );
        if (groupScore > bestGroupScore) bestGroupScore = groupScore;
      }
    }

    if (bestGroupScore === 0) continue;
    const weighted = bestGroupScore * (entry.weight ?? 1);

    if (!best || weighted > best.score) best = { entry, score: weighted };
  }

  if (best && best.score >= 1) return best.entry.answer;
  return `I'm not sure about that one yet. For anything specific you can call us on ${site.phoneDisplay}, or tap Book Now and we'll take care of the details. You can also try rephrasing — I can help with: warranty, Service A/B, AMG, Mercedes models (C-Class, E-Class, S-Class, GLC, GLE, EQS, etc.), other brands, brakes, diagnostics, transmission, pricing, booking, hours, and our location.`;
}

export default function AIAssistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: `Hi! I'm the ${site.name} assistant. Ask me anything about servicing, warranty, AMG work, or booking.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;

    const historyForApi = messages;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi, question: q }),
      });

      if (res.ok) {
        const data = (await res.json()) as { text?: string };
        if (data?.text) {
          setMessages((prev) => [...prev, { role: "bot", text: data.text! }]);
          return;
        }
      }

      // Any non-ok response or missing text → silently fall back to the
      // local keyword matcher so the user still gets an answer.
      setMessages((prev) => [...prev, { role: "bot", text: matchAnswer(q) }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: matchAnswer(q) }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div
      role="dialog"
      aria-label="AI Assistant chat"
      aria-hidden={!open}
      className={cn(
        "fixed right-4 md:right-6 bottom-20 lg:bottom-6 z-50 w-[calc(100vw-2rem)] max-w-[360px] h-[500px] max-h-[70vh] bg-ink-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
        open
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-ink-950 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent grid place-items-center shrink-0">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {site.name} Assistant
            </div>
            <div className="text-[11px] text-white/55 truncate">
              Online · usually replies instantly
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close assistant"
          className="w-8 h-8 grid place-items-center text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-accent text-white rounded-br-sm"
                  : "bg-ink-800 text-white/90 rounded-bl-sm"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {messages.length === 1 && !loading && (
          <div className="pt-2">
            <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
              Suggested
            </div>
            <div className="flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  disabled={loading}
                  className="text-left text-sm text-white/85 bg-ink-800 hover:bg-ink-800/70 border border-white/10 hover:border-accent/50 rounded-xl px-3 py-2 transition-colors disabled:opacity-60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start" aria-live="polite">
            <div className="bg-ink-800 text-white/70 rounded-2xl rounded-bl-sm px-3.5 py-2.5 inline-flex items-center gap-1.5">
              <span className="sr-only">Assistant is typing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-ink-950 shrink-0">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 px-3 pt-3 pb-1.5"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? "Thinking…" : "Ask a question..."}
            disabled={loading}
            className="flex-1 bg-ink-900 border border-white/10 focus:border-accent/60 outline-none text-sm text-white placeholder:text-white/40 rounded-full px-4 py-2.5 disabled:opacity-70"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || loading}
            className="w-10 h-10 shrink-0 rounded-full bg-accent text-white grid place-items-center hover:scale-[1.05] transition-transform disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-center text-white/35 pb-2 px-3">
          Powered by AI · answers may vary — for critical details please call{" "}
          {site.phoneDisplay}.
        </div>
      </div>
    </div>
  );
}
