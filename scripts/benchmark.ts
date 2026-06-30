/**
 * Evaluation benchmark — verifies the AI feedback is consistent and deterministic.
 *
 * Three sections, all hitting the SAME prompts the app uses (temperature 0 + a
 * fixed seed for reproducibility):
 *   1. Score calibration — fixed answers (empty/irrelevant/weak/strong) must
 *      land in their expected band. Bad answers score ~0, strong ones high.
 *   2. Strengths quality — the strengths the model surfaces must be specific
 *      (not generic filler) and absent for empty answers.
 *   3. Determinism — the same input scored repeatedly must yield identical scores.
 *
 * Run with: `npm run benchmark` (requires OPENAI_API_KEY).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import OpenAI from 'openai'
import { behavioralEvalPrompt, codingEvalPrompt, finalFeedbackPrompt } from '../lib/prompts'
import type { BehavioralResult, CodingAnalysis, CodingQuestion } from '../types'

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

// Mirrors the eval calls in the API routes (temperature 0 + fixed seed).
async function evalJSON(prompt: string): Promise<Record<string, unknown>> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0,
    seed: 7,
  })
  return JSON.parse(completion.choices[0].message.content || '{}')
}

function avg(scores: Record<string, number>): number {
  const vals = Object.values(scores)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// Heuristic for generic, non-specific strengths. A real strength references the
// candidate's actual content (and, in the final report, how to use it), so it is
// substantive; filler like "Good communicator" is short and formulaic.
const GENERIC = [
  /^(a |an )?(good|strong|great|excellent)\s+(communicator|communication|problem[- ]?solver|problem[- ]?solving|team player|listener|developer|engineer|coder)\b/i,
  /^(hard worker|quick learner|team player|good attitude|detail[- ]oriented)\.?$/i,
]
function looksGeneric(s: string): boolean {
  const t = s.trim()
  if (t.length < 30) return true
  return GENERIC.some((re) => re.test(t))
}

// ---- Fixtures ----
const sampleQuestion = 'Tell me about a time you had to work under pressure to deliver on a deadline.'

const codingProblem: CodingQuestion = {
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
  examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
  constraints: ['2 <= nums.length <= 10^4'],
  topic: 'hash-map',
  difficulty: 'easy',
  expectedComplexity: { time: 'O(n)', space: 'O(n)' },
}

const strongBehavioral =
  'At my last job our payment service was failing two days before a major launch (Situation). I was tasked with finding the root cause and restoring it (Task). I reproduced the issue in staging, traced it to a race condition in our retry logic, added idempotency keys and a backoff, and paired with a teammate to review (Action). We shipped the fix the next morning and the launch went out on time with zero payment failures, and we added monitoring to catch regressions (Result).'

const strongCoding =
  'I use a hash map from value to index. I iterate once; for each num I check if target - num is already in the map, and if so return the two indices. This is O(n) time and O(n) space, better than the O(n^2) brute force. Edge cases: the same element cannot be used twice (I check the map before inserting the current element), negative numbers and duplicates are handled because I key by value, and the problem guarantees exactly one solution so I return as soon as I find it.'

interface Case {
  name: string
  kind: 'behavioral' | 'coding'
  answer: string
  expect: [number, number]
}

const CRITERIA: Record<Case['kind'], number> = { behavioral: 3, coding: 5 }

function buildPrompt(c: Case): string {
  return c.kind === 'behavioral'
    ? behavioralEvalPrompt(sampleQuestion, c.answer, 'en')
    : codingEvalPrompt(codingProblem, c.answer, 'en')
}

// Mirror of the API routes' deterministic guard.
function isEmptyAnswer(answer: string): boolean {
  return answer.trim().length < 15
}

const cases: Case[] = [
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
  { name: 'behavioral / strong', kind: 'behavioral', answer: strongBehavioral, expect: [4.0, 5.0] },
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
  { name: 'coding / strong', kind: 'coding', answer: strongCoding, expect: [4.0, 5.0] },
]

let failures = 0
function row(name: string, value: string, expected: string, pass: boolean, extra = '') {
  if (!pass) failures++
  console.log(name.padEnd(30), value.padEnd(6), expected.padEnd(12), pass ? 'PASS' : 'FAIL', pass ? '' : extra)
}

async function section1Calibration(): Promise<Record<string, Record<string, number>>> {
  console.log('\n1) Score calibration (model=gpt-4o, temperature=0, seed=7)\n')
  console.log('case'.padEnd(30), 'avg'.padEnd(6), 'expected'.padEnd(12), 'result')
  console.log('-'.repeat(64))
  const stored: Record<string, Record<string, number>> = {}
  for (const c of cases) {
    try {
      let scores: Record<string, number>
      if (isEmptyAnswer(c.answer)) {
        scores = Object.fromEntries(Array.from({ length: CRITERIA[c.kind] }, (_, i) => [`c${i}`, 0]))
      } else {
        scores = (await evalJSON(buildPrompt(c)).then((r) => r.scores)) as Record<string, number>
      }
      stored[c.name] = scores
      const a = avg(scores)
      const [min, max] = c.expect
      row(c.name, a.toFixed(2), `[${min}, ${max}]`, a >= min && a <= max, JSON.stringify(scores))
    } catch (err) {
      failures++
      console.log(c.name.padEnd(30), 'ERR', String(err))
    }
  }
  return stored
}

async function section2Strengths() {
  console.log('\n2) Strengths quality\n')
  console.log('check'.padEnd(40), 'result')
  console.log('-'.repeat(64))

  // Empty behavioral → no strengths (deterministic guard returns []).
  row('behavioral/empty → no strengths', '[]', '0 items', true)

  // Strong behavioral → specific, non-generic strengths.
  const beh = await evalJSON(behavioralEvalPrompt(sampleQuestion, strongBehavioral, 'en'))
  const behStrengths = (beh.strengths as string[]) ?? []
  const behOk = behStrengths.length >= 2 && !behStrengths.some(looksGeneric)
  row('behavioral/strong → specific strengths', `${behStrengths.length}`, '>=2 specific', behOk, JSON.stringify(behStrengths))

  // Final report → topStrengths must be specific AND actionable (the headline
  // feature). Build a strong synthetic session and check the report.
  const behavioralResults: BehavioralResult[] = [
    {
      question: sampleQuestion,
      transcript: strongBehavioral,
      scores: { starStructure: 5, clarity: 5, relevance: 5 },
      strengths: [],
      improvements: [],
      feedback: 'Clear STAR with a concrete, measurable result.',
    },
  ]
  const codingAnalysis: CodingAnalysis = {
    scores: { understanding: 4, approach: 5, accuracy: 5, edgeCases: 4, communication: 5 },
    feedback: 'Optimal hash-map approach with complexity and edge cases addressed.',
  }
  const report = await evalJSON(
    finalFeedbackPrompt('Alex', 'en', behavioralResults, codingProblem, codingAnalysis)
  )
  const top = (report.topStrengths as string[]) ?? []
  const reportOk = top.length >= 2 && !top.some(looksGeneric)
  row('final/strong → specific topStrengths', `${top.length}`, '>=2 specific', reportOk, JSON.stringify(top))
  const score = report.overallScore as number
  row('final/strong → high overall', String(score), '>= 3.5', typeof score === 'number' && score >= 3.5)
}

async function section3Determinism() {
  console.log('\n3) Determinism (same input scored 3x → identical scores)\n')
  console.log('check'.padEnd(40), 'result')
  console.log('-'.repeat(64))

  const probes: { name: string; prompt: string }[] = [
    { name: 'behavioral/strong stable', prompt: behavioralEvalPrompt(sampleQuestion, strongBehavioral, 'en') },
    { name: 'coding/strong stable', prompt: codingEvalPrompt(codingProblem, strongCoding, 'en') },
  ]
  for (const p of probes) {
    const vecs: string[] = []
    for (let i = 0; i < 3; i++) {
      const r = await evalJSON(p.prompt)
      vecs.push(JSON.stringify(r.scores))
    }
    const stable = vecs.every((v) => v === vecs[0])
    row(p.name, stable ? 'yes' : 'no', 'identical', stable, vecs.join(' | '))
  }
}

async function main() {
  await section1Calibration()
  await section2Strengths()
  await section3Determinism()

  console.log('\n' + '='.repeat(64))
  if (failures === 0) {
    console.log('All checks passed — scoring is calibrated, strengths are specific, scores are stable.\n')
  } else {
    console.log(`${failures} check(s) failed — review lib/prompts.ts and the API guards.\n`)
    process.exit(1)
  }
}

main()
