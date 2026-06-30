'use client'

import AudioRecorder from './AudioRecorder'

interface Props {
  question: string
  questionNumber: number
  totalQuestions?: number
  onSubmit: (blob: Blob) => void
  isProcessing: boolean
  language: 'pt' | 'en'
}

const hints = {
  en: 'Take your time. Structure your answer around the situation, your actions, and the outcome.',
  pt: 'Leve o tempo que precisar. Estruture sua resposta em torno da situação, suas ações e o resultado.',
}

const responseLabel = { en: 'Your Response', pt: 'Sua Resposta' }
const processingLabel = { en: 'Processing...', pt: 'Processando...' }
const questionLabel = (n: number, total: number | undefined, lang: 'pt' | 'en') => {
  if (!total) return lang === 'pt' ? 'Pergunta' : 'Question'
  return lang === 'pt' ? `Pergunta ${n} de ${total}` : `Question ${n} of ${total}`
}

export default function BehavioralQuestion({
  question,
  questionNumber,
  totalQuestions = 3,
  onSubmit,
  isProcessing,
  language,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="border border-border p-4 md:p-8 flex flex-col">
        <span className="text-xs tracking-widest uppercase text-muted font-sans mb-6">
          {questionLabel(questionNumber, totalQuestions, language)}
        </span>
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-text">{question}</p>
        <p className="text-xs sm:text-sm text-muted mt-auto pt-8 leading-relaxed">{hints[language]}</p>
      </div>

      <div className="border border-border p-4 md:p-8 flex flex-col">
        <span className="text-xs tracking-widest uppercase text-muted font-sans mb-6">
          {responseLabel[language]}
        </span>
        <div className="mt-auto">
          {isProcessing ? (
            <span className="font-mono text-sm text-muted">{processingLabel[language]}</span>
          ) : (
            <AudioRecorder onSubmit={onSubmit} disabled={isProcessing} />
          )}
        </div>
      </div>
    </div>
  )
}
