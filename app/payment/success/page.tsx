"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const PaymentSuccessPage = () => {
  const router = useRouter();

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/learn");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-yellow-50 to-white">

      {/* Success icon */}
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
        <Crown className="w-12 h-12 text-yellow-500" />
      </div>

      {/* Mascot */}
      <Image
        src="/mascot.svg"
        alt="Mascot"
        width={100}
        height={100}
      />

      {/* Message */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-800">
          🎉 You&apos;re now Pro!
        </h1>
        <p className="text-muted-foreground max-w-sm">
          Your payment was successful. You now have full access to all IELTS
          units, unlimited hearts, and AI-generated practice questions.
        </p>
      </div>

      {/* What unlocked */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-sm w-full space-y-2">
        <p className="font-bold text-sm text-yellow-700">
          ✅ Unlocked for you:
        </p>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>🎯 All 8 IELTS Units (Band 4–9)</li>
          <li>🎧 IELTS Listening (Sections 1–4)</li>
          <li>✍️ IELTS Writing (Task 1 &amp; 2)</li>
          <li>🎤 IELTS Speaking (Parts 1, 2 &amp; 3)</li>
          <li>📖 Advanced Reading + Mock Exam</li>
          <li>❤️ Unlimited Hearts</li>
          <li>🤖 AI-generated practice questions</li>
        </ul>
      </div>

      {/* Redirect message */}
      <p className="text-xs text-muted-foreground">
        Redirecting you automatically in 5 seconds...
      </p>

      {/* Manual buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => router.push("/learn")}
          variant="secondary"
          size="lg"
        >
          Start Learning
        </Button>
        <Button
          onClick={() => router.push("/shop")}
          variant="default"
          size="lg"
        >
          Go to Shop
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;