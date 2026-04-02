import { NextResponse } from "next/server";
import { analyzeWeakness } from "@/lib/ai-tutor";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    const result = await analyzeWeakness(answers);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}