"use client";

type IeltsListeningProps = {
  audioSrc: string;
  onsubmit?: () => void;
};

export const IeltsListening = ({ audioSrc, onSubmit }: IeltsListeningProps & { onSubmit?: () => void }) => {
  const handleComplete = async () => {
    // Award XP for completing IELTS Listening
    await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: 20 }),
    });
    onSubmit?.();
  };

  return (
    <div className="space-y-4">
      <audio controls src={audioSrc} />
      <button
        onClick={handleComplete}
        className="bg-green-500 text-white px-4 py-2 rounded-xl"
      >
        Complete Listening
      </button>
    </div>
  );
};
