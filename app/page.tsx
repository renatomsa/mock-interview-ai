'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveSession } from '@/lib/session'
import { getRandomQuestions } from '@/lib/questions'
import ThemeToggle from '@/components/ThemeToggle'
import type { Level, Language, InterviewMode } from '@/types'

const levels: Level[] = ['junior', 'mid', 'senior']

const copy = {
  en: {
    tagline: 'Practice the interview.\nOwn the outcome.',
    sub: 'Train on individual questions, or run a full recruitment simulation.\nHonest, deterministic feedback on how you communicate and think.',
    modeLabel: 'Mode',
    modes: {
      training: { name: 'Training', desc: 'Pick a subject and practice questions one at a time, with feedback after each.' },
      simulation: { name: 'Simulation', desc: 'A full mock interview: 3 behavioral questions by audio, then a coding challenge, then a report.' },
    },
    levelLabel: 'Level',
    nameLabel: 'Your Name',
    namePlaceholder: 'Full name',
    ctaTraining: 'Start Training',
    ctaSimulation: 'Begin Simulation',
  },
  pt: {
    tagline: 'Pratique a entrevista.\nDomine o resultado.',
    sub: 'Treine questões individuais, ou faça uma simulação completa de recrutamento.\nFeedback honesto e determinístico sobre como você comunica e raciocina.',
    modeLabel: 'Modo',
    modes: {
      training: { name: 'Treino', desc: 'Escolha um assunto e pratique questões uma por vez, com feedback após cada uma.' },
      simulation: { name: 'Simulação', desc: 'Entrevista completa: 3 perguntas comportamentais por áudio, depois um desafio de código e um relatório.' },
    },
    levelLabel: 'Nível',
    nameLabel: 'Seu Nome',
    namePlaceholder: 'Nome completo',
    ctaTraining: 'Iniciar Treino',
    ctaSimulation: 'Iniciar Simulação',
  },
}

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState<Level | null>(null)
  const [language, setLanguage] = useState<Language>('en')
  const [mode, setMode] = useState<InterviewMode>('simulation')
  const t = copy[language]

  const needsName = mode === 'simulation'
  const canStart = !!level && (!needsName || !!name.trim())

  function handleStart() {
    if (!canStart) return
    if (mode === 'training') {
      saveSession({
        candidateName: name.trim(),
        level: level!,
        language,
        mode,
      })
      router.push('/training')
      return
    }
    saveSession({
      candidateName: name.trim(),
      level: level!,
      language,
      mode,
      behavioralQuestions: getRandomQuestions(language),
      behavioralResults: [],
      codingQuestion: null,
      codingAnswer: '',
      codingAnalysis: null,
    })
    router.push('/interview')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="px-6 md:px-8 pt-8 flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase font-sans text-muted">
          Mock Interview AI
        </span>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-md space-y-10 sm:space-y-12">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl text-text leading-tight whitespace-pre-line">
              {t.tagline}
            </h1>
            <p className="text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">{t.sub}</p>
          </div>

          <div className="space-y-8">
            {/* Language toggle */}
            <div className="flex justify-end gap-5">
              {(['en', 'pt'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`text-xs tracking-widest uppercase font-sans transition-colors ${
                    language === lang ? 'text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Mode */}
            <div className="space-y-3">
              <span className="text-xs tracking-widest uppercase text-muted font-sans">
                {t.modeLabel}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['training', 'simulation'] as InterviewMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`border p-4 text-left transition-colors ${
                      mode === m
                        ? 'border-text'
                        : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <span className={`block text-xs tracking-widest uppercase font-sans mb-2 ${mode === m ? 'text-text' : 'text-muted'}`}>
                      {t.modes[m].name}
                    </span>
                    <span className="block text-xs sm:text-sm text-muted leading-relaxed">
                      {t.modes[m].desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="space-y-3">
              <span className="text-xs tracking-widest uppercase text-muted font-sans">
                {t.levelLabel}
              </span>
              <div className="flex gap-3">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 border py-3 text-xs tracking-widest uppercase font-sans transition-colors ${
                      level === l
                        ? 'border-text text-text'
                        : 'border-border text-muted hover:border-border-strong hover:text-text'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Name (simulation only) */}
            {needsName && (
              <div className="space-y-3">
                <span className="text-xs tracking-widest uppercase text-muted font-sans">
                  {t.nameLabel}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  placeholder={t.namePlaceholder}
                  className="w-full bg-transparent border-b border-border pb-3 text-sm sm:text-base text-text placeholder:text-muted focus:outline-none focus:border-border-strong transition-colors font-sans"
                />
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="w-full bg-text text-background border border-text py-4 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {mode === 'training' ? t.ctaTraining : t.ctaSimulation}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
