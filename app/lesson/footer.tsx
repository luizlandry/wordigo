// app/lesson/footer.tsx
import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled: boolean;
  lessonId: number;
  correctAnswerText?: string; // ✅ New prop
};

export const Footer = ({
  onClick,
  status,
  disabled,
  lessonId,
  correctAnswerText,
}: Props) => {
  useKey("Enter", onClick, {}, [onClick]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer className={cn(
      "lg:h-[140px] h-[100px] border-t-2",
      status === "correct" && "border-transparent bg-green-100",
      status === "wrong" && "border-transparent bg-rose-100",
    )}>
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {/* Left side - feedback message */}
        <div className="flex-1">
          {status === "correct" && (
            <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
              <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
              Nicely done!
            </div>
          )}

          {status === "wrong" && (
            <div className="text-rose-500 font-bold text-base lg:text-xl flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 lg:h-8 lg:w-8 mr-3" />
                <span>Incorrect — it will appear again later!</span>
              </div>
              {correctAnswerText && (
                <div className="text-green-600 text-sm lg:text-base font-medium bg-white/50 px-3 py-1 rounded-full">
                  ✅ Correct answer: {correctAnswerText}
                </div>
              )}
            </div>
          )}

          {status === "completed" && (
            <Button
              variant="default"
              size={isMobile ? "sm" : "lg"}
              onClick={() => window.location.href = `/lesson/${lessonId}`}
            >
              Practice again
            </Button>
          )}
        </div>

        {/* Right side - action button */}
        <Button
          disabled={disabled}
          className="ml-auto"
          onClick={onClick}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Next"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};