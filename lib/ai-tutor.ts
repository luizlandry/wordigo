import { openai } from "./ai";

export const analyzeWeakness = async (answers: string[]) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS tutor. Analyze mistakes and return weak areas like grammar, vocabulary, coherence.",
      },
      {
        role: "user",
        content: answers.join("\n"),
      },
    ],
  });

  return res.choices[0].message.content;
};