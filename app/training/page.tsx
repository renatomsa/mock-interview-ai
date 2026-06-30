'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import BehavioralQuestion from '@/components/BehavioralQuestion'
import CodingQuestion from '@/components/CodingQuestion'
import ScoreBar from '@/components/ScoreBar'
import ThemeToggle from '@/components/ThemeToggle'
import HomeButton from '@/components/HomeButton'
import { getCodingTopics, listCoding, getCodingById } from '@/lib/codingBank'
import {
  getBehavioralCategories,
  listBehavioral,
  getBehavioralById,
  type BehavioralCategory,
} from '@/lib/questions'
import type {
  CodingQuestion as CodingQuestionType,
  CodingAnalysis,
  Difficulty,
  Language,
  BehavioralResult,
} from '@/types'

type Discipline = 'coding' | 'behavioral'
type Stage = 'select' | 'list' | 'practice' | 'result'

const copy = {
  en: {
    title: 'Training',
    subtitle: 'Browse subjects and pick the questions you want to practice.',
    coding: 'Coding',
    behavioral: 'Behavioral',
    chooseSubject: 'Choose a subject',
    chooseQuestion: 'Choose a question',
    backSubjects: 'Subjects',
    backQuestions: 'Questions',
    practiceAnother: 'Practice another question',
    yourFeedback: 'Your Feedback',
    strengths: 'Strengths',
    improvements: 'Areas to Improve',
    transcript: 'Transcript',
    easy: 'Easy',
    difficult: 'Difficult',
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
      pressure: 'Pressure',
      conflict: 'Conflict',
      ownership: 'Ownership',
      communication: 'Communication',
      growth: 'Growth',
      collaboration: 'Collaboration',
    } as Record<string, string>,
  },
  pt: {
    title: 'Treino',
    subtitle: 'Navegue pelos assuntos e escolha as questões que quer praticar.',
    coding: 'Código',
    behavioral: 'Comportamental',
    chooseSubject: 'Escolha um assunto',
    chooseQuestion: 'Escolha uma questão',
    backSubjects: 'Assuntos',
    backQuestions: 'Questões',
    practiceAnother: 'Praticar outra questão',
    yourFeedback: 'Seu Feedback',
    strengths: 'Pontos Fortes',
    improvements: 'Áreas de Melhoria',
    transcript: 'Transcrição',
    easy: 'Fácil',
    difficult: 'Difícil',
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
      pressure: 'Pressão',
      conflict: 'Conflito',
      ownership: 'Responsabilidade',
      communication: 'Comunicação',
      growth: 'Crescimento',
      collaboration: 'Colaboração',
    } as Record<string, string>,
  },
}

interface ListItem {
  id: string
  label: string
  difficulty?: Difficulty
}

