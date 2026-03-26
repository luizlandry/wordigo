"use client";

type Props = {
  passage: string;
  question: string;
};

export const IeltsReading = ({ passage, question }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* LEFT = PASSAGE */}
      <div className="p-4 border rounded-xl h-[400px] overflow-y-scroll bg-white">
        <h2 className="font-bold mb-2">Reading Passage</h2>
        <p className="text-sm leading-6 whitespace-pre-line">{passage}</p>
      </div>

      {/* RIGHT = QUESTION */}
      <div className="flex flex-col justify-center">
        <h2 className="font-bold mb-4">{question}</h2>
      </div>
    </div>
  );
};