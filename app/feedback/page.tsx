'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, clearSession } from '@/lib/session'
import FeedbackReport from '@/components/FeedbackReport'
import type { FeedbackResponse, InterviewSession } from '@/types'

export default function Feedback() {
  const router = useRouter()
  const [session] = useState(() => getSession())
  const [report, setReport] = useState<FeedbackResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!session.candidateName || !session.codingAnswer || !session.codingQuestion) {
      router.replace('/')
      return
    }
    generateReport()
  }, [])

  async function generateReport() {
    setError(false)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      })
      if (!res.ok) throw new Error('API error')
      const data: FeedbackResponse = await res.json()
      setReport(data)
    } catch {
      setError(true)
    }
  }

  function handleTryAgain() {
    clearSession()
    router.push('/')
  }

  if (!session.candidateName) return null

  const lang = session.language ?? 'en'
  const loadingText = lang === 'pt' ? 'Gerando seu relatório de feedback...' : 'Generating your feedback report...'
  const errorText = lang === 'pt' ? 'Algo deu errado ao gerar o relatório.' : 'Something went wrong generating your report.'
  const retryText = lang === 'pt' ? 'Tentar novamente' : 'Try again'
  const tryAgainText = lang === 'pt' ? 'Nova Entrevista' : 'New Interview'

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="px-8 pt-8 pb-6 flex items-center border-b border-[#262626]">
        <span className="text-xs tracking-widest uppercase font-sans text-[#737373]">
          Mock Interview AI
        </span>
      </header>

      <div className="flex-1 px-8 py-16">
        {error ? (
          <div className="max-w-lg mx-auto space-y-4">
            <p className="text-sm text-[#737373]">{errorText}</p>
            <button
              onClick={generateReport}
              className="text-sm text-[#F2EFE8] underline underline-offset-4 hover:text-[#D4C9B8] transition-colors"
            >
              {retryText}
            </button>
          </div>
        ) : !report ? (
          <div className="flex items-center justify-center h-64">
            <span className="font-mono text-sm text-[#737373]">{loadingText}</span>
          </div>
        ) : (
          <div>
            <FeedbackReport report={report} session={session as Partial<InterviewSession>} />
            <div className="max-w-2xl mx-auto mt-16 pt-8 border-t border-[#262626]">
              <button
                onClick={handleTryAgain}
                className="border border-[#262626] px-5 py-2.5 text-xs tracking-widest uppercase font-sans text-[#737373] hover:border-[#3A3A3A] hover:text-[#F2EFE8] transition-colors"
              >
                {tryAgainText}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
