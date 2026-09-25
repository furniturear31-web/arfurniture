'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Search, FileText, Download, CheckCircle, Clock, AlertCircle, Trash2, Edit } from 'lucide-react'
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

  if (dbError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
        <AlertCircle size={48} className="text-[#c8941a] mb-4" />
        <h1 className="text-2xl font-bold text-[#111111] mb-2">Database Setup Required</h1>
        <p className="text-[#555] mb-6">
          To use the AR FURNITURE Bill Book & POS feature, you need to run the setup script in your Supabase SQL Editor.
        </p>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm font-mono text-left w-full overflow-x-auto text-gray-800">
          Please run the <strong className="text-black">supabase/billbook-schema.sql</strong> file in your Supabase project to create the necessary tables.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Bill Book & POS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage offline invoices, customers, and pending payments (Udhaari).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input type="text" placeholder="Search bills or customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-gold !pl-9 h-10 w-full sm:w-64" />
          </div>
          <Link href="/admin/bill-book/new" className="flex items-center gap-2 px-4 py-2 rounded-xl btn-gold text-sm font-semibold whitespace-nowrap text-black w-full sm:w-auto justify-center">
            <Plus size={16} /> New Bill
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#eaeaea] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Recovery</p>
            <h3 className="text-2xl font-bold text-[#111111]">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Clock size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-[#eaeaea] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bills</p>
            <h3 className="text-2xl font-bold text-[#111111]">{invoices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#c8941a]/10 flex items-center justify-center text-[#c8941a]">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white border border-[#eaeaea] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[1000px]">
            <thead>
              <tr>
                <th>Type & No.</th>
                <th>Customer Details</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Pending Balance</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading bills...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500">No bills found. Create a new bill to get started.</td></tr>
              ) : (
                filtered.map((item) => {
                  const paid = getInvoicePaid(item)
                  const pending = Math.max(0, item.total_amount - paid)
                  const status = pending === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
                  return (
                    <tr key={item.id} className="group hover:bg-gray-50">
                      <td>
                        <div className="font-bold text-[#111111] flex items-center gap-2">
                          {item.invoice_number}
                          {item.document_type && item.document_type !== 'Invoice' && (
                            <span className="text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded uppercase tracking-wider">{item.document_type}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(item.issue_date || item.created_at).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <p className="font-medium text-[#111111]">{item.customer_name}</p>
                        <p className="text-xs text-[#c8941a]">{item.customer_mobile}</p>
                      </td>
                      <td className="font-semibold text-gray-900">
                        ₹{item.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="font-medium text-green-600">
                        ₹{paid.toLocaleString('en-IN')}
                      </td>
                      <td className={`font-bold ${pending > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        ₹{pending.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${
                          status === 'paid' ? 'bg-green-100 text-green-700' :
                          status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/bill-book/${item.id}/edit`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#c8941a] hover:bg-[#c8941a]/10 rounded-lg transition-colors">
                            <Edit size={18} />
                          </Link>
                          <Link href={`/admin/bill-book/${item.id}/print`} target="_blank" className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                            <FileText size={18} />
                          </Link>
                          <button onClick={() => handleDelete(item.id)} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
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
