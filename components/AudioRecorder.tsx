'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioRecorderProps {
  onSubmit: (blob: Blob) => void
  disabled?: boolean
}

type Status = 'idle' | 'recording' | 'recorded'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function AudioRecorder({ onSubmit, disabled = false }: AudioRecorderProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioBlobRef = useRef<Blob | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        audioBlobRef.current = blob
        stream.getTracks().forEach((t) => t.stop())
        setStatus('recorded')
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setDuration(0)
      setStatus('recording')

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch {
      alert('Microphone access is required to record your answer.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function resetRecording() {
    audioBlobRef.current = null
    setDuration(0)
    setStatus('idle')
  }

  function handleSubmit() {
    if (audioBlobRef.current) onSubmit(audioBlobRef.current)
  }

  if (status === 'idle') {
    return (
      <button
        onClick={startRecording}
        disabled={disabled}
        className="flex items-center gap-3 border border-border px-5 py-3 text-xs tracking-widest uppercase font-sans text-text hover:border-border-strong transition-colors disabled:opacity-40"
      >
        <span className="w-3 h-3 rounded-full border border-text inline-block" />
        Record
      </button>
    )
  }

  if (status === 'recording') {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={stopRecording}
          className="flex items-center gap-3 border border-danger px-5 py-3 text-xs tracking-widest uppercase font-sans text-danger hover:border-danger transition-colors"
        >
          <span className="w-3 h-3 rounded-full bg-danger inline-block animate-pulse" />
          Stop
        </button>
        <span className="font-mono text-sm text-muted">{formatTime(duration)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <span className="font-mono text-sm text-muted">Recorded — {formatTime(duration)}</span>
      <button
        onClick={resetRecording}
        className="text-xs text-muted underline underline-offset-4 hover:text-text transition-colors tracking-widest uppercase"
      >
        Re-record
      </button>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="flex items-center gap-2 bg-text text-background border border-text px-5 py-2.5 text-xs tracking-widest uppercase font-sans font-medium hover:bg-accent hover:border-accent transition-colors disabled:opacity-40"
      >
        Submit
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" />
        </svg>
      </button>
    </div>
  )
}
