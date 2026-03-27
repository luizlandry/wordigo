import crypto from "crypto";

const NOTCHPAY_API_URL = "https://api.notchpay.co";
const PUBLIC_KEY = process.env.NOTCHPAY_PUBLIC_KEY!;
const HASH_KEY = process.env.NOTCHPAY_HASH ?? "";

export type NotchPayPlan = {
  name: string;
  amount: number;
  currency: string;
  description: string;
};

export type InitPaymentParams = {
  userId: string;
  email: string;
  plan?: NotchPayPlan;
  callbackUrl: string;
  returnUrl: string;
};

// ── Pro plan definition ────────────────────────────────────────────────────
// Change amount here to set your price in XAF
export const PRO_PLAN: NotchPayPlan = {
  name: "notchpay_pro",
  amount: 3000,
  currency: "XAF",
  description: "Wordigo Pro — Unlimited IELTS access, hearts & AI questions",
};

// ── Initialize a payment session ──────────────────────────────────────────
// Returns the NotchPay checkout URL to redirect the user to
export const initializePayment = async ({
  userId,
  email,
  plan = PRO_PLAN,
  callbackUrl,
  returnUrl,
}: InitPaymentParams) => {
  const reference = `wordigo-${plan.name}-${userId}-${Date.now()}`;

  const response = await fetch(`${NOTCHPAY_API_URL}/payments/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: PUBLIC_KEY,
    },
    body: JSON.stringify({
      email,
      amount: plan.amount,
      currency: plan.currency,
      reference,
      description: plan.description,
      callback: callbackUrl,
      return_url: returnUrl,
      meta: { userId, plan: plan.name },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`NotchPay init failed: ${response.status} — ${err}`);
  }

  const data = await response.json();

  const payment_url =
    data?.transaction?.payment_url ??
    data?.authorization_url ??
    data?.data?.link ??
    null;

  if (!payment_url) {
    throw new Error(`No payment URL returned: ${JSON.stringify(data)}`);
  }

  return { reference, payment_url };
};

// ── Verify webhook signature ───────────────────────────────────────────────
// Returns true if the webhook came from NotchPay (not tampered)
export const verifyWebhookSignature = (
  payload: string,
  signature: string
): boolean => {
  if (!HASH_KEY) {
    console.warn("NOTCHPAY_HASH not set — skipping verification");
    return true;
  }
  const computed = crypto
    .createHmac("sha256", HASH_KEY)
    .update(payload)
    .digest("hex");
  return computed === signature;
};

// ── Verify a payment reference directly with NotchPay API ─────────────────
// Extra security check in webhook handler
export const verifyPayment = async (reference: string) => {
  const response = await fetch(`${NOTCHPAY_API_URL}/payments/${reference}`, {
    headers: { Authorization: PUBLIC_KEY },
  });

  if (!response.ok) {
    throw new Error(`NotchPay verify failed: ${response.status}`);
  }

  const data = await response.json();
  const status = data?.transaction?.status ?? data?.status ?? "unknown";
  const paid = status === "complete" || status === "success";

  return { status, paid };
};

// ── Format XAF currency for display ──────────────────────────────────────
export const formatXAF = (amount: number): string => {
  return `${amount.toLocaleString("fr-CM")} XAF`;
};