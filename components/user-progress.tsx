import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { InfinityIcon } from "lucide-react";
import { courses } from "@/db/schema";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  streak: number | null; // ✅ FIX 1: Added missing prop type
};

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
  streak, // ✅ FIX 2: Destructured from props
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            src="/points.svg"
            height={28}
            width={28}
            alt="Points"
            className="mr-2"
          />
          {points}
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-rose-500">
          <Image
            src="/heart.svg"
            height={28}
            width={28}
            alt="Hearts"
            className="mr-2"
          />
          {/* ✅ BONUS FIX: "w-4vstroke-[3]" → "w-4 stroke-[3]" (space was missing) */}
          {hasActiveSubscription
            ? <InfinityIcon className="h-4 w-4 stroke-3" />
            : hearts}
        </Button>
      </Link>

      {/* ✅ Now works: streak is properly received as a prop */}
      <span className="text-orange-500 font-bold">
        🔥 {streak}
      </span>
    </div>
  );
};
