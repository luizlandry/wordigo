"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Unit = {
  id: number;
  title: string;
  completed: boolean;
  locked: boolean;
};

type Props = {
  units: Unit[];
};

export const LevelMap = ({ units }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-10 relative">
      
      {/* PATH LINE */}
      <div className="absolute w-1 bg-gray-200 h-full left-1/2 -translate-x-1/2" />

      {units.map((unit, index) => {
        const isLeft = index % 2 === 0;

        return (
          <div
            key={unit.id}
            className={cn(
              "w-full flex items-center my-8",
              isLeft ? "justify-start" : "justify-end"
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: !unit.completed && !unit.locked ? [1, 1.1, 1] : 1, // 🔥 bounce
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                repeat: !unit.completed && !unit.locked ? Infinity : 0,
                repeatDelay: 2,
              }}
              onClick={() => {
                if (!unit.locked) {
                  router.push(`/lesson/${unit.id}`);
                }
              }}
              className={cn(
                "cursor-pointer z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-xl transition-all",
                unit.completed && "bg-green-500 hover:scale-110",
                !unit.completed && !unit.locked && "bg-blue-500 hover:scale-110",
                unit.locked && "bg-gray-400 cursor-not-allowed"
              )}
            >
              {/* ICON */}
              <span className="text-xl">
                {unit.locked ? "🔒" : unit.completed ? "✅" : "▶"}
              </span>

              {/* SMALL LABEL */}
              <span className="text-[10px] mt-1 text-center px-1">
                {unit.title}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};