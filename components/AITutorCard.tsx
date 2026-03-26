"use client";

import { motion } from "framer-motion";

export const AITutorCard = ({ feedback }: { feedback: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-lg border mt-6"
    >
      <h2 className="text-lg font-bold text-indigo-600">
        🤖 AI Tutor Feedback
      </h2>

      <p className="text-gray-700 mt-2">
        {feedback}
      </p>
    </motion.div>
  );
};