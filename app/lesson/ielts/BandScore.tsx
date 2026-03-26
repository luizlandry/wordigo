"use client";

export const BandScore = ({ score }: { score: string }) => {
  return (
    <div className="p-4 bg-blue-100 rounded-xl text-center">
      <h2 className="text-xl font-bold">IELTS Band Score</h2>
      <p className="text-3xl font-bold text-blue-600">{score}</p>
    </div>
  );
};