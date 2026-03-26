import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-Banner";
import { LessonButton } from "./lesson-button";

type LessonWithCompletion = (typeof lessons.$inferSelect) & { completed?: boolean };
type ActiveLessonWithUnit = (typeof lessons.$inferSelect) & { unit: typeof units.$inferSelect };

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: LessonWithCompletion[];
  activeLesson?: ActiveLessonWithUnit;
  activeLessonPercentage: number;
  locked?: boolean;
};

export const Unit = ({
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />

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
    </>
  );
};