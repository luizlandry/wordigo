import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getWeakness = async () => {
  const { userId } = await auth();

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId!),
  });

 return [
  {
    name: "Grammar",
    value: data?.weakGrammar || 0,
    fill: "#ef4444", // 🔴 weak
  },
  {
    name: "Vocabulary",
    value: data?.weakVocabulary || 0,
    fill: "#22c55e", // 🟢 strong
  },
  {
    name: "Listening",
    value: data?.weakListening || 0,
    fill: "#f59e0b", // 🟡 medium
  },
  {
    name: "Reading",
    value: data?.weakReading || 0,
    fill: "#3b82f6", // 🔵 info
  },
];
};