import { NextResponse } from "next/server";
import { db, type RepairStatus, statusOrder } from "@/lib/store";
import { sendStatusUpdate, sendRatingRequest } from "@/lib/integrations";

type RouteParams = Promise<{ ref: string }>;

export async function GET(
  _req: Request,
  { params }: { params: RouteParams }
) {
  const { ref } = await params;
  const b = db.getBooking(ref);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ booking: b });
}

export async function PATCH(
  req: Request,
  { params }: { params: RouteParams }
) {
  const { ref } = await params;
  const body = await req.json();
  const status = body.status as RepairStatus;
  if (!statusOrder.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = db.updateStatus(ref, status);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await sendStatusUpdate(updated);
  if (status === "completed") await sendRatingRequest(updated);
  return NextResponse.json({ booking: updated });
}
