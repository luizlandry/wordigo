// actions/user-subscription.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

// The app always runs on localhost — used for internal navigation
const returnUrl = absoluteUrl("/shop");

// ── Build the NotchPay callback/return URL ─────────────────────────────────
// If NOTCHPAY_CALLBACK_URL is set (ngrok in dev, real domain in prod),
// use it for the NotchPay redirect. Otherwise fall back to NEXT_PUBLIC_APP_URL.
// This way your app stays on localhost:3000 but NotchPay can reach you.
function getNotchPayBaseUrl(): string {
  return (
    process.env.NOTCHPAY_CALLBACK_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

function notchPayUrl(path: string): string {
  return `${getNotchPayBaseUrl()}${path}`;
}

export const createNotchPayUrl = async (paymentMethod?: string) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const email =
    user.emailAddresses?.[0]?.emailAddress ?? `${userId}@wordigo.app`;

  const existingSubscription = await getUserSubscription();

  if (existingSubscription?.isActive) {
    return { data: returnUrl };
  }

  const reference = `wordigo-pro-${userId}-${Date.now()}`;

  const channelMap: Record<string, string[]> = {
    mtn: ["MTN_MONEY"],
    orange: ["ORANGE_MONEY"],
    all: ["MTN_MONEY", "ORANGE_MONEY"],
  };
  const channels = paymentMethod
    ? (channelMap[paymentMethod] ?? ["MTN_MONEY", "ORANGE_MONEY"])
    : ["MTN_MONEY", "ORANGE_MONEY"];

  // ✅ Uses ngrok URL for NotchPay so it can redirect back to your machine.
  // After activation the webhook handler redirects to localhost:3000/payment/success.
  const webhookCallbackUrl = notchPayUrl("/api/payment/webhook");

  console.log("🚀 Initializing NotchPay payment:", {
    reference,
    webhookCallbackUrl,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  });

  const notchPayBody: Record<string, unknown> = {
    email,
    amount: 2000,
    currency: "XAF",
    reference,
    description: "Wordigo Pro — Unlimited IELTS Access + Hearts",
    // NotchPay redirects user here after payment (must be public HTTPS)
    return_url: webhookCallbackUrl,
    // Server-to-server webhook (also needs public HTTPS)
    callback: webhookCallbackUrl,
    channels,
    meta: {
      userId,
      plan: "pro",
    },
  };

  const response = await fetch(
    "https://api.notchpay.co/payments/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NOTCHPAY_API_KEY!,
      },
      body: JSON.stringify(notchPayBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ NotchPay initialization failed:");
    console.error("  Status:", response.status);
    console.error("  Body:", errorText);
    throw new Error(
      `Payment initialization failed (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();
  console.log("✅ NotchPay init response:", JSON.stringify(data));

  const paymentUrl =
    data?.transaction?.payment_url ??
    data?.authorization_url ??
    data?.data?.link;

  if (!paymentUrl) {
    console.error("No payment URL in response:", JSON.stringify(data));
    throw new Error("No payment URL returned from NotchPay");
  }

  // Save a pending record so the webhook GET handler can activate by userId
  const existing = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!existing) {
    await db.insert(userSubscription).values({
      userId,
      stripeCustomerId: `notchpay_${userId}`,
      stripeSubscriptionId: reference,
      stripePriceId: "notchpay_pro",
      stripeCurrentPerriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: false,
    } as any);
  } else {
    await db
      .update(userSubscription)
      .set({ stripeSubscriptionId: reference })
      .where(eq(userSubscription.userId, userId));
  }

  return { data: paymentUrl };
};

export const createStripeUrl = createNotchPayUrl;