import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { type } = await req.json();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const update: any = {};

  if (type === "IELTS_WRITING") update.weakGrammar = 1;
  if (type === "IELTS_READING") update.weakReading = 1;
  if (type === "IELTS_LISTENING") update.weakListening = 1;
  if (type === "IELTS_SPEAKING") update.weakVocabulary = 1;

  await db
    .update(userProgress)
    .set(update)
    .where(eq(userProgress.userId, userId));

  return NextResponse.json({ success: true });
}