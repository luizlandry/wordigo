"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useTransition } from "react";
import { createNotchPayUrl } from "@/actions/user-subscription";
import { toast } from "sonner";

type Props = {
  unitTitle: string;
  bandTarget: string;
};

export const IeltsProBanner = ({ unitTitle, bandTarget }: Props) => {
  const [pending, startTransition] = useTransition();

  const onUpgrade = () => {
    startTransition(() => {
      createNotchPayUrl()
        .then((response) => {
          if (response?.data) {
            window.location.href = response.data;
          } else {
            toast.error("Could not get payment link. Try again.");
          }
        })
        .catch(() => toast.error("Payment initialization failed."));
    });
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 text-center space-y-4">

      {/* Lock icon */}
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-yellow-500" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-neutral-700">
          🔒 {unitTitle} — PRO Only
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          This unit targets{" "}
          <strong className="text-neutral-700">IELTS {bandTarget}</strong>.
          Upgrade to Pro to unlock all IELTS units including Listening,
          Writing, Speaking, and full mock exams.
        </p>
      </div>

      {/* What Pro unlocks */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left max-w-sm w-full space-y-2">
        <p className="font-bold text-sm text-yellow-700 flex items-center gap-1">
          <Crown className="w-4 h-4" /> Pro unlocks:
        </p>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>✅ IELTS Listening (Sections 1–4)</li>
          <li>✅ IELTS Writing (Task 1 &amp; Task 2)</li>
          <li>✅ IELTS Speaking (Parts 1, 2 &amp; 3)</li>
          <li>✅ Advanced Reading (Band 6–7)</li>
          <li>✅ Advanced Writing (Band 6–8)</li>
          <li>✅ Full Timed Mock Exam (Band 5–9)</li>
          <li>✅ AI-generated practice questions</li>
          <li>✅ Unlimited hearts</li>
        </ul>
      </div>

      {/* Price info */}
      <div className="text-sm text-muted-foreground">
        <p>💳 Pay with <strong>MTN Mobile Money</strong> or <strong>Orange Money</strong></p>
        <p className="font-bold text-neutral-700 mt-1">2,000 XAF / month</p>
      </div>

      {/* Upgrade button */}
      <Button
        onClick={onUpgrade}
        disabled={pending}
        variant="super"
        size="lg"
        className="w-full max-w-sm"
      >
        <Crown className="w-4 h-4 mr-2" />
        {pending ? "Redirecting to payment..." : "Upgrade to Pro"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Free units: Band 4–5 content is available for everyone.
      </p>
    </div>
  );
};