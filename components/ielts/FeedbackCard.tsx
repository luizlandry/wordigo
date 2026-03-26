"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  feedback: string;
  aiFeedback: string;
  band: number;
};

export const FeedbackCard = ({
  feedback,
  aiFeedback,
  band,
}: Props) => {
  const color =
    band >= 7
      ? "border-green-500 bg-green-50"
      : band >= 6
      ? "border-yellow-500 bg-yellow-50"
      : "border-red-500 bg-red-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border-2 shadow-sm space-y-3",
        color
      )}
    >
      <h3 className="font-bold text-lg">
        Feedback
      </h3>

      <p className="text-sm">{feedback}</p>

      <div className="text-xs text-muted-foreground border-t pt-2">
        {aiFeedback}
      </div>
    </motion.div>
  );
};