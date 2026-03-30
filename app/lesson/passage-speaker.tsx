// app/lesson/passage-speaker.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;        // The passage text to speak
  lang?: string;       // BCP-47 language tag, e.g. "en-US". Defaults to "en-US"
  className?: string;
};

/**
 * PassageSpeaker
 *
 * Renders a speaker icon button that reads `text` aloud when clicked.
 * Uses a softer, more gentle voice (prefers female voices like Google UK English Female)
 */
export const PassageSpeaker = ({ text, lang = "en-US", className }: Props) => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        
        // Priority order for softer/gentler voices:
        // 1. Google UK English Female (very natural, soft)
        // 2. Google US English Female
        // 3. Samantha (macOS - very gentle)
        // 4. Any female voice with "Female" in name
        // 5. Any English voice with "Google" in name
        // 6. Fallback to first English voice
        
        const preferredVoices = [
          // Google voices (Chrome) - very natural
          { name: "Google UK English Female", priority: 1 },
          { name: "Google US English Female", priority: 2 },
          { name: "Google UK English Male", priority: 5 },
          { name: "Google US English Male", priority: 6 },
          // macOS voices - Samantha is very gentle
          { name: "Samantha", priority: 3 },
          { name: "Victoria", priority: 4 },
          { name: "Karen", priority: 7 },
          { name: "Moira", priority: 8 },
        ];

        let bestVoice: SpeechSynthesisVoice | null = null;
        let bestPriority = 999;

        for (const preferred of preferredVoices) {
          const voice = voices.find(
            (v) => v.name === preferred.name && v.lang.startsWith("en")
          );
          if (voice && preferred.priority < bestPriority) {
            bestVoice = voice;
            bestPriority = preferred.priority;
          }
        }

        // If no preferred voice found, try to find any female voice
        if (!bestVoice) {
          const femaleVoice = voices.find(
            (v) => v.lang.startsWith("en") && 
                  (v.name.toLowerCase().includes("female") || 
                   v.name.toLowerCase().includes("samantha") ||
                   v.name.toLowerCase().includes("victoria") ||
                   v.name.toLowerCase().includes("karen"))
          );
          if (femaleVoice) bestVoice = femaleVoice;
        }

        // If still no voice, use any English voice
        if (!bestVoice) {
          bestVoice = voices.find((v) => v.lang.startsWith("en")) || null;
        }

        setSelectedVoice(bestVoice);
      }
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // ── Speak function (only when clicked) ──────────────────────────────────
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
    
    // Use selected voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Softer settings:
    utterance.rate = 0.85;      // Slightly slower for clarity (was 0.92)
    utterance.pitch = 1.15;     // Slightly higher pitch for softer sound (was 1.0)
    utterance.volume = 0.9;     // Slightly lower volume for gentler feel (was 1.0)

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, lang, supported, selectedVoice]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Don't render anything if the browser doesn't support TTS
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={speak}
      title={speaking ? "Stop reading passage" : "Read passage aloud"}
      aria-label={speaking ? "Stop reading passage" : "Read passage aloud"}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-full p-2 transition-all",
        // Colour: blue to match IELTS theme
        "text-blue-500 hover:bg-blue-50 active:scale-95",
        // Animated ring while speaking
        speaking && "ring-2 ring-blue-400 ring-offset-1 animate-pulse",
        className,
      )}
    >
      {speaking ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5 opacity-70" />
      )}
    </button>
  );
};