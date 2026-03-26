"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BandScore } from "./BandScore";
import { FeedbackCard } from "./FeedbackCard";

type Props = {
  open: boolean;
  onClose: () => void;
  result: {
    band: number;
    feedback: string;
    aiFeedback: string;
  } | null;
};

export const WritingResultModal = ({
  open,
  onClose,
  result,
}: Props) => {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-6 text-center">
        <h2 className="text-xl font-bold">
          Your IELTS Result
        </h2>

        <BandScore band={result.band} />

        <FeedbackCard
          band={result.band}
          feedback={result.feedback}
          aiFeedback={result.aiFeedback}
        />
      </DialogContent>
    </Dialog>
  );
};