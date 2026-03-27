// lib/getWeakness.ts
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getWeakness = async () => {
  const { userId } = await auth();

  if (!userId) {
    return [
      { name: "Grammar", value: 0, fill: "#ef4444" },
      { name: "Vocabulary", value: 0, fill: "#22c55e" },
      { name: "Listening", value: 0, fill: "#f59e0b" },
      { name: "Reading", value: 0, fill: "#3b82f6" },
    ];
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  // Ensure all values are numbers, default to 0 if undefined
  return [
    {
      name: "Grammar",
      value: data?.weakGrammar ?? 0,
      fill: "#ef4444",
    },
    {
      name: "Vocabulary",
      value: data?.weakVocabulary ?? 0,
      fill: "#22c55e",
    },
    {
      name: "Listening",
      value: data?.weakListening ?? 0,
      fill: "#f59e0b",
    },
    {
      name: "Reading",
      value: data?.weakReading ?? 0,
      fill: "#3b82f6",
    },
  ];
};