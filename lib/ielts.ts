import { openai } from "./ai";
import { calculateBandScore } from "./ielts-scoring";

export const evaluateWriting = async (text: string) => {
  // 🔥 AI Feedback
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS examiner. Give clear feedback on vocabulary, grammar, coherence.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const aiFeedback =
    res.choices[0]?.message?.content || "No feedback available";

  // 🔥 BAND SCORE (your logic)
  const band = calculateBandScore(text);

  // 🔥 SMART FEEDBACK (color system ready)
  let feedback = "";
  let color = "";

  if (band >= 7) {
    feedback = "Excellent structure and vocabulary.";
    color = "text-green-500";
  } else if (band >= 6) {
    feedback = "Good, but grammar needs improvement.";
    color = "text-yellow-500";
  } else {
    feedback = "Work on vocabulary and sentence clarity.";
    color = "text-red-500";
  }

  return {
    band,
    feedback,
    aiFeedback,
    color,
  };
};