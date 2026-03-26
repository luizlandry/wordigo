import { getLeaderboard } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getLeaderboard();
  return NextResponse.json(users);
}