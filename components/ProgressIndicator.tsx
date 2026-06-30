import type { InterviewPhase } from '@/types'

interface Props {
  phase: InterviewPhase
  behavioralIndex: number
}

export default function ProgressIndicator({ phase, behavioralIndex }: Props) {
  const behavioralActive = phase === 'behavioral' || phase === 'transition'
  const codingActive = phase === 'coding' || phase === 'done'

  return (
    <div className="flex items-center gap-3 text-xs tracking-widest uppercase font-sans">
      <span className={behavioralActive || codingActive ? 'text-text' : 'text-muted'}>
        01 Behavioral
      </span>
      {phase === 'behavioral' && (
        <span className="text-muted font-mono normal-case tracking-normal">
          ({behavioralIndex + 1}/3)
        </span>
      )}
      <span className="text-muted">——</span>
      <span className={codingActive ? 'text-text' : 'text-muted'}>02 Coding</span>
    </div>
  )
}
