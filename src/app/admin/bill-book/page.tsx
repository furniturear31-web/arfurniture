'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Search, FileText, Clock, AlertCircle, Trash2, Edit, Printer, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BillBookPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dbError, setDbError] = useState(false)
  const [allPayments, setAllPayments] = useState<any[]>([])

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()
    const [{ data: invData, error }, { data: payData }] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*')
    ])
    
    if (error) {
      if (error.code === '42P01') {
        setDbError(true)
      }
      console.error(error)
    } else if (invData) {
      setInvoices(invData)
    }
    if (payData) setAllPayments(payData)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bill? This cannot be undone.')) return
    
    const toastId = toast.loading('Deleting...')
    const supabase = createClient()
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    
    if (error) {
      toast.error(error.message, { id: toastId })
    } else {
      toast.success('Bill deleted successfully', { id: toastId })
      setInvoices(invoices.filter(i => i.id !== id))
    }
  }

  const getInvoicePaid = (item: any) => {
    const payForInv = allPayments.filter(p => p.invoice_id === item.id || (p.client_mobile === item.customer_mobile && p.invoice_id === item.id))
    const sumPay = payForInv.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    return Math.max(Number(item.paid_amount || 0), sumPay)
  }

  const filtered = invoices.filter(i => 
    i.invoice_number?.toLowerCase().includes(search.toLowerCase()) || 
    i.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.customer_mobile?.includes(search)
  )

  const totalOutstanding = invoices.reduce((acc, curr) => {
    const paid = getInvoicePaid(curr)
    return acc + Math.max(0, curr.total_amount - paid)
  }, 0)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  if (dbError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
        <AlertCircle size={48} className="text-[#c8941a] mb-4" />
        <h1 className="text-2xl font-bold text-[#111111] mb-2">Database Setup Required</h1>
        <p className="text-[#555] mb-6">
          To use the AR FURNITURE Bill Book & POS feature, please ensure database tables are set up properly in Supabase.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Bill Book & POS</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage offline invoices, customer orders & pending payments (Udhaari).</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl transition-colors shadow-xs"
            title="Refresh List"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by bill no. or customer..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] w-full sm:w-64 shadow-xs font-medium" 
            />
          </div>
          <Link href="/admin/bill-book/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#c8941a] hover:bg-[#b08115] text-white rounded-xl text-sm font-bold shadow-xs whitespace-nowrap">
            <Plus size={16} /> New Bill
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Pending Recovery (Udhaari)</p>
            <h3 className="text-3xl font-black text-red-600">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <Clock size={24} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Generated Bills</p>
            <h3 className="text-3xl font-black text-zinc-900">{invoices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#c8941a] shrink-0">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Styled Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px] border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Type & Bill No.</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Paid Amount</th>
                <th className="px-6 py-4 text-right">Pending Dues</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-400 font-semibold">Loading bills...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No bills found matching your search. <Link href="/admin/bill-book/new" className="text-[#c8941a] font-bold underline">Create a new bill</Link>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const paid = getInvoicePaid(item)
                  const pending = Math.max(0, item.total_amount - paid)
                  const status = pending === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
                  const docType = item.document_type || 'Invoice'

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-zinc-900 text-base">{item.invoice_number}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            docType === 'Quotation' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            docType === 'Order Form' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                            'bg-zinc-100 text-zinc-800 border border-zinc-200'
                          }`}>
                            {docType}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium">{formatDate(item.issue_date || item.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-zinc-900 text-base">{item.customer_name}</p>
                        <p className="text-xs text-zinc-500 font-semibold mt-0.5">+91 {item.customer_mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-zinc-900 text-base">
                        ₹{Number(item.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        ₹{Number(paid).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-black text-base ${pending > 0 ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200' : 'text-zinc-400'}`}>
                          {pending > 0 ? `₹${pending.toLocaleString('en-IN')}` : 'PAID'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-bold inline-block ${
                          status === 'paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                          status === 'partial' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                          'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {status === 'paid' ? '✓ PAID' : status === 'partial' ? 'PARTIAL' : 'UNPAID'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/admin/bill-book/${item.id}/print`} 
                            target="_blank" 
                            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs" 
                            title="Print / PDF"
                          >
                            <Printer size={13} /> Print
                          </Link>
                          <Link 
                            href={`/admin/bill-book/${item.id}/edit`} 
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200" 
                            title="Edit Bill"
                          >
                            <Edit size={14} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200" 
                            title="Delete Bill"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
