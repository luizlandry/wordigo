"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BandScoreCard = ({ band }: { band: number }) => {
  const color =
    band >= 7
      ? "from-green-500 to-emerald-600"
      : band >= 6
      ? "from-yellow-500 to-orange-500"
      : "from-red-500 to-rose-600";

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "p-6 rounded-2xl text-white text-center shadow-xl bg-gradient-to-r",
        color
      )}
    >
      <h2 className="text-sm opacity-90">IELTS Band Score</h2>

      <p className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
        {band.toFixed(1)}
      </p>

      <p className="text-xs opacity-80 mt-1">
        Based on your performance
      </p>
    </motion.div>
  );
};