# Mock Interview AI

A structured technical interview simulator that evaluates candidates across behavioral and coding dimensions. Built as a class project for Media & Interactions.

---

## What it does

Candidates complete a two-phase interview:

1. **Behavioral** — Three audio-recorded questions. The browser captures speech via the MediaRecorder API, OpenAI Whisper transcribes it, and GPT-4o scores the response on STAR structure, clarity, and relevance.
2. **Coding** — One LeetCode-style problem generated at the candidate's level. The candidate explains their approach in plain text; GPT-4o evaluates understanding, problem-solving process, and edge-case awareness.

After both phases, a final report synthesizes all scores into an overall rating, a hire verdict, and concrete study recommendations.

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
  page.tsx                 # Landing — name, level, language
  interview/page.tsx       # Interview state machine
  feedback/page.tsx        # Final report
  api/
    behavioral/route.ts    # Whisper transcription + GPT-4o evaluation
    question/route.ts      # GPT-4o-mini coding question generation
    feedback/route.ts      # GPT-4o coding eval + holistic report

components/
  AudioRecorder.tsx        # Record / stop / re-record
  BehavioralQuestion.tsx   # Question card + recorder
  CodingQuestion.tsx       # Problem display + text input
  FeedbackReport.tsx       # Report renderer with score bars
  ProgressIndicator.tsx    # Phase tracker

lib/
  openai.ts                # OpenAI client singleton
  prompts.ts               # All prompt templates
  questions.ts             # Behavioral question bank (8 questions, 3 drawn randomly)
  session.ts               # sessionStorage helpers

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
