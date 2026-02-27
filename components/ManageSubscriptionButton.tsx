'use client'

import { useState } from 'react'

interface ManageSubscriptionButtonProps {
  customerId: string
  className?: string
}

export function ManageSubscriptionButton({ customerId, className }: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!customerId) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No portal URL returned')
        alert('Unable to open customer portal. Please try again.')
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      alert('Unable to open customer portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ||
        'w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {isLoading ? 'Loading...' : 'Manage Subscription'}
    </button>
  )
}

