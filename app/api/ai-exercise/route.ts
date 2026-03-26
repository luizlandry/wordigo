import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { weakness } = await req.json();

    const prompt = `
Generate 3 English learning questions based on weakness: ${weakness}

Return ONLY JSON:
[
  {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correct": "A"
  }
]
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an English teacher." },
        { role: "user", content: prompt },
      ],
    });

    const text = res.choices[0].message.content;

    return NextResponse.json({
      exercises: JSON.parse(text || "[]"),
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error", { status: 500 });
  }
}