import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// Helper function to get plan name from price ID
const getPlanName = (priceId: string): string => {
  const planMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASIC || '']: 'Basic',
    [process.env.STRIPE_PRICE_TIPS || '']: 'Tips',
    [process.env.STRIPE_PRICE_AI_AGENT || '']: 'AI Agent',
    [process.env.STRIPE_PRICE_TRIAL || '']: 'Early Access Trial',
    [process.env.STRIPE_PRICE_EARLY_BIRD || '']: 'Early Bird',
  }
  return planMap[priceId] || 'Unknown Plan'
}

// Helper function to get plan price (updated to match actual Stripe prices)
const getPlanPrice = (planName: string): number => {
  const priceMap: Record<string, number> = {
    'Basic': 20,
    'Basic Plan': 20,
    'Tips': 50,
    'Tips Plan': 50,
    'AI Agent': 125,
    'AI Agent Plan': 125,
    'Early Access Trial': 50,
    'Early Bird': 200,
    'Early Bird Annual': 200,
  }
  return priceMap[planName] || 0
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      console.error('❌ No sessionId provided')
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    console.log('📝 Processing session:', sessionId)

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('❌ User not authenticated')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.email)

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('📦 Session retrieved:', {
      id: session.id,
      mode: session.mode,
      customer: session.customer,
      payment_status: session.payment_status,
      subscription: session.subscription
    })

    if (!session.customer) {
      console.error('❌ No customer in session. Session details:', JSON.stringify(session, null, 2))
      return NextResponse.json(
        { error: 'No customer found in session' },
        { status: 400 }
      )
    }

    // Check if it's a subscription
    if (session.mode === 'subscription' && session.subscription) {
      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0]?.price.id
      const planName = getPlanName(priceId)

      // Get actual price from Stripe (in cents, convert to pounds)
      const priceAmount = subscription.items.data[0]?.price.unit_amount || 0
      const actualPrice = priceAmount / 100

      // Save subscription to database
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          plan_name: planName,
          plan_price: actualPrice, // Use actual price from Stripe instead of hardcoded
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }, {
          onConflict: 'stripe_subscription_id'
        })

      if (error) {
        console.error('Error saving subscription:', error)
        return NextResponse.json(
          { error: 'Failed to save subscription' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, subscription: planName })
    } else {
      // For one-time payments, just save customer info
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)
      const description = lineItems.data[0]?.description || 'One-time payment'

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: `onetime_${sessionId}`,
          plan_name: description,
          plan_price: (session.amount_total || 0) / 100,
          status: 'paid',
        }, {
          onConflict: 'stripe_subscription_id'
        })

      if (error) {
        console.error('Error saving payment:', error)
        return NextResponse.json(
          { error: 'Failed to save payment' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, payment: description })
    }
  } catch (error) {
    console.error('Save subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