export default function Training() {
  const router = useRouter()
  const [session] = useState(() => getSession())
  const [discipline, setDiscipline] = useState<Discipline>('coding')
  const [subject, setSubject] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('select')
  const [items, setItems] = useState<ListItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [codingQuestion, setCodingQuestion] = useState<CodingQuestionType | null>(null)
  const [codingResult, setCodingResult] = useState<CodingAnalysis | null>(null)
  const [behavioralText, setBehavioralText] = useState<string>('')
  const [behavioralResult, setBehavioralResult] = useState<BehavioralResult | null>(null)

  useEffect(() => {
    if (!session.language) router.replace('/')
  }, [])

  if (!session.language) return null

  const lang = (session.language ?? 'en') as Language
  const t = copy[lang]

  const codingTopics = getCodingTopics()
  const behavioralCategories = getBehavioralCategories()

  function prettyTopic(topic: string) {
    return topic.replace(/-/g, ' ')
  }

  // Subject selected → show the list of questions in it (free selection).
  function openSubject(d: Discipline, subj: string) {
    setDiscipline(d)
    setSubject(subj)
    if (d === 'coding') {
      setItems(listCoding(subj, lang).map((q) => ({ id: q.id, label: q.title, difficulty: q.difficulty })))
    } else {
      setItems(listBehavioral(subj as BehavioralCategory, lang).map((q) => ({ id: q.id, label: q.text })))
    }
    setStage('list')
  }

  // Question selected → load it for practice.
  function openQuestion(id: string) {
    setCodingResult(null)
    setBehavioralResult(null)
    if (discipline === 'coding') {
      const question = getCodingById(id, lang)
      if (!question) return
      setCodingQuestion(question)
    } else {
      const text = getBehavioralById(id, lang)
      if (!text) return
      setBehavioralText(text)
    }
    setStage('practice')
  }

  async function handleCodingSubmit(answer: string) {
    if (!codingQuestion) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/coding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: codingQuestion, answer, language: lang }),
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

  async function handleBehavioralSubmit(answer: { audio?: Blob; text?: string }) {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      if (answer.audio) formData.append('audio', answer.audio, 'recording.webm')
      if (answer.text != null) formData.append('text', answer.text)
      formData.append('question', behavioralText)
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

  function backToQuestions() {
    setStage('list')
    setCodingQuestion(null)
    setCodingResult(null)
    setBehavioralResult(null)
  }

  function backToSubjects() {
    setStage('select')
    setSubject(null)
    setItems([])
    setCodingQuestion(null)
    setCodingResult(null)
    setBehavioralResult(null)
  }

  const subjectLabel =
    subject && discipline === 'behavioral' ? t.categories[subject] ?? subject : subject ? prettyTopic(subject) : ''

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="px-4 md:px-8 pt-6 md:pt-8 pb-6 flex items-center justify-between border-b border-border gap-4">
        <span className="text-xs tracking-widest uppercase font-sans text-muted">
          Mock Interview AI — {t.title}
        </span>
        <div className="flex items-center gap-5">
          {(stage === 'practice' || stage === 'result') && (
            <button
              onClick={backToQuestions}
              className="text-xs tracking-widest uppercase font-sans text-muted hover:text-text transition-colors"
            >
              {t.backQuestions}
            </button>
          )}
          {stage !== 'select' && (
            <button
              onClick={backToSubjects}
              className="text-xs tracking-widest uppercase font-sans text-muted hover:text-text transition-colors"
            >
              {t.backSubjects}
            </button>
          )}
          <HomeButton language={lang} />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        {/* ---- Subject selection ---- */}
        {stage === 'select' && (
          <div className="max-w-3xl mx-auto space-y-10 pt-6">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-text">{t.title}</h1>
              <p className="text-sm sm:text-base text-muted">{t.subtitle}</p>
            </div>

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

            <div className="space-y-4">
              <span className="text-xs tracking-widest uppercase text-muted font-sans block">
                {t.chooseSubject}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {discipline === 'coding'
                  ? codingTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => openSubject('coding', topic)}
                        className="border border-border py-4 px-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
                      >
                        {prettyTopic(topic)}
                      </button>
                    ))
                  : behavioralCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => openSubject('behavioral', cat)}
                        className="border border-border py-4 px-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
                      >
                        {t.categories[cat] ?? cat}
                      </button>
                    ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- Question list (free selection) ---- */}
        {stage === 'list' && (
          <div className="max-w-2xl mx-auto space-y-6 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-text capitalize">{subjectLabel}</h2>
              <span className="text-xs tracking-widest uppercase text-muted font-sans">
                {t.chooseQuestion}
              </span>
            </div>
            <ul className="divide-y divide-border border border-border">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => openQuestion(item.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-surface transition-colors group"
                  >
                    <span className="text-sm sm:text-base text-text group-hover:text-text leading-relaxed">
                      {item.label}
                    </span>
                    {item.difficulty && (
                      <span
                        className={`shrink-0 text-xs tracking-widest uppercase font-sans ${
                          item.difficulty === 'easy' ? 'text-muted' : 'text-accent'
                        }`}
                      >
                        {item.difficulty === 'easy' ? t.easy : t.difficult}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- Practice ---- */}
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
            onSubmitAudio={(blob) => handleBehavioralSubmit({ audio: blob })}
            onSubmitText={(text) => handleBehavioralSubmit({ text })}
            isProcessing={isProcessing}
            language={lang}
          />
        )}

        {/* ---- Result ---- */}
        {stage === 'result' && (
          <div className="max-w-2xl mx-auto space-y-8 pt-4">
            <span className="text-xs tracking-widest uppercase text-muted font-sans block">
              {t.yourFeedback}
            </span>

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
                onClick={backToQuestions}
                className="bg-text text-background border border-text px-5 py-3 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors"
              >
                {t.practiceAnother}
              </button>
              <button
                onClick={backToSubjects}
                className="border border-border px-5 py-3 text-xs tracking-widest uppercase font-sans text-muted hover:border-border-strong hover:text-text transition-colors"
              >
                {t.backSubjects}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
