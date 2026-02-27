import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export default async function PaymentHistoryPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

	  // Get all of the user's subscriptions so we can collect all related Stripe customers
	  const { data: subscriptions } = await supabase
	    .from('subscriptions')
	    .select('*')
	    .eq('user_id', user.id)

	  let invoices: Stripe.Invoice[] = []

	  if (subscriptions && subscriptions.length > 0) {
	    // Collect all unique Stripe customer IDs associated with this user
	    const customerIds = Array.from(
	      new Set(
	        subscriptions
	          .map((sub: any) => sub.stripe_customer_id)
	          .filter((id: string | null) => Boolean(id))
	      )
	    ) as string[]

	    for (const customerId of customerIds) {
	      try {
	        // Fetch invoices from Stripe for each customer
	        const invoiceList = await stripe.invoices.list({
	          customer: customerId,
	          limit: 100,
	        })
	        invoices.push(...invoiceList.data)
	      } catch (error) {
	        console.error('Error fetching invoices for customer', customerId, error)
	      }
	    }

	    // Sort all invoices by date (newest first)
	    invoices.sort((a, b) => b.created - a.created)
	  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatAmount = (amount: number) => {
    return `£${(amount / 100).toFixed(2)}`
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'text-teal-400 bg-teal-500/10'
      case 'open':
        return 'text-yellow-400 bg-yellow-500/10'
      case 'void':
      case 'uncollectible':
        return 'text-red-400 bg-red-500/10'
      default:
        return 'text-white/60 bg-white/5'
    }
  }

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Payment History
          </h1>
          <p className="text-white/60">View all your past invoices and payments</p>
        </div>

        {/* Payment History */}
        <div className="bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-xl overflow-hidden">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatDate(invoice.created)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {invoice.lines.data[0]?.description || 'Subscription payment'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatAmount(invoice.amount_paid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {invoice.invoice_pdf && (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 transition-colors"
                          >
                            Download PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/60 mb-2">No payment history yet</p>
              <p className="text-white/40 text-sm">Your invoices will appear here once you subscribe to a plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

