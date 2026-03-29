// app/(main)/settings/cancel-button.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cancelSubscription } from '@/actions/cancel-subscription';

export const CancelSubscriptionButton = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    startTransition(() => {
      cancelSubscription()
        .then(() => {
          toast.success("Subscription cancelled. You keep access until your period ends.");
          router.push("/shop");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <div className="space-y-2">
      {confirmed && (
        <p className="text-xs text-red-600 font-semibold">
          Are you sure? Click again to confirm cancellation.
        </p>
      )}
      <Button
        onClick={handleCancel}
        disabled={pending}
        variant="primaryoutline"
        className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full"
        size="sm"
      >
        {pending
          ? "Cancelling…"
          : confirmed
          ? "Yes, cancel my subscription"
          : "Cancel subscription"}
      </Button>
    </div>
  );
};