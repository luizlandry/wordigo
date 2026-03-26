"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WritingResultModal } from "./WritingResultModal";

export const IeltsWriting = ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!text || text.length < 20) {
      alert("Write at least 20 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ielts/writing", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setResult(data);
      setOpen(true);

      // 🔥 ALSO notify quiz system
      onSubmit(text);
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 📝 TEXT AREA */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your IELTS response here..."
        className="w-full h-40 p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* 🔥 BUTTON */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Evaluating..." : "Submit Writing"}
      </Button>

      {/* 🔥 RESULT MODAL */}
      <WritingResultModal
        open={open}
        onClose={() => setOpen(false)}
        result={result}
      />
    </div>
  );
};