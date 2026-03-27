import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Promo } from "@/components/promo";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";
import { Quests } from "@/components/quests";

type LessonWithCompletion = typeof lessons.$inferSelect & {
  completed?: boolean;
};

const LearnPage = async () => {
  const userProgressData      = await getUserProgress();
  const courseProgressData    = await getCourseProgress();
  const lessonPercentageData  = await getLessonPercentage();
  const unitsData             = await getUnits();
  const userSubscriptionData  = await getUserSubscription();

  const [userProgress, units, courseProgress, lessonPercentage, userSubscription] =
    await Promise.all([
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
      userSubscriptionData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  // Detect if this is the English (IELTS) course
  const isIeltsCourse =
    userProgress.activeCourse.title === "English " ||
    userProgress.activeCourse.imageSrc === "/en.svg";

  return (
    <div className="flex flex-row-reverse gap-4 px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />

        {/* IELTS course info banner */}
        {isIeltsCourse && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <p className="font-bold mb-1">📚 IELTS Preparation Course</p>
            <p>
              Follow the units in order. Units 1–2 are{" "}
              <strong>free</strong> (Band 4–5). Units 3–8 require{" "}
              <strong>Pro</strong> and cover Listening, Writing, Speaking,
              Advanced Reading, and a full Mock Exam (up to Band 9).
            </p>
          </div>
        )}

        {units.length === 0 && (
          <div className="text-center mt-10 text-gray-500">
            No lessons yet. Start learning!
          </div>
        )}

        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              locked={userProgress.points < unit.order * 50}
              lessons={unit.lessons as LessonWithCompletion[]}
              activeLesson={
                courseProgress?.activeLesson?.unitId === unit.id
                  ? ({
                      ...courseProgress.activeLesson,
                      unit,
                    } as typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  : undefined
              }
              activeLessonPercentage={lessonPercentage}
              // Pass IELTS-specific props
              isIeltsCourse={isIeltsCourse}
              isPro={isPro}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;