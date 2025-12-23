import { NextResponse } from "next/server";
import { generateRoast } from "../../../lib/openai";
import { verifyOrder } from "../../../lib/cashfree";

export async function POST(request) {
  try {
    const body = await request.json();
    const text = (body.text || "").trim();
    const mode = body.mode || "soft";
    const accessToken = body.accessToken || request.headers.get("x-roast-access");
    const preview = Boolean(body.preview);
    const isDev = process.env.NODE_ENV === "development";

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 800) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    if (!preview && !isDev) {
      if (!accessToken) {
        return NextResponse.json({ error: "Payment required" }, { status: 402 });
      }
      const verification = await verifyOrder(accessToken);
      if (!verification.paid) {
        return NextResponse.json({ error: "Payment not verified" }, { status: 402 });
      }
    }

    let message;
    try {
      message = await generateRoast({ text, mode, preview });
    } catch (err) {
      // If OpenAI quota is exhausted, fall back to a local mock for demos/dev.
      const isQuota =
        err?.status === 429 ||
        err?.response?.status === 429 ||
        err?.message?.toLowerCase?.().includes("quota");
      if (isQuota) {
        console.warn("OpenAI quota hit; returning mock roast for demo/dev.");
        message =
          mode === "compliment"
            ? "Mock compliment: Certified main-character energy. Go flex."
            : mode === "flag"
            ? "Mock flag check: 🚦 Mostly green with a tiny amber—communicate and you’re good."
            : mode === "soft"
            ? "Mock soft roast: You’re the human equivalent of ‘typing…’ forever, and we love you for it."
            : "Mock savage roast: You’re the group chat’s ‘seen by everyone, replied by no one.’";
      } else {
        throw err;
      }
    }
    return NextResponse.json({ message, preview });
  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json(
      {
        error: "Could not generate roast right now.",
        detail: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}


