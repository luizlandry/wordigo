"use client";

export const Streak = ({ streak }: { streak: number }) => {
  return (
    <div className="flex items-center gap-2 text-orange-500 font-bold">
      🔥 {streak} day streak
    </div>
  );
};