"use client";

import { useState, useTransition, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize, useMount, useAudio } from "react-use";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { ResultCard } from "./result-card";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { ExamTimer } from "@/components/ExamTimer";
import { AITutorCard } from "@/components/AITutorCard";

type ChallengeWithOptions = typeof challenges.$inferSelect & {
  completed: boolean;
  difficulty?: number;
  challengeOptions: typeof challengeOptions.$inferSelect[];
};

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: ChallengeWithOptions[];
  userSubscription: (typeof userSubscription.$inferSelect & {
    isActive: boolean;
  }) | null;
  mode: string;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  userSubscription,
  initialLessonId,
  initialLessonChallenges,
  mode,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiExercises, setAiExercises] = useState<any[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();

  const [finishAudioElement, , finishControls] = useAudio({ src: "/finish.mp3" });
  const [correctAudioElement, , correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudioElement, , incorrectControls] = useAudio({ src: "/incorrect.wav" });

  const [pending, startTransition] = useTransition();
  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(
    initialPercentage === 100 ? 0 : initialPercentage
  );

  const [challengesList, setChallengesList] = useState<ChallengeWithOptions[]>(
    initialLessonChallenges
  );

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challengesList.findIndex((c) => !c.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const challenge = challengesList[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  // ✅ AI TUTOR (SEND REAL WEAKNESSES)
  useEffect(() => {
    if (!challenge && weaknesses.length > 0) {

      // 🔥 AI FEEDBACK
      fetch("/api/ai-tutor", {
        method: "POST",
        body: JSON.stringify({ answers: weaknesses }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiFeedback(data.result);
        });

      // 🔥 AI EXERCISES
      fetch("/api/ai-exercise", {
        method: "POST",
        body: JSON.stringify({ weakness: weaknesses[0] }),
      })
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.exercises.map((ex: any, index: number) => ({
            id: Date.now() + index,
            lessonId: lessonId,
            type: "SELECT",
            question: ex.question,
            completed: false,
            difficulty: 1,
            challengeOptions: ex.options.map((opt: string, i: number) => ({
              id: i + 1,
              text: opt,
              correct: opt === ex.correct,
            })),
          }));

          setChallengesList((prev) => [...prev, ...mapped]);
        });
    }
  }, [challenge, weaknesses]);

  useEffect(() => {
    if (!challenge && mode !== "exam") finishControls.play();
  }, [challenge, finishControls, mode]);

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: string | number) => {
    const numericId = typeof id === "string" ? parseInt(id) : id;
    if (status !== "none") return;
    setSelectedOption(numericId);
  };

  const onContinue = () => {
    if (!challenge) return;

    const userLevel = 1;
    if ((challenge.difficulty ?? 1) > userLevel) {
      onNext();
      return;
    }

    if (mode === "ielts") {
      if (
        challenge.type === "IELTS_WRITING" ||
        challenge.type === "IELTS_SPEAKING"
      ) {
        onNext();
        return;
      }
      new Audio("/streak.mp3").play();
    }

    if (mode === "exam" && !selectedOption) return;
    if (!selectedOption) return;

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);
    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            if (mode !== "exam") correctControls.play();
            setStatus("correct");

            if (mode === "ielts") {
              setPercentage((prev) => prev + 100 / (challengesList.length * 1.2));
            } else {
              setPercentage((prev) => prev + 100 / challengesList.length);
            }

            if (mode !== "exam") {
              const xpGain =
                mode === "ielts"
                  ? 20 + (challenge.difficulty ?? 1) * 5
                  : 10;

              fetch("/api/xp", {
                method: "POST",
                body: JSON.stringify({ xp: xpGain }),
              });

              fetch("/api/streak", { method: "POST" });
            }
          })
          .catch(() => toast.error("Something went wrong."));
      });
    } else {
      // ✅ SAVE WEAKNESS ON WRONG ANSWER
      setWeaknesses((prev) => [
        ...prev,
        challenge.type || "general mistake",
      ]);

      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            if (mode !== "exam") incorrectControls.play();
            setStatus("wrong");
            setHearts((prev) => Math.max(prev - 1, 0));
          })
          .catch(() => toast.error("Something went wrong."));
      });
    }
  };

  return (
    <>
      {finishAudioElement}
      {correctAudioElement}
      {incorrectAudioElement}

      {!challenge ? (
        <>
          {mode !== "exam" && (
            <Confetti width={width} height={height} recycle={false} />
          )}

          <div className="flex flex-col gap-y-4 max-w-lg mx-auto text-center items-center justify-center h-full">
            <Image src="/finish.svg" alt="Finish" height={100} width={100} />

            <h1 className="text-xl font-bold">
              {mode === "exam"
                ? "Exam Completed"
                : "Great job! You have completed the lesson."}
            </h1>

            <div className="flex items-center gap-x-4 w-full">
              <ResultCard
                variant="points"
                value={mode === "exam" ? 0 : challengesList.length * 5}
              />
              <ResultCard variant="hearts" value={hearts} />
            </div>

            {aiFeedback && <AITutorCard feedback={aiFeedback} />}

            {aiExercises.length > 0 && (
              <div className="mt-6 p-4 bg-white rounded-xl shadow">
                <h2 className="font-bold text-lg mb-2">
                  Practice your weak areas
                </h2>

                {aiExercises.map((ex, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-semibold">{ex.question}</p>

                    <ul className="mt-2 space-y-1">
                      {ex.options.map((opt: string, idx: number) => (
                        <li
                          key={idx}
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/learn")}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl shadow"
          >
            Continue Learning
          </button>

          <Footer
            lessonId={lessonId}
            status="completed"
            disabled={false}
            onClick={() =>
              router.push(mode === "exam" ? "/exam/result" : "/learn")
            }
          />
        </>
      ) : (
        <>
          {mode === "exam" && (
            <ExamTimer
              duration={60 * 60}
              onTimeUp={() => router.push("/exam/result")}
            />
          )}

          <Header
            hearts={hearts}
            percentage={percentage}
            hasActiveSubscription={!!userSubscription?.isActive}
          />

          <div className="flex-1 flex items-center justify-center">
            <div className="lg:w-[600px] w-full px-6 flex flex-col gap-y-12">
              <h1 className="text-lg font-bold text-center">
                {challenge.type === "ASSIST"
                  ? "Select the correct meaning"
                  : challenge.question}
              </h1>

              {mode === "ielts" && (
                <span className="text-xs text-purple-500">
                  IELTS Mode
                </span>
              )}

              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}

              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>

          <Footer
            lessonId={lessonId}
            disabled={pending || !selectedOption}
            status={status}
            onClick={onContinue}
          />
        </>
      )}
    </>
  );
};