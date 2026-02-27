# Stripe Integration Setup Guide

This guide explains how to set up and test the Stripe integration in DataDeck.

## Features Implemented

✅ **Checkout Integration** - Multiple pricing tiers with Stripe Checkout  
✅ **Webhook Handler** - Processes Stripe events (subscriptions, payments, cancellations)  
✅ **Customer Portal** - Allows users to manage their subscriptions  
✅ **Payment Details** - Displays transaction information on success page  

## Setup Instructions

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret Key** (starts with `sk_test_`)
3. Copy your **Publishable Key** (starts with `pk_test_`)

### 2. Create Products and Prices

1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Create products for each pricing tier:
   - **Basic** - £20/month (recurring)
   - **Tips** - £50/month (recurring)
   - **AI Agent** - £100/month (recurring)
   - **Early Access Trial** - £50 (one-time payment)
   - **Early Bird** - £500/year (one-time payment)
3. Copy each Price ID (starts with `price_`)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key

# Stripe Price IDs
STRIPE_PRICE_BASIC=price_xxxxx
STRIPE_PRICE_TIPS=price_xxxxx
STRIPE_PRICE_AI_AGENT=price_xxxxx
STRIPE_PRICE_TRIAL=price_xxxxx
STRIPE_PRICE_EARLY_BIRD=price_xxxxx

# Webhook Secret (see step 4)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set Up Webhooks (Local Testing)

#### Option A: Using Stripe CLI (Recommended for Testing)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`

#### Option B: Using Stripe Dashboard (For Production)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

### 5. Enable Customer Portal

1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/settings/billing/portal)
2. Click "Activate test link"
3. Configure what customers can do (cancel, update payment method, etc.)

## Testing the Integration

### Test Checkout Flow

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to `/pricing`
3. Click on any pricing plan
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any billing details
5. Complete the payment
6. You should be redirected to `/success` with payment details

### Test Webhooks

1. Make sure Stripe CLI is running:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Complete a test payment
3. Check your terminal/console for webhook events:
   - ✅ `checkout.session.completed`
   - 🎉 `customer.subscription.created`
   - ✅ `invoice.payment_succeeded`

### Test Customer Portal

1. Complete a subscription purchase
2. On the success page, click "Manage Subscription"
3. You'll be redirected to Stripe's Customer Portal
4. Test cancelling or updating the subscription

## API Endpoints

### POST `/api/checkout`
Creates a Stripe Checkout session.

**Request:**
```json
{
  "priceId": "price_basic_monthly"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/webhooks/stripe`
Handles Stripe webhook events.

**Events Handled:**
- `checkout.session.completed` - Payment successful
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Recurring payment successful
- `invoice.payment_failed` - Payment failed

### GET `/api/checkout-session?session_id={id}`
Retrieves checkout session details.

**Response:**
```json
{
  "id": "cs_test_...",
  "customerEmail": "user@example.com",
  "amountTotal": 2000,
  "currency": "gbp",
  "paymentStatus": "paid",
  "mode": "subscription"
}
```

### POST `/api/create-portal-session`
Creates a Customer Portal session.

**Request:**
```json
{
  "customerId": "cus_xxxxx"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

## Stripe Test Cards

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

## Going Live

1. Switch to live mode in Stripe Dashboard
2. Create live products and prices
3. Update environment variables with live keys
4. Set up production webhook endpoint
5. Test with real payment (then refund)
6. Update Stripe Customer Portal settings for live mode

## Support

For issues or questions:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

