'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import UserMenu from './UserMenu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-yellow-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">DataDeck</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/70 hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-white/70 hover:text-teal-400 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-white/70 hover:text-teal-400 transition-colors">
              Pricing
            </Link>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login" className="text-white/70 hover:text-teal-400 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-lg hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg shadow-teal-500/25">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="block text-white/70 hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link href="#features" className="block text-white/70 hover:text-teal-400 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="block text-white/70 hover:text-teal-400 transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block text-white/70 hover:text-teal-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/payment-history" className="block text-white/70 hover:text-teal-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Payment History
                </Link>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-2 px-1">Signed in as</p>
                  <p className="text-sm text-white font-medium mb-3 px-1 truncate">{user.email}</p>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      window.location.href = '/login'
                    }}
                    className="w-full px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold rounded-lg text-center hover:bg-red-500/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-white/70 hover:text-teal-400 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="block px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-lg text-center hover:from-teal-500 hover:to-teal-400 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

