// actions/verify-payment.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const NOTCHPAY_KEY =
  process.env.NOTCHPAY_API_KEY ?? process.env.NOTCHPAY_PUBLIC_KEY ?? "";

export const verifyAndActivatePayment = async (reference: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "Not logged in" };
  }

  if (!reference) {
    return { success: false, message: "No payment reference provided" };
  }

  // 1. Call NotchPay API to confirm payment status
  let paid = false;
  try {
    const response = await fetch(
      `https://api.notchpay.co/payments/${reference}`,
      {
        headers: {
          Authorization: NOTCHPAY_KEY,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      const status =
        data?.transaction?.status ??
        data?.payment?.status ??
        data?.status ??
        "unknown";

      paid = status === "complete" || status === "success";
      console.log(`Manual verify: reference=${reference} status=${status}`);
    } else {
      console.error(`NotchPay API error: ${response.status}`);
    }
  } catch (err) {
    console.error("verifyAndActivatePayment fetch error:", err);
    return { success: false, message: "Could not reach payment server" };
  }

  if (!paid) {
    return {
      success: false,
      message: "Payment not confirmed yet. Please wait a moment and try again.",
    };
  }

  // 2. Payment confirmed — activate in DB
  try {
    const existing = await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
    });

    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (existing) {
      await db
        .update(userSubscription)
        .set({
          isActive: true,
          stripeCurrentPerriodEnd: periodEnd,
          ...(existing.stripeSubscriptionId !== reference
            ? { stripeSubscriptionId: reference }
            : {}),
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

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");
    revalidatePath("/settings");
    revalidatePath("/");

    console.log(`✅ Manual activation success for user: ${userId}`);
    return { success: true, message: "Pro activated!" };
  } catch (err) {
    console.error("DB activation error:", err);
    return { success: false, message: "Database error. Please contact support." };
  }
};