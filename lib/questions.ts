import type { Language } from '@/types'

// Behavioral bank, categorized so the user can practice a specific competency
// in Training mode and so Simulation can sample across distinct categories.
export type BehavioralCategory =
  | 'conflict'
  | 'pressure'
  | 'ownership'
  | 'failure'
  | 'communication'
  | 'collaboration'
  | 'ambiguity'
  | 'leadership'

export interface BehavioralQuestion {
  id: string
  category: BehavioralCategory
  text: Record<Language, string>
}

export const behavioralBank: BehavioralQuestion[] = [
  {
    id: 'tech-challenge',
    category: 'pressure',
    text: {
      en: 'Tell me about the most technically challenging problem you faced recently. What made it hard, and how did you break it down?',
      pt: 'Me conte sobre o problema mais desafiador tecnicamente que você enfrentou recentemente. O que o tornava difícil e como você o decompôs?',
    },
  },
  {
    id: 'deadline-pressure',
    category: 'pressure',
    text: {
      en: 'Describe a time you had to deliver under a tight deadline. What did you choose to cut or defer, and why?',
      pt: 'Descreva uma situação em que teve que entregar sob um prazo apertado. O que você escolheu cortar ou adiar, e por quê?',
    },
  },
  {
    id: 'proud-contribution',
    category: 'ownership',
    text: {
      en: "Tell me about a project you're proud of. What was your specific contribution, and what would have failed without you?",
      pt: 'Me fale sobre um projeto do qual você tem orgulho. Qual foi a sua contribuição específica e o que teria falhado sem você?',
    },
  },
  {
    id: 'technical-disagreement',
    category: 'conflict',
    text: {
      en: 'Tell me about a time you disagreed with a teammate on a technical approach. How did you reach a decision?',
      pt: 'Me conte sobre uma vez em que você discordou de um colega sobre uma abordagem técnica. Como vocês chegaram a uma decisão?',
    },
  },
  {
    id: 'difficult-debug',
    category: 'ownership',
    text: {
      en: "Walk me through a bug whose cause you couldn't find at first. What was your process, and what was the root cause?",
      pt: 'Me guie por um bug cuja causa você não conseguiu encontrar de início. Qual foi seu processo e qual era a causa raiz?',
    },
  },
  {
    id: 'explain-nontechnical',
    category: 'communication',
    text: {
      en: 'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder. How did you adapt?',
      pt: 'Me conte sobre uma vez em que precisou explicar um conceito técnico complexo para alguém não técnico. Como você se adaptou?',
    },
  },
  {
    id: 'mistake-lesson',
    category: 'failure',
    text: {
      en: 'Describe a significant mistake you made on a project. What was the impact, and what did you change afterward?',
      pt: 'Descreva um erro significativo que você cometeu em um projeto. Qual foi o impacto e o que você mudou depois disso?',
    },
  },
  {
    id: 'prioritization',
    category: 'ownership',
    text: {
      en: 'How do you decide what to work on when several urgent tasks compete for your time? Give a concrete recent example.',
      pt: 'Como você decide no que trabalhar quando várias tarefas urgentes competem pelo seu tempo? Dê um exemplo concreto recente.',
    },
  },
  {
    id: 'critical-feedback',
    category: 'communication',
    text: {
      en: 'Tell me about a time you received critical feedback you disagreed with. How did you respond?',
      pt: 'Me conte sobre uma vez em que recebeu um feedback crítico do qual discordava. Como você respondeu?',
    },
  },
  {
    id: 'unclear-requirements',
    category: 'ambiguity',
    text: {
      en: 'Describe a situation where requirements were unclear or changing. How did you make progress despite the ambiguity?',
      pt: 'Descreva uma situação em que os requisitos eram pouco claros ou mudavam. Como você avançou apesar da ambiguidade?',
    },
  },
  {
    id: 'help-teammate',
    category: 'collaboration',
    text: {
      en: 'Tell me about a time you helped a struggling teammate without being asked. What did you do, and what changed?',
      pt: 'Me conte sobre uma vez em que ajudou um colega em dificuldade sem ser solicitado. O que você fez e o que mudou?',
    },
  },
  {
    id: 'drove-initiative',
    category: 'leadership',
    text: {
      en: 'Describe a time you took the lead on something without being formally in charge. How did you get others on board?',
      pt: 'Descreva uma vez em que você liderou algo sem estar formalmente no comando. Como você conseguiu o apoio dos outros?',
    },
  },
]

const CATEGORIES: BehavioralCategory[] = [
  'conflict',
  'pressure',
  'ownership',
  'failure',
  'communication',
  'collaboration',
  'ambiguity',
  'leadership',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Simulation: 3 questions sampled from distinct categories for variety.
export function getRandomQuestions(language: Language): string[] {
  const byCategory = new Map<BehavioralCategory, BehavioralQuestion[]>()
  for (const q of behavioralBank) {
    const list = byCategory.get(q.category) ?? []
    list.push(q)
    byCategory.set(q.category, list)
  }
  const categories = shuffle([...byCategory.keys()]).slice(0, 3)
  const picks =
    categories.length >= 3
      ? categories.map((c) => shuffle(byCategory.get(c)!)[0])
      : shuffle(behavioralBank).slice(0, 3)
  return picks.map((q) => q.text[language])
}

// Training: categories that actually have questions, for the subject picker.
export function getBehavioralCategories(): BehavioralCategory[] {
  const present = new Set(behavioralBank.map((q) => q.category))
  return CATEGORIES.filter((c) => present.has(c))
}

export function getBehavioralByCategory(
  category: BehavioralCategory,
  language: Language
): { id: string; text: string }[] {
  return behavioralBank
    .filter((q) => q.category === category)
    .map((q) => ({ id: q.id, text: q.text[language] }))
}

// Pick one question of a category, avoiding ids already practiced this session.
export function getRandomBehavioral(
  category: BehavioralCategory,
  language: Language,
  usedIds: string[] = []
): { id: string; text: string } | null {
  const pool = getBehavioralByCategory(category, language)
  if (pool.length === 0) return null
  const available = pool.filter((q) => !usedIds.includes(q.id))
  const source = available.length > 0 ? available : pool
  return source[Math.floor(Math.random() * source.length)]
}
