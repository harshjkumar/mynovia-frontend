'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [text, setText] = useState('We help you make your dreams come true!')
  const [linkText, setLinkText] = useState('Book your appointment today')
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-bar-tan text-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-center">
        <p className="text-xs tracking-wide font-sans font-medium">
          {text} –{' '}
          <Link href="/book-appointment" className="underline underline-offset-2 hover:text-gold transition-colors">
            {linkText}
          </Link>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-charcoal transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
