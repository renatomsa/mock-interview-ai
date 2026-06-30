# Mock Interview AI

A structured technical interview simulator that evaluates candidates across behavioral and coding dimensions. Built as a class project for Media & Interactions.

---

## What it does

The app has two modes, chosen on the landing page:

- **Simulation** — a full mock interview: three audio-recorded behavioral questions, then one coding challenge, then a synthesized report.
- **Training** — browse subjects (coding topics or behavioral categories) and freely pick the specific questions you want to practice, LeetCode-style, one at a time with immediate feedback after each.

In both modes evaluation works the same way:

1. **Behavioral** — Answer by **audio or text**. Audio is captured via the MediaRecorder API and transcribed by OpenAI Whisper; text answers are evaluated directly. Either way, GPT-4o scores the response on STAR structure, clarity, and relevance.
2. **Coding** — LeetCode-style problems from a curated bank organized by subject, each at least 3 per subject, tagged `easy` or `difficult`. In Training the user picks freely; in Simulation a random problem is served (the user cannot choose). The candidate explains their approach in plain text — graded on the explanation, including edge cases, complexity, and tradeoffs, not on runnable code.

All scores use a **0–5 scale** with an explicit rubric: empty, off-topic, or "I don't know" answers score 0. Evaluation calls run at `temperature: 0` with a fixed `seed` for deterministic, repeatable feedback (the benchmark verifies identical scores across repeated runs). The Simulation's final report synthesizes all scores into an overall rating, a hire verdict, specific strengths (with how to leverage them in interviews), and concrete study recommendations.

No account required. No data persists — all session state lives in `sessionStorage` and is discarded when the tab closes.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript |
| Styles | Tailwind CSS v4 |
| Audio transcription | OpenAI Whisper (`whisper-1`) |
| Evaluation & generation | GPT-4o, GPT-4o-mini |
| Hosting | Vercel (serverless functions) |

All OpenAI calls happen server-side in Next.js route handlers. The API key is never exposed to the client.

---

## Interview flow

```
Landing (mode, name, language)
  └── Behavioral Q1 → record audio → transcript + scores
  └── Behavioral Q2 → record audio → transcript + scores
  └── Behavioral Q3 → record audio → transcript + scores
      └── Transition summary screen
          └── Random coding question (easy or difficult)
              └── Written explanation → scores
                  └── Final feedback report
```

Difficulty: each coding question is `easy` or `difficult`. In Simulation it is random and cannot be chosen; in Training the user selects questions freely.

Languages: Portuguese (PT) and English (EN) — all prompts and UI strings are bilingual.

Theme: light and dark, toggled in the header and persisted in `localStorage` (an inline script applies it before first paint to avoid flashing).

---

## Evaluation benchmark

To verify the AI feedback is trustworthy, a benchmark script runs fixed sample answers through the real prompts and checks three things: **score calibration** (bad answers ~0, strong answers high), **strengths quality** (strong answers yield specific, non-generic strengths; empty answers yield none), and **determinism** (the same input scored 3× yields identical scores).

```bash
npm run benchmark
```

Requires `OPENAI_API_KEY` (read from `.env.local`). It makes a handful of `gpt-4o` calls at `temperature: 0` and exits non-zero if any case falls outside its expected band. Use it after changing prompts in `lib/prompts.ts` to confirm scoring stays calibrated.

---

## Local setup

**Prerequisites:** Node.js 20+, an OpenAI API key.

```bash
git clone https://github.com/renatomsa/mock-interview-ai
cd mock-interview-ai
npm install
```

Create `.env.local` at the project root:

```
OPENAI_API_KEY=sk-...
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Project structure

```
app/
  page.tsx                 # Landing — mode, name, language
  interview/page.tsx       # Simulation state machine
  training/page.tsx        # Training mode — subject picker + per-question practice
  feedback/page.tsx        # Final report
  api/
    behavioral/route.ts    # Whisper transcription + GPT-4o evaluation
    question/route.ts      # Coding question from the bank (AI fallback)
    coding/route.ts        # Single coding-answer evaluation (Training)
    feedback/route.ts      # GPT-4o coding eval + holistic report

components/
  AudioRecorder.tsx        # Record / stop / re-record
  BehavioralQuestion.tsx   # Question card + recorder
  CodingQuestion.tsx       # Problem display + text input
  FeedbackReport.tsx       # Report renderer with score bars
  ScoreBar.tsx             # Shared 0–5 tick-bar score display
  ProgressIndicator.tsx    # Phase tracker
  ThemeToggle.tsx          # Light/dark theme switch
  HomeButton.tsx           # Navbar link back to the landing page

lib/
  openai.ts                # OpenAI client singleton
  prompts.ts               # All prompt templates + shared 0–5 rubric
  questions.ts             # Categorized behavioral question bank
  codingBank.ts            # Curated coding bank by subject (≥3 each) and difficulty
  session.ts               # sessionStorage helpers

scripts/benchmark.ts       # Evaluation calibration benchmark (npm run benchmark)
types/index.ts             # Shared TypeScript types
```

---

## Deployment

The project deploys to Vercel with zero configuration. Push to a connected repository and add `OPENAI_API_KEY` to the project's environment variables in the Vercel dashboard.

```bash
vercel --prod
```

---

## Design notes

The interface uses Instrument Serif for headings, DM Sans for body text, and JetBrains Mono for transcripts and code. All corners are flat (2–4px radius). Score bars render as monospace tick characters (`████░`) rather than gradient fills. No icon libraries — SVGs are written inline where needed.

---

## Team

Built for Media & Interactions, UFPE.
