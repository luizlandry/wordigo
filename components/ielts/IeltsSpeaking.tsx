"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WritingResultModal } from "./WritingResultModal";

export const IeltsSpeaking = ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  let recognition: any;

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      onSubmit(speechText);
    };

    recognition.onend = () => setRecording(false);

    recognition.start();
  };

  const evaluateSpeech = async () => {
    if (!transcript) return;

    const res = await fetch("/api/ielts/speaking", {
      method: "POST",
      body: JSON.stringify({ text: transcript }),
    });

    const data = await res.json();

    setResult(data);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Button onClick={startRecording}>
        {recording ? "🎙️ Listening..." : "Start Speaking"}
      </Button>

      {transcript && (
        <p className="text-sm text-gray-600 text-center">
          "{transcript}"
        </p>
      )}

      {transcript && (
        <Button onClick={evaluateSpeech}>
          Get Score
        </Button>
      )}

      <WritingResultModal
        open={open}
        onClose={() => setOpen(false)}
        result={result}
      />
    </div>
  );
};