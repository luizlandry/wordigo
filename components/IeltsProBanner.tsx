"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";

type Props = {
  unitTitle: string;
  bandTarget: string;
};

export const IeltsProBanner = ({ unitTitle, bandTarget }: Props) => {
  return (
    <div className="flex flex-col items-center py-8 px-4 text-center space-y-4">
      {/* Lock icon */}
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-yellow-500" />
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-neutral-700">
          🔒 {unitTitle} — PRO
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          This unit targets <strong>IELTS {bandTarget}</strong>. Upgrade to Pro
          to unlock all IELTS units including Listening, Writing, Speaking, and
          full mock exams.
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
          <li>✅ Advanced Reading (Band 6–9)</li>
          <li>✅ AI-generated practice questions</li>
          <li>✅ Full Timed Mock Exam</li>
          <li>✅ Unlimited hearts</li>
        </ul>
      </div>

      {/* Upgrade button */}
      <Button
        asChild
        variant="super"
        size="lg"
        className="w-full max-w-sm"
      >
        <Link href="/shop">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Link>
      </Button>

      <p className="text-xs text-muted-foreground">
        Complete Band 5 content is available for free.
      </p>
    </div>
  );
};