import type { FeedbackResponse, InterviewSession, Language } from '@/types'
import ScoreBar from './ScoreBar'

interface Props {
  report: FeedbackResponse
  session: Partial<InterviewSession>
}

const sectionLabels: Record<Language, Record<string, string>> = {
  en: {
    behavioral: 'Behavioral',
    coding: 'Coding',
    strengths: 'Strengths',
    improvements: 'Areas to Improve',
    study: 'Study Recommendations',
    starStructure: 'STAR Structure',
    clarity: 'Clarity',
    relevance: 'Relevance',
    understanding: 'Understanding',
    approach: 'Approach',
    accuracy: 'Accuracy',
    edgeCases: 'Edge Cases',
    communication: 'Communication',
  },
  pt: {
    behavioral: 'Comportamental',
    coding: 'Programação',
    strengths: 'Pontos Fortes',
    improvements: 'Áreas de Melhoria',
    study: 'Recomendações de Estudo',
    starStructure: 'Estrutura STAR',
    clarity: 'Clareza',
    relevance: 'Relevância',
    understanding: 'Compreensão',
    approach: 'Abordagem',
    accuracy: 'Precisão',
    edgeCases: 'Casos Extremos',
    communication: 'Comunicação',
  },
}

export default function FeedbackReport({ report, session }: Props) {
  const lang = (session.language ?? 'en') as Language
  const t = sectionLabels[lang]

  const verdictBorder =
    report.verdict === 'Strong hire' ? 'border-text text-text' : 'border-border-strong text-muted'

  return (
    <div className="max-w-2xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-5">
        <span className="text-xs tracking-widest uppercase text-muted font-sans">
          {session.candidateName} — {session.level}
        </span>
        <div className={`inline-block border px-4 py-2 text-xs tracking-widest uppercase font-sans ${verdictBorder}`}>
          {report.verdict}
        </div>
        <div className="pt-2">
          <span className="font-serif text-7xl sm:text-8xl text-text leading-none">
            {report.overallScore.toFixed(1)}
          </span>
          <span className="font-sans text-sm text-muted ml-4">out of 5</span>
        </div>
      </div>

      {/* Behavioral */}
      <section className="space-y-4">
        <span className="text-xs tracking-widest uppercase text-muted font-sans block">
          {t.behavioral}
        </span>
        <p className="text-sm text-text leading-relaxed">{report.behavioralSummary}</p>
        <div className="space-y-4">
          {session.behavioralResults?.map((r, i) => (
            <div key={i} className="border border-border p-6 space-y-4">
              <p className="text-xs text-muted font-serif italic leading-relaxed">
                &ldquo;{r.question}&rdquo;
              </p>
              <div className="space-y-2">
                <ScoreBar label={t.starStructure} score={r.scores.starStructure} />
                <ScoreBar label={t.clarity} score={r.scores.clarity} />
                <ScoreBar label={t.relevance} score={r.scores.relevance} />
              </div>
              <p className="text-xs text-muted leading-relaxed border-t border-border pt-4">
                {r.feedback}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coding */}
      <section className="space-y-4">
        <span className="text-xs tracking-widest uppercase text-muted font-sans block">
          {t.coding}
        </span>
        <p className="text-sm text-text leading-relaxed">{report.codingSummary}</p>
        {report.codingAnalysis && (
          <div className="border border-border p-6 space-y-4">
            <p className="text-xs text-muted font-serif italic">
              &ldquo;{session.codingQuestion?.title}&rdquo;
            </p>
            <div className="space-y-2">
              <ScoreBar label={t.understanding} score={report.codingAnalysis.scores.understanding} />
              <ScoreBar label={t.approach} score={report.codingAnalysis.scores.approach} />
              <ScoreBar label={t.accuracy} score={report.codingAnalysis.scores.accuracy} />
              <ScoreBar label={t.edgeCases} score={report.codingAnalysis.scores.edgeCases} />
              <ScoreBar label={t.communication} score={report.codingAnalysis.scores.communication} />
            </div>
            <p className="text-xs text-muted leading-relaxed border-t border-border pt-4">
              {report.codingAnalysis.feedback}
            </p>
          </div>
        )}
      </section>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="space-y-4">
          <span className="text-xs tracking-widest uppercase text-muted font-sans block">
            {t.strengths}
          </span>
          <ol className="space-y-4">
            {report.topStrengths.map((s, i) => (
              <li key={i} className="flex gap-4 text-sm text-text">
                <span className="font-mono text-muted shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="space-y-4">
          <span className="text-xs tracking-widest uppercase text-muted font-sans block">
            {t.improvements}
          </span>
          <ol className="space-y-4">
            {report.topImprovements.map((s, i) => (
              <li key={i} className="flex gap-4 text-sm text-text">
                <span className="font-mono text-muted shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Study Recommendations */}
      <section className="space-y-4">
        <span className="text-xs tracking-widest uppercase text-muted font-sans block">
          {t.study}
        </span>
        <ol className="space-y-4">
          {report.studyRecommendations.map((s, i) => (
            <li key={i} className="flex gap-4 text-sm text-text">
              <span className="font-mono text-muted shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Final Note */}
      <section>
        <p className="font-serif italic text-text leading-relaxed text-base border-l-2 border-border pl-6">
          {report.finalNote}
        </p>
      </section>
    </div>
  )
}
