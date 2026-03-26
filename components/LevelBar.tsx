"use client";

export const LevelBar = ({ xp }: { xp: number }) => {
  const progress = xp % 100;

  return (
    <div className="w-full bg-gray-200 rounded-xl h-4">
      <div
        className="bg-green-500 h-4 rounded-xl transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};