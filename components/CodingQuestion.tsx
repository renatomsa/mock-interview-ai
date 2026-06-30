'use client'

import { useState } from 'react'
import type { CodingQuestion as CodingQuestionType, Language } from '@/types'

interface Props {
  question: CodingQuestionType
  onSubmit: (answer: string) => void
  isProcessing: boolean
  language: Language
}

const labels = {
  en: {
    tag: 'Algorithm Problem',
    explanation: 'Your Explanation',
    placeholder:
      'Describe your approach. Explain the data structures you would use, the steps of your algorithm, any tradeoffs you considered, and edge cases you would handle.',
    submit: 'Submit',
    evaluating: 'Saving...',
    examples: 'Examples',
    constraints: 'Constraints',
    easy: 'Easy',
    difficult: 'Difficult',
    evaluatedOn:
      'You are evaluated on your explanation — not on runnable code. Even if the problem does not ask for it, explicitly discuss: edge cases, time & space complexity, and the tradeoffs of your approach.',
  },
  pt: {
    tag: 'Problema de Algoritmo',
    explanation: 'Sua Explicação',
    placeholder:
      'Descreva sua abordagem. Explique as estruturas de dados que usaria, os passos do seu algoritmo, os trade-offs considerados e os casos extremos que trataria.',
    submit: 'Enviar',
    evaluating: 'Salvando...',
    examples: 'Exemplos',
    constraints: 'Restrições',
    easy: 'Fácil',
    difficult: 'Difícil',
    evaluatedOn:
      'Você é avaliado pela sua explicação — não por código executável. Mesmo que o problema não peça, comente explicitamente: casos extremos, complexidade de tempo e espaço, e os trade-offs da sua abordagem.',
  },
}

export default function CodingQuestion({ question, onSubmit, isProcessing, language }: Props) {
  const [answer, setAnswer] = useState('')
  const t = labels[language]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="border border-border p-4 md:p-8 overflow-y-auto flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs tracking-widest uppercase text-muted font-sans">{t.tag}</span>
          <span className="flex items-center gap-3 shrink-0">
            {question.difficulty && (
              <span
                className={`text-xs tracking-widest uppercase font-sans ${
                  question.difficulty === 'easy' ? 'text-muted' : 'text-accent'
                }`}
              >
                {question.difficulty === 'easy' ? t.easy : t.difficult}
              </span>
            )}
            <span className="text-xs font-mono text-muted">{question.topic}</span>
          </span>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl text-text">{question.title}</h2>
        <p className="text-sm sm:text-base text-text leading-relaxed">{question.description}</p>

        {question.examples.length > 0 && (
          <div>
            <span className="text-xs tracking-widest uppercase text-muted font-sans block mb-3">
              {t.examples}
            </span>
            <div className="space-y-3">
              {question.examples.map((ex, i) => (
                <div key={i} className="border border-border p-4 font-mono text-xs space-y-1">
                  <div>
                    <span className="text-muted">Input: </span>
                    <span className="text-text">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-muted">Output: </span>
                    <span className="text-text">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-muted pt-1">{ex.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.constraints.length > 0 && (
          <div>
            <span className="text-xs tracking-widest uppercase text-muted font-sans block mb-3">
              {t.constraints}
            </span>
            <ul className="space-y-1">
              {question.constraints.map((c, i) => (
                <li key={i} className="font-mono text-xs text-muted">
                  — {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-6 text-xs font-mono text-muted mt-auto pt-2 border-t border-border">
          <span>Time: {question.expectedComplexity.time}</span>
          <span>Space: {question.expectedComplexity.space}</span>
        </div>
      </div>

      <div className="border border-border p-4 md:p-8 flex flex-col">
        <span className="text-xs tracking-widest uppercase text-muted font-sans mb-4">
          {t.explanation}
        </span>
        <p className="text-xs sm:text-sm text-muted leading-relaxed border border-border-strong p-3 mb-4">
          {t.evaluatedOn}
        </p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 bg-transparent border border-border p-4 font-mono text-sm text-text placeholder:text-muted resize-none focus:outline-none focus:border-border-strong transition-colors leading-relaxed"
          disabled={isProcessing}
        />
        <div className="flex justify-end mt-4">
          {isProcessing ? (
            <span className="font-mono text-sm text-muted">{t.evaluating}</span>
          ) : (
            <button
              onClick={() => answer.trim() && onSubmit(answer)}
              disabled={!answer.trim()}
              className="flex items-center gap-2 bg-text text-background border border-text px-5 py-2.5 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.submit}
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
