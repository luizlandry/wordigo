"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

const returnUrl = absoluteUrl("/shop");

export const createNotchPayUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Get user email from Clerk
  const email =
    user.emailAddresses?.[0]?.emailAddress ?? `${userId}@wordigo.app`;

  // Check if user already has an active subscription
  const existingSubscription = await getUserSubscription();

  if (existingSubscription?.isActive) {
    // Already Pro — just redirect to shop
    return { data: returnUrl };
  }

  // ── Call NotchPay to initialize a payment ──────────────────────────
  const reference = `wordigo-pro-${userId}-${Date.now()}`;

  const response = await fetch(
    "https://api.notchpay.co/payments/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NOTCHPAY_PUBLIC_KEY!,
      },
      body: JSON.stringify({
        email,
        amount: 2000,          // 2000 XAF (~$3.50 USD) — change as needed
        currency: "XAF",
        reference,
        description: "Wordigo Pro — Unlimited IELTS Access + Hearts",
        callback: absoluteUrl("/api/payment/webhook"),
        return_url: absoluteUrl("/payment/success"),
        meta: {
          userId,
          plan: "pro",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("NotchPay error:", errorText);
    throw new Error("Payment initialization failed");
  }

  const data = await response.json();

  // NotchPay returns the checkout URL in data.authorization_url
  const paymentUrl =
    data?.transaction?.payment_url ??
    data?.authorization_url ??
    data?.data?.link;

  if (!paymentUrl) {
    console.error("NotchPay response:", JSON.stringify(data));
    throw new Error("No payment URL returned from NotchPay");
  }

  // Save a pending subscription record so we can update it on webhook
  const existing = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!existing) {
    await db.insert(userSubscription).values({
      userId,
      // Temporary values — webhook will update these
      stripeCustomerId: `notchpay_${reference}`,
      stripeSubscriptionId: reference,
      stripePriceId: "notchpay_pro",
      stripeCurrentPerriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      ),
      isActive: false,
    } as any);
  }

  return { data: paymentUrl };
};

// Keep createStripeUrl as alias so existing imports don't break
export const createStripeUrl = createNotchPayUrl;