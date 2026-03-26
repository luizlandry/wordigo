"use client";

import { useEffect, useState } from "react";

type Props = {
  duration: number; // in seconds
  onTimeUp: () => void;
};

export const ExamTimer = ({ duration, onTimeUp }: Props) => {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-red-500 font-bold text-lg text-center">
      ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};