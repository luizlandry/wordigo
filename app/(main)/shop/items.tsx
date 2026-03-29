// app/(main)/shop/items.tsx
"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import Image from "next/image";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Crown, Settings } from "lucide-react";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { useRouter } from "next/navigation";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // ── Refill hearts ──────────────────────────────────────────────────────────
  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) return;
    startTransition(() => {
      refillHearts().catch(() => toast.error("Something went wrong"));
    });
  };

  // ── Upgrade or manage subscription ────────────────────────────────────────
  const onUpgradeOrManage = () => {
    if (hasActiveSubscription) {
      // ✅ Pro users → go to subscription settings
      router.push("/settings");
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <ul className="w-full">

        {/* ── Refill Hearts ──────────────────────────────────────────────── */}
        <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
          <Image src="/heart.svg" alt="Heart" height={60} width={60} />
          <div className="flex-1">
            <p className="text-neutral-700 text-base lg:text-xl font-bold">
              Refill hearts
            </p>
            <p className="text-sm text-muted-foreground">Restore all 5 hearts</p>
          </div>
          <Button
            onClick={onRefillHearts}
            disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
          >
            {hearts === 5 ? (
              "Full"
            ) : (
              <div className="flex items-center gap-1">
                <Image src="/points.svg" alt="Points" height={20} width={20} />
                <p>{POINTS_TO_REFILL}</p>
              </div>
            )}
          </Button>
        </div>

        {/* ── Pro Subscription ───────────────────────────────────────────── */}
        <div className="flex items-center w-full p-4 pt-6 gap-x-4 border-t-2">
          <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />
          <div className="flex-1">
            <p className="text-neutral-700 text-base lg:text-xl font-bold flex items-center gap-2">
              {hasActiveSubscription ? (
                <>
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Pro Active
                </>
              ) : (
                "Wordigo Pro"
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasActiveSubscription
                ? "You have full access to all IELTS content"
                : "Upgrade for unlimited hearts + full IELTS access"}
            </p>
          </div>

          {/* ✅ FIX: Show "Settings" button when Pro, "Upgrade" when not */}
          <Button
            onClick={onUpgradeOrManage}
            disabled={pending}
            variant={hasActiveSubscription ? "ghost" : "super"}
            className={hasActiveSubscription ? "border border-input" : ""}
          >
            {pending ? (
              "Loading..."
            ) : hasActiveSubscription ? (
              <span className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Settings
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Upgrade
              </span>
            )}
          </Button>
        </div>

        {/* ── What Pro includes (only shown when NOT Pro) ────────────────── */}
        {!hasActiveSubscription && (
          <div className="mx-4 mt-2 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs font-bold text-yellow-700 mb-1 flex items-center gap-1">
              <Crown className="w-3 h-3" /> Wordigo Pro includes:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-neutral-600">
              <span>✅ All IELTS units</span>
              <span>✅ Unlimited hearts</span>
              <span>✅ Writing evaluation</span>
              <span>✅ Speaking practice</span>
              <span>✅ Mock exam</span>
              <span>✅ AI questions</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pay with MTN Mobile Money or Orange Money · 2,000 XAF/month
            </p>
          </div>
        )}
      </ul>

      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};