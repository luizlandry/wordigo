import { Button } from "@/components/ui/button";
import { Crown, NotebookText } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  isIeltsCourse?: boolean;
  bandTarget?: string;
  isProLocked?: boolean;
};

export const UnitBanner = ({
  title,
  description,
  isIeltsCourse,
  bandTarget,
  isProLocked,
}: Props) => {
  return (
    <div
      className={`w-full rounded-xl p-5 text-white flex items-center justify-between ${
        isProLocked
          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
          : isIeltsCourse
          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
          : "bg-green-500"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          {isProLocked && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" /> PRO
            </span>
          )}
          {isIeltsCourse && bandTarget && !isProLocked && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              🎯 {bandTarget}
            </span>
          )}
        </div>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      {!isProLocked && (
        <Link href="/lesson">
          <Button
            size="lg"
            variant="secondary"
            className="hidden xl:flex border-2 border-b-4 active:border-b-2"
          >
            <NotebookText className="mr-2" />
            Continue
          </Button>
        </Link>
      )}

      {isProLocked && (
        <Link href="/shop">
          <Button
            size="lg"
            variant="default"
            className="hidden xl:flex border-2 border-b-4 active:border-b-2 bg-white text-orange-500 hover:bg-white/90"
          >
            <Crown className="mr-2 w-4 h-4" />
            Upgrade
          </Button>
        </Link>
      )}
    </div>
  );
};