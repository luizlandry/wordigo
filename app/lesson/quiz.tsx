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
  difficulty?: number | null;
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
  mode?: string;
};

// ─── Helper: map AI challenge to app ChallengeWithOptions shape ─────────────
function mapAiChallenge(
  aiChallenge: any,
  lessonId: number,
  index: number,
  passage?: string
): ChallengeWithOptions {
  return {
    id: -(Date.now() + index), // negative ID = AI-generated (not in DB)
    lessonId,
    type: aiChallenge.type ?? "SELECT",
    question: aiChallenge.question ?? "",
    order: -1,
    completed: false,
    difficulty: 1,
    isExam: false,
    passage: aiChallenge.passage ?? passage ?? null,
    audioSrc: null,
    challengeOptions: (aiChallenge.options ?? []).map((opt: any, i: number) => ({
      id: -(Date.now() + index * 100 + i),
      challengeId: -(Date.now() + index),
      text: opt.text ?? opt,
      correct: opt.correct ?? false,
      imageSrc: null,
      audioSrc: null,
    })),
  };
}

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
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
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
    const idx = challengesList.findIndex((c) => !c.completed);
    return idx === -1 ? 0 : idx;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  // ─── IELTS: Load AI-generated questions when lesson starts ─────────────────
  useEffect(() => {
    if (mode !== "ielts") return;
    if (challengesList.length === 0) return;

    // Determine the primary challenge type for AI generation
    const primaryType = challengesList[0]?.type ?? "IELTS_READING";

    // Only fetch AI questions for reading/writing/speaking (not if it's pure SELECT)
    const ieltsTypes = ["IELTS_READING","IELTS_TFNG","IELTS_WRITING","IELTS_SPEAKING","IELTS_LISTENING"];
    const hasIeltsContent = challengesList.some((c) => ieltsTypes.includes(c.type));
    if (!hasIeltsContent) return;

    setAiLoading(true);

    fetch("/api/ielts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: primaryType,
        bandLevel: 5,
        lessonTitle: challengesList[0]?.question?.slice(0, 50) ?? "IELTS Practice",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.data?.challenges) return;

        const aiChallenges: ChallengeWithOptions[] = data.data.challenges.map(
          (c: any, i: number) =>
            mapAiChallenge(c, lessonId, i + 1000, data.data.passage)
        );

        // Append AI challenges after seeded ones
        setChallengesList((prev) => [...prev, ...aiChallenges]);
      })
      .catch((err) => console.error("AI IELTS load error:", err))
      .finally(() => setAiLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const challenge = challengesList[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  // ─── AI Tutor feedback when lesson ends ───────────────────────────────────
  useEffect(() => {
    if (!challenge && weaknesses.length > 0) {
      fetch("/api/ai-tutor", {
        method: "POST",
        body: JSON.stringify({ answers: weaknesses }),
      })
        .then((r) => r.json())
        .then((data) => setAiFeedback(data.result));
    }
  }, [challenge, weaknesses]);

  useEffect(() => {
    if (!challenge && mode !== "exam") finishControls.play();
  }, [challenge, finishControls, mode]);

  const onNext = () => setActiveIndex((cur) => cur + 1);

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

    // IELTS writing/speaking: auto-advance without DB tracking
    if (mode === "ielts") {
      if (
        challenge.type === "IELTS_WRITING" ||
        challenge.type === "IELTS_SPEAKING"
      ) {
        onNext();
        return;
      }
    }

    if (mode === "exam" && !selectedOption) return;
    if (!selectedOption) return;

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((o) => o.correct);
    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      // Correct answer
      startTransition(() => {
        // Only track DB progress for real (positive ID) challenges
        const isRealChallenge = challenge.id > 0;

        const progressPromise = isRealChallenge
          ? upsertChallengeProgress(challenge.id)
          : Promise.resolve(undefined);

        progressPromise
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            if (mode !== "exam") correctControls.play();
            setStatus("correct");

            const increment = mode === "ielts"
              ? 100 / (challengesList.length * 1.2)
              : 100 / challengesList.length;
            setPercentage((prev) => Math.min(prev + increment, 100));

            if (mode !== "exam") {
              const xpGain = mode === "ielts" ? 20 + (challenge.difficulty ?? 1) * 5 : 10;
              fetch("/api/xp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ xp: xpGain }),
              });
              fetch("/api/streak", { method: "POST" });
            }
          })
          .catch(() => toast.error("Something went wrong."));
      });
    } else {
      // Wrong answer
      setWeaknesses((prev) => [...prev, challenge.type || "general"]);
      startTransition(() => {
        const isRealChallenge = challenge.id > 0;

        const heartPromise = isRealChallenge
          ? reduceHearts(challenge.id)
          : Promise.resolve(undefined);

        heartPromise
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
                ? "Exam Completed 🎉"
                : mode === "ielts"
                ? "IELTS Lesson Complete! 🎓"
                : "Great job! You have completed the lesson."}
            </h1>

            {mode === "ielts" && (
              <p className="text-sm text-muted-foreground max-w-xs">
                Keep practising daily to improve your IELTS band score. Each lesson
                brings you closer to your target!
              </p>
            )}

            <div className="flex items-center gap-x-4 w-full">
              <ResultCard
                variant="points"
                value={mode === "exam" ? 0 : challengesList.length * 5}
              />
              <ResultCard variant="hearts" value={hearts} />
            </div>

            {aiFeedback && <AITutorCard feedback={aiFeedback} />}
          </div>

          <button
            onClick={() => router.push("/learn")}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl shadow block mx-auto"
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

          {/* IELTS loading indicator */}
          {aiLoading && mode === "ielts" && (
            <div className="text-center text-xs text-blue-500 py-1 animate-pulse">
              ✨ Loading AI-generated questions...
            </div>
          )}

          <Header
            hearts={hearts}
            percentage={percentage}
            hasActiveSubscription={!!userSubscription?.isActive}
          />

          <div className="flex-1 flex items-center justify-center">
            <div className="lg:w-[600px] w-full px-6 flex flex-col gap-y-12">

              {/* IELTS mode badge */}
              {mode === "ielts" && (
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    🎯 IELTS MODE
                  </span>
                  {challenge.type === "IELTS_WRITING" && (
                    <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                      AI Evaluated
                    </span>
                  )}
                  {challenge.type === "IELTS_SPEAKING" && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      Speech Recognition
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-lg font-bold text-center">
                {challenge.type === "ASSIST"
                  ? "Select the correct meaning"
                  : challenge.type === "IELTS_READING" || challenge.type === "IELTS_TFNG"
                  ? challenge.question
                  : challenge.question}
              </h1>

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
                passage={challenge.passage}
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