import type { InterviewSession } from '@/types'

const SESSION_KEY = 'interview-session'

export function saveSession(session: Partial<InterviewSession>): void {
  if (typeof window === 'undefined') return
  const existing = getSession()
  const merged = { ...existing, ...session }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged))
}

export function getSession(): Partial<InterviewSession> {
  if (typeof window === 'undefined') return {}
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Partial<InterviewSession>
  } catch {
    return {}
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
}
