# Mock Interview AI

A structured technical interview simulator that evaluates candidates across behavioral and coding dimensions. Built as a class project for Media & Interactions.

---

## What it does

The app has two modes, chosen on the landing page:

- **Simulation** — a full mock interview: three audio-recorded behavioral questions, then one coding challenge, then a synthesized report.
- **Training** — pick a subject (a coding topic or a behavioral category) and practice questions one at a time, with immediate feedback after each, and a "practice more of this subject" loop.

In both modes evaluation works the same way:

1. **Behavioral** — Audio-recorded answers. The browser captures speech via the MediaRecorder API, OpenAI Whisper transcribes it, and GPT-4o scores the response on STAR structure, clarity, and relevance.
2. **Coding** — A LeetCode-style problem served from a curated, level-calibrated bank (with AI generation as a fallback). The candidate explains their approach in plain text — they are graded on the explanation, including edge cases, complexity, and tradeoffs, not on runnable code.

All scores use a **0–5 scale** with an explicit rubric: empty, off-topic, or "I don't know" answers score 0. Evaluation calls run at `temperature: 0` for deterministic, repeatable feedback. The Simulation's final report synthesizes all scores into an overall rating, a hire verdict, specific strengths (with how to leverage them in interviews), and concrete study recommendations.

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
Landing (name, level, language)
  └── Behavioral Q1 → record audio → transcript + scores
  └── Behavioral Q2 → record audio → transcript + scores
  └── Behavioral Q3 → record audio → transcript + scores
      └── Transition summary screen
          └── Coding question (generated for selected level)
              └── Written explanation → scores
                  └── Final feedback report
```

Levels: `junior` / `mid` / `senior` — difficulty calibrates both the coding question and evaluation expectations.

Languages: Portuguese (PT) and English (EN) — all prompts and UI strings are bilingual.

Theme: light and dark, toggled in the header and persisted in `localStorage` (an inline script applies it before first paint to avoid flashing).

---

## Evaluation benchmark

To verify the AI feedback is consistent with the rubric, a benchmark script runs fixed sample answers (empty, irrelevant, weak, strong) through the real prompts and asserts each lands in its expected score band — bad answers must score ~0, strong answers must score high.

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
  page.tsx                 # Landing — mode, name, level, language
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

lib/
  openai.ts                # OpenAI client singleton
  prompts.ts               # All prompt templates + shared 0–5 rubric
  questions.ts             # Categorized behavioral question bank
  codingBank.ts            # Curated, level/topic coding question bank
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
