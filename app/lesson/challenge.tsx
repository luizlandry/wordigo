import { challengeOptions } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./card";

import { IeltsReading } from "@/components/ielts/IeltsReading";
import { IeltsWriting } from "@/components/ielts/IeltsWriting";
import { IeltsListening } from "@/components/ielts/IeltsListening";
import { IeltsSpeaking } from "@/components/ielts/IeltsSpeaking";

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
  // passage now comes from the challenge row, not options
  passage?: string | null;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  passage,
}: Props) => {

  // ─── IELTS READING (multiple choice) ─────────────────────────────────
  if (type === "IELTS_READING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        {/* Show the passage above the options */}
        {passage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl max-h-56 overflow-y-auto text-sm leading-relaxed text-neutral-700">
            <p className="font-bold text-blue-700 mb-2 text-xs uppercase tracking-wide">
              Reading Passage
            </p>
            {passage}
          </div>
        )}
        {/* Render as selectable cards */}
        <div className="grid gap-2 grid-cols-1">
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
        </div>
      </motion.div>
    );
  }

  // ─── IELTS TRUE / FALSE / NOT GIVEN ──────────────────────────────────
  if (type === "IELTS_TFNG") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        {/* Show the passage */}
        {passage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl max-h-56 overflow-y-auto text-sm leading-relaxed text-neutral-700">
            <p className="font-bold text-blue-700 mb-2 text-xs uppercase tracking-wide">
              Reading Passage
            </p>
            {passage}
          </div>
        )}
        {/* T/F/NG buttons */}
        <div className="grid gap-2 grid-cols-1">
          {options.map((option, i) => (
            <Card
              key={option.id}
              id={option.id}
              text={option.text}
              imageSrc={null}
              shortcut={`${i + 1}`}
              selected={selectedOption === option.id}
              onClick={() => onSelect(option.id)}
              status={status}
              audioSrc=""
              disabled={disabled}
              type={type}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // ─── IELTS WRITING ────────────────────────────────────────────────────
  if (type === "IELTS_WRITING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsWriting onSubmit={onSelect} />
      </motion.div>
    );
  }

  // ─── IELTS LISTENING ─────────────────────────────────────────────────
  if (type === "IELTS_LISTENING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsListening
          audioSrc={options[0]?.audioSrc || ""}
          onSubmit={() => onSelect(options[0]?.id ?? 0)}
        />
      </motion.div>
    );
  }

  // ─── IELTS SPEAKING ──────────────────────────────────────────────────
  if (type === "IELTS_SPEAKING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsSpeaking onSubmit={onSelect} />
      </motion.div>
    );
  }

  // ─── DEFAULT: SELECT / ASSIST ─────────────────────────────────────────
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