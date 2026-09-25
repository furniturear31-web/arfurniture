'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Plus, User, ArrowRight, Phone, Edit } from 'lucide-react'

interface ClientLedger {
  id: string
  full_name: string
  mobile: string
  address?: string
  city?: string
  total_orders: number
  total_business: number
  total_paid: number
  pending: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientLedger[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    const supabase = createClient()
    const { data: clientsData } = await supabase.from('clients').select('*').order('full_name')
    const { data: invoicesData } = await supabase.from('invoices').select('id, client_id, customer_mobile, total_amount, paid_amount, created_at')
    const { data: paymentsData } = await supabase.from('payments').select('invoice_id, client_mobile, amount, created_at')

    if (!clientsData) { setLoading(false); return }

    const ledger: ClientLedger[] = clientsData.map(c => {
      const orders = (invoicesData || []).filter(inv => inv.client_id === c.id || (inv.customer_mobile === c.mobile && new Date(inv.created_at) >= new Date(c.created_at)))
      const totalBusiness = orders.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0)
      
      const invPaidSum = orders.reduce((sum, inv) => {
        const pForInv = (paymentsData || []).filter(p => p.invoice_id === inv.id)
        const pSum = pForInv.reduce((acc, p) => acc + Number(p.amount || 0), 0)
        return sum + Math.max(Number(inv.paid_amount || 0), pSum)
      }, 0)

      const standalonePays = (paymentsData || []).filter(p => p.client_mobile === c.mobile && new Date(p.created_at) >= new Date(c.created_at) && (!p.invoice_id || !orders.some(o => o.id === p.invoice_id)))
      const standaloneSum = standalonePays.reduce((acc, p) => acc + Number(p.amount || 0), 0)

      const totalPaid = Math.min(totalBusiness, invPaidSum + standaloneSum)
      const pending = Math.max(0, totalBusiness - totalPaid)

      return {
        ...c,
        total_orders: orders.length,
        total_business: totalBusiness,
        total_paid: totalPaid,
        pending: pending
      }
    })
    setClients(ledger)
    setLoading(false)
  }

  const filtered = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Client List (Khata)</h1>
          <p className="text-sm text-gray-500 mt-1">Saare clients ka hisaab ek jagah.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Naam ya mobile..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] w-full sm:w-64" />
          </div>
          <Link href="/admin/clients/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-sm font-bold whitespace-nowrap">
            <Plus size={16} /> New Client
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead>
              <tr className="bg-[#111111] text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Orders</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Total Business</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Paid</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Bakaya</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Koi client nahi mila. <Link href="/admin/clients/new" className="text-[#c8941a] font-bold underline">Pehla client add karo</Link></td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <User size={18} className="text-[#c8941a]" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{c.full_name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> +91 {c.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700 font-medium">{c.total_orders}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">₹{c.total_business.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">₹{c.total_paid.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg ${c.pending > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        ₹{c.pending.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg" title="Profile">
                          Profile <ArrowRight size={12} />
                        </Link>
                        <Link href={`/admin/clients/${c.id}/edit`} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg" title="Edit Client">
                          <Edit size={14} />
                        </Link>
                        <Link href={`/admin/bill-book/new?client_id=${c.id}&mobile=${c.mobile}&name=${encodeURIComponent(c.full_name)}`} className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-lg" title="New Order">
                          <Plus size={12} /> New Order
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
