'use client'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  priceId: string
  popular?: boolean
  badge?: string
}

interface PricingCardProps {
  plan: PricingPlan
  isLoading: boolean
  onSubscribe: () => void
}

export default function PricingCard({ plan, isLoading, onSubscribe }: PricingCardProps) {
  const isEarlyBird = plan.id === 'early-bird'
  const isTrial = plan.id === 'trial'

  return (
    <div
      className={`relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 card-hover ${
        plan.popular
          ? 'bg-gradient-to-br from-teal-900/50 to-teal-800/30 border-teal-500/50 scale-105'
          : isEarlyBird
          ? 'bg-gradient-to-br from-yellow-900/30 to-slate-900/50 border-yellow-500/40'
          : isTrial
          ? 'bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/40'
          : 'bg-white/5 border-teal-500/20 hover:border-teal-500/40'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Custom Badge */}
      {plan.badge && !plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`px-4 py-1 text-xs font-semibold rounded-full ${
            isTrial
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900'
          }`}>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className={`text-xl font-bold mb-2 mt-2 ${
        isEarlyBird ? 'text-yellow-400' : isTrial ? 'text-purple-400' : 'text-white'
      }`}>{plan.name}</h3>

      {/* Description */}
      <p className="text-sm text-white/60 mb-4">{plan.description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className={`text-4xl font-bold ${
          isEarlyBird ? 'text-yellow-400' : isTrial ? 'text-purple-400' : 'text-white'
        }`}>£{plan.price}</span>
        <span className="text-white/60">/{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm">
            <svg
              className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
                isEarlyBird ? 'text-yellow-400' : isTrial ? 'text-purple-400' : 'text-teal-400'
              }`}
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
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
          plan.popular
            ? 'bg-teal-500 text-slate-900 hover:bg-teal-400'
            : isEarlyBird
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:from-yellow-400 hover:to-yellow-500'
            : isTrial
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-400 hover:to-purple-500'
            : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Get Started'
        )}
      </button>
    </div>
  )
}

