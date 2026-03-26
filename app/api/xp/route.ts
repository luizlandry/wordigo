import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { xp } = await req.json();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!user) return new NextResponse("No user", { status: 404 });

  await db.update(userProgress)
    .set({
      xp: (user.xp || 0) + xp,
    })
    .where(eq(userProgress.userId, userId));

  return NextResponse.json({ success: true });
}