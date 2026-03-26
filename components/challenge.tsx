"use client";

import { challengeOptions } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./card";

import { IeltsReading } from "./ielts/IeltsReading";
import { IeltsWriting } from "./ielts/IeltsWriting";
import { IeltsListening } from "./ielts/IeltsListening";
import { IeltsSpeaking } from "./ielts/IeltsSpeaking";

import { motion } from "framer-motion";

type ChallengeType =
  | "SELECT"
  | "ASSIST"
  | "IELTS_READING"
  | "IELTS_WRITING"
  | "IELTS_LISTENING"
  | "IELTS_SPEAKING"
  | "IELTS_TFNG";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: string | number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: ChallengeType;
};

export const Challenge = (props: Props) => {
  const { options, onSelect, status, selectedOption, disabled, type } = props;

  // ================= IELTS MODES =================

  if (type === "IELTS_READING") {
    return (
      <IeltsReading
        passage={options[0]?.text || ""}
        question="Read and answer"
      />
    );
  }

  if (type === "IELTS_WRITING") {
    return <IeltsWriting onSubmit={onSelect} />;
  }

  if (type === "IELTS_LISTENING") {
    return <IeltsListening audioSrc={options[0]?.audioSrc || ""} />;
  }

  if (type === "IELTS_SPEAKING") {
    return <IeltsSpeaking onSubmit={onSelect} />;
  }

  if (type === "IELTS_TFNG") {
    const tfngOptions = [
      { id: 1, text: "True" },
      { id: 2, text: "False" },
      { id: 3, text: "Not Given" },
    ];

    return (
      <div className="grid gap-2">
        {tfngOptions.map((option, i) => (
          <Card
            key={option.id}
            id={option.id}
            text={option.text}
            shortcut={`${i + 1}`}
            selected={selectedOption === option.id}
            onClick={() => onSelect(option.id)}
            status={status}
            disabled={disabled}
            type={type}
          />
        ))}
      </div>
    );
  }

  // ================= DEFAULT =================

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc || ""}
          disabled={disabled}
          type={type}
        />
      ))}
    </motion.div>
  );
};