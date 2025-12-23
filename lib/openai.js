import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateRoast({ text, mode, preview = false }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const prompts = {
    soft:
      "Soft Roast: Playful teasing, kind but witty, short and shareable. Avoid appearance, identity, and trauma. Keep it under 60 words.",
    savage:
      "Savage Roast: Brutal but safe for work, clever, no personal attacks on appearance, identity, race, religion, or trauma. Keep it under 60 words.",
    compliment:
      "Compliment: Hype them up, main-character energy, funny if possible. Keep it under 60 words.",
    flag:
      "Green / Red Flag: Judge the vibes only, playful verdict with emoji. No identity or appearance takes. Keep it under 60 words."
  };

  const systemPrompt = [
    "You are RoastMe AI, a Gen-Z internet voice that roasts or hypes without bullying.",
    "Rules:",
    "- Never attack appearance, race, gender, orientation, religion, disability, or trauma.",
    "- Keep it short, punchy, and screenshot-friendly.",
    "- Add emoji only if it enhances the vibe.",
    "- Stay fun, do not be hateful."
  ].join("\n");

  const userPrompt = [
    prompts[mode] || prompts.soft,
    "Input text:",
    text.trim()
  ].join("\n");

  const completion = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: preview
          ? `${userPrompt}\nRespond with a teaser preview only (max 25 words).`
          : userPrompt
      }
    ]
  });

  const message =
    completion.output_text ||
    completion.content?.[0]?.text ||
    "Could not craft a response right now. Try again.";

  return message.trim();
}


