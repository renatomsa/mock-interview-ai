'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveSession } from '@/lib/session'
import { getRandomQuestions } from '@/lib/questions'
import type { Level, Language } from '@/types'

const levels: Level[] = ['junior', 'mid', 'senior']

const copy = {
  en: {
    tagline: 'Practice the interview.\nOwn the outcome.',
    sub: 'Three behavioral questions by audio, then a coding challenge.\nHonest feedback on how you communicate and think.',
    levelLabel: 'Level',
    nameLabel: 'Your Name',
    namePlaceholder: 'Full name',
    cta: 'Begin Interview',
  },
  pt: {
    tagline: 'Pratique a entrevista.\nDomine o resultado.',
    sub: 'Três perguntas comportamentais por áudio, depois um desafio de código.\nFeedback honesto sobre como você comunica e raciocina.',
    levelLabel: 'Nível',
    nameLabel: 'Seu Nome',
    namePlaceholder: 'Nome completo',
    cta: 'Iniciar Entrevista',
  },
}

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState<Level | null>(null)
  const [language, setLanguage] = useState<Language>('en')
  const t = copy[language]

  function handleStart() {
    if (!name.trim() || !level) return
    saveSession({
      candidateName: name.trim(),
      level,
      language,
      behavioralQuestions: getRandomQuestions(language),
      behavioralResults: [],
      codingQuestion: null,
      codingAnswer: '',
      codingAnalysis: null,
    })
    router.push('/interview')
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="px-8 pt-8">
        <span className="text-xs tracking-widest uppercase font-sans text-[#737373]">
          Mock Interview AI
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl text-[#F2EFE8] leading-tight whitespace-pre-line">
              {t.tagline}
            </h1>
            <p className="text-sm text-[#737373] leading-relaxed whitespace-pre-line">{t.sub}</p>
          </div>

          <div className="space-y-8">
            {/* Language toggle */}
            <div className="flex justify-end gap-5">
              {(['en', 'pt'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`text-xs tracking-widest uppercase font-sans transition-colors ${
                    language === lang
                      ? 'text-[#F2EFE8]'
                      : 'text-[#737373] hover:text-[#F2EFE8]'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Level */}
            <div className="space-y-3">
              <span className="text-xs tracking-widest uppercase text-[#737373] font-sans">
                {t.levelLabel}
              </span>
              <div className="flex gap-3">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 border py-3 text-xs tracking-widest uppercase font-sans transition-colors ${
                      level === l
                        ? 'border-[#F2EFE8] text-[#F2EFE8]'
                        : 'border-[#262626] text-[#737373] hover:border-[#3A3A3A] hover:text-[#F2EFE8]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <span className="text-xs tracking-widest uppercase text-[#737373] font-sans">
                {t.nameLabel}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder={t.namePlaceholder}
                className="w-full bg-transparent border-b border-[#262626] pb-3 text-sm text-[#F2EFE8] placeholder:text-[#737373] focus:outline-none focus:border-[#3A3A3A] transition-colors font-sans"
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              disabled={!name.trim() || !level}
              className="w-full bg-[#F2EFE8] text-[#0A0A0A] border border-[#F2EFE8] py-4 text-xs tracking-widest uppercase font-sans font-medium hover:bg-[#D4C9B8] hover:border-[#D4C9B8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.cta}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
