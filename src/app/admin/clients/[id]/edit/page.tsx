'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    address: '',
    city: 'Vadodara',
  })

  useEffect(() => {
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
    if (error || !data) {
      toast.error('Client data loading error!')
      setFetching(false)
      return
    }
    setForm({
      full_name: data.full_name || '',
      mobile: data.mobile || '',
      address: data.address || '',
      city: data.city || 'Vadodara',
    })
    setFetching(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name.trim() || !form.mobile.trim()) {
      toast.error('Naam aur mobile zaroori hai!')
      return
    }
    if (form.mobile.length !== 10) {
      toast.error('10 digit ka mobile number dalo')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('clients')
      .update({
        full_name: form.full_name,
        mobile: form.mobile,
        address: form.address,
        city: form.city,
      })
      .eq('id', id)

    if (error) {
      toast.error('Error: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Client data update ho gaya!')
    router.push(`/admin/clients/${id}`)
  }

  const handleDelete = async () => {
    if (!confirm('Kya aap sure hain ki is client ko delete karna chahte hain?')) return
    setLoading(true)
    const supabase = createClient()
    
    // Unlink client_id from invoices so they don't attach to future profiles
    await supabase.from('invoices').update({ client_id: null }).eq('client_id', id)

    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) {
      toast.error('Delete error: ' + error.message)
      setLoading(false)
      return
    }
    toast.success('Client delete ho gaya!')
    router.push('/admin/clients')
  }

  if (fetching) return <div className="flex items-center justify-center h-64 text-gray-400">Loading client data...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/admin/clients/${id}`} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Client Edit Karo</h1>
            <p className="text-sm text-gray-500">Update customer details</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
        >
          <Trash2 size={14} /> Delete Client
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Client Ka Naam *</label>
          <input
            type="text"
            required
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Mobile Number * (10 digit)</label>
          <input
            type="tel"
            required
            maxLength={10}
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
            placeholder="e.g. 9876543210"
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Address</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Ghar / Office ka address"
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">City</label>
          <input
            type="text"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            placeholder="e.g. Vadodara"
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#111111] hover:bg-black text-white font-bold rounded-xl text-sm disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Changes Save Karo'}
          </button>
        </div>
      </form>
    </div>
  )
}
