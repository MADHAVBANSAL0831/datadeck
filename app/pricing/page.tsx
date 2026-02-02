'use client'

import { useState } from 'react'
import PricingCard from '@/components/PricingCard'

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 20,
    period: 'month',
    description: 'Perfect for casual collectors',
    features: [
      'UK Pokémon card price lookups',
      'Access to eBay sold data',
      'Basic price history charts',
      'Email support',
      'Weekly market updates',
    ],
    priceId: 'price_basic_monthly',
    popular: false,
  },
  {
    id: 'tips',
    name: 'Tips',
    price: 50,
    period: 'month',
    description: 'For serious sellers and traders',
    features: [
      'Everything in Basic',
      'Expert buying/selling tips',
      'Price trend alerts',
      'Priority email support',
      'Daily market insights',
      'Advanced analytics dashboard',
      'Hot card recommendations',
    ],
    priceId: 'price_tips_monthly',
    popular: false,
  },
  {
    id: 'ai-agent',
    name: 'AI Agent',
    price: 125,
    period: 'month',
    description: 'AI-powered card intelligence',
    features: [
      'Everything in Tips',
      'AI-powered Q&A agent',
      'Ask questions about your data',
      'Natural language card searches',
      'Automated collection valuation',
      'Custom portfolio tracking',
      'Dedicated account manager',
      'API access for integrations',
      '24/7 priority support',
    ],
    priceId: 'price_ai_agent_monthly',
    popular: false,
  },
  {
    id: 'trial',
    name: 'Early Access Trial',
    price: 50,
    period: '3 months',
    description: 'Try premium features risk-free',
    features: [
      'Full AI Agent access for 3 months',
      'All premium features included',
      'AI-powered Q&A agent',
      'Natural language card searches',
      'Advanced analytics dashboard',
      'Priority email support',
      'No long-term commitment',
      'Cancel anytime',
    ],
    priceId: 'price_trial_3months',
    popular: false,
    badge: 'Trial',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 200,
    period: 'year',
    description: 'Best value — full year access',
    features: [
      'Full AI Agent access for 1 year',
      'All premium features included',
      '24/7 priority support',
      'Early access to new features',
      'Founding member badge',
      'Exclusive Discord community',
      'Save over £1,300/year',
      'Lock in this price forever',
    ],
    priceId: 'price_early_bird_yearly',
    popular: false,
    badge: 'Best Value',
  },
]

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planId: string) => {
    setIsLoading(planId)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        alert('Unable to start checkout. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Unlock UK Pokémon card price intelligence. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isLoading={isLoading === plan.id}
              onSubscribe={() => handleSubscribe(plan.priceId, plan.id)}
            />
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-white/50 text-sm">
            All prices are in GBP. Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  )
}

