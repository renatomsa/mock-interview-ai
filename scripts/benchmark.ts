/**
 * Evaluation benchmark — verifies the AI scoring is consistent with the rubric.
 *
 * It runs fixed sample answers (empty, irrelevant, weak, mid, strong) through
 * the SAME prompts the app uses, with temperature 0, and asserts each lands in
 * the expected score band. Bad answers MUST score ~0; strong answers MUST score
 * high. Run with: `npm run benchmark` (requires OPENAI_API_KEY).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import OpenAI from 'openai'
import { behavioralEvalPrompt, codingEvalPrompt } from '../lib/prompts'
import type { CodingQuestion } from '../types'

// Minimal .env.local loader (Next loads it for the app, not for scripts).
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}
loadEnv()

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Add it to .env.local or export it.')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function avg(scores: Record<string, number>): number {
  const vals = Object.values(scores)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

async function evalJSON(prompt: string): Promise<{ scores: Record<string, number> }> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0,
  })
  return JSON.parse(completion.choices[0].message.content || '{}')
}

interface Case {
  name: string
  kind: 'behavioral' | 'coding'
  // Raw candidate answer/transcript — also used to apply the same deterministic
  // empty-answer guard the API routes use, so the benchmark tests the real app
  // contract (empty/near-empty input scores 0 without a model call).
  answer: string
  // Expected average-score band [min, max] on the 0-5 scale.
  expect: [number, number]
}

const CRITERIA: Record<Case['kind'], number> = { behavioral: 3, coding: 5 }

function buildPrompt(c: Case): string {
  return c.kind === 'behavioral'
    ? behavioralEvalPrompt(sampleQuestion, c.answer, 'mid', 'en')
    : codingEvalPrompt(codingProblem, c.answer, 'junior', 'en')
}

// Mirror of the API routes' deterministic guard.
function isEmptyAnswer(answer: string): boolean {
  return answer.trim().length < 15
}

const sampleQuestion = 'Tell me about a time you had to work under pressure to deliver on a deadline.'

const codingProblem: CodingQuestion = {
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
  examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
  constraints: ['2 <= nums.length <= 10^4'],
  topic: 'hash-map',
  expectedComplexity: { time: 'O(n)', space: 'O(n)' },
}

const cases: Case[] = [
  // ---- Behavioral ----
  { name: 'behavioral / empty', kind: 'behavioral', answer: '', expect: [0, 0.5] },
  {
    name: 'behavioral / irrelevant',
    kind: 'behavioral',
    answer: 'I really like pizza and my favorite color is blue.',
    expect: [0, 1.0],
  },
  {
    name: 'behavioral / weak',
    kind: 'behavioral',
    answer:
      'Once we had a tight deadline to ship a feature before a client demo. I stayed late a couple of nights and pushed through to finish my part. It was stressful but we delivered on time and the client was happy.',
    expect: [1.0, 3.5],
  },
  {
    name: 'behavioral / strong',
    kind: 'behavioral',
    answer:
      'At my last job our payment service was failing two days before a major launch (Situation). I was tasked with finding the root cause and restoring it (Task). I reproduced the issue in staging, traced it to a race condition in our retry logic, added idempotency keys and a backoff, and paired with a teammate to review (Action). We shipped the fix the next morning and the launch went out on time with zero payment failures, and we added monitoring to catch regressions (Result).',
    expect: [4.0, 5.0],
  },
  // ---- Coding ----
  { name: 'coding / empty', kind: 'coding', answer: '', expect: [0, 0.5] },
  {
    name: 'coding / irrelevant',
    kind: 'coding',
    answer: "I don't know how to solve this one.",
    expect: [0, 1.0],
  },
  {
    name: 'coding / weak',
    kind: 'coding',
    answer:
      'I would use two nested loops to check every pair of numbers until I find the pair that adds up to the target, then return their indices.',
    expect: [1.0, 3.5],
  },
  {
    name: 'coding / strong',
    kind: 'coding',
    answer:
      'I use a hash map from value to index. I iterate once; for each num I check if target - num is already in the map, and if so return the two indices. This is O(n) time and O(n) space, better than the O(n^2) brute force. Edge cases: the same element cannot be used twice (I check the map before inserting the current element), negative numbers and duplicates are handled because I key by value, and the problem guarantees exactly one solution so I return as soon as I find it.',
    expect: [4.0, 5.0],
  },
]

async function main() {
  let failures = 0
  console.log('\nEvaluation benchmark (model=gpt-4o, temperature=0)\n')
  console.log('case'.padEnd(28), 'avg', 'expected', 'result')
  console.log('-'.repeat(60))

  for (const c of cases) {
    try {
      let scores: Record<string, number>
      if (isEmptyAnswer(c.answer)) {
        // Deterministic guard (matches the API routes): no model call.
        scores = Object.fromEntries(Array.from({ length: CRITERIA[c.kind] }, (_, i) => [`c${i}`, 0]))
      } else {
        scores = (await evalJSON(buildPrompt(c))).scores
      }
      const a = avg(scores)
      const [min, max] = c.expect
      const pass = a >= min && a <= max
      if (!pass) failures++
      console.log(
        c.name.padEnd(28),
        a.toFixed(2),
        `[${min}, ${max}]`.padEnd(10),
        pass ? 'PASS' : 'FAIL',
        pass ? '' : JSON.stringify(scores)
      )
    } catch (err) {
      failures++
      console.log(c.name.padEnd(28), 'ERR', '', String(err))
    }
  }

  console.log('-'.repeat(60))
  if (failures === 0) {
    console.log('\nAll cases passed — scoring is calibrated to the rubric.\n')
  } else {
    console.log(`\n${failures} case(s) failed — review prompts/rubric in lib/prompts.ts.\n`)
    process.exit(1)
  }
}

main()
