import { z } from "zod";

export const bookingSchema = z.object({
  serviceSlug: z.string().min(1, "Please select a service"),
  model: z.string().min(1, "Please select your Mercedes model"),
  year: z
    .string()
    .regex(/^(19|20)\d{2}$/, "Enter a valid year (e.g. 2019)"),
  rego: z.string().min(2, "Enter your registration").max(10),
  odometer: z.string().regex(/^\d{1,7}$/, "Enter km as a number"),
  description: z.string().min(10, "Please describe the issue"),
  symptoms: z.array(z.string()).default([]),
  date: z.string().min(1, "Pick a date"),
  timeSlot: z.string().min(1, "Pick a time"),
  dropOff: z.enum(["drop-off", "wait", "courtesy-car"]),
  name: z.string().min(2, "Enter your name"),
  // Phone is digits-only at the input layer (the Step 4 input strips
  // anything else) — schema just confirms it's present.
  phone: z.string().min(1, "Enter your phone number"),
  email: z.string().email("Enter a valid email"),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const symptomOptions = [
  "Warning light on dash",
  "Unusual noise",
  "Fluid leak",
  "Performance issue",
  "Overheating",
  "Electrical fault",
  "Transmission issue",
  "Brake issue",
  "AC not cold",
  "Starting problems",
];

export const timeSlots = [
  "08:30",
  "09:30",
  "10:30",
  "11:30",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export const dropOffOptions = [
  {
    value: "drop-off" as const,
    label: "Drop off & collect later",
    desc: "Most flexible — pick up when ready",
  },
  {
    value: "wait" as const,
    label: "Wait at workshop",
    desc: "Best for quick services (up to 2 hrs)",
  },
  {
    value: "courtesy-car" as const,
    label: "Request courtesy car",
    desc: "Subject to availability",
  },
];
