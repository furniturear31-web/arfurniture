'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { User, Phone, MapPin, ArrowLeft, Plus, FileText, Edit, Receipt } from 'lucide-react'

interface Client {
  id: string
  full_name: string
  mobile: string
  address?: string
  city?: string
  created_at: string
}

interface Invoice {
  id: string
  invoice_number: string
  document_type: string
  total_amount: number
  created_at: string
  delivery_date?: string
}

interface Payment {
  id: string
  invoice_id: string
  amount: number
  payment_mode: string
  note?: string
  created_at: string
}

export default function ClientProfilePage() {
  const params = useParams()
  const id = params.id as string
  const [client, setClient] = useState<Client | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    const supabase = createClient()
    const [{ data: clientData }, { data: invoiceData }, { data: paymentData }] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('invoices').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      supabase.from('payments').select('*').eq('client_mobile', '').then(async () => {
        // fetch by client mobile after we have client data
        return { data: [] }
      })
    ])

    if (clientData) {
      setClient(clientData)
      // Fetch payments for this client's invoices or payments created on/after client creation
      const { data: pData } = await supabase
        .from('payments')
        .select('*')
        .eq('client_mobile', clientData.mobile)
        .gte('created_at', clientData.created_at)
        .order('created_at', { ascending: false })
      setPayments(pData || [])
    }
    setInvoices(invoiceData || [])
    setLoading(false)
  }

  const getInvPaid = (inv: Invoice) => {
    const pForInv = payments.filter(p => p.invoice_id === inv.id)
    const pSum = pForInv.reduce((pAcc, p) => pAcc + Number(p.amount || 0), 0)
    return Math.max(Number(inv.total_amount && inv.total_amount <= (inv as any).paid_amount ? inv.total_amount : (inv as any).paid_amount || 0), pSum)
  }

  const totalBusiness = invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0)
  
  const totalInvoicePaid = invoices.reduce((sum, inv) => {
    return sum + getInvPaid(inv)
  }, 0)

  const standalonePayments = payments.filter(p => !p.invoice_id || !invoices.some(inv => inv.id === p.invoice_id))
  const standalonePaid = standalonePayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  
  const totalPaid = Math.min(totalBusiness, totalInvoicePaid + standalonePaid)
  const bakaya = Math.max(0, totalBusiness - totalPaid)

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
  if (!client) return <div className="text-center py-20 text-gray-500">Client nahi mila.</div>

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clients" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#111111]">{client.full_name}</h1>
          <p className="text-sm text-gray-500">Client Profile & Ledger</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/admin/clients/${client.id}/edit`} className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold">
            <Edit size={16} /> Edit Client
          </Link>
          <Link href={`/admin/payments/new?client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}&order_amount=${invoices[0]?.total_amount || 0}&order_num=${invoices[0]?.invoice_number || ''}`} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold">
            <Receipt size={16} /> Payment Lena / Receipt
          </Link>
          <Link href={`/admin/bill-book/new?client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}&address=${encodeURIComponent(client.address || '')}`} className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white rounded-xl text-sm font-bold">
            <Plus size={16} /> Naya Order/Bill
          </Link>
        </div>
      </div>

      {/* Client Info + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <User size={26} className="text-[#c8941a]" />
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">{client.full_name}</p>
          {client.mobile && (
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-1"><Phone size={13} /> +91 {client.mobile}</p>
          )}
          {client.address && (
            <p className="text-xs text-gray-400 flex items-start gap-2 mt-2"><MapPin size={12} className="mt-0.5 shrink-0" /> {client.address}, {client.city}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Business</p>
          <p className="text-3xl font-bold text-gray-900">₹{totalBusiness.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-2">{invoices.length} orders</p>
        </div>

        <div className={`rounded-2xl border shadow-sm p-6 flex flex-col justify-center ${bakaya > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Bakaya (Pending)</p>
          <p className={`text-3xl font-bold ${bakaya > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{bakaya.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-2">Paid: ₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Orders / Bills</h3>
          <Link href={`/admin/bill-book/new?client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}&address=${encodeURIComponent(client.address || '')}`} className="flex items-center gap-1 text-xs text-[#c8941a] font-bold">
            <Plus size={14} /> New
          </Link>
        </div>
        {invoices.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">Abhi tak koi order nahi. <Link href={`/admin/bill-book/new?client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}`} className="text-[#c8941a] font-bold">Pehla order banao</Link></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead><tr className="bg-gray-50 text-gray-400">
                <th className="px-5 py-3 text-xs font-bold uppercase">Document</th>
                <th className="px-5 py-3 text-xs font-bold uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-bold uppercase text-right">Amount</th>
                <th className="px-5 py-3 text-xs font-bold uppercase text-center">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900 text-sm">{inv.invoice_number}</p>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">{inv.document_type || 'Invoice'}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(inv.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3 text-right font-bold text-gray-900">₹{Number(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/bill-book/${inv.id}/print`} target="_blank" className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg" title="Print">
                          <FileText size={14} />
                        </Link>
                        <Link href={`/admin/bill-book/${inv.id}/edit`} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg" title="Edit">
                          <Edit size={14} />
                        </Link>
                        <Link href={`/admin/payments/new?invoice_id=${inv.id}&client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}&order_amount=${inv.total_amount}&order_num=${inv.invoice_number}`} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200" title="Payment Lena">
                          <Receipt size={13} /> Payment
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payments Ledger */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Payment History (Paisa Kab Kab Aaya)</h3>
          <Link
            href={`/admin/payments/new?client_id=${client.id}&mobile=${client.mobile}&name=${encodeURIComponent(client.full_name)}&order_amount=${invoices[0]?.total_amount || 0}&order_num=${invoices[0]?.invoice_number || ''}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Receipt size={14} /> + Payment Lena
          </Link>
        </div>
        {payments.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">Abhi tak koi payment nahi.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead><tr className="bg-gray-50 text-gray-400">
                <th className="px-5 py-3 text-xs font-bold uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-bold uppercase">Mode</th>
                <th className="px-5 py-3 text-xs font-bold uppercase">Note / Ref</th>
                <th className="px-5 py-3 text-xs font-bold uppercase text-right">Amount</th>
                <th className="px-5 py-3 text-xs font-bold uppercase text-center">Receipt</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-green-50">
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{p.payment_mode}</span></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{p.note || '-'}</td>
                    <td className="px-5 py-3 text-right font-bold text-green-600">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-center">
                      <Link
                        href={`/admin/payments/${p.id}/receipt?invoice_id=${p.invoice_id || invoices[0]?.id || ''}&amount=${p.amount}&mode=${encodeURIComponent(p.payment_mode || 'Cash')}&ref=${encodeURIComponent(p.note || '')}&order_num=${encodeURIComponent(invoices[0]?.invoice_number || '')}&client_name=${encodeURIComponent(client.full_name)}&order_amount=${totalBusiness}&paid_total=${totalPaid}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-lg"
                      >
                        <FileText size={12} /> Receipt / Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50">
                  <td colSpan={3} className="px-5 py-3 font-bold text-gray-700">Total Paid</td>
                  <td className="px-5 py-3 text-right font-bold text-green-700 text-lg">₹{totalPaid.toLocaleString('en-IN')}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
