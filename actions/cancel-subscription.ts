// actions/cancel-subscription.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const cancelSubscription = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!existing) {
    throw new Error("No subscription found");
  }

  // Set isActive to false — the user keeps their DB record but loses Pro access
  await db
    .update(userSubscription)
    .set({ isActive: false })
    .where(eq(userSubscription.userId, userId));

  // Bust the cache on all pages that check isPro
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");
  revalidatePath("/settings");
  revalidatePath("/");

  console.log(`✅ Subscription cancelled for user: ${userId}`);
};
