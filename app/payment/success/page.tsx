// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, XCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | "pending">("pending");

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const notchpayStatus = searchParams.get("status");
    
    if (notchpayStatus === "complete") {
      setStatus("success");
    } else if (notchpayStatus === "failed") {
      setStatus("failed");
    } else {
      // Auto redirect after 5 seconds if success
      const timer = setTimeout(() => {
        router.push("/learn");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [router, searchParams]);

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-red-50 to-white">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-neutral-800">
            Payment Failed
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Your payment could not be processed. Please try again.
          </p>
        </div>
        <Button onClick={() => router.push("/shop")} variant="default">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-yellow-50 to-white">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
        <Crown className="w-12 h-12 text-yellow-500" />
      </div>

      <Image src="/mascot.svg" alt="Mascot" width={100} height={100} />

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-800">
          {status === "success" ? "🎉 You're now Pro!" : "Processing Your Payment..."}
        </h1>
        <p className="text-muted-foreground max-w-sm">
          {status === "success"
            ? "Your payment was successful. You now have full access to all IELTS units, unlimited hearts, and AI-generated practice questions."
            : "Please wait while we confirm your payment..."}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-sm w-full space-y-2">
        <p className="font-bold text-sm text-yellow-700">✅ Unlocked for you:</p>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>🎯 All 8 IELTS Units (Band 4–9)</li>
          <li>🎧 IELTS Listening (Sections 1–4)</li>
          <li>✍️ IELTS Writing (Task 1 & 2)</li>
          <li>🎤 IELTS Speaking (Parts 1, 2 & 3)</li>
          <li>📖 Advanced Reading + Mock Exam</li>
          <li>❤️ Unlimited Hearts</li>
          <li>🤖 AI-generated practice questions</li>
        </ul>
      </div>

      {status === "success" && (
        <div className="flex gap-3">
          <Button onClick={() => router.push("/learn")} variant="secondary">
            Start Learning
          </Button>
          <Button onClick={() => router.push("/shop")} variant="default">
            Go to Shop
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;