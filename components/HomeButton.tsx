'use client'

import Link from 'next/link'

const label = { en: 'Home', pt: 'Início' }

// Navbar link back to the landing page. Available on every screen.
export default function HomeButton({ language = 'en' }: { language?: 'pt' | 'en' }) {
  return (
    <Link
      href="/"
      className="text-xs tracking-widest uppercase font-sans text-muted hover:text-text transition-colors"
    >
      {label[language]}
    </Link>
  )
}
