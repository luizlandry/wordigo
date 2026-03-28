// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

// ─── POST: Handle webhook notifications from NotchPay (server-to-server) ───
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 NotchPay webhook received:", body);

    const { event, data } = body;

    // Handle successful payment
    if (event === "payment.complete" || event === "payment.success") {
      const userId = data?.meta?.userId ?? data?.metadata?.userId;
      const reference = data?.reference;

      if (!userId) {
        console.error("No userId in webhook");
        return new NextResponse("Missing userId", { status: 400 });
      }

      // Activate subscription
      const existing = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
      });

      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (existing) {
        await db
          .update(userSubscription)
          .set({
            isActive: true,
            stripeSubscriptionId: reference,
            stripeCurrentPerriodEnd: periodEnd,
          })
          .where(eq(userSubscription.userId, userId));
      } else {
        await db.insert(userSubscription).values({
          userId,
          stripeCustomerId: `notchpay_${userId}`,
          stripeSubscriptionId: reference,
          stripePriceId: "notchpay_pro",
          stripeCurrentPerriodEnd: periodEnd,
          isActive: true,
        });
      }

      console.log(`✅ Pro activated for user: ${userId}`);
    }

    // Handle failed/cancelled payment
    if (event === "payment.failed" || event === "payment.cancelled") {
      const userId = data?.meta?.userId ?? data?.metadata?.userId;
      console.log(`❌ Payment failed/cancelled for user: ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ─── GET: Handle redirect from NotchPay (user returns to app) ─────────────
export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  const trxref = url.searchParams.get("trxref");
  const status = url.searchParams.get("status");
  
  console.log("🔄 NotchPay redirect received:", { reference, trxref, status });
  
  // Check payment status from URL params
  if (status === "complete" || status === "success") {
    // Try to find user from reference and activate subscription
    const referenceId = reference || trxref;
    
    if (referenceId) {
      try {
        // Extract userId from reference (format: wordigo-pro-{userId}-timestamp)
        const match = referenceId.match(/wordigo-pro-(.+?)-\d+$/);
        const userId = match ? match[1] : null;
        
        if (userId) {
          const existing = await db.query.userSubscription.findFirst({
            where: eq(userSubscription.userId, userId),
          });
          
          const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          if (existing && !existing.isActive) {
            await db
              .update(userSubscription)
              .set({
                isActive: true,
                stripeSubscriptionId: referenceId,
                stripeCurrentPerriodEnd: periodEnd,
              })
              .where(eq(userSubscription.userId, userId));
            console.log(`✅ Pro activated for user via redirect: ${userId}`);
          } else if (!existing) {
            await db.insert(userSubscription).values({
              userId,
              stripeCustomerId: `notchpay_${userId}`,
              stripeSubscriptionId: referenceId,
              stripePriceId: "notchpay_pro",
              stripeCurrentPerriodEnd: periodEnd,
              isActive: true,
            });
            console.log(`✅ Pro activated for new user via redirect: ${userId}`);
          }
        }
      } catch (error) {
        console.error("Error activating subscription from redirect:", error);
      }
    }
  }
  
  // Redirect to success page
  return NextResponse.redirect(new URL("/payment/success", req.url));
}

// ─── OPTIONS: Handle CORS preflight requests ─────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}