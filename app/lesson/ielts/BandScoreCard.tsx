"use client";

import { motion } from "framer-motion";

export const BandScoreCard = ({ band }: { band: number }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center shadow-xl"
    >
      <h2 className="text-lg">IELTS Band Score</h2>
      <p className="text-4xl font-bold">{band}</p>
    </motion.div>
  );
};