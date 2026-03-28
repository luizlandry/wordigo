// components/promo.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { useState } from "react";
import { PaymentMethodModal } from "./PaymentMethodModal";

export const Promo = () => {
  const [showModal, setShowModal] = useState(false);

  const onUpgrade = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="border-2 rounded-xl p-3 space-y-2">
        <div className="space-y-2">
          <div className="flex items-center gap-x-2">
            <Image
              src="/unlimited.svg"
              alt="Pro"
              height={26}
              width={26}
            />
            <h3 className="font-bold text-lg">Upgrade to Wordigo Pro</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Unlock all IELTS units, unlimited hearts &amp; AI practice!
          </p>
        </div>

        <Button
          onClick={onUpgrade}
          variant="super"
          className="w-full"
          size="lg"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade today
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          MTN &amp; Orange Money · 2,000 XAF/month
        </p>
      </div>

      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};