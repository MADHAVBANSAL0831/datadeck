import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// Price mapping - replace these with your actual Stripe price IDs
const priceMapping: Record<string, { priceId: string; mode: 'subscription' | 'payment' }> = {
  'price_basic_monthly': {
    priceId: process.env.STRIPE_PRICE_BASIC || 'price_basic_monthly',
    mode: 'subscription',
  },
  'price_tips_monthly': {
    priceId: process.env.STRIPE_PRICE_TIPS || 'price_tips_monthly',
    mode: 'subscription',
  },
  'price_ai_agent_monthly': {
    priceId: process.env.STRIPE_PRICE_AI_AGENT || 'price_ai_agent_monthly',
    mode: 'subscription',
  },
  'price_trial_3months': {
    priceId: process.env.STRIPE_PRICE_TRIAL || 'price_trial_3months',
    mode: 'payment', // One-time payment for 3-month trial
  },
  'price_early_bird_yearly': {
    priceId: process.env.STRIPE_PRICE_EARLY_BIRD || 'price_early_bird_yearly',
    mode: 'payment', // One-time payment for early bird
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    const priceConfig = priceMapping[priceId]

    if (!priceConfig) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get the base URL for redirects from request headers or env
    const host = request.headers.get('host') || 'localhost:3005'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceConfig.priceId,
          quantity: 1,
        },
      ],
      mode: priceConfig.mode,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    }

    // If user is logged in, prefill their email
    if (user?.email) {
      sessionConfig.customer_email = user.email
    }

    // For one-time payments, explicitly tell Stripe to create a customer
    // This ensures session.customer exists when we save to database
    if (priceConfig.mode === 'payment') {
      sessionConfig.customer_creation = 'always'
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

