'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Plus, User, ArrowRight, Phone, Edit, RefreshCw } from 'lucide-react'

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
    setLoading(true)
    const supabase = createClient()

    // 1. Fetch raw clients, invoices, and payments
    let { data: clientsData } = await supabase.from('clients').select('*').order('full_name')
    const { data: invoicesData } = await supabase.from('invoices').select('id, client_id, customer_name, customer_mobile, customer_address, total_amount, paid_amount, created_at')
    const { data: paymentsData } = await supabase.from('payments').select('id, invoice_id, client_mobile, amount, created_at')

    const currentClients = clientsData ? [...clientsData] : []

    // 2. AUTO-HEAL: If invoices exist for customers not yet in clients table, auto-insert them into clients table
    if (invoicesData && invoicesData.length > 0) {
      for (const inv of invoicesData) {
        if (inv.customer_mobile && inv.customer_name) {
          const exists = currentClients.some(c => c.mobile === inv.customer_mobile)
          if (!exists) {
            const { data: newClient } = await supabase
              .from('clients')
              .insert({
                full_name: inv.customer_name,
                mobile: inv.customer_mobile,
                address: inv.customer_address || null,
                city: 'Vadodara'
              })
              .select()
              .single()

            if (newClient) {
              currentClients.push(newClient)
            }
          }
        }
      }
    }

    if (currentClients.length === 0) {
      setClients([])
      setLoading(false)
      return
    }

    // 3. 360-Degree Khata / Ledger Calculation per Client
    const ledger: ClientLedger[] = currentClients.map(c => {
      // Find all invoices linked to this client by ID or Mobile
      const orders = (invoicesData || []).filter(inv => 
        inv.client_id === c.id || inv.customer_mobile === c.mobile
      )

      // Total business volume
      const totalBusiness = orders.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0)
      
      // Calculate total paid via invoices and payments table
      const invPaidSum = orders.reduce((sum, inv) => {
        const pForInv = (paymentsData || []).filter(p => p.invoice_id === inv.id)
        const pSum = pForInv.reduce((acc, p) => acc + Number(p.amount || 0), 0)
        return sum + Math.max(Number(inv.paid_amount || 0), pSum)
      }, 0)

      // Standalone payments against client mobile
      const standalonePays = (paymentsData || []).filter(p => 
        p.client_mobile === c.mobile && (!p.invoice_id || !orders.some(o => o.id === p.invoice_id))
      )
      const standaloneSum = standalonePays.reduce((acc, p) => acc + Number(p.amount || 0), 0)

      const totalPaid = Math.min(totalBusiness, invPaidSum + standaloneSum)
      const pending = Math.max(0, totalBusiness - totalPaid)

      return {
        id: c.id,
        full_name: c.full_name,
        mobile: c.mobile,
        address: c.address,
        city: c.city,
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Client List (Khata)</h1>
          <p className="text-sm text-zinc-500 mt-1">Complete customer accounts, billing history & pending dues.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchClients}
            className="p-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl transition-colors shadow-xs"
            title="Refresh Khata"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name or mobile..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] w-full sm:w-64 shadow-xs" 
            />
          </div>
          <Link 
            href="/admin/clients/new" 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c8941a] hover:bg-[#b08115] text-white rounded-xl text-sm font-bold shadow-xs whitespace-nowrap"
          >
            <Plus size={16} /> New Client
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px] border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Client Details</th>
                <th className="px-6 py-4 text-right">Orders</th>
                <th className="px-6 py-4 text-right">Total Business</th>
                <th className="px-6 py-4 text-right">Amount Paid</th>
                <th className="px-6 py-4 text-right">Bakaya (Pending)</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-semibold">Loading Client Khata...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No clients found. <Link href="/admin/clients/new" className="text-[#c8941a] font-bold underline">Add your first client</Link>
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-[#c8941a] shrink-0 font-bold">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{c.full_name}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 font-semibold"><Phone size={11} /> +91 {c.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-700 font-bold">{c.total_orders}</td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-900">₹{c.total_business.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{c.total_paid.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-black text-base ${c.pending > 0 ? 'text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200' : 'text-zinc-400'}`}>
                        {c.pending > 0 ? `₹${c.pending.toLocaleString('en-IN')}` : 'PAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/clients/${c.id}`} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg border border-zinc-200" 
                          title="View Ledger & Profile"
                        >
                          Profile <ArrowRight size={12} />
                        </Link>
                        <Link 
                          href={`/admin/clients/${c.id}/edit`} 
                          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg border border-zinc-200" 
                          title="Edit Client"
                        >
                          <Edit size={14} />
                        </Link>
                        <Link 
                          href={`/admin/bill-book/new?client_id=${c.id}&mobile=${c.mobile}&name=${encodeURIComponent(c.full_name)}`} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#c8941a] hover:bg-[#b08115] text-white text-xs font-bold rounded-lg shadow-xs" 
                          title="New Order for Client"
                        >
                          <Plus size={12} /> New Bill
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
