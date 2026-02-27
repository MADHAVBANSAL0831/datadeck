import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// Create Supabase admin client for webhook operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

// Helper function to get plan price
const getPlanPrice = (planName: string): number => {
  const priceMap: Record<string, number> = {
    'Basic': 20,
    'Tips': 50,
    'AI Agent': 100,
    'Early Access Trial': 50,
    'Early Bird': 500,
  }
  return priceMap[planName] || 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    console.log('✅ Webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('💳 Payment successful:', {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
          currency: session.currency,
          mode: session.mode,
        })

        // Get user by email
        if (session.customer_details?.email && session.mode === 'subscription') {
          const { data: users } = await supabaseAdmin.auth.admin.listUsers()
          const user = users?.users.find(u => u.email === session.customer_details?.email)

          if (user && session.subscription) {
            // Get subscription details from Stripe
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            const priceId = subscription.items.data[0]?.price.id
            const planName = getPlanName(priceId)

            // Get actual price from Stripe (in cents, convert to pounds)
            const priceAmount = subscription.items.data[0]?.price.unit_amount || 0
            const actualPrice = priceAmount / 100

            // Save subscription to database
            const { error } = await supabaseAdmin
              .from('subscriptions')
              .upsert({
                user_id: user.id,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscription.id,
                stripe_price_id: priceId,
                plan_name: planName,
                plan_price: actualPrice, // Use actual price from Stripe
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
              }, {
                onConflict: 'stripe_subscription_id'
              })

            if (error) {
              console.error('Error saving subscription:', error)
            } else {
              console.log('✅ Subscription saved to database')
            }
          }
        }
        break

      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription
        console.log('🎉 Subscription created:', {
          subscriptionId: subscriptionCreated.id,
          customerId: subscriptionCreated.customer,
          status: subscriptionCreated.status,
          currentPeriodEnd: new Date(subscriptionCreated.current_period_end * 1000),
        })

        const priceIdCreated = subscriptionCreated.items.data[0]?.price.id
        const planNameCreated = getPlanName(priceIdCreated)

        // Get actual price from Stripe
        const priceAmountCreated = subscriptionCreated.items.data[0]?.price.unit_amount || 0
        const actualPriceCreated = priceAmountCreated / 100

        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            stripe_customer_id: subscriptionCreated.customer as string,
            stripe_subscription_id: subscriptionCreated.id,
            stripe_price_id: priceIdCreated,
            plan_name: planNameCreated,
            plan_price: actualPriceCreated, // Use actual price from Stripe
            status: subscriptionCreated.status,
            current_period_start: new Date(subscriptionCreated.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionCreated.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscriptionCreated.cancel_at_period_end,
          }, {
            onConflict: 'stripe_subscription_id'
          })
        break

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription
        console.log('🔄 Subscription updated:', {
          subscriptionId: subscriptionUpdated.id,
          status: subscriptionUpdated.status,
          cancelAtPeriodEnd: subscriptionUpdated.cancel_at_period_end,
        })

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscriptionUpdated.status,
            current_period_start: new Date(subscriptionUpdated.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionUpdated.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscriptionUpdated.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscriptionUpdated.id)
        break

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription
        console.log('❌ Subscription cancelled:', {
          subscriptionId: subscriptionDeleted.id,
          customerId: subscriptionDeleted.customer,
        })

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_subscription_id', subscriptionDeleted.id)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        console.log('✅ Invoice paid:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
          subscriptionId: invoice.subscription,
        })
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log('⚠️ Payment failed:', {
          invoiceId: failedInvoice.id,
          customerId: failedInvoice.customer,
          attemptCount: failedInvoice.attempt_count,
        })
        // Here you would send payment failure notification
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

