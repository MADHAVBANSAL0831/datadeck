'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FixSubscriptionPage() {
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Subscription saved successfully! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Failed to save subscription')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Fix Missing Subscription</h1>
        <p className="text-white/60 mb-8">
          If you completed a payment but it's not showing in your dashboard, enter your Stripe session ID below to manually save it.
        </p>

        <div className="bg-white/5 border border-teal-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">How to find your Session ID:</h2>
          <ol className="text-white/70 space-y-2 text-sm list-decimal list-inside">
            <li>Check your email for the Stripe receipt</li>
            <li>Or look at the URL after payment - it should have <code className="bg-white/10 px-2 py-1 rounded">?session_id=cs_...</code></li>
            <li>Copy the entire session ID (starts with "cs_")</li>
            <li>Paste it below and click "Fix Subscription"</li>
          </ol>
        </div>

        <form onSubmit={handleFix} className="bg-white/5 border border-teal-500/20 rounded-xl p-6">
          {message && (
            <div className="bg-teal-500/10 border border-teal-500/50 rounded-lg p-4 mb-4">
              <p className="text-teal-400">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="sessionId" className="block text-sm font-medium text-white/80 mb-2">
              Stripe Session ID
            </label>
            <input
              id="sessionId"
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
              placeholder="cs_test_..."
              className="w-full px-4 py-3 bg-white/5 border border-teal-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !sessionId}
            className="w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Fix Subscription'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-teal-400 hover:text-teal-300">← Back to Dashboard</a>
        </div>

        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Alternative: Make a New Payment</h3>
          <p className="text-white/60 text-sm mb-4">
            If you can't find your session ID, you can simply make a new test payment and it will work automatically.
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-medium rounded-lg hover:bg-yellow-500/30 transition-all"
          >
            Go to Pricing
          </a>
        </div>
      </div>
    </div>
  )
}

