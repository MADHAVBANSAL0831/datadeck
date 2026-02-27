'use client'

import Link from 'next/link'

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-yellow-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">DataDeck</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

