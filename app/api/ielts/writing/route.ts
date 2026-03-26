import { NextResponse } from "next/server";
import { evaluateWriting } from "@/lib/ielts";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new NextResponse("No text provided", { status: 400 });
    }

    const result = await evaluateWriting(text);

    return NextResponse.json(result);

  } catch (error) {
    console.error("IELTS Writing API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}