import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ManageSubscriptionButton } from '@/components/ManageSubscriptionButton'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's subscriptions from database (all of them, most recent first)
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Find the best subscription to display:
  // 1. Filter to only active/trialing/paid subscriptions (not cancelled/expired)
  // 2. Pick the most recent one (first in the list)
  const activeSubscriptions =
    subscriptions?.filter(
      (sub) => sub.status === 'active' || sub.status === 'trialing' || sub.status === 'paid'
    ) || []

  const subscription = activeSubscriptions[0] || null

  // If there is no currently active subscription, remember the most recent
  // subscription (could be cancelled/expired) so we can show a "last plan" summary.
  const lastSubscription = !subscription && subscriptions && subscriptions.length > 0
    ? subscriptions[0]
    : null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-teal-400'
      case 'trialing':
        return 'text-blue-400'
      case 'past_due':
        return 'text-yellow-400'
      case 'canceled':
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-white/60">Welcome back, {user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Subscription Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Your Subscription</h2>

	        {subscription ? (
	          <div className="space-y-4">
	            {(() => {
	              const isOneTime =
	                subscription.status === 'paid' ||
	                (subscription.stripe_subscription_id &&
	                  subscription.stripe_subscription_id.startsWith('onetime_'))
	
	              return (
	                <>
	                  {/* Plan Name */}
	                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
	                    <span className="text-white/60">Plan</span>
	                    <span className="text-xl font-semibold text-white">{subscription.plan_name}</span>
	                  </div>

	                  {/* Status */}
	                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
	                    <span className="text-white/60">Status</span>
	                    <span className={`font-semibold capitalize ${getStatusColor(subscription.status)}`}>
	                      {subscription.status}
	                    </span>
	                  </div>

	                  {/* Price */}
	                  {subscription.plan_price && (
	                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
	                      <span className="text-white/60">Price</span>
	                      <span className="text-white font-medium">
	                        £{subscription.plan_price}
	                        {isOneTime ? ' one-time' : '/month'}
	                      </span>
	                    </div>
	                  )}

	                  {/* Current Period (only for recurring subscriptions) */}
	                  {!isOneTime && subscription.current_period_end && (
	                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
	                      <span className="text-white/60">
	                        {subscription.cancel_at_period_end ? 'Expires on' : 'Next billing date'}
	                      </span>
	                      <span className="text-white font-medium">
	                        {formatDate(subscription.current_period_end)}
	                      </span>
	                    </div>
	                  )}

	                  {/* Cancel Warning (only for recurring subscriptions) */}
	                  {!isOneTime && subscription.cancel_at_period_end && (
	                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mt-4">
	                      <p className="text-yellow-400 text-sm">
	                        ⚠️ Your subscription will be cancelled at the end of the current billing period.
	                      </p>
	                    </div>
	                  )}

	                  {/* Manage Subscription Button (only for recurring subscriptions) */}
	                  {!isOneTime && subscription.stripe_customer_id && (
	                    <div className="pt-4">
	                      <ManageSubscriptionButton customerId={subscription.stripe_customer_id} />
	                    </div>
	                  )}
	                </>
	              )
	            })()}
	          </div>
	        ) : lastSubscription ? (
	          <div className="space-y-4">
	            <p className="text-white/60">
	              You don&apos;t have an active subscription right now.
	            </p>
	            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
	              <p className="text-sm text-white/60">Last subscription</p>
	              <p className="text-white font-semibold">{lastSubscription.plan_name}</p>
	              <p className={`text-sm ${getStatusColor(lastSubscription.status)}`}>
	                Status: <span className="capitalize">{lastSubscription.status}</span>
	              </p>
	              <p className="text-sm text-white/60">
	                Ended on{' '}
	                <span className="text-white">
	                  {formatDate(lastSubscription.current_period_end || lastSubscription.updated_at)}
	                </span>
	              </p>
	            </div>
	            <div className="pt-2">
	              <Link
	                href="/pricing"
	                className="inline-block py-3 px-8 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all"
	              >
	                View Pricing Plans
	              </Link>
	            </div>
	          </div>
	        ) : (
	          <div className="text-center py-8">
	            <p className="text-white/60 mb-6">You don&apos;t have an active subscription yet.</p>
	            <Link
	              href="/pricing"
	              className="inline-block py-3 px-8 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-xl hover:from-teal-500 hover:to-teal-400 transition-all"
	            >
	              View Pricing Plans
	            </Link>
	          </div>
	        )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/pricing"
            className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 hover:bg-teal-500/10 transition-all group"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
              Browse Plans
            </h3>
            <p className="text-white/60 text-sm">
              Explore our pricing options and upgrade your plan
            </p>
          </Link>

          <Link
            href="/"
            className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl p-6 hover:bg-teal-500/10 transition-all group"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
              Back to Home
            </h3>
            <p className="text-white/60 text-sm">
              Return to the DataDeck homepage
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

