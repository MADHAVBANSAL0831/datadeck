import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-lg text-white/70 mb-8">
          Thank you for joining DataDeck! You will receive a confirmation email shortly with your account details and how to access your Pokémon card price tools.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full py-3 px-6 bg-white/5 backdrop-blur-sm border border-teal-500/30 text-white font-semibold rounded-xl hover:bg-teal-500/10 transition-all"
          >
            Return Home
          </Link>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-white/50">
          Need help? Contact us at support@datadeck.co.uk
        </p>
      </div>
    </div>
  )
}

