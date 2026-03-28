// actions/user-subscription.ts
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

  const email =
    user.emailAddresses?.[0]?.emailAddress ?? `${userId}@wordigo.app`;

  const existingSubscription = await getUserSubscription();

  if (existingSubscription?.isActive) {
    return { data: returnUrl };
  }

  const reference = `wordigo-pro-${userId}-${Date.now()}`;

  // ✅ CRITICAL: Specify the mobile money channels
 const channels = ["MTN_MONEY", "ORANGE_MONEY", "CARD"];

  const response = await fetch(
    "https://api.notchpay.co/payments/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NOTCHPAY_API_KEY!,
      },
      body: JSON.stringify({
        email,
        amount: 2000,
        currency: "XAF",
        reference,
        description: "Wordigo Pro — Unlimited IELTS Access + Hearts",
        callback: absoluteUrl("/api/payment/webhook"),
        return_url: absoluteUrl("/payment/success"),
        channels :["MTN_MONEY", "ORANGE_MONEY"],
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
  console.log("NotchPay channels response:", data); // Debug: check if channels were accepted

  const paymentUrl =
    data?.transaction?.payment_url ??
    data?.authorization_url ??
    data?.data?.link;

  if (!paymentUrl) {
    console.error("NotchPay response:", JSON.stringify(data));
    throw new Error("No payment URL returned from NotchPay");
  }

  const existing = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!existing) {
    await db.insert(userSubscription).values({
      userId,
      stripeCustomerId: `notchpay_${reference}`,
      stripeSubscriptionId: reference,
      stripePriceId: "notchpay_pro",
      stripeCurrentPerriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
      isActive: false,
    } as any);
  }

  return { data: paymentUrl };
};

export const createStripeUrl = createNotchPayUrl;