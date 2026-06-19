"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { services } from "@/lib/services";
import { modelGroups } from "@/lib/models";
import {
  bookingSchema,
  symptomOptions,
  timeSlots,
  dropOffOptions,
  type BookingInput,
} from "@/lib/booking";
import { cn } from "@/lib/utils";
import ServiceIcon from "@/components/ServiceIcon";

const STEPS = [
  "Service",
  "Vehicle",
  "Issue",
  "Date & Time",
  "Your Details",
  "Confirm",
];

type PartialBooking = Partial<BookingInput>;

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<PartialBooking>({ symptoms: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const continueRowRef = useRef<HTMLDivElement | null>(null);
  const isFirstStepRender = useRef(true);
  const isFirstDataRender = useRef(true);

  // Whenever the step changes, scroll the wizard card to the top of
  // the viewport (with a small header offset) so the user sees the
  // new step's first field without manually scrolling. Skip on the
  // initial render so we don't yank the page on load.
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    const el = wizardRef.current;
    if (!el) return;
    // Header is sticky at ~64px (mobile) / 80px (md+); offset 96px
    // covers both with breathing room.
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  }, [step]);

  // Whenever the user makes a discrete selection (service, date, time
  // slot, drop-off, or toggles a symptom), smoothly scroll the
  // Continue button row into view. This naturally reveals any
  // intermediate fields between the current scroll position and the
  // bottom of the step, ending at Continue. We intentionally do NOT
  // trigger on text-input changes — auto-scrolling on every keystroke
  // is jarring. Users typing in text fields can scroll manually or use
  // the next-focus / Tab key.
  useEffect(() => {
    if (isFirstDataRender.current) {
      isFirstDataRender.current = false;
      return;
    }
    const el = continueRowRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    data.serviceSlug,
    data.date,
    data.timeSlot,
    data.dropOff,
    // Joining keys the dep on the array's identity-string so toggling
    // a symptom in/out fires the effect even when length is unchanged.
    data.symptoms?.join(","),
  ]);

  const update = (patch: PartialBooking) =>
    setData((d) => ({ ...d, ...patch }));

  function validateStep(): boolean {
    const stepFields: (keyof BookingInput)[][] = [
      ["serviceSlug"],
      ["model", "year", "rego", "odometer"],
      ["description"],
      ["date", "timeSlot", "dropOff"],
      ["name", "phone", "email"],
      [],
    ];
    const fields = stepFields[step];
    if (!fields.length) return true;
    const result = bookingSchema.safeParse(data);
    const fieldErrors: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const k = issue.path[0] as string;
        if (fields.includes(k as keyof BookingInput) && !fieldErrors[k]) {
          fieldErrors[k] = issue.message;
        }
      }
    }
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((i) => [i.path[0], i.message])
        )
      );
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const body = await res.json();
    setSubmitting(false);
    if (body?.reference) setReference(body.reference);
  }

  if (reference) {
    return (
      <div className="card text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-brand-success mx-auto mb-4" />
        <h2 className="heading-3 mb-3">Booking confirmed</h2>
        <p className="text-white/70 mb-6">
          Thanks! We&apos;ve emailed and SMS&apos;d your confirmation.
        </p>
        <div className="inline-block bg-ink-900 px-6 py-3 mb-6">
          <div className="text-xs uppercase tracking-widest text-white/60">
            Booking reference
          </div>
          <div className="font-display text-2xl font-bold text-white">
            {reference}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/track?ref=${reference}`} className="btn-primary">
            Track My Repair
          </Link>
          <Link href="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={wizardRef} style={{ scrollMarginTop: "96px" }}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-white">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-white/60">{STEPS[step]}</span>
        </div>
        <div className="h-2 bg-ink-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card min-h-[320px]">
        {step === 0 && <Step0 data={data} update={update} error={errors.serviceSlug} />}
        {step === 1 && <Step1 data={data} update={update} errors={errors} />}
        {step === 2 && <Step2 data={data} update={update} error={errors.description} />}
        {step === 3 && <Step3 data={data} update={update} errors={errors} />}
        {step === 4 && <Step4 data={data} update={update} errors={errors} />}
        {step === 5 && <Step5 data={data} />}
      </div>

      {/* `touch-action: manipulation` removes the legacy 300ms tap delay
          on mobile browsers so Continue / Back respond on first tap.
          `type="button"` prevents any accidental form-submit semantics
          if these end up nested inside a <form>. */}
      <div
        ref={continueRowRef}
        className="mt-6 flex justify-between gap-3"
        style={{ touchAction: "manipulation", scrollMarginBottom: "16px" }}
      >
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="btn-ghost disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>Confirm Booking</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Step0({
  data,
  update,
  error,
}: {
  data: PartialBooking;
  update: (p: PartialBooking) => void;
  error?: string;
}) {
  return (
    <div>
      <h2 className="heading-3 mb-2">What service do you need?</h2>
      <p className="text-white/60 mb-6 text-sm">Choose one option.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <button
            key={s.slug}
            onClick={() => update({ serviceSlug: s.slug })}
            className={cn(
              "text-left p-4 border-2 transition-all",
              data.serviceSlug === s.slug
                ? "border-accent bg-accent/10"
                : "border-white/10 hover:border-white/25"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/10 text-accent grid place-items-center flex-shrink-0">
                <ServiceIcon name={s.icon} className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  {s.title.replace("Mercedes-Benz ", "")}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {s.short}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-accent text-sm mt-3">{error}</p>}
    </div>
  );
}

function Step1({
  data,
  update,
  errors,
}: {
  data: PartialBooking;
  update: (p: PartialBooking) => void;
  errors: Record<string, string>;
}) {
  const allModels = modelGroups.flatMap((g) => g.models);
  return (
    <div>
      <h2 className="heading-3 mb-2">Tell us about your Mercedes</h2>
      <p className="text-white/60 mb-6 text-sm">
        These details help us prepare the right parts and tools.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Model" error={errors.model}>
          <select
            value={data.model || ""}
            onChange={(e) => update({ model: e.target.value })}
            className="field-input"
          >
            <option value="">Select model</option>
            {modelGroups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Year" error={errors.year}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="2019"
            value={data.year || ""}
            onChange={(e) => update({ year: e.target.value })}
            className="field-input"
          />
        </Field>
        <Field label="Registration (rego)" error={errors.rego}>
          <input
            type="text"
            placeholder="ABC-123"
            value={data.rego || ""}
            onChange={(e) => update({ rego: e.target.value.toUpperCase() })}
            className="field-input uppercase"
          />
        </Field>
        <Field label="Odometer (km)" error={errors.odometer}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="85000"
            value={data.odometer || ""}
            onChange={(e) => update({ odometer: e.target.value })}
            className="field-input"
          />
        </Field>
      </div>
      {allModels.length === 0 && null}
    </div>
  );
}

function Step2({
  data,
  update,
  error,
}: {
  data: PartialBooking;
  update: (p: PartialBooking) => void;
  error?: string;
}) {
  const toggleSymptom = (s: string) => {
    const current = data.symptoms || [];
    update({
      symptoms: current.includes(s)
        ? current.filter((x) => x !== s)
        : [...current, s],
    });
  };

  return (
    <div>
      <h2 className="heading-3 mb-2">Describe the issue</h2>
      <p className="text-white/60 mb-6 text-sm">
        The more detail, the better we can prepare.
      </p>
      <Field label="What are you experiencing?" error={error}>
        <textarea
          rows={4}
          value={data.description || ""}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="e.g. Engine oil light came on last week. Car drives normally but there's a slight clicking noise on cold start."
          className="field-input"
        />
      </Field>
      <div className="mt-6">
        <div className="text-sm font-medium text-white mb-3">
          Any of these symptoms? (select all that apply)
        </div>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((s) => {
            const active = data.symptoms?.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={cn(
                  "px-3 py-2 rounded-full text-sm border-2 transition-all",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-white/10 text-white hover:border-white/25"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step3({
  data,
  update,
  errors,
}: {
  data: PartialBooking;
  update: (p: PartialBooking) => void;
  errors: Record<string, string>;
}) {
  const today = new Date();
  const days: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d);
  }

  return (
    <div>
      <h2 className="heading-3 mb-2">Pick a date & time</h2>
      <p className="text-white/60 mb-6 text-sm">
        Available slots from the workshop calendar.
      </p>

      <div className="mb-6">
        <div className="text-sm font-medium text-white mb-3">Date</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const iso = d.toISOString().split("T")[0];
            const active = data.date === iso;
            return (
              <button
                key={iso}
                onClick={() => update({ date: iso })}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center px-4 py-3 border-2 min-w-[80px] transition-all",
                  active
                    ? "border-accent bg-accent/10"
                    : "border-white/10 hover:border-white/25"
                )}
              >
                <div className="text-xs uppercase text-white/60">
                  {d.toLocaleDateString("en-AU", { weekday: "short" })}
                </div>
                <div className="font-display text-xl font-bold text-white">
                  {d.getDate()}
                </div>
                <div className="text-xs text-white/60">
                  {d.toLocaleDateString("en-AU", { month: "short" })}
                </div>
              </button>
            );
          })}
        </div>
        {errors.date && (
          <p className="text-accent text-sm mt-2">{errors.date}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="text-sm font-medium text-white mb-3">Time</div>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((t) => {
            const active = data.timeSlot === t;
            return (
              <button
                key={t}
                onClick={() => update({ timeSlot: t })}
                className={cn(
                  "py-3 border-2 text-sm font-medium transition-all",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-white/10 text-white hover:border-white/25"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
        {errors.timeSlot && (
          <p className="text-accent text-sm mt-2">{errors.timeSlot}</p>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-white mb-3">
          How will you drop off?
        </div>
        <div className="space-y-2">
          {dropOffOptions.map((o) => {
            const active = data.dropOff === o.value;
            return (
              <button
                key={o.value}
                onClick={() => update({ dropOff: o.value })}
                className={cn(
                  "w-full text-left p-4 border-2 transition-all",
                  active
                    ? "border-accent bg-accent/10"
                    : "border-white/10 hover:border-white/25"
                )}
              >
                <div className="font-semibold text-white">{o.label}</div>
                <div className="text-xs text-white/60 mt-0.5">
                  {o.desc}
                </div>
              </button>
            );
          })}
        </div>
        {errors.dropOff && (
          <p className="text-accent text-sm mt-2">{errors.dropOff}</p>
        )}
      </div>
    </div>
  );
}

function Step4({
  data,
  update,
  errors,
}: {
  data: PartialBooking;
  update: (p: PartialBooking) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h2 className="heading-3 mb-2">Your contact details</h2>
      <p className="text-white/60 mb-6 text-sm">
        We&apos;ll send confirmation & status updates here.
      </p>
      <div className="space-y-4">
        <Field label="Full name" error={errors.name}>
          <input
            value={data.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            className="field-input"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Mobile phone" error={errors.phone}>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="04XXXXXXXX"
              value={data.phone || ""}
              onChange={(e) =>
                // Strip everything except digits so the user can only
                // enter numbers, regardless of whether they paste or
                // type. Mobile keyboards open in numeric mode too.
                update({ phone: e.target.value.replace(/[^\d]/g, "") })
              }
              className="field-input"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => update({ email: e.target.value })}
              className="field-input"
            />
          </Field>
        </div>
        <Field label="Additional notes (optional)">
          <textarea
            rows={3}
            value={data.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            className="field-input"
          />
        </Field>
      </div>
    </div>
  );
}

function Step5({ data }: { data: PartialBooking }) {
  const service = services.find((s) => s.slug === data.serviceSlug);
  const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between gap-4 py-2 border-b border-white/10 last:border-0">
      <span className="text-white/60">{label}</span>
      <span className="font-medium text-white text-right">
        {value || "—"}
      </span>
    </div>
  );
  return (
    <div>
      <h2 className="heading-3 mb-2">Review your booking</h2>
      <p className="text-white/60 mb-6 text-sm">
        Check everything looks right, then confirm.
      </p>
      <div className="text-sm">
        <Row label="Service" value={service?.title} />
        <Row
          label="Vehicle"
          value={
            data.model
              ? `${data.year} ${data.model} · ${data.rego} · ${data.odometer}km`
              : undefined
          }
        />
        <Row label="Issue" value={data.description} />
        <Row
          label="Date"
          value={
            data.date
              ? new Date(data.date).toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : undefined
          }
        />
        <Row label="Time" value={data.timeSlot} />
        <Row label="Drop off" value={data.dropOff} />
        <Row label="Name" value={data.name} />
        <Row label="Phone" value={data.phone} />
        <Row label="Email" value={data.email} />
        {data.symptoms && data.symptoms.length > 0 && (
          <Row label="Symptoms" value={data.symptoms.join(", ")} />
        )}
      </div>
      <div className="mt-6 p-4 bg-ink-900 text-sm text-white/70">
        By confirming, you agree to receive email and SMS updates about this
        booking. No payment required at booking — pay at the workshop.
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-accent text-sm mt-1">{error}</p>}
    </div>
  );
}
