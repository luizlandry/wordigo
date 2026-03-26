import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();

    const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: Date.now().toString(),
        amount,
        currency: "XAF",
        description: "Pro Subscription",
        notify_url: "https://yourdomain.com/api/payment/webhook",
        return_url: "https://yourdomain.com/payment-success",
        channels: "MOBILE_MONEY",
        lang: "en",
        metadata: userId,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      payment_url: data.data.payment_url,
    });

  } catch (error) {
    console.error(error);
    return new NextResponse("Payment error", { status: 500 });
  }
}