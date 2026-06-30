// Monospaced tick-bar score display (0-5), per the PRD design system.
export default function ScoreBar({ label, score }: { label: string; score: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(score)))
  const bar = Array(5)
    .fill(0)
    .map((_, i) => (i < clamped ? '█' : '░'))
    .join('')
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs sm:text-sm text-muted font-sans w-32 sm:w-36 shrink-0">{label}</span>
      <span className="font-mono text-sm text-text tracking-widest">{bar}</span>
      <span className="font-mono text-xs text-muted">{clamped} / 5</span>
    </div>
  )
}
