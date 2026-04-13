import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-Banner";
import { LessonButton } from "./lesson-button";
import { IeltsProBanner } from "@/components/IeltsProBanner";

type LessonWithCompletion = (typeof lessons.$inferSelect) & {
  completed?: boolean;
};
type ActiveLessonWithUnit = (typeof lessons.$inferSelect) & {
  unit: typeof units.$inferSelect;
};

const IELTS_BAND_MAP: Record<number, string> = {
  1: "Band 4–5",
  2: "Band 4–5",
  3: "Band 5–6",
  4: "Band 5–6",
  5: "Band 5–7",
  6: "Band 6–7",
  7: "Band 6–8",
  8: "Band 5–9",
};

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: LessonWithCompletion[];
  activeLesson?: ActiveLessonWithUnit;
  activeLessonPercentage: number;
  locked?: boolean;
  isIeltsCourse?: boolean;
  isPro?: boolean;
};

export const Unit = ({
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
  order,
  isIeltsCourse,
  isPro,
}: Props) => {
  const isProLocked = isIeltsCourse && order > 2 && !isPro;
  const bandTarget = isIeltsCourse
    ? IELTS_BAND_MAP[order] ?? "Band 5–9"
    : undefined;
  const bannerDescription =
    isIeltsCourse && bandTarget
      ? `${description} · Target: ${bandTarget}`
      : description;

  return (
    <>
      <UnitBanner
        title={title}
        description={bannerDescription}
        isIeltsCourse={isIeltsCourse}
        bandTarget={bandTarget}
        isProLocked={isProLocked}
      />

      {isProLocked ? (
        <IeltsProBanner
          unitTitle={title}
          bandTarget={bandTarget ?? "Band 5–9"}
        />
      ) : (
        <div className="flex items-center flex-col relative">
          {lessons.map((lesson, index) => {
            const isCurrent = lesson.id === activeLesson?.id;

            // ✅ A lesson is locked ONLY if it is not completed AND not the current active lesson
            // Completed lessons are NEVER locked — users can always go back to practice them
            const isLocked = !lesson.completed && !isCurrent;

            return (
              <LessonButton
                key={lesson.id}
                id={lesson.id}
                index={index}
                totalCount={lessons.length - 1}
                current={isCurrent}
                locked={isLocked}
                percentage={isCurrent ? activeLessonPercentage : 0}
              />
            );
          })}
        </div>
      )}
    </>
  );
};