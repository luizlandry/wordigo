import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { type, bandLevel = 5, topic, lessonTitle } = await req.json();

    if (!type) {
      return new NextResponse("Missing 'type' field", { status: 400 });
    }

    let prompt = "";
    let systemPrompt = `You are a certified IELTS examiner with 15 years of experience. 
Generate authentic IELTS-style exam content that accurately reflects the real exam. 
Respond ONLY with valid JSON — no markdown, no code blocks, no extra text.`;

    // ─── BUILD PROMPT BY TYPE ──────────────────────────────────────────
    if (type === "IELTS_READING" || type === "IELTS_TFNG") {
      prompt = `Generate an IELTS Academic Reading question for Band ${bandLevel} level.
${topic ? `Topic: ${topic}` : "Choose an academic topic (technology, environment, science, society, history, or psychology)."}

Return this exact JSON structure:
{
  "passage": "A 150-200 word IELTS-style academic passage. Use formal academic language appropriate for Band ${bandLevel}. Include specific facts, statistics, or expert opinions.",
  "challenges": [
    {
      "type": "IELTS_READING",
      "question": "A multiple-choice comprehension question about the passage",
      "options": [
        {"text": "Correct answer based on passage", "correct": true},
        {"text": "Plausible wrong answer 1", "correct": false},
        {"text": "Plausible wrong answer 2", "correct": false}
      ]
    },
    {
      "type": "IELTS_TFNG",
      "question": "A statement that is TRUE based on the passage",
      "options": [
        {"text": "TRUE", "correct": true},
        {"text": "FALSE", "correct": false},
        {"text": "NOT GIVEN", "correct": false}
      ]
    },
    {
      "type": "IELTS_TFNG",
      "question": "A statement that is FALSE based on the passage (contradicts it)",
      "options": [
        {"text": "TRUE", "correct": false},
        {"text": "FALSE", "correct": true},
        {"text": "NOT GIVEN", "correct": false}
      ]
    },
    {
      "type": "IELTS_TFNG",
      "question": "A statement that is NOT GIVEN (neither confirmed nor denied in the passage)",
      "options": [
        {"text": "TRUE", "correct": false},
        {"text": "FALSE", "correct": false},
        {"text": "NOT GIVEN", "correct": true}
      ]
    }
  ]
}`;
    } else if (type === "IELTS_WRITING") {
      prompt = `Generate ${bandLevel >= 7 ? "an advanced" : "a standard"} IELTS Writing question for Band ${bandLevel}.
Lesson: "${lessonTitle || "IELTS Writing Practice"}"
${topic ? `Topic area: ${topic}` : ""}

Return this exact JSON structure:
{
  "challenges": [
    {
      "type": "IELTS_WRITING",
      "question": "Task 1 prompt: Describe a visual data representation (graph, chart, diagram, or process). Include the instruction to write at least 150 words in 20 minutes.",
      "passage": null,
      "bandTips": "Brief tip for achieving Band ${bandLevel}: focus on [specific aspect]"
    },
    {
      "type": "IELTS_WRITING",
      "question": "Task 2 prompt: A discussion or opinion essay question on a contemporary social, cultural, or environmental issue. Include instructions to write at least 250 words in 40 minutes.",
      "passage": null,
      "bandTips": "Brief tip for achieving Band ${bandLevel}: focus on [specific aspect]"
    }
  ]
}`;
    } else if (type === "IELTS_SPEAKING") {
      prompt = `Generate authentic IELTS Speaking questions for Band ${bandLevel} target.
Lesson: "${lessonTitle || "IELTS Speaking Practice"}"
${topic ? `Theme: ${topic}` : ""}

Return this exact JSON structure:
{
  "challenges": [
    {
      "type": "IELTS_SPEAKING",
      "question": "Part 1: Ask 3 related personal questions about a familiar everyday topic. Format them as 'Part 1 – [Topic]: [Question 1]? [Question 2]? [Question 3]?'",
      "passage": null
    },
    {
      "type": "IELTS_SPEAKING",
      "question": "Part 2 (Cue Card): 'Describe [something specific]. You should say: [point 1], [point 2], [point 3], and explain [why/how/what]. You have 1 minute to prepare, then speak for 1–2 minutes.'",
      "passage": null
    },
    {
      "type": "IELTS_SPEAKING",
      "question": "Part 3: Ask 3 abstract discussion questions that relate to the Part 2 topic on a broader societal level. Format as 'Part 3 – Discussion: [Question 1]? [Question 2]? [Question 3]?'",
      "passage": null
    }
  ]
}`;
    } else if (type === "IELTS_LISTENING") {
      prompt = `Generate IELTS Listening comprehension questions for Band ${bandLevel}.
Lesson: "${lessonTitle || "IELTS Listening Practice"}"

Since actual audio isn't available, create transcript-based questions.
Return this exact JSON structure:
{
  "transcript": "A 100-150 word realistic dialogue or monologue that could appear in IELTS Listening Section 1 or 2. Use natural spoken language.",
  "challenges": [
    {
      "type": "IELTS_READING",
      "question": "Based on the listening transcript: [comprehension question]",
      "passage": "[include the transcript here as the passage]",
      "options": [
        {"text": "Correct answer", "correct": true},
        {"text": "Wrong answer 1", "correct": false},
        {"text": "Wrong answer 2", "correct": false}
      ]
    },
    {
      "type": "IELTS_READING",
      "question": "Based on the listening transcript: [another comprehension question]",
      "passage": "[include the transcript here]",
      "options": [
        {"text": "Correct answer", "correct": true},
        {"text": "Wrong answer 1", "correct": false},
        {"text": "Wrong answer 2", "correct": false}
      ]
    }
  ]
}`;
    } else {
      // Generic IELTS question
      prompt = `Generate 3 IELTS-style questions for the "${lessonTitle || type}" lesson at Band ${bandLevel}.
Return JSON: {"challenges": [{"type": "${type}", "question": "...", "options": [{"text":"...","correct":true/false}]}]}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = response.choices[0].message.content || "{}";

    // Clean potential markdown code fences
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error:", cleaned.slice(0, 200));
      return new NextResponse("AI returned invalid JSON", { status: 500 });
    }

    // Normalize: ensure passage is propagated into each challenge for reading types
    if (parsed.passage && parsed.challenges) {
      parsed.challenges = parsed.challenges.map((c: any) => ({
        ...c,
        passage: c.passage ?? parsed.passage,
      }));
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("IELTS Generate API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}