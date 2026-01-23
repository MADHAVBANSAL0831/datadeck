import Link from 'next/link'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-slate-900/40 to-yellow-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 backdrop-blur-sm border border-teal-500/30 mb-8">
            <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
            <span className="text-sm text-teal-300">Now accepting early bird members</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="gradient-text">DataDeck</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4">
            Made for sellers. Updated for today.
          </p>

          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            Track UK Pokémon card prices, explore eBay sold listings, and make smarter buying and selling decisions with real-time market data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg shadow-teal-500/25 text-lg"
            >
              View Pricing
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-teal-500/30 text-white font-semibold rounded-xl hover:bg-teal-500/10 transition-all text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose DataDeck?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Everything you need to track, price, and trade Pokémon cards in the UK market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Price Check */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-500/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Price Check</h3>
              <p className="text-white/60">Instantly check UK Pokémon card prices based on recent eBay sold listings and marketplace data.</p>
            </div>

            {/* Feature 2 - Buy & Sell */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-500/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Buy & Sell Smarter</h3>
              <p className="text-white/60">Make informed decisions when buying or selling cards with accurate market valuations.</p>
            </div>

            {/* Feature 3 - AI Agent */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-yellow-500/20 card-hover">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Insights</h3>
              <p className="text-white/60">Ask questions about your collection and get instant AI-generated answers from your data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-teal-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Get started in minutes and unlock the full potential of your Pokémon card collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Search Cards</h3>
              <p className="text-sm text-white/60">Look up any Pokémon card by name, set, or number.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Check Prices</h3>
              <p className="text-sm text-white/60">See real sold prices from eBay UK and other marketplaces.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Trends</h3>
              <p className="text-sm text-white/60">Monitor price trends and get alerts on value changes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sell Smarter</h3>
              <p className="text-sm text-white/60">List cards at the right price and maximize your profits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-teal-900/40 to-slate-900/60 backdrop-blur-sm border border-teal-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Join now and get early bird access at just £200 for a full year — save over £1,300!
            </p>
            <Link
              href="/pricing"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all shadow-lg shadow-teal-500/25 text-lg"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

