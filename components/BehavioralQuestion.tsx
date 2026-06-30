'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'

interface Props {
  question: string
  questionNumber: number
  totalQuestions?: number
  onSubmitAudio: (blob: Blob) => void
  onSubmitText: (text: string) => void
  isProcessing: boolean
  language: 'pt' | 'en'
}

type InputMode = 'audio' | 'text'

const hints = {
  en: 'Take your time. Structure your answer around the situation, your actions, and the outcome.',
  pt: 'Leve o tempo que precisar. Estruture sua resposta em torno da situação, suas ações e o resultado.',
}

const labels = {
  en: {
    response: 'Your Response',
    processing: 'Processing...',
    audio: 'Audio',
    text: 'Text',
    placeholder: 'Type your answer. Structure it around the situation, your actions, and the result.',
    submit: 'Submit',
  },
  pt: {
    response: 'Sua Resposta',
    processing: 'Processando...',
    audio: 'Áudio',
    text: 'Texto',
    placeholder: 'Digite sua resposta. Estruture em torno da situação, suas ações e o resultado.',
    submit: 'Enviar',
  },
}

const questionLabel = (n: number, total: number | undefined, lang: 'pt' | 'en') => {
  if (!total) return lang === 'pt' ? 'Pergunta' : 'Question'
  return lang === 'pt' ? `Pergunta ${n} de ${total}` : `Question ${n} of ${total}`
}

export default function BehavioralQuestion({
  question,
  questionNumber,
  totalQuestions = 3,
  onSubmitAudio,
  onSubmitText,
  isProcessing,
  language,
}: Props) {
  const [mode, setMode] = useState<InputMode>('audio')
  const [text, setText] = useState('')
  const t = labels[language]

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
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-xs tracking-widest uppercase text-muted font-sans">
            {t.response}
          </span>
          {/* Audio / Text input toggle */}
          <div className="flex gap-4">
            {(['audio', 'text'] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={isProcessing}
                className={`text-xs tracking-widest uppercase font-sans transition-colors disabled:opacity-40 ${
                  mode === m ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {m === 'audio' ? t.audio : t.text}
              </button>
            ))}
          </div>
        </div>

        {isProcessing ? (
          <div className="mt-auto">
            <span className="font-mono text-sm text-muted">{t.processing}</span>
          </div>
        ) : mode === 'audio' ? (
          <div className="mt-auto">
            <AudioRecorder onSubmit={onSubmitAudio} disabled={isProcessing} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 min-h-40 bg-transparent border border-border p-4 text-sm sm:text-base text-text placeholder:text-muted resize-none focus:outline-none focus:border-border-strong transition-colors leading-relaxed font-sans"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => text.trim() && onSubmitText(text)}
                disabled={!text.trim()}
                className="flex items-center gap-2 bg-text text-background border border-text px-5 py-2.5 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.submit}
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
