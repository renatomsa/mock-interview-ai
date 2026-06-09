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
        className="flex items-center gap-3 border border-[#262626] px-5 py-3 text-xs tracking-widest uppercase font-sans text-[#F2EFE8] hover:border-[#3A3A3A] transition-colors disabled:opacity-40"
      >
        <span className="w-3 h-3 rounded-full border border-[#F2EFE8] inline-block" />
        Record
      </button>
    )
  }

  if (status === 'recording') {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={stopRecording}
          className="flex items-center gap-3 border border-[#C84B4B] px-5 py-3 text-xs tracking-widest uppercase font-sans text-[#C84B4B] hover:border-[#C84B4B] transition-colors"
        >
          <span className="w-3 h-3 rounded-full bg-[#C84B4B] inline-block animate-pulse" />
          Stop
        </button>
        <span className="font-mono text-sm text-[#737373]">{formatTime(duration)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <span className="font-mono text-sm text-[#737373]">Recorded — {formatTime(duration)}</span>
      <button
        onClick={resetRecording}
        className="text-xs text-[#737373] underline underline-offset-4 hover:text-[#F2EFE8] transition-colors tracking-widest uppercase"
      >
        Re-record
      </button>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="flex items-center gap-2 bg-[#F2EFE8] text-[#0A0A0A] border border-[#F2EFE8] px-5 py-2.5 text-xs tracking-widest uppercase font-sans font-medium hover:bg-[#D4C9B8] hover:border-[#D4C9B8] transition-colors disabled:opacity-40"
      >
        Submit
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4.5h12M8.5 1l4 3.5-4 3.5" />
        </svg>
      </button>
    </div>
  )
}
