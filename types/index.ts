export type Level = 'junior' | 'mid' | 'senior'
export type Language = 'pt' | 'en'
export type InterviewPhase = 'behavioral' | 'transition' | 'coding' | 'done'

export interface BehavioralScores {
  starStructure: number
  clarity: number
  relevance: number
}

export interface BehavioralResult {
  question: string
  transcript: string
  scores: BehavioralScores
  strengths: string[]
  improvements: string[]
  feedback: string
}

export interface CodingQuestion {
  title: string
  description: string
  examples: Array<{ input: string; output: string; explanation?: string }>
  constraints: string[]
  topic: string
  expectedComplexity: { time: string; space: string }
}

export interface CodingScores {
  understanding: number
  approach: number
  accuracy: number
  edgeCases: number
  communication: number
}

export interface CodingAnalysis {
  scores: CodingScores
  feedback: string
}

export interface InterviewSession {
  candidateName: string
  level: Level
  language: Language
  behavioralQuestions: string[]
  behavioralResults: BehavioralResult[]
  codingQuestion: CodingQuestion | null
  codingAnswer: string
  codingAnalysis: CodingAnalysis | null
}

export interface FeedbackResponse {
  codingAnalysis: CodingAnalysis
  overallScore: number
  verdict: 'Strong hire' | 'Hire with reservations' | 'Needs more preparation'
  behavioralSummary: string
  codingSummary: string
  topStrengths: string[]
  topImprovements: string[]
  studyRecommendations: string[]
  finalNote: string
}
