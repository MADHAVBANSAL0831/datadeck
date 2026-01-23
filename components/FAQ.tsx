'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "How accurate are the card prices?",
    answer: "Our prices are based on real eBay sold listings and other UK marketplace data, updated regularly. While we strive for accuracy, prices can fluctuate based on card condition, rarity, and market demand. Use our data as a guide to make informed decisions."
  },
  {
    question: "Where does the pricing data come from?",
    answer: "We aggregate data from publicly available sold listings on eBay UK, TCGPlayer, and other trusted marketplaces. This gives you a realistic view of what cards are actually selling for, not just listed prices."
  },
  {
    question: "How often are prices updated?",
    answer: "Prices are updated daily for most cards. Popular and high-value cards may be updated more frequently to reflect current market conditions. Our AI Agent tier includes real-time updates for the most accurate pricing."
  },
  {
    question: "Can I track my Pokémon card collection?",
    answer: "Yes! With our Tips and AI Agent plans, you can create and track your collection, monitor total value changes, and receive alerts when cards in your collection experience significant price movements."
  },
  {
    question: "What Pokémon card sets do you cover?",
    answer: "We cover all major Pokémon TCG sets including Base Set, Jungle, Fossil, modern sets like Scarlet & Violet, Japanese exclusive cards, and promotional cards. Our database is constantly expanding to include new releases."
  },
  {
    question: "How does the AI Agent work?",
    answer: "The AI Agent uses natural language processing to answer your questions about Pokémon card values, trends, and market insights. Simply ask questions like 'What's the most valuable card in my collection?' or 'Should I sell my Charizard now?' and get data-driven answers."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period. No long-term contracts or hidden fees."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards including Visa, Mastercard, and American Express. All payments are processed securely through Stripe. We also support Apple Pay and Google Pay."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-white/60">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/5 backdrop-blur-sm border border-teal-500/20 overflow-hidden transition-all duration-300 hover:border-teal-500/40"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-teal-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-white/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

