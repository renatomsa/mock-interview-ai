import type { Language } from '@/types'

// Behavioral bank, categorized by competency. Every category has at least 3
// questions so users can pick freely in Training and Simulation can sample
// across distinct categories.
export type BehavioralCategory =
  | 'pressure'
  | 'conflict'
  | 'ownership'
  | 'communication'
  | 'growth'
  | 'collaboration'

export interface BehavioralQuestion {
  id: string
  category: BehavioralCategory
  text: Record<Language, string>
}

export const behavioralBank: BehavioralQuestion[] = [
  // ---- pressure ----
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
    id: 'production-incident',
    category: 'pressure',
    text: {
      en: 'Tell me about a high-pressure production incident you were part of. What was your role, and how did you stay focused?',
      pt: 'Me conte sobre um incidente em produção, de alta pressão, do qual você participou. Qual foi o seu papel e como você manteve o foco?',
    },
  },

  // ---- conflict ----
  {
    id: 'technical-disagreement',
    category: 'conflict',
    text: {
      en: 'Tell me about a time you disagreed with a teammate on a technical approach. How did you reach a decision?',
      pt: 'Me conte sobre uma vez em que você discordou de um colega sobre uma abordagem técnica. Como vocês chegaram a uma decisão?',
    },
  },
  {
    id: 'pushback-on-lead',
    category: 'conflict',
    text: {
      en: 'Describe a time you disagreed with a decision from your manager or lead. How did you handle it?',
      pt: 'Descreva uma vez em que você discordou de uma decisão do seu gestor ou líder. Como você lidou com isso?',
    },
  },
  {
    id: 'code-review-tension',
    category: 'conflict',
    text: {
      en: 'Tell me about a tense disagreement during a code review. How did you resolve it and keep the relationship intact?',
      pt: 'Me conte sobre um desacordo tenso durante um code review. Como você resolveu e preservou a relação com a pessoa?',
    },
  },

  // ---- ownership ----
  {
    id: 'proud-contribution',
    category: 'ownership',
    text: {
      en: "Tell me about a project you're proud of. What was your specific contribution, and what would have failed without you?",
      pt: 'Me fale sobre um projeto do qual você tem orgulho. Qual foi a sua contribuição específica e o que teria falhado sem você?',
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
    id: 'prioritization',
    category: 'ownership',
    text: {
      en: 'How do you decide what to work on when several urgent tasks compete for your time? Give a concrete recent example.',
      pt: 'Como você decide no que trabalhar quando várias tarefas urgentes competem pelo seu tempo? Dê um exemplo concreto recente.',
    },
  },

  // ---- communication ----
  {
    id: 'explain-nontechnical',
    category: 'communication',
    text: {
      en: 'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder. How did you adapt?',
      pt: 'Me conte sobre uma vez em que precisou explicar um conceito técnico complexo para alguém não técnico. Como você se adaptou?',
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
    id: 'giving-feedback',
    category: 'communication',
    text: {
      en: 'Describe a time you had to give difficult feedback to a teammate. How did you approach the conversation?',
      pt: 'Descreva uma vez em que você teve que dar um feedback difícil a um colega. Como você conduziu a conversa?',
    },
  },

  // ---- growth ----
  {
    id: 'mistake-lesson',
    category: 'growth',
    text: {
      en: 'Describe a significant mistake you made on a project. What was the impact, and what did you change afterward?',
      pt: 'Descreva um erro significativo que você cometeu em um projeto. Qual foi o impacto e o que você mudou depois disso?',
    },
  },
  {
    id: 'unclear-requirements',
    category: 'growth',
    text: {
      en: 'Describe a situation where requirements were unclear or changing. How did you make progress despite the ambiguity?',
      pt: 'Descreva uma situação em que os requisitos eram pouco claros ou mudavam. Como você avançou apesar da ambiguidade?',
    },
  },
  {
    id: 'learn-fast',
    category: 'growth',
    text: {
      en: 'Tell me about a time you had to learn a new technology quickly to deliver. How did you go about it?',
      pt: 'Me conte sobre uma vez em que você teve que aprender uma nova tecnologia rapidamente para entregar. Como você fez isso?',
    },
  },

  // ---- collaboration ----
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
    category: 'collaboration',
    text: {
      en: 'Describe a time you took the lead on something without being formally in charge. How did you get others on board?',
      pt: 'Descreva uma vez em que você liderou algo sem estar formalmente no comando. Como você conseguiu o apoio dos outros?',
    },
  },
  {
    id: 'cross-team',
    category: 'collaboration',
    text: {
      en: 'Tell me about a project that required working closely with another team. What made the collaboration work, or not?',
      pt: 'Me conte sobre um projeto que exigiu trabalhar de perto com outra equipe. O que fez a colaboração funcionar, ou não?',
    },
  },
]

const CATEGORIES: BehavioralCategory[] = [
  'pressure',
  'conflict',
  'ownership',
  'communication',
  'growth',
  'collaboration',
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

// Training: categories that have questions, for the subject picker.
export function getBehavioralCategories(): BehavioralCategory[] {
  const present = new Set(behavioralBank.map((q) => q.category))
  return CATEGORIES.filter((c) => present.has(c))
}

// Free selection — list questions in a category (localized).
export function listBehavioral(
  category: BehavioralCategory,
  language: Language
): { id: string; text: string }[] {
  return behavioralBank
    .filter((q) => q.category === category)
    .map((q) => ({ id: q.id, text: q.text[language] }))
}

export function getBehavioralById(id: string, language: Language): string | null {
  const found = behavioralBank.find((q) => q.id === id)
  return found ? found.text[language] : null
}
