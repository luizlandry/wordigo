"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { useTransition } from "react";
import { createNotchPayUrl } from "@/actions/user-subscription";
import { toast } from "sonner";

export const Promo = () => {
  const [pending, startTransition] = useTransition();

  const onUpgrade = () => {
    startTransition(() => {
      createNotchPayUrl()
        .then((response) => {
          if (response?.data) {
            window.location.href = response.data;
          } else {
            toast.error("Could not get payment link");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="border-2 rounded-xl p-3 space-y-2">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image
            src="/unlimited.svg"
            alt="Pro"
            height={26}
            width={26}
          />
          <h3 className="font-bold text-lg">Upgrade to Pro</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Unlock all IELTS units, unlimited hearts &amp; AI practice!
        </p>
      </div>

      <Button
        onClick={onUpgrade}
        disabled={pending}
        variant="super"
        className="w-full"
        size="lg"
      >
        <Crown className="w-4 h-4 mr-2" />
        {pending ? "Loading..." : "Upgrade today"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        MTN &amp; Orange Money · 2,000 XAF/month
      </p>
    </div>
  );
};