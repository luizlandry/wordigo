import { NextResponse } from "next/server";
import { evaluateSpeaking } from "@/lib/ielts-speaking";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new NextResponse("No speech provided", { status: 400 });
    }

    const result = await evaluateSpeaking(text);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Speaking API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}