import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();

  const { cpm_trans_status, metadata } = body;

  // SUCCESS PAYMENT
  if (cpm_trans_status === "ACCEPTED") {
    await db.update(userSubscription)
      .set({
        isActive: true,
      })
      .where(eq(userSubscription.userId, metadata));
  }

  return NextResponse.json({ success: true });
}