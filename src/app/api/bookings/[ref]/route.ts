import { NextResponse } from "next/server";
import { db, type RepairStatus, statusOrder } from "@/lib/store";
import { sendStatusUpdate, sendRatingRequest } from "@/lib/integrations";
import { getStaffSession } from "@/lib/auth/session";

const supabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

type RouteParams = Promise<{ ref: string }>;

export async function GET(
  _req: Request,
  { params }: { params: RouteParams }
) {
  const { ref } = await params;
  const b = await db.getBooking(ref);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ booking: b });
}

export async function PATCH(
  req: Request,
  { params }: { params: RouteParams }
) {
  let staffEmail: string | undefined;
  if (supabaseConfigured()) {
    const staff = await getStaffSession();
    if (!staff) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    staffEmail = staff.email;
  }
  const { ref } = await params;
  const body = await req.json();
  const status = body.status as RepairStatus;
  if (!statusOrder.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await db.updateStatus(ref, status, staffEmail);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await sendStatusUpdate(updated);
  if (status === "completed") await sendRatingRequest(updated);
  return NextResponse.json({ booking: updated });
}
