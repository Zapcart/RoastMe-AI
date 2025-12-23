import { NextResponse } from "next/server";
import { createOrder, verifyOrder } from "../../../lib/cashfree";
import { addLeaderboardEntry, getLeaderboard } from "../../../lib/store";

function getSafeName(name) {
  const safe = (name || "Anonymous").slice(0, 50).trim();
  return safe || "Anonymous";
}

export async function GET() {
  return NextResponse.json({ leaderboard: getLeaderboard() });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount || 0);
    const name = getSafeName(body.name);
    const email = body.email || "user@roastme.ai";
    const phone = body.phone || body.mobile || "9999999999";
    const envMode = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

    // Temporary debug (does not log secrets)
    console.log("[Cashfree] env:", {
      mode: envMode,
      hasAppId: Boolean(process.env.CASHFREE_APP_ID),
      hasSecret: Boolean(process.env.CASHFREE_SECRET_KEY)
    });

    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Cashfree keys not configured", detail: "Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { orderId, paymentSessionId } = await createOrder({
      amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone
    });

    return NextResponse.json({
      orderId,
      paymentSessionId,
      mode: envMode
    });
  } catch (error) {
    console.error("Cashfree create order error:", error?.data || error || {});
    return NextResponse.json(
      {
        error: "Could not start payment. Try again.",
        detail: error?.message || "Unknown error from Cashfree",
        cashfree: error?.data || null
      },
      { status: error?.status || 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;
    const name = getSafeName(body.name);
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const verification = await verifyOrder(orderId);
    if (!verification.paid) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    addLeaderboardEntry({
      id: orderId,
      name,
      amount: verification.amount,
      timestamp: Date.now()
    });

    return NextResponse.json({
      ok: true,
      accessToken: orderId
    });
  } catch (error) {
    console.error("Cashfree verify error:", error);
    return NextResponse.json(
      { error: "Could not verify payment. Try again." },
      { status: 500 }
    );
  }
}


