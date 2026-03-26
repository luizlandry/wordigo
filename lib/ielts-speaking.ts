import { openai } from "./ai";

export const evaluateSpeaking = async (text: string) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an IELTS speaking examiner. Score from 0-9 and give feedback on fluency, grammar, pronunciation.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const aiFeedback =
    res.choices[0]?.message?.content || "No feedback";

  // 🔥 SIMPLE BAND LOGIC
  let band = 5;

  if (text.length > 120) band = 7;
  else if (text.length > 60) band = 6;

  let feedback = "";
  let color = "";

  if (band >= 7) {
    feedback = "Fluent and well structured speech.";
    color = "text-green-500";
  } else if (band >= 6) {
    feedback = "Good, but hesitations present.";
    color = "text-yellow-500";
  } else {
    feedback = "Needs improvement in fluency.";
    color = "text-red-500";
  }

  return {
    band,
    feedback,
    aiFeedback,
    color,
  };
};