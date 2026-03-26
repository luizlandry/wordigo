"use client";

type Props = {
  passage: string;
  question: string;
};

export const IeltsReading = ({ passage, question, onSubmit }: Props & { onSubmit?: () => void }) => {
  const handleComplete = async () => {
    // Award XP for completing IELTS Reading
    await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: 20 }),
    });
    onSubmit?.();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded-xl max-h-[200px] overflow-y-auto">
        <p className="text-sm">{passage}</p>
      </div>

      <h2 className="text-lg font-bold">{question}</h2>
      <button
        onClick={handleComplete}
        className="bg-green-500 text-white px-4 py-2 rounded-xl"
      >
        Complete Reading
      </button>
    </div>
  );
};
