"use server";

import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const updateStreak = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const user = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!user) return;

  const today = new Date();
  const last = user.lastActive ? new Date(user.lastActive) : null;

  let newStreak = user.streak;

  if (last) {
    const diff = Math.floor(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) newStreak += 1;
    else if (diff > 1) newStreak = 1;
  } else {
    newStreak = 1;
  }

  await db.update(userProgress)
    .set({
      streak: newStreak,
      lastActive: today,
    })
    .where(eq(userProgress.userId, userId));
};