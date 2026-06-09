'use client'

import AudioRecorder from './AudioRecorder'

interface Props {
  question: string
  questionNumber: number
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

export default function BehavioralQuestion({
  question,
  questionNumber,
  onSubmit,
  isProcessing,
  language,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="border border-[#262626] p-4 md:p-8 flex flex-col">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-sans mb-6">
          Question {questionNumber} of 3
        </span>
        <p className="font-serif text-xl leading-relaxed text-[#F2EFE8]">{question}</p>
        <p className="text-xs text-[#737373] mt-auto pt-8 leading-relaxed">{hints[language]}</p>
      </div>

      <div className="border border-[#262626] p-4 md:p-8 flex flex-col">
        <span className="text-xs tracking-widest uppercase text-[#737373] font-sans mb-6">
          {responseLabel[language]}
        </span>
        <div className="mt-auto">
          {isProcessing ? (
            <span className="font-mono text-sm text-[#737373]">{processingLabel[language]}</span>
          ) : (
            <AudioRecorder onSubmit={onSubmit} disabled={isProcessing} />
          )}
        </div>
      </div>
    </div>
  )
}
