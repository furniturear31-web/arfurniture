'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    address: '',
    city: 'Vadodara',
  })

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
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...form })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        toast.error('Ye mobile number pehle se registered hai!')
      } else {
        toast.error('Error: ' + error.message)
      }
      setLoading(false)
      return
    }

    toast.success(`${form.full_name} successfully add ho gaya!`)
    router.push(`/admin/clients/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/clients" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">New Client Add Karo</h1>
          <p className="text-sm text-gray-500">Client ka data ek baar save karo, baar baar type mat karo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Client Ka Naam *</label>
          <input type="text" required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="e.g. Rahul Sharma" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Mobile Number * (10 digit)</label>
          <input type="tel" required maxLength={10} value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value.replace(/\D/,'')})} placeholder="e.g. 9876543210" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">Address</label>
          <textarea rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Ghar / Office ka address" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a] resize-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#c8941a] uppercase tracking-widest mb-2">City</label>
          <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Vadodara" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8941a]" />
        </div>

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-[#111111] hover:bg-black text-white font-bold rounded-xl text-sm disabled:opacity-50">
          <UserPlus size={18} />
          {loading ? 'Saving...' : 'Client Save Karo'}
        </button>
      </form>
    </div>
  )
}
