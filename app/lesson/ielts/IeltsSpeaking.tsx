 "use client"

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

export const IeltsSpeaking = ({ 
  onSubmit 
}: { 
  onSubmit: (transcript: string) => void 
}) => {
  const { 
    transcript, 
    listening, 
    resetTranscript 
  } = useSpeechRecognition()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Speaking Task</h2>

      <div className="p-4 bg-gray-100 rounded-lg min-h-[100px]">
        {transcript || "Start speaking..."}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => SpeechRecognition.startListening()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          disabled={listening}
        >
          {listening ? "Listening..." : "Start"}
        </button>

        <button
          onClick={() => SpeechRecognition.stopListening()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          disabled={!listening}
        >
          Stop
        </button>

        <button
          onClick={resetTranscript}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          Reset
        </button>

        <button
          onClick={async () => {
            // Award XP for completing IELTS Speaking
            await fetch("/api/xp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ xp: 20 }),
            });
            onSubmit(transcript);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors ml-auto"
          disabled={!transcript || !transcript.trim()}
        >
          Submit Answer
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {listening ? "🔴 Listening..." : "⚫ Ready"}
      </p>
    </div>
  )
} 

