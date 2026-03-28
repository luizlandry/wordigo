// components/PaymentMethodModal.tsx
"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Crown, Smartphone } from "lucide-react";
import { createNotchPayUrl } from "@/actions/user-subscription";
import { toast } from "sonner";
import Image from "next/image";

type PaymentMethod = "mtn" | "orange" | "all";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentMethodModal = ({ isOpen, onClose, onSuccess }: PaymentMethodModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn");
  const [pending, startTransition] = useTransition();

  const handlePayment = () => {
    startTransition(() => {
      createNotchPayUrl(paymentMethod)
        .then((response) => {
          if (response?.data) {
            window.location.href = response.data;
          } else {
            toast.error("Could not get payment link");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Payment initialization failed. Try again.");
        });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Choose Payment Method
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Upgrade to Wordigo Pro - 2,000 XAF/month
            </p>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            className="space-y-3"
          >
            {/* MTN Mobile Money */}
            <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="mtn" id="mtn" />
              <Label htmlFor="mtn" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-yellow-600">MTN</span>
                </div>
                <div>
                  <p className="font-semibold">MTN Mobile Money</p>
                  <p className="text-sm text-muted-foreground">Pay with MTN Mobile Money</p>
                </div>
              </Label>
            </div>

            {/* Orange Money */}
            <div className="flex items-center space-x-6 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="orange" id="orange" />
              <Label htmlFor="orange" className="flex items-center gap-6 cursor-pointer flex-1">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600">ORANGE</span>
                </div>
                <div>
                  <p className="font-semibold">Orange Money</p>
                  <p className="text-sm text-muted-foreground">Pay with Orange Money</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handlePayment}
            disabled={pending}
            className="w-full"
            size="lg"
            variant="super"
          >
            {pending ? (
              "Processing..."
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Pay 2,000 XAF
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to NotchPay to complete your payment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};