'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import BehavioralQuestion from '@/components/BehavioralQuestion'
import CodingQuestion from '@/components/CodingQuestion'
import ScoreBar from '@/components/ScoreBar'
import ThemeToggle from '@/components/ThemeToggle'
import { getCodingTopics, getRandomCoding } from '@/lib/codingBank'
import { getBehavioralCategories, getRandomBehavioral, type BehavioralCategory } from '@/lib/questions'
import type {
  CodingQuestion as CodingQuestionType,
  CodingAnalysis,
  Language,
  Level,
  BehavioralResult,
} from '@/types'

type Discipline = 'coding' | 'behavioral'
type Stage = 'select' | 'practice' | 'result'

const copy = {
  en: {
    title: 'Training',
    subtitle: 'Pick a subject and practice one question at a time.',
    coding: 'Coding',
    behavioral: 'Behavioral',
    chooseSubject: 'Choose a subject',
    back: 'Back to subjects',
    practiceMore: 'Practice more of this subject',
    yourFeedback: 'Your Feedback',
    strengths: 'Strengths',
    improvements: 'Areas to Improve',
    transcript: 'Transcript',
    evaluating: 'Evaluating...',
    scoreLabels: {
      starStructure: 'STAR Structure',
      clarity: 'Clarity',
      relevance: 'Relevance',
      understanding: 'Understanding',
      approach: 'Approach',
      accuracy: 'Accuracy',
      edgeCases: 'Edge Cases',
      communication: 'Communication',
    } as Record<string, string>,
    categories: {
      conflict: 'Conflict',
      pressure: 'Pressure',
      ownership: 'Ownership',
      failure: 'Failure',
      communication: 'Communication',
      collaboration: 'Collaboration',
      ambiguity: 'Ambiguity',
      leadership: 'Leadership',
    } as Record<string, string>,
  },
  pt: {
    title: 'Treino',
    subtitle: 'Escolha um assunto e pratique uma questão por vez.',
    coding: 'Código',
    behavioral: 'Comportamental',
    chooseSubject: 'Escolha um assunto',
    back: 'Voltar aos assuntos',
    practiceMore: 'Praticar mais deste assunto',
    yourFeedback: 'Seu Feedback',
    strengths: 'Pontos Fortes',
    improvements: 'Áreas de Melhoria',
    transcript: 'Transcrição',
    evaluating: 'Avaliando...',
    scoreLabels: {
      starStructure: 'Estrutura STAR',
      clarity: 'Clareza',
      relevance: 'Relevância',
      understanding: 'Compreensão',
      approach: 'Abordagem',
      accuracy: 'Precisão',
      edgeCases: 'Casos Extremos',
      communication: 'Comunicação',
    } as Record<string, string>,
    categories: {
      conflict: 'Conflito',
      pressure: 'Pressão',
      ownership: 'Responsabilidade',
      failure: 'Fracasso',
      communication: 'Comunicação',
      collaboration: 'Colaboração',
      ambiguity: 'Ambiguidade',
      leadership: 'Liderança',
    } as Record<string, string>,
  },
}

