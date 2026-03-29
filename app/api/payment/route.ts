// app/api/payment/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = body.amount ?? 2000;

    const email =
      user.emailAddresses?.[0]?.emailAddress ?? `${userId}@wordigo.app`;

    const reference = `wordigo-pro-${userId}-${Date.now()}`;

    const response = await fetch(
      "https://api.notchpay.co/payments/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NOTCHPAY_API_KEY!,
        },
        body: JSON.stringify({
          email,
          amount,
          currency: "XAF",
          reference,
          description: "Wordigo Pro — Unlimited IELTS Access + Hearts",
          // callback = server-to-server webhook (works in production)
          callback: absoluteUrl("/api/payment/webhook"),
          // ✅ FIXED: return_url goes through webhook GET handler to activate subscription
          return_url: absoluteUrl("/api/payment/webhook"),
          channels: ["MTN_MONEY", "ORANGE_MONEY"],
          meta: {
            userId,
            plan: "pro",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NotchPay error:", errorText);
      return new NextResponse("Payment initialization failed", { status: 500 });
    }

    const data = await response.json();

    const paymentUrl =
      data?.transaction?.payment_url ??
      data?.authorization_url ??
      data?.data?.link;

    if (!paymentUrl) {
      console.error("NotchPay full response:", JSON.stringify(data));
      return new NextResponse("No payment URL in response", { status: 500 });
    }

    return NextResponse.json({ payment_url: paymentUrl, reference });
  } catch (error) {
    console.error("Payment route error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}