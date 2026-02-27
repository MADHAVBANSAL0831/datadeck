'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  id: string
  customerEmail: string | null
  customerName: string | null
  amountTotal: number | null
  currency: string | null
  paymentStatus: string
  mode: string
  customerId: string | null
  lineItems?: Array<{
    description: string | null
    quantity: number | null
    amountTotal: number | null
  }>
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const fetchSessionData = async (id: string) => {
    try {
      const response = await fetch(`/api/checkout-session?session_id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setSessionData(data)

        // Save subscription to database
        try {
          await fetch('/api/save-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: id }),
          })
          console.log('✅ Subscription saved to database')
        } catch (saveError) {
          console.error('Error saving subscription:', saveError)
        }
      }
    } catch (error) {
      console.error('Error fetching session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!sessionData?.customerId) return

    setIsLoadingPortal(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: sessionData.customerId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      alert('Unable to open customer portal. Please try again.')
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (!amount || !currency) return 'N/A'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-slate-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          Payment Successful!
        </h1>

        <p className="text-lg text-white/70 mb-8 text-center">
          Thank you for joining DataDeck! You will receive a confirmation email shortly.
        </p>

        {/* Session Details */}
        {loading ? (
          <div className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
        ) : sessionData ? (
          <div className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
            <div className="space-y-3 text-sm">
              {sessionData.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium">{sessionData.customerEmail}</span>
                </div>
              )}
              {sessionData.customerName && (
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white font-medium">{sessionData.customerName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/60">Amount:</span>
                <span className="text-white font-medium">
                  {formatAmount(sessionData.amountTotal, sessionData.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Payment Status:</span>
                <span className="text-teal-400 font-medium capitalize">
                  {sessionData.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Type:</span>
                <span className="text-white font-medium capitalize">
                  {sessionData.mode}
                </span>
              </div>
              {sessionData.id && (
                <div className="flex justify-between">
                  <span className="text-white/60">Session ID:</span>
                  <span className="text-white/40 font-mono text-xs">
                    {sessionData.id.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="space-y-4">
          {sessionData?.customerId && sessionData.mode === 'subscription' && (
            <button
              onClick={handleManageSubscription}
              disabled={isLoadingPortal}
              className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingPortal ? 'Loading...' : 'Manage Subscription'}
            </button>
          )}

          <Link
            href="/dashboard"
            className="block w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all text-center"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full py-3 px-6 bg-white/5 backdrop-blur-sm border border-teal-500/30 text-white font-semibold rounded-xl hover:bg-teal-500/10 transition-all text-center"
          >
            Return Home
          </Link>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-white/50 text-center">
          Need help? Contact us at support@datadeck.co.uk
        </p>
      </div>
    </div>
  )
}

