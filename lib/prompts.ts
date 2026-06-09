import type { Language, Level, BehavioralResult, CodingQuestion, CodingAnalysis } from '@/types'

export function behavioralEvalPrompt(
  question: string,
  transcript: string,
  level: Level,
  language: Language
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  return `You are a senior technical interviewer evaluating a candidate's behavioral interview response. Respond in ${lang}.

Question asked: ${question}
Candidate level: ${level}
Transcript (from audio): ${transcript}

Evaluate this response on:
1. STAR structure — did they provide Situation, Task, Action, Result?
2. Clarity — was the response clear and organized?
3. Relevance — did they actually answer the question?

Return ONLY valid JSON with no markdown:
{
  "scores": {
    "starStructure": <integer 1-5>,
    "clarity": <integer 1-5>,
    "relevance": <integer 1-5>
  },
  "strengths": ["<string>", "<string>"],
  "improvements": ["<string>", "<string>"],
  "feedback": "<2-3 sentence coaching note>"
}`
}

export function codingQuestionPrompt(
  level: Level,
  language: Language,
  usedTopics: string[] = []
): string {
  const difficultyMap = { junior: 'easy', mid: 'medium', senior: 'hard' }
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  const avoid =
    usedTopics.length > 0
      ? `Avoid these topics already used: ${usedTopics.join(', ')}.`
      : ''
  return `You are a technical interviewer. Generate a ${difficultyMap[level]} difficulty algorithm or data structure problem, similar to LeetCode ${difficultyMap[level]} problems. Write the problem in ${lang}. ${avoid}

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
  level: Level,
  language: Language
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  return `You are a technical interviewer evaluating a candidate's explanation of their solution. Respond in ${lang}.

Problem: ${question.title}
${question.description}
Expected complexity — Time: ${question.expectedComplexity.time}, Space: ${question.expectedComplexity.space}
Candidate level: ${level}

Candidate's explanation:
${answer}

Evaluate on:
1. Problem understanding — did they restate or clarify the problem?
2. Approach quality — is it correct? Do they mention tradeoffs vs brute force?
3. Technical accuracy — is the described solution actually correct?
4. Edge cases — did they consider any?
5. Communication — was the explanation clear and structured?

Return ONLY valid JSON with no markdown:
{
  "scores": {
    "understanding": <integer 1-5>,
    "approach": <integer 1-5>,
    "accuracy": <integer 1-5>,
    "edgeCases": <integer 1-5>,
    "communication": <integer 1-5>
  },
  "feedback": "<coaching paragraph>"
}`
}

export function finalFeedbackPrompt(
  candidateName: string,
  level: Level,
  language: Language,
  behavioralResults: BehavioralResult[],
  codingQuestion: CodingQuestion,
  codingAnalysis: CodingAnalysis
): string {
  const lang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English'
  const behavioralSummary = behavioralResults
    .map(
      (r, i) =>
        `Q${i + 1}: "${r.question}"\nSTAR: ${r.scores.starStructure}/5, Clarity: ${r.scores.clarity}/5, Relevance: ${r.scores.relevance}/5\nFeedback: ${r.feedback}`
    )
    .join('\n\n')
  const codingAvg = (
    Object.values(codingAnalysis.scores).reduce((a, b) => a + b, 0) / 5
  ).toFixed(1)

  return `You are a senior engineering manager providing post-interview feedback. Respond in ${lang}.

Candidate: ${candidateName}, ${level} level

Behavioral results (3 questions, scored 1-5):
${behavioralSummary}

Coding problem: ${codingQuestion.title}
Coding average score: ${codingAvg}/5
Coding feedback: ${codingAnalysis.feedback}

Write a comprehensive, honest, and constructive feedback report. Weight the overall score 40% behavioral, 60% coding.

Return ONLY valid JSON with no markdown:
{
  "overallScore": <number 1.0-5.0 with one decimal>,
  "verdict": "<Strong hire|Hire with reservations|Needs more preparation>",
  "behavioralSummary": "<2-3 sentence summary of behavioral performance>",
  "codingSummary": "<2-3 sentence summary of coding performance>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "topImprovements": ["<area 1>", "<area 2>", "<area 3>"],
  "studyRecommendations": ["<topic 1>", "<topic 2>", "<topic 3>"],
  "finalNote": "<Personal, encouraging 2-3 sentence closing message addressed to ${candidateName}>"
}`
}