export default function Training() {
  const router = useRouter()
  const [session] = useState(() => getSession())
  const [discipline, setDiscipline] = useState<Discipline>('coding')
  const [subject, setSubject] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('select')
  const [isProcessing, setIsProcessing] = useState(false)
  const [usedIds, setUsedIds] = useState<string[]>([])

  const [codingQuestion, setCodingQuestion] = useState<CodingQuestionType | null>(null)
  const [codingResult, setCodingResult] = useState<CodingAnalysis | null>(null)
  const [behavioralText, setBehavioralText] = useState<string>('')
  const [behavioralResult, setBehavioralResult] = useState<BehavioralResult | null>(null)

  useEffect(() => {
    if (!session.level) router.replace('/')
  }, [])

  if (!session.level) return null

  const lang = (session.language ?? 'en') as Language
  const level = session.level as Level
  const t = copy[lang]

  const codingTopics = getCodingTopics(level)
  const behavioralCategories = getBehavioralCategories()

  function loadCoding(topic: string, prevIds: string[] = []) {
    const picked = getRandomCoding(level, lang, prevIds, topic)
    if (!picked) return
    setCodingQuestion(picked.question)
    setCodingResult(null)
    setUsedIds((ids) => [...ids, picked.id])
    setSubject(topic)
    setDiscipline('coding')
    setStage('practice')
  }

  function loadBehavioral(category: BehavioralCategory, prevIds: string[] = []) {
    const picked = getRandomBehavioral(category, lang, prevIds)
    if (!picked) return
    setBehavioralText(picked.text)
    setBehavioralResult(null)
    setUsedIds((ids) => [...ids, picked.id])
    setSubject(category)
    setDiscipline('behavioral')
    setStage('practice')
  }

  async function handleCodingSubmit(answer: string) {
    if (!codingQuestion) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/coding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: codingQuestion, answer, level, language: lang }),
      })
      if (!res.ok) throw new Error('API error')
      const data: CodingAnalysis = await res.json()
      setCodingResult(data)
      setStage('result')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleBehavioralSubmit(blob: Blob) {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('question', behavioralText)
      formData.append('level', level)
      formData.append('language', lang)
      const res = await fetch('/api/behavioral', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setBehavioralResult({
        question: behavioralText,
        transcript: data.transcript,
        scores: data.scores,
        strengths: data.strengths ?? [],
        improvements: data.improvements ?? [],
        feedback: data.feedback,
      })
      setStage('result')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  function practiceMore() {
    if (discipline === 'coding' && subject) loadCoding(subject, usedIds)
    else if (discipline === 'behavioral' && subject) loadBehavioral(subject as BehavioralCategory, usedIds)
  }

  function backToSubjects() {
    setStage('select')
    setSubject(null)
    setCodingQuestion(null)
    setCodingResult(null)
    setBehavioralResult(null)
  }

  function prettyTopic(topic: string) {
    return topic.replace(/-/g, ' ')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="px-4 md:px-8 pt-6 md:pt-8 pb-6 flex items-center justify-between border-b border-border gap-4">
        <span className="text-xs tracking-widest uppercase font-sans text-muted">
          Mock Interview AI — {t.title}
        </span>
        <div className="flex items-center gap-5">
          {stage !== 'select' && (
            <button
              onClick={backToSubjects}
              className="text-xs tracking-widest uppercase font-sans text-muted hover:text-text transition-colors"
            >
              {t.back}
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        {stage === 'select' && (
          <div className="max-w-3xl mx-auto space-y-10 pt-6">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-text">{t.title}</h1>
              <p className="text-sm sm:text-base text-muted">{t.subtitle}</p>
            </div>

            {/* Discipline toggle */}
            <div className="flex gap-3">
              {(['coding', 'behavioral'] as Discipline[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscipline(d)}
                  className={`flex-1 sm:flex-none sm:px-8 border py-3 text-xs tracking-widest uppercase font-sans transition-colors ${
                    discipline === d
                      ? 'border-text text-text'
                      : 'border-border text-muted hover:border-border-strong hover:text-text'
                  }`}
                >
                  {d === 'coding' ? t.coding : t.behavioral}
                </button>
              ))}
            </div>

            {/* Subjects */}
            <div className="space-y-4">
              <span className="text-xs tracking-widest uppercase text-muted font-sans block">
                {t.chooseSubject}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {discipline === 'coding'
                  ? codingTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => loadCoding(topic)}
                        className="border border-border py-4 px-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
                      >
                        {prettyTopic(topic)}
                      </button>
                    ))
                  : behavioralCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => loadBehavioral(cat)}
                        className="border border-border py-4 px-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
                      >
                        {t.categories[cat] ?? cat}
                      </button>
                    ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'practice' && discipline === 'coding' && codingQuestion && (
          <CodingQuestion
            question={codingQuestion}
            onSubmit={handleCodingSubmit}
            isProcessing={isProcessing}
            language={lang}
          />
        )}

        {stage === 'practice' && discipline === 'behavioral' && (
          <BehavioralQuestion
            question={behavioralText}
            questionNumber={1}
            totalQuestions={undefined}
            onSubmit={handleBehavioralSubmit}
            isProcessing={isProcessing}
            language={lang}
          />
        )}

        {stage === 'result' && (
          <div className="max-w-2xl mx-auto space-y-8 pt-4">
            <span className="text-xs tracking-widest uppercase text-muted font-sans block">
              {t.yourFeedback}
            </span>

            {/* Scores */}
            <div className="border border-border p-6 space-y-4">
              {discipline === 'coding' && codingResult && (
                <>
                  <div className="space-y-2">
                    {Object.entries(codingResult.scores).map(([k, v]) => (
                      <ScoreBar key={k} label={t.scoreLabels[k] ?? k} score={v} />
                    ))}
                  </div>
                  <p className="text-sm text-muted leading-relaxed border-t border-border pt-4">
                    {codingResult.feedback}
                  </p>
                </>
              )}
              {discipline === 'behavioral' && behavioralResult && (
                <>
                  <div className="space-y-2">
                    {Object.entries(behavioralResult.scores).map(([k, v]) => (
                      <ScoreBar key={k} label={t.scoreLabels[k] ?? k} score={v} />
                    ))}
                  </div>
                  <p className="text-sm text-muted leading-relaxed border-t border-border pt-4">
                    {behavioralResult.feedback}
                  </p>
                </>
              )}
            </div>

            {/* Strengths / improvements (behavioral) */}
            {discipline === 'behavioral' && behavioralResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {behavioralResult.strengths.length > 0 && (
                  <section className="space-y-3">
                    <span className="text-xs tracking-widest uppercase text-muted font-sans block">
                      {t.strengths}
                    </span>
                    <ul className="space-y-2">
                      {behavioralResult.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-text leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {behavioralResult.improvements.length > 0 && (
                  <section className="space-y-3">
                    <span className="text-xs tracking-widest uppercase text-muted font-sans block">
                      {t.improvements}
                    </span>
                    <ul className="space-y-2">
                      {behavioralResult.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-text leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* Transcript (behavioral) */}
            {discipline === 'behavioral' && behavioralResult?.transcript && (
              <section className="space-y-3">
                <span className="text-xs tracking-widest uppercase text-muted font-sans block">
                  {t.transcript}
                </span>
                <p className="font-mono text-xs sm:text-sm text-muted leading-relaxed border border-border p-4">
                  {behavioralResult.transcript}
                </p>
              </section>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={practiceMore}
                className="bg-text text-background border border-text px-5 py-3 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors"
              >
                {t.practiceMore}
              </button>
              <button
                onClick={backToSubjects}
                className="border border-border px-5 py-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
              >
                {t.back}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
