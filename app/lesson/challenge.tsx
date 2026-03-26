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

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {

  // IELTS READING
  if (type === "IELTS_READING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsReading
          passage={options[0]?.text || ""}
          question="Read and answer"
        />
      </motion.div>
    );
  }

  // IELTS WRITING
  if (type === "IELTS_WRITING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsWriting onSubmit={onSelect} />
      </motion.div>
    );
  }

  // IELTS LISTENING
  if (type === "IELTS_LISTENING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsListening audioSrc={options[0]?.audioSrc || ""} />
      </motion.div>
    );
  }

  // IELTS SPEAKING
  if (type === "IELTS_SPEAKING") {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <IeltsSpeaking onSubmit={onSelect} />
      </motion.div>
    );
  }

  // DEFAULT
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