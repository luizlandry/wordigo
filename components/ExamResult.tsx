"use client";

export const ExamResult = ({
  band,
  correct,
  total,
}: {
  band: number;
  correct: number;
  total: number;
}) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Exam Finished 🎉</h1>

      <div className="text-5xl font-bold text-blue-600">
        {band}
      </div>

      <p>
        Score: {correct} / {total}
      </p>

      <p className="text-gray-500">
        {band >= 7
          ? "Great job! You are IELTS ready."
          : "Keep practicing to improve your band."}
      </p>
    </div>
  );
};