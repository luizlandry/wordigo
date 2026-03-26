import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-Banner";
import { LessonButton } from "./lesson-button";
import { IeltsProBanner } from "@/components/IeltsProBanner";

type LessonWithCompletion = (typeof lessons.$inferSelect) & { completed?: boolean };
type ActiveLessonWithUnit = (typeof lessons.$inferSelect) & { unit: typeof units.$inferSelect };

// Map unit order to IELTS band target text
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
  // IELTS-specific
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

  // PRO GATE: IELTS units 3–8 require Pro subscription
  const isProLocked = isIeltsCourse && order > 2 && !isPro;

  // Band target label for IELTS units
  const bandTarget = isIeltsCourse ? IELTS_BAND_MAP[order] ?? "Band 5–9" : undefined;

  // Build banner description: append band info for IELTS
  const bannerDescription = isIeltsCourse && bandTarget
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
        // Show pro upgrade prompt instead of lessons
        <IeltsProBanner unitTitle={title} bandTarget={bandTarget ?? "Band 5–9"} />
      ) : (
        <div className="flex items-center flex-col relative">
          {lessons.map((lesson, index) => {
            const isCurrent = lesson.id === activeLesson?.id;
            const isLocked = !lesson.completed && !isCurrent;

            return (
              <LessonButton
                key={lesson.id}
                id={lesson.id}
                index={index}
                totalCount={lessons.length}
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