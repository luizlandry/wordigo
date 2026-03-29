// actions/user-subscription.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// The app always runs on localhost — used for internal navigation
const returnUrl = absoluteUrl("/shop");

// Use ngrok URL for NotchPay callbacks in dev, real domain in prod
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

  // ── Already fully active ───────────────────────────────────────────────
  if (existingSubscription?.isActive) {
    return { data: returnUrl };
  }

  // ── REACTIVATION: Cancelled but period not yet expired ─────────────────
  // The user cancelled but still has time left on their paid period.
  // Just flip isActive back to true — no new payment needed.
  if (existingSubscription && !existingSubscription.isActive) {
    const periodEnd = existingSubscription.stripeCurrentPerriodEnd
      ? new Date(existingSubscription.stripeCurrentPerriodEnd)
      : null;

    const stillInPeriod = periodEnd && periodEnd > new Date();

    if (stillInPeriod) {
      console.log(
        `♻️ Reactivating cancelled Pro for user ${userId} — period ends ${periodEnd.toISOString()}`
      );

      await db
        .update(userSubscription)
        .set({ isActive: true })
        .where(eq(userSubscription.userId, userId));

      // Bust cache so all pages reflect Pro status immediately
      revalidatePath("/shop");
      revalidatePath("/learn");
      revalidatePath("/leaderboard");
      revalidatePath("/quests");
      revalidatePath("/settings");
      revalidatePath("/");

      // Return shop URL — no payment page needed
      return { data: returnUrl };
    }
  }

  // ── NEW PAYMENT: No subscription or period has expired ─────────────────
  const reference = `wordigo-pro-${userId}-${Date.now()}`;

  const channelMap: Record<string, string[]> = {
    mtn: ["MTN_MONEY"],
    orange: ["ORANGE_MONEY"],
    all: ["MTN_MONEY", "ORANGE_MONEY"],
  };
  const channels = paymentMethod
    ? (channelMap[paymentMethod] ?? ["MTN_MONEY", "ORANGE_MONEY"])
    : ["MTN_MONEY", "ORANGE_MONEY"];

  const webhookCallbackUrl = notchPayUrl("/api/payment/webhook");

  console.log("🚀 Initializing NotchPay payment:", {
    reference,
    webhookCallbackUrl,
  });

  const notchPayBody: Record<string, unknown> = {
    email,
    amount: 2000,
    currency: "XAF",
    reference,
    description: "Wordigo Pro — Unlimited IELTS Access + Hearts",
    return_url: webhookCallbackUrl,
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