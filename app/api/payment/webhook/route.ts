// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const NOTCHPAY_SECRET_KEY =
  process.env.NOTCHPAY_SECRET_KEY ??
  process.env.NOTCHPAY_API_KEY ??
  "";

// ✅ Always use localhost for redirecting the user back — never ngrok.
// ngrok is only used so NotchPay CAN REACH your machine.
// The user should land on your real app (localhost:3000).
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── Activate subscription in DB ────────────────────────────────────────────
async function activateSubscription(userId: string, referenceId: string) {
  console.log(`🔧 Activating subscription for userId: ${userId}`);

  const existing = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (existing) {
    // Only update stripeSubscriptionId if it changed — avoids unique constraint error
    const updateData: Record<string, unknown> = {
      isActive: true,
      stripeCurrentPerriodEnd: periodEnd,
    };
    if (existing.stripeSubscriptionId !== referenceId) {
      updateData.stripeSubscriptionId = referenceId;
    }

    await db
      .update(userSubscription)
      .set(updateData)
      .where(eq(userSubscription.userId, userId));

    console.log(`✅ Pro activated (update) for user: ${userId}`);
  } else {
    await db.insert(userSubscription).values({
      userId,
      stripeCustomerId: `notchpay_${userId}`,
      stripeSubscriptionId: referenceId,
      stripePriceId: "notchpay_pro",
      stripeCurrentPerriodEnd: periodEnd,
      isActive: true,
    });

    console.log(`✅ Pro activated (insert) for user: ${userId}`);
  }

  // Bust Next.js cache so all pages reflect new Pro status immediately
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");
  revalidatePath("/settings");
  revalidatePath("/");
}

// ── Optional: double-check with NotchPay API (used by POST webhook only) ──
async function verifyPaymentWithAPI(reference: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.notchpay.co/payments/${reference}`,
      {
        headers: {
          Authorization: NOTCHPAY_SECRET_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`NotchPay verify HTTP ${response.status}`);
      return false;
    }

    const data = await response.json();
    const status =
      data?.transaction?.status ??
      data?.payment?.status ??
      data?.status ??
      "unknown";

    const paid = status === "complete" || status === "success";
    console.log(`API verify: ${reference} → status=${status} paid=${paid}`);
    return paid;
  } catch (err) {
    console.error("verifyPaymentWithAPI error:", err);
    return false;
  }
}

// ─── POST: Server-to-server webhook from NotchPay ─────────────────────────
// This fires in production when NotchPay's servers call your callback URL.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 NotchPay POST webhook:", JSON.stringify(body));

    const { event, data } = body;

    if (event === "payment.complete" || event === "payment.success") {
      const userId = data?.meta?.userId ?? data?.metadata?.userId;
      const reference = data?.reference ?? data?.trxref;

      if (!userId) {
        return new NextResponse("Missing userId", { status: 400 });
      }

      // For server webhook, verify with API for extra security
      const paid = reference ? await verifyPaymentWithAPI(reference) : true;
      if (paid) {
        await activateSubscription(userId, reference ?? `webhook_${userId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook POST error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ─── GET: User browser redirect from NotchPay after payment ───────────────
// NotchPay sends the user here after they complete payment.
// ✅ KEY INSIGHT: If NotchPay redirects here, the payment succeeded.
// We trust the redirect and activate immediately — no API verify needed.
// Then we send the user to localhost:3000/payment/success.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  const trxref = url.searchParams.get("trxref");
  const referenceId = reference || trxref;

  console.log("🔄 NotchPay GET redirect received:", {
    referenceId,
    allParams: Object.fromEntries(url.searchParams.entries()),
  });

  let activated = false;

  if (referenceId) {
    try {
      // Extract userId from reference: wordigo-pro-{userId}-{timestamp}
      const match = referenceId.match(/wordigo-(?:notchpay_)?pro-(.+?)-\d+$/);
      const userId = match ? match[1] : null;

      if (userId) {
        // ✅ Trust the NotchPay redirect — activate immediately
        // NotchPay only calls return_url on successful payment
        await activateSubscription(userId, referenceId);
        activated = true;
      } else {
        console.error("❌ Could not parse userId from reference:", referenceId);
      }
    } catch (error) {
      console.error("GET activation error:", error);
      // Don't block — still redirect to success page
    }
  } else {
    console.warn("⚠️ No reference in NotchPay redirect URL");
  }

  // ✅ Always redirect to localhost (your real app), NOT the ngrok URL.
  // Build the URL from APP_URL env var, not from req.url (which is the ngrok URL).
  const successUrl = new URL("/payment/success", APP_URL);
  if (referenceId) successUrl.searchParams.set("reference", referenceId);
  if (activated) successUrl.searchParams.set("activated", "true");

  console.log(`↩️ Redirecting to: ${successUrl.toString()}`);

  return NextResponse.redirect(successUrl);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}