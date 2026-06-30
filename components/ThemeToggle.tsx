'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

// The theme lives on <html> (applied pre-paint by the inline script in
// app/layout.tsx). useSyncExternalStore reads it without a setState-in-effect
// and avoids hydration mismatches via the server snapshot.
const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

function getServerSnapshot(): Theme {
  return 'dark'
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('light', next === 'light')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // ignore persistence failures (e.g. private mode)
    }
    listeners.forEach((l) => l())
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="text-xs tracking-widest uppercase font-sans text-muted hover:text-text transition-colors"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
