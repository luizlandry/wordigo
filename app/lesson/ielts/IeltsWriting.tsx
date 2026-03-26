import { useState } from "react";
import { BandScoreCard } from "./BandScoreCard";

export const IeltsWriting = ({ onSubmit }: any) => {
  const [text, setText] = useState("");
  const [band, setBand] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/ielts/writing", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    setBand(data.band);
    setFeedback(data.feedback);

    // Award XP for completing IELTS Writing
    await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: 20 }),
    });

    onSubmit(text);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full p-4 border rounded-xl"
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded-xl"
      >
        Submit
      </button>

      {band && <BandScoreCard band={band} />}

      {feedback && (
        <p className="text-gray-600 text-sm">{feedback}</p>
      )}
    </div>
  );
};