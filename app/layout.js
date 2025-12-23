import "../styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://roastme.ai"),
  title: "RoastMe AI | Gen-Z friendly roasts, flags, and compliments",
  description:
    "RoastMe AI crafts playful roasts, vibe checks, and compliments that stay safe, short, and shareable. Server-verified payments via Cashfree. For entertainment only.",
  keywords: [
    "AI roast",
    "Gen-Z roast",
    "funny AI",
    "green flag red flag",
    "AI compliment",
    "safe roast",
    "Cashfree checkout",
    "viral AI app"
  ],
  openGraph: {
    title: "RoastMe AI | Safe, funny roasts and vibe checks",
    description:
      "Pick Soft, Savage, Compliment, or Flag and get a punchy, safe response. Payments verified server-side with Cashfree.",
    url: "https://roastme.ai",
    siteName: "RoastMe AI",
    images: [
      {
        url: "https://roastme.ai/og.jpg",
        width: 1200,
        height: 630,
        alt: "RoastMe AI preview card"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMe AI | Safe, funny roasts and vibe checks",
    description:
      "Punchy, safe roasts and vibe checks with server-verified payments via Cashfree.",
    images: ["https://roastme.ai/og.jpg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-brand-dark text-white">
      <body className="min-h-screen bg-gradient-to-b from-black via-brand-dark to-black text-white antialiased">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
