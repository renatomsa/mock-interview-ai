import type { Language, BehavioralResult, CodingQuestion, CodingAnalysis, Difficulty } from '@/types'

// Shared rubric anchor used across every evaluation prompt so that scoring is
// consistent and deterministic. Each criterion is scored 0-5 with the SAME
// meaning per band. The model is told explicitly to give 0 for bad answers
// instead of inflating scores out of politeness.
const SCORING_RUBRIC = `Scoring scale (apply STRICTLY, integers 0-5, the same meaning for every criterion):
- 0 = Absent, empty, off-topic, "I don't know", or no real attempt for this criterion.
- 1 = Severely deficient: barely touches the criterion, mostly wrong or incoherent.
- 2 = Weak: some relevant content but major gaps or errors.
- 3 = Adequate: meets the baseline expectation, with notable room to improve.
- 4 = Strong: clearly above baseline, minor gaps only.
- 5 = Excellent: thorough, precise, nothing meaningful missing.

Calibrate in BOTH directions:
- Do NOT inflate: a vague, generic, irrelevant, or empty answer MUST receive 0 or 1 — never a 3 out of politeness. If the answer is empty or has no substantive content, every score is 0.
- Do NOT under-score: when the answer is correct and addresses a criterion thoroughly, it MUST receive 4 or 5. A complete, well-reasoned answer should land in the 4-5 range overall. Reserving 5 only for "perfection" is wrong — award it when the criterion is fully met.`

export function behavioralEvalPrompt(
  question: string,
  transcript: string,
  language: Language
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  return `You are a senior technical interviewer evaluating a candidate's behavioral interview response. Respond in ${lang}.

Question asked: ${question}
Transcript (from audio): ${transcript}

${SCORING_RUBRIC}

Evaluate this response on:
1. STAR structure — did they provide Situation, Task, Action, Result? (0 = none of STAR present; 5 = all four clearly present)
2. Clarity — was the response clear, organized, and easy to follow?
3. Relevance — did they actually answer the question that was asked?

The "strengths" must be SPECIFIC and tied to what the candidate actually said — quote or paraphrase their concrete example. Never generic ("good communication"); say WHAT was good and WHY. The "improvements" must be concrete and actionable.

Return ONLY valid JSON with no markdown:
{
  "scores": {
    "starStructure": <integer 0-5>,
    "clarity": <integer 0-5>,
    "relevance": <integer 0-5>
  },
  "strengths": ["<specific strength grounded in their answer>", "<specific strength>"],
  "improvements": ["<concrete, actionable improvement>", "<concrete improvement>"],
  "feedback": "<2-3 sentence coaching note referencing their actual answer>"
}`
}

export function codingQuestionPrompt(
  language: Language,
  difficulty: Difficulty = 'difficult',
  usedTopics: string[] = []
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  const leetLevel = difficulty === 'easy' ? 'easy' : 'medium/hard'
  const avoid =
    usedTopics.length > 0
      ? `Avoid these topics already used: ${usedTopics.join(', ')}.`
      : ''
  return `You are a technical interviewer. Generate a ${difficulty} algorithm or data structure problem, similar to LeetCode ${leetLevel} problems. Write the problem in ${lang}. ${avoid}

The candidate will explain their solution in plain text — no code execution required. Make the problem self-contained and unambiguous.

Return ONLY valid JSON with no markdown:
{
  "title": "<problem title>",
  "description": "<clear problem statement>",
  "examples": [
    {"input": "<example input>", "output": "<expected output>", "explanation": "<brief explanation>"}
  ],
  "constraints": ["<constraint 1>", "<constraint 2>"],
  "topic": "<arrays|strings|trees|graphs|dynamic-programming|hash-map|two-pointers|sorting|stack|queue>",
  "expectedComplexity": {"time": "<e.g. O(n)>", "space": "<e.g. O(1)>"}
}`
}

