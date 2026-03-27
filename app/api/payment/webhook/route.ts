import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyWebhookSignature, verifyPayment } from "@/lib/notchpay";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-notch-signature") ?? "";

    // ── Step 1: Verify the request is genuinely from NotchPay ─────────
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("❌ Invalid NotchPay webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event, data } = body;

    console.log("📩 NotchPay webhook:", event, data?.reference);

    // ── Step 2: Handle payment success ────────────────────────────────
    if (
      event === "payment.complete" ||
      event === "payment.success" ||
      data?.status === "complete" ||
      data?.status === "success"
    ) {
      const userId = data?.meta?.userId ?? data?.metadata?.userId;
      const reference = data?.reference ?? data?.trxref;

      if (!userId) {
        console.error("No userId in webhook:", JSON.stringify(data));
        return new NextResponse("Missing userId", { status: 400 });
      }

      // ── Step 3: Double-verify with NotchPay API ────────────────────
      if (reference) {
        try {
          const { paid } = await verifyPayment(reference);
          if (!paid) {
            console.warn("Payment not confirmed by API:", reference);
            return new NextResponse("Payment not verified", { status: 400 });
          }
        } catch (e) {
          console.warn("Could not verify payment, proceeding anyway:", e);
        }
      }

      // ── Step 4: Activate subscription in database ──────────────────
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const existing = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
      });

      if (existing) {
        await db
          .update(userSubscription)
          .set({
            isActive: true,
            stripeSubscriptionId: reference ?? existing.stripeSubscriptionId,
            stripePriceId: "notchpay_pro",
            stripeCurrentPerriodEnd: periodEnd,
          })
          .where(eq(userSubscription.userId, userId));
      } else {
        await db.insert(userSubscription).values({
          userId,
          stripeCustomerId: `notchpay_${userId}`,
          stripeSubscriptionId: reference ?? `ref_${Date.now()}`,
          stripePriceId: "notchpay_pro",
          stripeCurrentPerriodEnd: periodEnd,
          isActive: true,
        });
      }

      console.log(`✅ Pro activated for user: ${userId}`);
    }

    // ── Handle failed/cancelled ────────────────────────────────────────
    if (event === "payment.failed" || event === "payment.cancelled") {
      const userId = data?.meta?.userId;
      console.log(`❌ Payment failed for user: ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}