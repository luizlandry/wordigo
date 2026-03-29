// app/payment/success/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { verifyAndActivatePayment } from "@/actions/verify-payment";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  // ✅ If webhook already activated, skip the API call entirely
  const alreadyActivated = searchParams.get("activated") === "true";

  useEffect(() => {
    // Webhook handler already confirmed activation — show success immediately
    if (alreadyActivated) {
      setStatus("success");
      return;
    }

    if (!reference) {
      setStatus("pending");
      return;
    }

    // Fallback: try to verify manually in case webhook had an issue
    startTransition(() => {
      verifyAndActivatePayment(reference).then((result) => {
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("pending");
          setMessage(result.message);
        }
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualVerify = () => {
    if (!reference) return;
    setMessage("");
    startTransition(() => {
      verifyAndActivatePayment(reference).then((result) => {
        if (result.success) {
          setStatus("success");
        } else {
          setStatus("failed");
          setMessage(result.message);
        }
      });
    });
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (status === "loading" || isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-yellow-50 to-white">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-neutral-800">
            Confirming your payment…
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-yellow-50 to-white">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
          <Crown className="w-12 h-12 text-yellow-500" />
        </div>

        <Image src="/mascot.svg" alt="Mascot" width={100} height={100} />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-neutral-800">
            🎉 You&apos;re now Pro!
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Payment confirmed. You now have full access to all IELTS units,
            unlimited hearts, and AI-generated practice questions.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-sm w-full space-y-2">
          <p className="font-bold text-sm text-yellow-700 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Unlocked for you:
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

        <div className="flex gap-3">
          <Button onClick={() => router.push("/learn")} variant="default" size="lg">
            🚀 Start Learning
          </Button>
          <Button onClick={() => router.push("/shop")} variant="secondary">
            Go to Shop
          </Button>
        </div>
      </div>
    );
  }

  // ── Failed ─────────────────────────────────────────────────────────────
  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-red-50 to-white">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-neutral-800">Payment Failed</h1>
          <p className="text-muted-foreground max-w-sm">
            {message || "Your payment could not be confirmed."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/shop")} variant="default">
            Try Again
          </Button>
          {reference && (
            <Button onClick={handleManualVerify} variant="secondary" disabled={isPending}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Pending ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-b from-yellow-50 to-white">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
        <Crown className="w-12 h-12 text-yellow-400" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-neutral-800">
          Payment Processing…
        </h1>
        <p className="text-muted-foreground max-w-sm">
          {message || "Your payment may still be processing. Click below to check."}
        </p>
      </div>
      {reference && (
        <Button
          onClick={handleManualVerify}
          variant="default"
          disabled={isPending}
          size="lg"
        >
          {isPending
            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            : <RefreshCw className="w-4 h-4 mr-2" />
          }
          Check Payment Status
        </Button>
      )}
      <Button onClick={() => router.push("/shop")} variant="ghost" size="sm">
        Back to Shop
      </Button>
    </div>
  );
};

export default PaymentSuccessPage;