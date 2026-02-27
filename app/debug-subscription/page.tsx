import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugSubscriptionPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's subscription
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen px-6 py-12 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Subscription Data</h1>
        
        <div className="bg-white/5 border border-teal-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Info</h2>
          <pre className="text-sm text-white/80 overflow-auto">
            {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
          </pre>
        </div>

        <div className="bg-white/5 border border-teal-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Subscription Data</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400">Error: {error.message}</p>
            </div>
          )}
          <pre className="text-sm text-white/80 overflow-auto">
            {JSON.stringify(subscription, null, 2)}
          </pre>
        </div>

	        <div className="bg-white/5 border border-teal-500/20 rounded-xl p-6">
	          <h2 className="text-xl font-semibold text-white mb-4">What to Check:</h2>
	          <ul className="text-white/70 space-y-2 text-sm">
	            <li>✅ <strong>user_id:</strong> Should match your user ID above</li>
	            <li>✅ <strong>stripe_customer_id:</strong> Should exist (starts with &quot;cus_&quot;)</li>
	            <li>✅ <strong>stripe_subscription_id:</strong> Should exist (starts with &quot;sub_&quot;)</li>
	            <li>✅ <strong>plan_name:</strong> Should show your plan</li>
	            <li>✅ <strong>status:</strong> Should be &quot;active&quot; or &quot;trialing&quot;</li>
	          </ul>
	        </div>

        <div className="mt-6">
          <a href="/dashboard" className="text-teal-400 hover:text-teal-300">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  )
}

