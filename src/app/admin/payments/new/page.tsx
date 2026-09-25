'use client'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

function NewPaymentForm() {
  const params = useSearchParams()
  const invoice_id = params.get('invoice_id') || ''
  const client_id = params.get('client_id') || ''
  const client_mobile = params.get('mobile') || ''
  const client_name = params.get('name') || ''
  const order_amount = Number(params.get('order_amount') || 0)
  const order_num = params.get('order_num') || ''

  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('Cash')
  const [paymentRef, setPaymentRef] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedPayment, setSavedPayment] = useState<{id: string; newPaidTotal: number} | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) { toast.error('Amount dalo!'); return }
    setLoading(true)
    const supabase = createClient()

    // 1. Save payment record only (NO new invoice)
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .insert({
        invoice_id: invoice_id || null,
        client_mobile,
        amount: Number(amount),
        payment_mode: mode,
        note: [note, paymentRef ? `Ref: ${paymentRef}` : ''].filter(Boolean).join(' | ') || null
      })
      .select()
      .single()

    if (payErr) { toast.error('Error: ' + payErr.message); setLoading(false); return }

    // 2. Update original invoice paid_amount
    let newPaidTotal = Number(amount)
    if (invoice_id) {
      const { data: inv } = await supabase.from('invoices').select('paid_amount').eq('id', invoice_id).single()
      if (inv) {
        newPaidTotal = Number(inv.paid_amount || 0) + Number(amount)
        await supabase.from('invoices').update({ paid_amount: newPaidTotal }).eq('id', invoice_id)
      }
    }

    toast.success('Payment record ho gayi!')
    setSavedPayment({ id: payment.id, newPaidTotal })
    setLoading(false)
  }

  if (savedPayment) {
    const paid = Number(amount)
    const balance = order_amount - savedPayment.newPaidTotal
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Record Ho Gayi!</h2>
        <p className="text-gray-500 mb-1">₹{paid.toLocaleString('en-IN')} — {mode}</p>
        {paymentRef && <p className="text-xs text-gray-400 mb-1">Ref: {paymentRef}</p>}
        <p className="text-sm text-gray-500 mb-8">
          {balance > 0
            ? `Bakaya: ₹${balance.toLocaleString('en-IN')}`
            : '✅ Order Fully Paid!'}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {/* Print receipt from the ORIGINAL order, not a new one */}
          {invoice_id && (
            <Link
              href={`/admin/payments/${savedPayment.id}/receipt?invoice_id=${invoice_id}&amount=${paid}&mode=${encodeURIComponent(mode)}&ref=${encodeURIComponent(paymentRef)}&order_num=${encodeURIComponent(order_num)}&client_name=${encodeURIComponent(client_name)}&order_amount=${order_amount}&paid_total=${savedPayment.newPaidTotal}`}
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-[#111111] text-white rounded-xl font-bold text-sm"
            >
              <Printer size={16} /> Receipt Print Karo
            </Link>
          )}
          <Link href={`/admin/clients/${client_id}`} className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">
            Client Profile Dekho
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={client_id ? `/admin/clients/${client_id}` : '/admin/clients'} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Payment Lena</h1>
          <p className="text-sm text-gray-500">{client_name} {order_num ? `| ${order_num}` : ''}</p>
        </div>
      </div>

      {order_num && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">Order Reference</p>
          <p className="text-sm font-bold text-amber-900">{order_num}</p>
          <p className="text-sm text-amber-700">Total Order Value: ₹{order_amount.toLocaleString('en-IN')}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Amount Received *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-50 border border-gray-200 pl-9 pr-4 py-4 rounded-xl text-xl font-bold focus:outline-none focus:border-[#c8941a]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Payment Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]">
            <option>Cash</option>
            <option>Online / UPI</option>
            <option>Cheque</option>
            <option>Bank Transfer</option>
            <option>Card</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">
            Payment Reference No. <span className="text-gray-400 font-normal normal-case">(UPI ID / Cheque No. / Transaction ID)</span>
          </label>
          <input
            type="text"
            value={paymentRef}
            onChange={e => setPaymentRef(e.target.value)}
            placeholder="e.g. UPI-234567890, Cheque No. 001234"
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. 2nd installment, token amount, final payment..."
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          {loading ? 'Saving...' : 'Payment Record Karo & Receipt Print Karo'}
        </button>
      </form>
    </div>
  )
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
      <NewPaymentForm />
    </Suspense>
  )
}