export function codingEvalPrompt(
  question: CodingQuestion,
  answer: string,
  language: Language
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  const difficultyNote = question.difficulty
    ? `This is a ${question.difficulty} problem — calibrate expectations accordingly.`
    : ''
  return `You are a technical interviewer evaluating a candidate's WRITTEN EXPLANATION of their solution. Respond in ${lang}.

IMPORTANT: The candidate is NOT asked to write or run code. They are evaluated on the QUALITY OF THEIR EXPLANATION — including whether they discuss edge cases, time/space complexity, and tradeoffs, even when the problem statement did not explicitly ask for them, because that is what a real interviewer expects.

Score each criterion INDEPENDENTLY — do not let a weakness in one dimension drag down an unrelated one. For example: a correct brute-force solution earns a high "accuracy" score (it is correct) and a fair "understanding" score, even if the candidate never mentions complexity or edge cases — those omissions should lower ONLY the relevant criteria ("approach" for not optimizing, "edgeCases" for not discussing edge cases). Conversely, when the candidate explicitly addresses a criterion well (e.g. lists concrete edge cases, states correct complexity, compares against brute force), that criterion MUST score 4-5.

Problem: ${question.title}
${question.description}
Expected complexity — Time: ${question.expectedComplexity.time}, Space: ${question.expectedComplexity.space}
${difficultyNote}

Candidate's explanation:
${answer}

${SCORING_RUBRIC}

Evaluate on:
1. Problem understanding — did they restate or clarify the problem and its constraints?
2. Approach quality — is the approach correct and reasonable? Do they compare it against a brute-force baseline and justify tradeoffs?
3. Technical accuracy — is the described solution actually correct, including the stated complexity?
4. Edge cases — did they explicitly identify and handle edge cases (empty input, duplicates, overflow, boundaries)?
5. Communication — was the explanation clear, structured, and easy to follow?

Return ONLY valid JSON with no markdown:
{
  "scores": {
    "understanding": <integer 0-5>,
    "approach": <integer 0-5>,
    "accuracy": <integer 0-5>,
    "edgeCases": <integer 0-5>,
    "communication": <integer 0-5>
  },
  "feedback": "<coaching paragraph referencing what they did and did not address>"
}`
}

export function finalFeedbackPrompt(
  candidateName: string,
  language: Language,
  behavioralResults: BehavioralResult[],
  codingQuestion: CodingQuestion,
  codingAnalysis: CodingAnalysis
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  const behavioralSummary = behavioralResults
    .map(
      (r, i) =>
        `Q${i + 1}: "${r.question}"\nSTAR: ${r.scores.starStructure}/5, Clarity: ${r.scores.clarity}/5, Relevance: ${r.scores.relevance}/5\nTranscript excerpt: ${r.transcript.slice(0, 400)}\nFeedback: ${r.feedback}`
    )
    .join('\n\n')
  const codingAvg = (
    Object.values(codingAnalysis.scores).reduce((a, b) => a + b, 0) / 5
  ).toFixed(1)

  return `You are a senior engineering manager providing post-interview feedback. Respond in ${lang}.

Candidate: ${candidateName}

Behavioral results (3 questions, scored 0-5):
${behavioralSummary}

Coding problem: ${codingQuestion.title}${codingQuestion.difficulty ? ` (${codingQuestion.difficulty})` : ''}
Coding average score: ${codingAvg}/5
Coding feedback: ${codingAnalysis.feedback}

Write a comprehensive, honest, and constructive feedback report. Weight the overall score 40% behavioral, 60% coding, on a 0.0-5.0 scale. A genuinely poor performance should receive a low score (below 2.0) — do not inflate.

The "topStrengths" are the most important part. Each MUST be:
- SPECIFIC — grounded in something the candidate actually said or did in THIS interview (reference the concrete example or the coding approach). Never generic filler like "good communicator" or "strong problem solver" on its own.
- ACTIONABLE in interviews — for each strength, explain in the same sentence HOW the candidate can deliberately use it to their advantage in a real interview (e.g. "lead with this story when asked about conflict because...").
If the candidate showed few real strengths, return fewer items rather than inventing generic ones.

The "topImprovements" and "studyRecommendations" must be concrete and tied to the gaps observed.

Return ONLY valid JSON with no markdown:
{
  "overallScore": <number 0.0-5.0 with one decimal>,
  "verdict": "<Strong hire|Hire with reservations|Needs more preparation>",
  "behavioralSummary": "<2-3 sentence summary of behavioral performance>",
  "codingSummary": "<2-3 sentence summary of coding performance>",
  "topStrengths": ["<specific strength + how to leverage it in interviews>", "<...>", "<...>"],
  "topImprovements": ["<concrete area 1>", "<area 2>", "<area 3>"],
  "studyRecommendations": ["<topic 1>", "<topic 2>", "<topic 3>"],
  "finalNote": "<Personal, encouraging 2-3 sentence closing message addressed to ${candidateName}>"
}`
}
