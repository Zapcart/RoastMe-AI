🔥 RoastMe AI – Gen-Z Friendly AI Roasts & Vibe Checks

RoastMe AI is a modern, fun-first AI web app that generates safe, punchy roasts, compliments, and vibe checks with a clean Gen-Z aesthetic.

Built with Next.js App Router, server-verified payments, and a performance-focused UI, this project demonstrates real-world SaaS architecture, not just a demo app.

🌟 Highlights

😈 Soft, Savage & Compliment roast modes

🟢 Green / Red flag vibe checks

⚡ Lightning-fast Next.js App Router setup

🔐 Server-verified payments via Cashfree

🧠 Preview mode before payment unlock

📱 Fully responsive (Mobile / Tablet / Desktop)

🎨 Premium dark UI with modern gradients

🏆 Leaderboard-ready architecture

🛠️ Tech Stack
Frontend

Next.js 14 (App Router)

React (Client Components)

Tailwind CSS

Fetch API

Backend

Next.js API Routes

OpenAI API (roast generation)

Cashfree Payments (Server-side verification)

Other

Environment-based configuration

Secure server validation

Production-ready build setup

📂 Project Structure
RoastMe-AI/
│
├── app/
│   ├── page.js            # Home page
│   ├── roast/page.js      # Roast result page
│   ├── api/
│   │   ├── roast/route.js     # AI roast logic
│   │   └── payment/route.js   # Payment verification
│
├── components/
│   ├── InputBox.jsx
│   ├── RoastCard.jsx
│   ├── ModeSelector.jsx
│   ├── FlexSupport.jsx
│   └── Leaderboard.jsx
│
├── lib/
│   ├── openai.js
│   ├── cashfree.js
│   └── store.js
│
├── styles/
│   └── globals.css
│
├── .env.local
├── package.json
├── next.config.mjs
└── README.md

🧩 App Flow

User enters text (name, bio, message, etc.)

Selects roast mode (Soft / Savage / Compliment / Flag)

Gets free preview

Unlocks full roast via Cashfree payment

Server verifies payment

Full roast is revealed instantly 🎉

🔐 Payments & Security

Payments handled via Cashfree

No client-side unlock hacks

Order verification happens server-side

Preview access without payment

Production-ready payment architecture

⚙️ Local Setup
git clone https://github.com/Zapcart/RoastMe-AI.git
cd RoastMe-AI
npm install
npm run dev


Create .env.local:

OPENAI_API_KEY=your_key_here
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret

🌍 Deployment

Deployed using Vercel

Automatic CI/CD from GitHub

Environment variables configured in Vercel dashboard

🧠 Key Learnings

Next.js App Router & dynamic rendering

Handling useSearchParams correctly

Secure payment verification

Preview → Unlock UX flow

Building a real SaaS-style product

Production-grade deployment practices

📸 Preview

Add screenshots or live demo here
Example:

🌐 Live Demo: Coming Soon

📷 Screenshots: To be added

📬 Contact

👨‍💻 Developer: Zapcart

🌍 GitHub: https://github.com/Zapcart

🇮🇳 Location: India

⚠️ Disclaimer

RoastMe AI is built for entertainment purposes only.
All responses are designed to be safe, non-hateful, and playful.
Please use responsibly.

⭐ If you like this project, don’t forget to star the repository!
