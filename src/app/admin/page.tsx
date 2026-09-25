import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Grid, ShoppingCart, DollarSign, FileText, Users, Plus, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { data: paidOrders },
    { data: invoices },
    { data: clients }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('payment_status', 'PAID'),
    supabase.from('invoices').select('id, invoice_number, customer_name, total_amount, paid_amount, status, document_type, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('clients').select('id', { count: 'exact', head: true })
  ])

  const totalRevenue = paidOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
  const invoicesList = invoices || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">AR Furniture Admin Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage Invoices, Khata / Clients, Billing, and Products.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/bill-book/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c8941a] hover:bg-[#b08115] text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
          >
            <Plus size={18} /> New Bill / Order
          </Link>
          <Link
            href="/admin/clients/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
          >
            <Plus size={18} /> Add Client
          </Link>
        </div>
      </div>

      {/* Primary Feature Quick Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link 
          href="/admin/bill-book"
          className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#c8941a]/30 rounded-2xl shadow-xs hover:shadow-md hover:border-[#c8941a] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#c8941a] text-white flex items-center justify-center shadow-md">
              <FileText size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#c8941a] transition-colors">Bill Book / POS</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Create Tax Invoices, Order Forms, Quotations & Receipts</p>
            </div>
          </div>
          <ArrowRight className="text-[#c8941a] group-hover:translate-x-1 transition-transform" size={24} />
        </Link>

        <Link 
          href="/admin/clients"
          className="group p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-zinc-900 flex items-center justify-center shadow-md">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#c8941a] transition-colors">Clients / Khata</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Customer Profiles, History & Udhaari Balance Ledger</p>
            </div>
          </div>
          <ArrowRight className="text-[#c8941a] group-hover:translate-x-1 transition-transform" size={24} />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Products</CardTitle>
            <Package className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{productsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Categories</CardTitle>
            <Grid className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{categoriesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{clients?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Web Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bill Book Invoices */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Recent Bill Book Documents</h2>
            <p className="text-xs text-zinc-500">Latest Invoices & Orders generated in Bill Book</p>
          </div>
          <Link href="/admin/bill-book" className="text-xs font-bold text-[#c8941a] hover:underline">
            View All Bills →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Doc #</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {invoicesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-500">
                    No bills created yet. Click <strong className="text-black">New Bill / Order</strong> above to create your first invoice!
                  </td>
                </tr>
              ) : (
                invoicesList.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#c8941a]">{inv.invoice_number}</td>
                    <td className="py-4 px-6 font-semibold text-zinc-900">{inv.customer_name}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {inv.document_type || 'Invoice'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-900">₹{Number(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                        inv.status === 'partial' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {inv.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/bill-book/${inv.id}/print`}
                        className="text-xs font-bold text-zinc-900 hover:text-[#c8941a] underline"
                      >
                        Print / View
                      </Link>
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
