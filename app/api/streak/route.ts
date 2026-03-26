import { updateStreak } from "@/actions/streak";

export async function POST() {
  await updateStreak();
  return new Response("OK");
}