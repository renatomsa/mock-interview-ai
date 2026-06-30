'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, saveSession } from '@/lib/session'
import BehavioralQuestion from '@/components/BehavioralQuestion'
import CodingQuestion from '@/components/CodingQuestion'
import ProgressIndicator from '@/components/ProgressIndicator'
import ThemeToggle from '@/components/ThemeToggle'
import type { InterviewPhase, BehavioralResult, CodingQuestion as CodingQuestionType } from '@/types'

const transitionCopy = {
  en: {
    label: 'Behavioral complete',
    heading: 'Good work. Now for the coding challenge.',
    body: "You'll receive one algorithm problem. Explain your approach, the data structures you'd use, any tradeoffs, and edge cases to consider. You do not need to write working code.",
    cta: 'Continue',
  },
  pt: {
    label: 'Comportamental concluído',
    heading: 'Bom trabalho. Agora o desafio de programação.',
    body: 'Você receberá um problema de algoritmo. Explique sua abordagem, as estruturas de dados que usaria, os trade-offs e os casos extremos a considerar. Você não precisa escrever código funcional.',
    cta: 'Continuar',
  },
}

export default function Interview() {
  const router = useRouter()
  const [session, setSession] = useState(() => getSession())
  const [phase, setPhase] = useState<InterviewPhase>('behavioral')
  const [behavioralIndex, setBehavioralIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [codingQuestion, setCodingQuestion] = useState<CodingQuestionType | null>(null)

  useEffect(() => {
    if (!session.candidateName || !session.level || !session.behavioralQuestions?.length) {
      router.replace('/')
    }
  }, [])

  async function handleBehavioralSubmit(blob: Blob) {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('question', session.behavioralQuestions![behavioralIndex])
      formData.append('level', session.level!)
      formData.append('language', session.language!)

      const res = await fetch('/api/behavioral', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      const result: BehavioralResult = {
        question: session.behavioralQuestions![behavioralIndex],
        transcript: data.transcript,
        scores: data.scores,
        strengths: data.strengths ?? [],
        improvements: data.improvements ?? [],
        feedback: data.feedback,
      }

      const updatedResults = [...(session.behavioralResults ?? []), result]
      const updated = { ...session, behavioralResults: updatedResults }
      saveSession(updated)
      setSession(updated)

      if (behavioralIndex < 2) {
        setBehavioralIndex((i) => i + 1)
      } else {
        setPhase('transition')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleProceedToCoding() {
    setPhase('coding')
    setIsProcessing(true)
    try {
      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: session.level, language: session.language }),
      })
      if (!res.ok) throw new Error('API error')
      const question: CodingQuestionType = await res.json()
      setCodingQuestion(question)
      const updated = { ...session, codingQuestion: question }
      saveSession(updated)
      setSession(updated)
    } catch {
      alert('Something went wrong generating the coding question. Please try again.')
      setPhase('transition')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleCodingSubmit(answer: string) {
    const updated = { ...session, codingAnswer: answer }
    saveSession(updated)
    router.push('/feedback')
  }

  if (!session.candidateName) return null

  const lang = session.language ?? 'en'
  const tc = transitionCopy[lang]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="px-4 md:px-8 pt-6 md:pt-8 pb-6 flex items-center justify-between border-b border-border">
        <span className="text-xs tracking-widest uppercase font-sans text-muted">
          Mock Interview AI
        </span>
        <div className="flex items-center gap-5">
          <ProgressIndicator phase={phase} behavioralIndex={behavioralIndex} />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        {phase === 'behavioral' && (
          <BehavioralQuestion
            question={session.behavioralQuestions![behavioralIndex]}
            questionNumber={behavioralIndex + 1}
            onSubmit={handleBehavioralSubmit}
            isProcessing={isProcessing}
            language={lang}
          />
        )}

        {phase === 'transition' && (
          <div className="max-w-lg mx-auto pt-16 space-y-8">
            <span className="text-xs tracking-widest uppercase text-muted font-sans">
              {tc.label}
            </span>
            <h2 className="font-serif text-2xl text-text leading-snug">{tc.heading}</h2>
            <p className="text-sm text-muted leading-relaxed">{tc.body}</p>
            <button
              onClick={handleProceedToCoding}
              className="flex items-center gap-2 bg-text text-background border border-text px-6 py-3 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors"
            >
              {tc.cta}
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" />
              </svg>
            </button>
          </div>
        )}

        {phase === 'coding' && !codingQuestion && (
          <div className="flex items-center justify-center h-64">
            <span className="font-mono text-sm text-muted">Generating problem...</span>
          </div>
        )}

        {phase === 'coding' && codingQuestion && (
          <CodingQuestion
            question={codingQuestion}
            onSubmit={handleCodingSubmit}
            isProcessing={isProcessing}
            language={lang}
          />
        )}
      </div>
    </main>
  )
}
