// app/api/weakness/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { type } = await req.json();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const update: any = {};

  // Increment the appropriate weakness counter
  if (type === "IELTS_WRITING" || type === "GENERAL") {
    update.weakGrammar = (user.weakGrammar || 0) + 1;
  }
  if (type === "IELTS_READING") {
    update.weakReading = (user.weakReading || 0) + 1;
  }
  if (type === "IELTS_LISTENING") {
    update.weakListening = (user.weakListening || 0) + 1;
  }
  if (type === "IELTS_SPEAKING") {
    update.weakVocabulary = (user.weakVocabulary || 0) + 1;
  }

  await db
    .update(userProgress)
    .set(update)
    .where(eq(userProgress.userId, userId));

  return NextResponse.json({ success: true });
}