// app/lesson/question-speaker.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;        // The question text to speak
  lang?: string;       // BCP-47 language tag, e.g. "en-US". Defaults to "en-US"
  className?: string;
};

/**
 * QuestionSpeaker
 *
 * Renders a small speaker icon button that reads `text` aloud using the
 * browser's built-in Web Speech API (SpeechSynthesis). No API key, no audio
 * files, no backend required — it works in every modern browser for free.
 *
 * Behaviour:
 *  - Click once  → starts reading
 *  - Click again → stops reading (toggle)
 *  - Automatically resets the icon when speech finishes
 *  - On the very first render it reads the question automatically so the
 *    user hears it without having to press anything
 */
export const QuestionSpeaker = ({ text, lang = "en-US", className }: Props) => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  // ── Core speak function ────────────────────────────────────────────────────
  const speak = useCallback(() => {
    if (!supported || !window.speechSynthesis) return;

    // If already speaking → stop (toggle off)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;   // slightly slower for learners
    utterance.pitch = 1;

    utterance.onstart  = () => setSpeaking(true);
    utterance.onend    = () => setSpeaking(false);
    utterance.onerror  = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, lang, supported]);

  // ── Auto-read when question changes ───────────────────────────────────────
  useEffect(() => {
    if (!supported) return;

    // Cancel any previous speech first
    window.speechSynthesis.cancel();
    setSpeaking(false);

    // Small delay so the page has time to render before speaking starts
    const timeout = setTimeout(() => {
      speak();
    }, 400);

    // Cleanup: cancel if the component unmounts or text changes
    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };
    // We intentionally only re-run when `text` changes (i.e. new question)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Don't render anything if the browser doesn't support TTS
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={speak}
      title={speaking ? "Stop reading" : "Read question aloud"}
      aria-label={speaking ? "Stop reading" : "Read question aloud"}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-full p-2 transition-all",
        // Colour: orange tint to match Wordigo brand
        "text-orange-500 hover:bg-orange-50 active:scale-95",
        // Animated ring while speaking
        speaking && "ring-2 ring-orange-400 ring-offset-1 animate-pulse",
        className,
      )}
    >
      {speaking ? (
        // Pulsing speaker while reading
        <Volume2 className="h-6 w-6" />
      ) : (
        <Volume2 className="h-6 w-6 opacity-70" />
      )}
    </button>
  );
};